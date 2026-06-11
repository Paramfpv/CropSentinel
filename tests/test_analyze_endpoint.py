"""
Test script to verify the POST /analyze unified dashboard API endpoint.
"""
import json
import requests

def main():
    url = "http://localhost:8000/analyze"
    payload = {
        "latitude": 20.9374,
        "longitude": 77.7796,
        "city": "Vadodara"
    }
    
    print("Sending POST request to unified analyze endpoint...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload)}")
    
    try:
        response = requests.post(url, json=payload, timeout=45)
        print(f"\nResponse Status Code: {response.status_code}")
        print("Response JSON:")
        print(json.dumps(response.json(), indent=4))
        
        # Verify structure
        response_data = response.json()
        if all(k in response_data for k in ("satellite", "weather", "risk", "intervention")):
            print("\n[SUCCESS] Response has correct unified orchestrator keys ('satellite', 'weather', 'risk', 'intervention')!")
        else:
            print("\n[ERROR] Response is missing some of the required root keys.")
            
    except Exception as e:
        print(f"Error during unified analysis endpoint verification: {e}")

if __name__ == "__main__":
    main()
