from app.agents.recovery_agent import RevenueRecoveryAgent

def test_agent_status(client):
    response = client.get("/api/agent/status")
    assert response.status_code == 200
    data = response.json()
    assert data["agent_name"] == "RecoverAI Autonomous Agent"
    assert data["status"] == "ACTIVE"
    assert data["is_autonomous"] is True

def test_agent_analyze_endpoint(client):
    payload = {
        "amount": 75000.0,
        "payment_method": "UPI",
        "failure_reason": "UPI_TIMEOUT",
        "gateway": "Razorpay"
    }
    response = client.post("/api/agent/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recovery_probability"] >= 90.0
    assert data["risk_level"] == "High"
    assert "Smart UPI Rail Reroute" in data["recommended_action"]
    assert data["estimated_salvageable_amount"] > 0
    assert data["auto_executable"] is True

def test_agent_prioritize_endpoint(client):
    response = client.post("/api/agent/prioritize")
    assert response.status_code == 200
    data = response.json()
    assert "total_prioritized" in data
    assert "prioritized_queue" in data
    assert len(data["prioritized_queue"]) > 0

def test_agent_deterministic_logic_unit():
    # Test high value + transient timeout -> high priority & high probability
    res1 = RevenueRecoveryAgent.analyze_transaction(
        amount=85000.0,
        payment_method="UPI",
        failure_reason="UPI_TIMEOUT",
        gateway="Razorpay"
    )
    assert res1["recovery_probability"] >= 90.0
    assert res1["priority"] == "High"
    assert res1["recommended_action"] == "Smart UPI Rail Reroute"

    # Test permanent failure -> low probability
    res2 = RevenueRecoveryAgent.analyze_transaction(
        amount=5000.0,
        payment_method="UPI",
        failure_reason="MAX_RETRIES_EXCEEDED",
        gateway="SBI Gateway",
        attempts_count=4
    )
    assert res2["recovery_probability"] <= 30.0
    assert res2["priority"] == "Low"
    assert "Support" in res2["recommended_action"]
