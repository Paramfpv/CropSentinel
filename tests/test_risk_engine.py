"""
Test script to verify the POST /risk-analysis API endpoint functionality.
"""
import json
import requests

def main():
    url = "http://localhost:8000/risk-analysis"
    payload = {
        "latitude": 20.9374,
        "longitude": 77.7796,
        "city": "Vadodara"
    }
    
    print("Sending POST request to /risk-analysis...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload)}")
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"\nResponse Status Code: {response.status_code}")
        response_data = response.json()
        print("Response JSON:")
        print(json.dumps(response_data, indent=4))
        
        if "llm_explanation" in response_data:
            print("\n[SUCCESS] Response includes 'llm_explanation' field!")
            print(f"Explanation: {response_data['llm_explanation']}")
        else:
            print("\n[ERROR] Response does NOT include 'llm_explanation' field.")
    except Exception as e:
        print(f"Error during endpoint verification test: {e}")

if __name__ == "__main__":
    main()
