"""
API endpoints for triggering rule-based farm risk assessments.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.risk_service import calculate_risk

router = APIRouter()

class RiskAnalysisRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude of the farm location")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude of the farm location")
    city: str = Field(..., min_length=1, description="City name for weather lookup")

@router.post("/risk-analysis")
async def post_risk_analysis(request: RiskAnalysisRequest):
    """
    Computes farm risk level, recommendation, and underlying factors by combining satellite and weather forecast data.
    """
    try:
        risk_data = calculate_risk(
            latitude=request.latitude,
            longitude=request.longitude,
            city=request.city
        )
        return risk_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
