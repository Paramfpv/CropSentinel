"""
Test script to verify Copernicus Sentinel-2 OAuth token retrieval and metadata queries.
"""
import json
import os
import requests
from app.services.copernicus_service import query_sentinel_metadata, get_copernicus_token

def main():
    # Test coordinates for Vidarbha Cotton Farm
    lat = 20.9374
    lon = 77.7796
    
    print("==================================================")
    print("1. VERIFYING OAUTH AUTHENTICATION WITH COPERNICUS")
    print("==================================================")
    
    try:
        token = get_copernicus_token()
        print("SUCCESS: OAuth Authentication Successful!")
        print(f"Token (abbreviated): {token[:40]}...[truncated]")
        
        # Make a direct request to show raw API response from CDSE STAC Search
        print("\n==================================================")
        print("2. FETCHING RAW STAC SEARCH RESPONSE FROM COPERNICUS")
        print("==================================================")
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        url = "https://sh.dataspace.copernicus.eu/api/v1/catalog/1.0.0/search"
        payload = {
            "collections": ["sentinel-2-l2a"],
            "intersects": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "datetime": "2026-05-01T00:00:00Z/2026-06-09T23:59:59Z",
            "limit": 1
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        raw_json = response.json()
        print("Raw JSON Response from Copernicus (first feature metadata):")
        print(json.dumps(raw_json, indent=4))
        
    except Exception as e:
        print("ERROR: Copernicus OAuth Authentication Failed!")
        print(f"Error details: {e}")
        
    print("\n==================================================")
    print("3. TESTING NORMALIZED SERVICE LAYER OUTPUT")
    print("==================================================")
    
    print(f"Querying Sentinel-2 metadata for coordinates: ({lat}, {lon})...")
    normalized_res = query_sentinel_metadata(lat, lon)
    print("\nNormalized Service Response:")
    print(json.dumps(normalized_res, indent=4))

if __name__ == "__main__":
    main()
