"""
Test script to verify LLM intervention planner (Stage 8D).
"""
import json
from app.services.intervention_llm_service import generate_intervention_plan

def test_planner():
    print("Initializing LLM Intervention Planner verification...")

    # Mock high-risk deterministic intervention data
    mock_data = {
        "priority": "HIGH",
        "action": "Irrigate",
        "time_window": "48 hours",
        "estimated_cost": 350,
        "estimated_yield_loss": 18000,
        "expected_benefit": 6000,
        "reasoning": "NDVI is critically low (0.105) and rainfall probability remains below 20% (11%), indicating a high crop risk situation. Immediate action 'Irrigate' is planned."
    }

    print("\nSending mock intervention data to LLM planner service...")
    print(f"Mock Data: {json.dumps(mock_data, indent=2)}")

    plan = generate_intervention_plan(mock_data)

    print("\nLLM Generated Plan Response:")
    print(json.dumps(plan, indent=4))

    # Verify keys
    has_summary = "summary" in plan
    has_steps = "execution_steps" in plan
    has_outcome = "expected_outcome" in plan

    if has_summary and has_steps and has_outcome:
        print("\n[SUCCESS] LLM intervention plan generated and verified successfully!")
        print(f"Summary exists: {has_summary}")
        print(f"Execution steps exists: {has_steps} (Count: {len(plan.get('execution_steps', []))})")
        print(f"Expected outcome exists: {has_outcome}")

        # Check clean list format (no bullet symbols, numbers, dashes inside step strings)
        steps = plan.get('execution_steps', [])
        import re
        has_bullets = any(re.match(r'^[\s\-\*\•\d\.\)\:]', step) for step in steps)
        if not has_bullets:
            print("[SUCCESS] Verified no list bullet/number prefixes inside execution step strings.")
        else:
            print("[WARNING] Found potential list bullet/number prefixes inside execution step strings!")
    else:
        print("\n[ERROR] Plan is missing key attributes. Validation failed.")

    # Test Fallback when API key is wrong/missing
    print("\nTesting fallback mode with invalid API key...")
    import os
    original_key = os.environ.get("GROQ_API_KEY")
    os.environ["GROQ_API_KEY"] = "invalid_key_for_testing_fallback"

    fallback_plan = generate_intervention_plan(mock_data)
    print("\nFallback Plan Response:")
    print(json.dumps(fallback_plan, indent=4))

    # Restore key
    if original_key is not None:
        os.environ["GROQ_API_KEY"] = original_key
    else:
        del os.environ["GROQ_API_KEY"]

    if "summary" in fallback_plan and "execution_steps" in fallback_plan and "expected_outcome" in fallback_plan:
        print("\n[SUCCESS] Fallback plan generated and validated successfully on Groq failure!")
    else:
        print("\n[ERROR] Fallback plan is invalid.")

if __name__ == "__main__":
    test_planner()
