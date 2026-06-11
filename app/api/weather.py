"""
API endpoints for retrieving real-time weather and forecast data.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.weather_service import get_weather

router = APIRouter()

class WeatherRequest(BaseModel):
    city: str = Field(..., min_length=1, description="City name to fetch weather data for")

@router.post("/weather")
async def post_weather(request: WeatherRequest):
    """
    Exposes forecast and current condition data for any resolved city.
    """
    try:
        weather_data = get_weather(request.city)
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
