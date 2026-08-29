from typing import List

class RiskEngine:
    """
    Multidimensional Risk Assessment Engine for VoxShield AI.
    Calculates overall risk level (LOW, MEDIUM, HIGH) based on AI probability,
    model confidence, acoustic indicator count, and signal quality metrics.
    """
    @staticmethod
    def assess_risk(
        ai_probability: float,
        confidence: float,
        result: str,
        indicators: List[str],
        duration: float
    ) -> str:
        # High Risk Conditions
        if result == "AI_GENERATED":
            if ai_probability >= 0.70:
                return "HIGH"
            elif ai_probability >= 0.60 and len(indicators) >= 2:
                return "HIGH"
            else:
                return "MEDIUM"
        
        # Uncertain Conditions
        if result == "UNCERTAIN":
            return "MEDIUM"
        
        # Human Conditions
        if result == "HUMAN":
            if ai_probability < 0.30 and confidence >= 0.70:
                return "LOW"
            elif ai_probability < 0.40:
                return "LOW"
            else:
                return "MEDIUM"

        return "MEDIUM"

risk_engine = RiskEngine()
