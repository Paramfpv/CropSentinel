"""
Deployment readiness verification script for CropSentinel.
Validates environment variable loading, API credentials, service layers, agents, LangGraph workflows, and endpoint routes.
"""
import sys
import os
import asyncio
from dotenv import load_dotenv

# Ensure dotenv is loaded before checks run
load_dotenv()

# Ensure project root is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import components
try:
    from app.services.copernicus_service import get_copernicus_token, get_ndvi
    from app.services.weather_service import get_weather
    from app.services.risk_service import calculate_risk
    from app.services.llm_service import generate_advice
    from app.agents.intervention import InterventionAgent
    from app.agents.coordinator import CoordinatorAgent
    from app.api.analyze import post_analyze, AnalyzeRequest
except ImportError as e:
    print(f"[FAIL] Dependency import failed: {e}")
    sys.exit(1)

def run_sync(coro):
    """
    Helper to run async coroutines safely.
    """
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)

def main():
    # A. Environment Variables
    try:
        required_vars = [
            "COPERNICUS_CLIENT_ID",
            "COPERNICUS_CLIENT_SECRET",
            "GROQ_API_KEY",
            "DATABASE_URL"
        ]
        missing = [v for v in required_vars if not os.getenv(v)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
        print("[PASS] Environment Variables")
    except Exception as e:
        print(f"[FAIL] Environment Variables: {e}")
        sys.exit(1)

    latitude = 20.9374
    longitude = 77.7796
    city = "Vadodara"

    # B. Copernicus Authentication
    try:
        token = get_copernicus_token()
        if not token:
            raise ValueError("Retrieved Copernicus token is empty.")
        print("[PASS] Copernicus Authentication")
    except Exception as e:
        print(f"[FAIL] Copernicus Authentication: {e}")
        sys.exit(1)

    # C. Satellite Service
    try:
        ndvi_res = get_ndvi(latitude, longitude)
        if "ndvi" not in ndvi_res or ndvi_res.get("ndvi") is None:
            raise ValueError(f"Invalid NDVI response structure: {ndvi_res}")
        print("[PASS] Satellite Service")
    except Exception as e:
        print(f"[FAIL] Satellite Service: {e}")
        sys.exit(1)

    # D. Weather Service
    try:
        weather_res = get_weather(city)
        if "current" not in weather_res or "forecast" not in weather_res:
            raise ValueError(f"Invalid weather response structure: {weather_res}")
        print("[PASS] Weather Service")
    except Exception as e:
        print(f"[FAIL] Weather Service: {e}")
        sys.exit(1)

    # E. Risk Engine
    try:
        risk_res = calculate_risk(latitude, longitude, city)
        if "risk_score" not in risk_res or "risk_level" not in risk_res:
            raise ValueError(f"Invalid risk response structure: {risk_res}")
        print("[PASS] Risk Engine")
    except Exception as e:
        print(f"[FAIL] Risk Engine: {e}")
        sys.exit(1)

    # F. LLM Layer
    try:
        advice = generate_advice(
            risk_score=risk_res["risk_score"],
            risk_level=risk_res["risk_level"],
            recommendation=risk_res["recommendation"],
            ndvi=ndvi_res["ndvi"],
            temperature=weather_res["current"]["temperature"],
            humidity=weather_res["current"]["humidity"],
            rain_probability=30
        )
        if not advice or len(advice.strip()) == 0:
            raise ValueError("LLM advice response is empty.")
        print("[PASS] LLM Layer")
    except Exception as e:
        print(f"[FAIL] LLM Layer: {e}")
        sys.exit(1)

    # G. Intervention Agent
    try:
        agent = InterventionAgent()
        state_data = {
            "satellite": ndvi_res,
            "weather": weather_res,
            "risk": risk_res
        }
        res = agent.execute(state_data)
        if res["status"] != "completed":
            raise ValueError(f"Intervention agent execution failed: {res.get('error')}")
        
        data = res["data"]
        if "plan" not in data or "summary" not in data["plan"] or "execution_steps" not in data["plan"] or "expected_outcome" not in data["plan"]:
            raise ValueError(f"Missing required plan fields: {data.get('plan')}")
        print("[PASS] Intervention Agent")
    except Exception as e:
        print(f"[FAIL] Intervention Agent: {e}")
        sys.exit(1)

    # H. LangGraph Coordinator
    try:
        coordinator = CoordinatorAgent()
        graph_state = coordinator.execute(latitude, longitude, city)
        for key in ["satellite", "weather", "risk", "intervention"]:
            if key not in graph_state:
                raise ValueError(f"Key '{key}' missing from orchestrated StateGraph.")
        print("[PASS] LangGraph Coordinator")
    except Exception as e:
        print(f"[FAIL] LangGraph Coordinator: {e}")
        sys.exit(1)

    # I. Analyze Endpoint
    try:
        req = AnalyzeRequest(latitude=latitude, longitude=longitude, city=city)
        endpoint_res = run_sync(post_analyze(req))
        if not all(k in endpoint_res for k in ["satellite", "weather", "risk", "intervention"]):
            raise ValueError(f"FastAPI POST /analyze response lacks required root keys: {endpoint_res.keys()}")
        if "plan" not in endpoint_res["intervention"]:
            raise ValueError("FastAPI POST /analyze response lacks nested plan structure under intervention.")
        print("[PASS] Analyze Endpoint")
    except Exception as e:
        print(f"[FAIL] Analyze Endpoint: {e}")
        sys.exit(1)

    print("\n==================================================")
    print("DEPLOYMENT READINESS STATUS: PASS")
    print("=================================")

if __name__ == "__main__":
    main()
