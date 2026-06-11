"""
Test script to verify the POST /satellite-health API endpoint functionality.
"""
import json
import requests

def main():
    url = "http://localhost:8000/satellite-health"
    payload = {
        "latitude": 20.9374,
        "longitude": 77.7796
    }
    
    print("Sending POST request to /satellite-health...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload)}")
    
    try:
        response = requests.post(url, json=payload, timeout=25)
        print(f"\nResponse Status Code: {response.status_code}")
        print("Response JSON:")
        print(json.dumps(response.json(), indent=4))
    except Exception as e:
        print(f"Error during endpoint verification test: {e}")

if __name__ == "__main__":
    main()
