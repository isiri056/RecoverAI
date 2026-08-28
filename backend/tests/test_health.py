def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "RecoverAI API"
    assert data["status"] == "running"
    assert data["version"] == "1.0.0"

def test_health_check_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert data["service"] == "RecoverAI Revenue Recovery Engine"
    assert "checks" in data
    assert data["checks"]["api"] == "operational"
