"""
Test script to verify the CoordinatorAgent and LangGraph orchestrator.
"""
import json
from app.agents.coordinator import CoordinatorAgent

def main():
    print("Initializing CoordinatorAgent and LangGraph workflow verification...")
    coordinator = CoordinatorAgent()
    
    latitude = 20.9374
    longitude = 77.7796
    city = "Vadodara"
    
    print(f"\nTriggering multi-agent execute() for city '{city}' ({latitude}, {longitude})...")
    
    try:
        final_state = coordinator.execute(
            latitude=latitude,
            longitude=longitude,
            city=city
        )
        
        print("\nFinal State Output:")
        # We print a clean representation of the final state
        # We can extract a snippet of weather forecast for cleaner printing
        clean_state = final_state.copy()
        if "weather" in clean_state and "forecast" in clean_state["weather"]:
            clean_state["weather"] = clean_state["weather"].copy()
            clean_state["weather"]["forecast"] = clean_state["weather"]["forecast"][:1]  # Keep first day only for brevity
            
        print(json.dumps(clean_state, indent=4))
        
        # Key validation
        has_satellite = "satellite" in final_state and "ndvi" in final_state["satellite"]
        has_weather = "weather" in final_state and "city" in final_state["weather"]
        has_risk = "risk" in final_state and "risk_score" in final_state["risk"]
        
        if has_satellite and has_weather and has_risk:
            print("\n[SUCCESS] Orchestrated LangGraph workflow executed successfully!")
            print("Verified keys: 'satellite', 'weather', and 'risk' are correctly populated.")
        else:
            print("\n[ERROR] State is missing keys or data. Validation failed.")
            
    except Exception as e:
        print(f"\n[ERROR] Multi-agent workflow failed during execution: {e}")

if __name__ == "__main__":
    main()
