"""
CropSentinel FastAPI Application Entrypoint
"""
from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.dashboard import router as dashboard_router
from app.api.analysis import router as analysis_router
from app.api.weather import router as weather_router
from app.api.risk import router as risk_router
from app.api.analyze import router as analyze_router

app = FastAPI(
    title="CropSentinel API",
    description="Autonomous farm crisis response system API layer",
    version="0.1"
)

# Register routers
app.include_router(health_router)
app.include_router(dashboard_router)
app.include_router(analysis_router)
app.include_router(weather_router)
app.include_router(risk_router)
app.include_router(analyze_router)
