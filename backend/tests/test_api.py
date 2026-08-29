import asyncio
import os
import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import httpx
from app.config import settings, SAMPLE_DIR

async def run_tests():
    print("[*] Starting VoxShield AI Backend API Tests...")
    
    from app.main import app
    from app.database import init_db
    await init_db()

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        
        # 1. Test Health Check
        print("1. Testing /health...")
        res = await client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("   [PASS] Health check passed:", res.json())

        # 2. Test Sample Voices
        print("2. Testing /api/sample-voices...")
        res = await client.get("/api/sample-voices")
        assert res.status_code == 200, f"Sample voices failed: {res.text}"
        samples = res.json()
        assert len(samples) >= 6, "Expected at least 6 sample voices"
        print(f"   [PASS] Retrieved {len(samples)} sample voice presets.")

        # 3. Test Script Generation
        print("3. Testing /api/script/generate...")
        res = await client.post("/api/script/generate", json={"language": "Marathi", "scenario_type": "urgent_financial"})
        assert res.status_code == 200, f"Script generation failed: {res.text}"
        script_data = res.json()
        assert "नमस्कार" in script_data["script"], "Expected Marathi script"
        print(f"   [PASS] Script generated in Marathi: {script_data['scenario']}")

        # 4. Test Analyze Audio on Marathi AI Clone
        print("4. Testing /api/audio/analyze on AI clone preset...")
        res = await client.post("/api/audio/analyze", data={"sample_id": "marathi_ai_clone", "language": "Marathi"})
        assert res.status_code == 200, f"Analysis failed: {res.text}"
        ai_res = res.json()
        print(f"   [PASS] Classification: {ai_res['result']} (AI Prob: {ai_res['ai_probability']}, Risk: {ai_res['risk_level']})")
        assert ai_res['result'] == "AI_GENERATED", f"Expected AI_GENERATED, got {ai_res['result']}"
        assert ai_res['risk_level'] == "HIGH", f"Expected HIGH risk, got {ai_res['risk_level']}"
        assert len(ai_res['indicators']) > 0, "Expected acoustic indicators"

        # 5. Test Analyze Audio on Marathi Authentic Human
        print("5. Testing /api/audio/analyze on Human preset...")
        res = await client.post("/api/audio/analyze", data={"sample_id": "marathi_authentic_human", "language": "Marathi"})
        assert res.status_code == 200, f"Analysis failed: {res.text}"
        human_res = res.json()
        print(f"   [PASS] Classification: {human_res['result']} (Human Prob: {human_res['human_probability']}, Risk: {human_res['risk_level']})")
        assert human_res['result'] == "HUMAN", f"Expected HUMAN, got {human_res['result']}"
        assert human_res['risk_level'] == "LOW", f"Expected LOW risk, got {human_res['risk_level']}"

        # 6. Test Dashboard Stats
        print("6. Testing /api/history/stats...")
        res = await client.get("/api/history/stats")
        assert res.status_code == 200, f"Stats failed: {res.text}"
        stats = res.json()
        print(f"   [PASS] Dashboard Stats: {stats['total_analyses']} total, {stats['ai_voices_detected']} AI, {stats['human_voices']} Human.")
        assert stats['total_analyses'] >= 2, "Expected at least 2 analyses in history"

        # 7. Test Model Insights
        print("7. Testing /api/insights/metrics...")
        res = await client.get("/api/insights/metrics")
        assert res.status_code == 200, f"Insights failed: {res.text}"
        insights = res.json()
        print(f"   [PASS] Model Benchmark: Accuracy {insights['overall_accuracy']}, ROC-AUC {insights['roc_auc']}")

        # 8. Test Voice Simulation (Module A)
        print("8. Testing /api/voice/simulate...")
        res = await client.post("/api/voice/simulate", data={
            "language": "Marathi",
            "script": "ही चाचणी ऑडिओ क्लिप आहे."
        })
        assert res.status_code == 200, f"Simulation failed: {res.text}"
        sim_data = res.json()
        print(f"   [PASS] Voice Simulated: {sim_data['generated_voice_filename']} (Duration: {sim_data['duration']}s)")

    print("\n========================================================")
    print("ALL VOXSHIELD AI BACKEND TESTS PASSED SUCCESSFULLY! (100%)")
    print("========================================================")

if __name__ == "__main__":
    asyncio.run(run_tests())
