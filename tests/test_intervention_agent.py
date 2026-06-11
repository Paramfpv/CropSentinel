"""
Test script to verify the InterventionAgent functionality.
"""
import json
from app.agents.intervention import InterventionAgent

def main():
    print("Initializing InterventionAgent verification...")
    agent = InterventionAgent()
    
    # Pre-calculated upstream agent outputs
    state_data = {
        "latitude": 20.9374,
        "longitude": 77.7796,
        "city": "Vadodara",
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
        },
        "risk": {
            "risk_score": 60,
            "risk_level": "HIGH",
            "recommendation": "Irrigate within 48 hours",
            "llm_explanation": "Sample LLM explanation text."
        }
    }
    
    print("\n1. Testing execute() standalone style with upstream state data:")
    result = agent.execute(state_data)
    print("execute() output:")
    print(json.dumps(result, indent=4))
    
    print("\n2. Testing run() LangGraph state node style with state data:")
    updated_state = agent.run(state_data.copy())
    print("run() output state:")
    print(json.dumps(updated_state, indent=4))
    
    if "intervention" in updated_state and "priority" in updated_state["intervention"]:
        print("\n[SUCCESS] Intervention Agent verified successfully in both execution styles!")
    else:
        print("\n[ERROR] Intervention Agent verification failed.")

if __name__ == "__main__":
    main()
