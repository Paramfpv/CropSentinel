"""
API endpoints for triggering unified farm analysis orchestrating satellite, weather, and risk assessments.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.agents.coordinator import CoordinatorAgent

router = APIRouter()

class AnalyzeRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude of the farm location")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude of the farm location")
    city: str = Field(..., min_length=1, description="City name for weather lookup")

@router.post("/analyze")
async def post_analyze(request: AnalyzeRequest):
    """
    Orchestrates the complete analysis pipeline using a LangGraph multi-agent workflow,
    returning satellite, weather, risk, and action-planning metrics in a single payload.
    """
    try:
        coordinator = CoordinatorAgent()
        final_state = coordinator.execute(
            latitude=request.latitude,
            longitude=request.longitude,
            city=request.city
        )
        return final_state
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
