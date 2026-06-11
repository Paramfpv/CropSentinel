"""
Test script to verify Sentinel Hub Process API connectivity and real-time NDVI calculation.
"""
import json
import requests
from app.services.copernicus_service import get_ndvi, get_copernicus_token

def main():
    # Vidarbha Cotton Farm coordinates
    lat = 20.9374
    lon = 77.7796
    
    print("==================================================")
    print("1. AUTHENTICATING WITH COPERNICUS DATASPACE")
    print("==================================================")
    try:
        token = get_copernicus_token()
        print("SUCCESS: Token retrieved successfully.")
        
        # Perform a manual request to capture the raw response size/metadata
        print("\n==================================================")
        print("2. CAPTURING RAW S-2 PROCESS API RESPONSE")
        print("==================================================")
        process_url = "https://sh.dataspace.copernicus.eu/api/v1/process"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        bbox = [lon - 0.0001, lat - 0.0001, lon + 0.0001, lat + 0.0001]
        
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
                                "from": "2026-06-03T00:00:00Z",
                                "to": "2026-06-05T00:00:00Z"
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
    output: { id: "default", bands: 1, sampleType: "FLOAT32" }
  };
}
function evaluatePixel(samples) {
  let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04);
  return [ndvi];
}"""
        }
        
        response = requests.post(process_url, headers=headers, json=payload, timeout=20)
        print(f"HTTP Status: {response.status_code}")
        print(f"Content Type: {response.headers.get('content-type')}")
        print(f"Raw Bytes Length: {len(response.content)} bytes")
        print(f"Raw Bytes (first 50): {response.content[:50]}...[truncated]")
        
    except Exception as e:
        print(f"ERROR: Authentication or raw request failed: {e}")
        
    print("\n==================================================")
    print("3. RUNNING COPERNICUS SERVICE AND NORMALIZATION")
    print("==================================================")
    print(f"Querying get_ndvi() for coordinates ({lat}, {lon})...")
    try:
        ndvi_result = get_ndvi(lat, lon)
        print("\nSUCCESS: Normalized NDVI Response:")
        print(json.dumps(ndvi_result, indent=4))
    except Exception as e:
        print(f"ERROR: NDVI service execution failed: {e}")

if __name__ == "__main__":
    main()
