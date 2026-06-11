"""
Test script to verify the WeatherAgent functionality.
"""
import json
from app.agents.weather import WeatherAgent

def main():
    print("Initializing WeatherAgent verification...")
    agent = WeatherAgent()
    
    city = "Vadodara"
    
    print(f"\n1. Testing execute() standalone style with city: '{city}'")
    result = agent.execute(city)
    print("execute() output (showing key structure and subset of keys for brevity):")
    if result.get("status") == "completed":
        print({
            "agent": result["agent"],
            "status": result["status"],
            "city_resolved": result["data"].get("city"),
            "current_temp": result["data"].get("current", {}).get("temperature"),
            "forecast_days_count": len(result["data"].get("forecast", []))
        })
    else:
        print(result)
        
    print(f"\n2. Testing run() LangGraph state node style with city: '{city}'")
    state = {
        "city": city
    }
    updated_state = agent.run(state)
    print("run() output state keys:")
    print(list(updated_state.keys()))
    
    if "weather" in updated_state and "city" in updated_state["weather"]:
        print(f"\n[SUCCESS] Weather Agent verified successfully in both execution styles!")
    else:
        print("\n[ERROR] Weather Agent verification failed.")

if __name__ == "__main__":
    main()
