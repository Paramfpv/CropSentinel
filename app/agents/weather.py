"""
Weather Intelligence Agent.
Responsible for forecast analysis, geocoding, and retrieving weather metrics.
"""
from app.services.weather_service import get_weather

class WeatherAgent:
    """
    Weather intelligence agent responsible for geocoding and forecast retrieval.
    Can be run as a standalone execution or as a LangGraph node.
    """
    
    def execute(self, city: str) -> dict:
        """
        Executes weather forecast retrieval and returns normalized agent state.
        """
        try:
            weather_data = get_weather(city)
            return {
                "agent": "weather",
                "status": "completed",
                "data": weather_data
            }
        except Exception as e:
            return {
                "agent": "weather",
                "status": "failed",
                "error": str(e)
            }

    def run(self, state: dict) -> dict:
        """
        LangGraph node execution. Reads city from state, performs weather retrieval,
        appends results to state, and returns updated state.
        """
        city = state.get("city")
        if not city:
            raise ValueError("State must contain 'city'.")
            
        result = self.execute(city)
        
        if result["status"] == "completed":
            state["weather"] = result["data"]
        else:
            state["weather"] = {
                "error": result.get("error", "Unknown weather agent error")
            }
            
        return state
