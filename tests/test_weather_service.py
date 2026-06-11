"""
Test script to verify the Weather Service integration.
"""
import json
from app.services.weather_service import get_weather

def main():
    try:
        print("Testing Weather Service for 'Vadodara'...")
        weather_result = get_weather("Vadodara")
        print("\nNormalized Weather JSON Response:")
        print(json.dumps(weather_result, indent=4))
    except Exception as e:
        print(f"Error during weather service test: {e}")

if __name__ == "__main__":
    main()
