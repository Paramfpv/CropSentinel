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

@app.on_event("startup")
async def startup_event():
    """
    Validates that all critical third-party API keys are loaded on startup.
    Halts application execution with RuntimeError if credentials are missing.
    """
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = ["COPERNICUS_CLIENT_ID", "COPERNICUS_CLIENT_SECRET", "GROQ_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        error_message = (
            f"\n======================================================================\n"
            f"CRITICAL STARTUP ERROR: Missing required environment variables:\n"
            f"  {', '.join(missing_vars)}\n"
            f"Please configure them in your environment or .env file before starting.\n"
            f"======================================================================\n"
        )
        print(error_message, flush=True)
        raise RuntimeError(error_message)

# Register routers
app.include_router(health_router)
app.include_router(dashboard_router)
app.include_router(analysis_router)
app.include_router(weather_router)
app.include_router(risk_router)
app.include_router(analyze_router)
