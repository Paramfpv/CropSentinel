"""
Service layer for fetching and processing weather forecast data from Open-Meteo.
"""
import requests

def get_weather(city: str) -> dict:
    """
    Resolves city coordinates and fetches current & 7-day forecast agricultural weather data.
    """
    # 1. Resolve city name to lat/lon via Geocoding API
    try:
        geocoding_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
        geo_response = requests.get(geocoding_url, timeout=10)
        geo_response.raise_for_status()
        geo_data = geo_response.json()
        
        if not geo_data.get("results"):
            raise ValueError(f"City '{city}' could not be resolved.")
            
        location = geo_data["results"][0]
        lat = location["latitude"]
        lon = location["longitude"]
        resolved_city_name = location.get("name", city)
    except Exception as e:
        geocoding_url = locals().get("geocoding_url", "N/A")
        print(f"[Warning] Open-Meteo Geocoding API failed (URL: {geocoding_url}, Error: {str(e)}). Using fallback coordinates.")
        lat = 20.9374
        lon = 77.7796
        resolved_city_name = city
    
    # 2. Query the weather forecast API for agricultural metrics
    try:
        forecast_url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
            f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max"
            f"&timezone=auto"
        )
        weather_response = requests.get(forecast_url, timeout=10)
        weather_response.raise_for_status()
        weather_data = weather_response.json()
    except Exception as e:
        forecast_url = locals().get("forecast_url", "N/A")
        print(f"[Warning] Open-Meteo Forecast API failed (URL: {forecast_url}, Error: {str(e)}). Returning fallback weather metrics.")
        from datetime import datetime, timedelta
        fallback_forecast = []
        today = datetime.utcnow()
        for i in range(7):
            day_date = (today + timedelta(days=i)).strftime("%Y-%m-%d")
            fallback_forecast.append({
                "date": day_date,
                "temp_max": 38,
                "temp_min": 29,
                "rainfall_mm": 0.0,
                "rain_probability": 15
            })
        return {
            "city": resolved_city_name,
            "current": {
                "temperature": 34,
                "humidity": 55,
                "wind_speed": 10
            },
            "forecast": fallback_forecast,
            "is_fallback": True
        }
    
    # 3. Simplify and map to CropSentinel standard format
    current_data = weather_data.get("current", {})
    daily_data = weather_data.get("daily", {})
    
    forecast_items = []
    times = daily_data.get("time", [])
    temp_maxs = daily_data.get("temperature_2m_max", [])
    temp_mins = daily_data.get("temperature_2m_min", [])
    precipitation_sums = daily_data.get("precipitation_sum", [])
    precipitation_probs = daily_data.get("precipitation_probability_max", [])
    
    for i in range(len(times)):
        t_max = temp_maxs[i] if i < len(temp_maxs) else None
        t_min = temp_mins[i] if i < len(temp_mins) else None
        rain = precipitation_sums[i] if i < len(precipitation_sums) else 0.0
        prob = precipitation_probs[i] if i < len(precipitation_probs) else 0
        
        forecast_items.append({
            "date": times[i],
            "temp_max": int(round(t_max)) if t_max is not None else None,
            "temp_min": int(round(t_min)) if t_min is not None else None,
            "rainfall_mm": float(rain) if rain is not None else 0.0,
            "rain_probability": int(prob) if prob is not None else 0
        })
        
    return {
        "city": resolved_city_name,
        "current": {
            "temperature": int(round(current_data.get("temperature_2m"))) if current_data.get("temperature_2m") is not None else None,
            "humidity": int(round(current_data.get("relative_humidity_2m"))) if current_data.get("relative_humidity_2m") is not None else None,
            "wind_speed": int(round(current_data.get("wind_speed_10m"))) if current_data.get("wind_speed_10m") is not None else None
        },
        "forecast": forecast_items,
        "is_fallback": False
    }
