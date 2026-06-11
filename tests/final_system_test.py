"""
Final system verification script performing end-to-end checks across all components of CropSentinel.
"""
import sys
import os
import asyncio

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
    print("==================================================")
    print("          CROPSENTINEL SYSTEM VERIFICATION        ")
    print("==================================================")
    
    latitude = 20.9374
    longitude = 77.7796
    city = "Vadodara"
    
    # 1. Copernicus & Satellite Service
    try:
        token = get_copernicus_token()
        if not token:
            raise ValueError("Copernicus token is empty")
        ndvi_res = get_ndvi(latitude, longitude)
        if "ndvi" not in ndvi_res:
            raise ValueError("NDVI missing from satellite response")
        print("[PASS] Satellite Service")
    except Exception as e:
        print(f"[FAIL] Satellite Service check failed: {e}")
        sys.exit(1)

    # 2. Weather Service
    try:
        weather_res = get_weather(city)
        if "current" not in weather_res or "forecast" not in weather_res:
            raise ValueError("Invalid weather payload structure")
        print("[PASS] Weather Service")
    except Exception as e:
        print(f"[FAIL] Weather Service check failed: {e}")
        sys.exit(1)

    # 3. Risk Engine
    try:
        risk_res = calculate_risk(latitude, longitude, city)
        if "risk_score" not in risk_res or "risk_level" not in risk_res:
            raise ValueError("Risk fields missing from risk response")
        print("[PASS] Risk Engine")
    except Exception as e:
        print(f"[FAIL] Risk Engine check failed: {e}")
        sys.exit(1)

    # 4. LLM Layer
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
            raise ValueError("LLM generated advice is empty")
        print("[PASS] LLM Layer")
    except Exception as e:
        print(f"[FAIL] LLM Layer check failed: {e}")
        sys.exit(1)

    # 5. Intervention Agent
    try:
        agent = InterventionAgent()
        state_data = {
            "satellite": ndvi_res,
            "weather": weather_res,
            "risk": risk_res
        }
        res = agent.execute(state_data)
        if res["status"] != "completed":
            raise ValueError(f"Intervention agent failed: {res.get('error')}")
        
        data = res["data"]
        if "plan" not in data or "summary" not in data["plan"] or "execution_steps" not in data["plan"]:
            raise ValueError("Plan payload is missing required schema fields")
        print("[PASS] Intervention Agent")
    except Exception as e:
        print(f"[FAIL] Intervention Agent check failed: {e}")
        sys.exit(1)

    # 6. LangGraph Coordinator
    try:
        coordinator = CoordinatorAgent()
        graph_state = coordinator.execute(latitude, longitude, city)
        required_keys = ["satellite", "weather", "risk", "intervention"]
        if not all(k in graph_state for k in required_keys):
            raise ValueError("LangGraph state is missing one of the primary payloads")
        print("[PASS] LangGraph Coordinator")
    except Exception as e:
        print(f"[FAIL] LangGraph Coordinator check failed: {e}")
        sys.exit(1)

    # 7. Analyze Endpoint
    try:
        req = AnalyzeRequest(latitude=latitude, longitude=longitude, city=city)
        endpoint_res = run_sync(post_analyze(req))
        if not all(k in endpoint_res for k in ["satellite", "weather", "risk", "intervention"]):
            raise ValueError("FastAPI POST /analyze response lacks required root keys")
        if "plan" not in endpoint_res["intervention"]:
            raise ValueError("FastAPI POST /analyze intervention payload is missing the nested plan")
        print("[PASS] Analyze Endpoint")
    except Exception as e:
        print(f"[FAIL] Analyze Endpoint check failed: {e}")
        sys.exit(1)

    print("==================================================")
    print("FINAL STATUS: ALL SYSTEMS OPERATIONAL")
    print("==================================================")

if __name__ == "__main__":
    main()
