"""
Test script to verify the SatelliteAgent functionality.
"""
import json
from app.agents.satellite import SatelliteAgent

def main():
    print("Initializing SatelliteAgent verification...")
    agent = SatelliteAgent()
    
    # Test coordinates (Vidarbha farm)
    latitude = 20.9374
    longitude = 77.7796
    
    print(f"\n1. Testing execute() standalone style with coordinates: ({latitude}, {longitude})")
    result = agent.execute(latitude, longitude)
    print("execute() output:")
    print(json.dumps(result, indent=4))
    
    print(f"\n2. Testing run() LangGraph state node style with coordinates: ({latitude}, {longitude})")
    state = {
        "latitude": latitude,
        "longitude": longitude
    }
    updated_state = agent.run(state)
    print("run() output state:")
    print(json.dumps(updated_state, indent=4))
    
    # Assert successful runs
    if result.get("status") == "completed" and "satellite" in updated_state:
        print("\n[SUCCESS] Satellite Agent verified successfully in both execution styles!")
    else:
        print("\n[ERROR] Satellite Agent verification failed.")

if __name__ == "__main__":
    main()
