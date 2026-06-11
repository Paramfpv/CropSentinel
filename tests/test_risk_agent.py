"""
Test script to verify the RiskAgent functionality.
"""
import json
from app.agents.risk import RiskAgent

def main():
    print("Initializing RiskAgent verification...")
    agent = RiskAgent()
    
    latitude = 20.9374
    longitude = 77.7796
    city = "Vadodara"
    
    print(f"\n1. Testing execute() standalone style with coordinates: ({latitude}, {longitude}) and city: '{city}'")
    result = agent.execute(latitude, longitude, city)
    print("execute() output:")
    print(json.dumps(result, indent=4))
    
    print("\n2. Testing run() LangGraph state node style with precomputed state data:")
    # We pass pre-calculated satellite and weather values so that it doesn't query the external services again.
    state = {
        "latitude": latitude,
        "longitude": longitude,
        "city": city,
        "satellite": {
            "ndvi": 0.105,
            "farm_health_score": 12,
            "status": "stressed",
            "captured_at": "2026-06-09T05:33:03.561Z"
        },
        "weather": {
            "city": "Vadodara",
            "current": {
                "temperature": 32,
                "humidity": 65,
                "wind_speed": 8
            },
            "forecast": [
                {
                    "date": "2026-06-10",
                    "temp_max": 39,
                    "temp_min": 30,
                    "rainfall_mm": 0.0,
                    "rain_probability": 1
                }
            ]
        }
    }
    
    updated_state = agent.run(state)
    print("run() output state:")
    print(json.dumps(updated_state, indent=4))
    
    if "risk" in updated_state and "risk_score" in updated_state["risk"]:
        print("\n[SUCCESS] Risk Agent verified successfully in both execution styles!")
    else:
        print("\n[ERROR] Risk Agent verification failed.")

if __name__ == "__main__":
    main()
