from app.schemas.detection import TechnicalDetails, AcousticFeatures

class ExplainabilityEngine:
    """
    Explainable AI (XAI) Engine for VoxShield AI.
    Translates raw mathematical DSP features and model outputs into clear,
    human-interpretable rationales and structured cybersecurity audit insights.
    """
    @staticmethod
    def generate_explanation(
        result: str,
        ai_probability: float,
        language: str,
        technical_details: TechnicalDetails,
        acoustic_features: AcousticFeatures
    ) -> str:
        if result == "AI_GENERATED":
            reasons = []
            if technical_details.prosodic_inconsistency_score > 0.2:
                reasons.append("unnatural pitch regularity lacking biological micro-tremors")
            if technical_details.spectral_irregularity_score > 0.2:
                reasons.append("spectral harmonic attenuation typical of neural text-to-speech vocoders")
            if technical_details.phase_discontinuity_index > 0.3:
                reasons.append("STFT phase reconstruction artifacts")
            
            reasons_str = ", ".join(reasons) if reasons else "characteristic acoustic anomalies"
            return (
                f"The audio contains acoustic and prosodic patterns ({reasons_str}) "
                f"that differ significantly from natural {language} human vocal tract mechanics. "
                f"The VoxShield ensemble detector assigns an AI probability of {round(ai_probability * 100, 1)}%."
            )
        elif result == "HUMAN":
            return (
                f"The audio demonstrates natural physiological vocal characteristics, including authentic "
                f"pitch jitter (micro-tremors), continuous formant transitions, and realistic spectral harmonic decay "
                f"consistent with biological {language} speech."
            )
        else:
            return (
                f"The audio displays mixed acoustic signals with border-region confidence. "
                f"While some natural speech dynamics are present, certain harmonic or compression patterns "
                f"prevent high-confidence classification. Multi-channel out-of-band verification is strongly advised."
            )

explainability_engine = ExplainabilityEngine()
