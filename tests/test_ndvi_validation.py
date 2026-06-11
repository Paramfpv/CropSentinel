"""
Validation script to verify that the custom TIFF parser correctly extracts bands
and compares manual NDVI calculation with the service's output.
"""
import os
import zlib
import struct
import json
import requests
from dotenv import load_dotenv
from app.services.copernicus_service import get_ndvi, get_copernicus_token

def get_raw_bands(latitude: float, longitude: float) -> tuple:
    """
    Directly queries the Process API to retrieve raw B04 and B08 band values as FLOAT32.
    """
    token = get_copernicus_token()
    url = "https://sh.dataspace.copernicus.eu/api/v1/process"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Query matching metadata coordinates and datetime range
    bbox = [longitude - 0.0001, latitude - 0.0001, longitude + 0.0001, latitude + 0.0001]
    
    # We query the exact latest scene date by calling metadata search first
    from app.services.copernicus_service import query_sentinel_metadata
    metadata = query_sentinel_metadata(latitude, longitude)
    latest_scene_date = metadata["latest_scene_date"]
    
    from datetime import datetime, timedelta
    dt_clean = latest_scene_date.replace("Z", "")
    if "." in dt_clean:
        dt_clean = dt_clean.split(".")[0]
    dt = datetime.strptime(dt_clean, "%Y-%m-%dT%H:%M:%S")
    
    time_from = (dt - timedelta(hours=12)).strftime("%Y-%m-%dT%H:%M:%SZ")
    time_to = (dt + timedelta(hours=12)).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    payload = {
        "input": {
            "bounds": {
                "properties": {
                    "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
                },
                "bbox": bbox
            },
            "data": [
                {
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "timeRange": {
                            "from": time_from,
                            "to": time_to
                        }
                    }
                }
            ]
        },
        "output": {
            "width": 1,
            "height": 1,
            "responses": [
                {
                    "identifier": "default",
                    "format": {
                        "type": "image/tiff"
                    }
                }
            ]
        },
        "evalscript": """//VERSION=3
function setup() {
  return {
    input: ["B04", "B08", "dataMask"],
    output: { id: "default", bands: 2, sampleType: "FLOAT32" }
  };
}
function evaluatePixel(samples) {
  return [samples.B04, samples.B08];
}"""
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=20)
    response.raise_for_status()
    
    # Parse bands from 1x1 TIFF
    is_little = response.content[:2] == b"II"
    endian = "<" if is_little else ">"
    
    ifd_offset = struct.unpack(f"{endian}I", response.content[4:8])[0]
    num_entries = struct.unpack(f"{endian}H", response.content[ifd_offset:ifd_offset+2])[0]
    
    strip_offset = None
    strip_bytes = None
    
    for idx in range(num_entries):
        entry_offset = ifd_offset + 2 + idx * 12
        tag = struct.unpack(f"{endian}H", response.content[entry_offset:entry_offset+2])[0]
        value_offset = struct.unpack(f"{endian}I", response.content[entry_offset+8:entry_offset+12])[0]
        
        if tag == 273:
            strip_offset = value_offset
        if tag == 279:
            strip_bytes = value_offset
            
    if strip_offset is None or strip_bytes is None:
        raise ValueError("Failed to extract TIFF tags in validation.")
        
    compressed_data = response.content[strip_offset:strip_offset+strip_bytes]
    decompressed_data = zlib.decompress(compressed_data)
    
    # Unpack B04 and B08 (2 float32 = 8 bytes)
    b04, b08 = struct.unpack(f"{endian}2f", decompressed_data)
    return b04, b08, latest_scene_date

def main():
    lat = 20.9374
    lon = 77.7796
    
    print("==================================================")
    print("Copernicus Sentinel Hub NDVI Validation")
    print("==================================================")
    
    try:
        # 1. Fetch raw band values
        print(f"Requesting raw B04 and B08 reflectance for ({lat}, {lon})...")
        b04, b08, capture_date = get_raw_bands(lat, lon)
        print(f"Captured at: {capture_date}")
        print(f"Raw B04 (Red) Value : {b04:.6f}")
        print(f"Raw B08 (NIR) Value : {b08:.6f}")
        
        # 2. Manual NDVI Calculation in Python
        if (b08 + b04) != 0:
            manual_ndvi = (b08 - b04) / (b08 + b04)
        else:
            manual_ndvi = 0.0
        print(f"Calculated Manual NDVI: {manual_ndvi:.6f} (rounded: {round(manual_ndvi, 3)})")
        
        # 3. Request service layer NDVI
        print("\nRequesting service layer NDVI...")
        service_res = get_ndvi(lat, lon)
        service_ndvi = service_res["ndvi"]
        print(f"Service Normalized NDVI: {service_ndvi:.6f}")
        
        # 4. Compare NDVI values
        diff = abs(manual_ndvi - service_ndvi)
        print(f"\nAbsolute Difference: {diff:.6f}")
        
        if diff <= 0.01:
            print("SUCCESS: Service NDVI matches Manual NDVI within acceptable threshold (<= 0.01).")
        else:
            print("WARNING: NDVI difference exceeds threshold of 0.01!")
            
    except Exception as e:
        print(f"ERROR: Validation failed with exception: {e}")

if __name__ == "__main__":
    main()
