def test_recovery_summary(client):
    response = client.get("/api/recovery/summary")
    assert response.status_code == 200
    data = response.json()
    assert "revenue_at_risk" in data
    assert "recoverable_revenue" in data
    assert "revenue_recovered" in data
    assert "recovery_rate_percentage" in data
    assert data["revenue_at_risk"] > 0
    assert data["recoverable_revenue"] > 0

def test_recovery_opportunities(client):
    response = client.get("/api/recovery/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert "total_opportunities" in data
    assert "opportunities" in data
    assert len(data["opportunities"]) > 0
    for opp in data["opportunities"]:
        assert "recovery_probability" in opp
        assert "recommended_action" in opp

def test_at_risk_endpoint(client):
    response = client.get("/api/recovery/at-risk")
    assert response.status_code == 200
    data = response.json()
    assert "total_at_risk" in data
    assert "transactions" in data

def test_recovered_endpoint(client):
    response = client.get("/api/recovery/recovered")
    assert response.status_code == 200
    data = response.json()
    assert "total_recovered" in data
    assert "transactions" in data
