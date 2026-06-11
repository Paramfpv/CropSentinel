"""
Test script to verify Groq SDK connectivity and llama-3.1-8b-instant completions.
"""
import sys
from app.services.llm_service import generate_advice

def main():
    print("Testing Groq connectivity & generate_advice function...")
    
    # Mock data based on the example in the requirements
    risk_score = 60
    risk_level = "HIGH"
    recommendation = "Irrigate within 48 hours"
    ndvi = 0.105
    temperature = 32
    humidity = 65
    rain_probability = 1
    
    print("\nInputs:")
    print(f"Risk Score: {risk_score}")
    print(f"Risk Level: {risk_level}")
    print(f"Recommendation: {recommendation}")
    print(f"NDVI: {ndvi}")
    print(f"Temperature: {temperature}°C")
    print(f"Humidity: {humidity}%")
    print(f"Rain Probability: {rain_probability}%")
    
    try:
        explanation = generate_advice(
            risk_score=risk_score,
            risk_level=risk_level,
            recommendation=recommendation,
            ndvi=ndvi,
            temperature=temperature,
            humidity=humidity,
            rain_probability=rain_probability
        )
        print("\n[SUCCESS] Successfully generated LLM advice!")
        print("\nGenerated Explanation:")
        print("-" * 60)
        print(explanation)
        print("-" * 60)
        
        # Word count validation
        word_count = len(explanation.split())
        print(f"Explanation Word Count: {word_count} (Limit: 120 words)")
        if word_count > 120:
            print("[WARNING] Word count exceeds the 120-word limit!")
        else:
            print("[OK] Word count is within limits.")
            
    except Exception as e:
        print(f"\n[ERROR] Failed to generate advice: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
