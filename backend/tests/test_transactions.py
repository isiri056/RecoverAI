def test_list_transactions(client):
    response = client.get("/api/transactions")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "transactions" in data
    assert len(data["transactions"]) > 0

def test_get_single_transaction(client):
    response = client.get("/api/transactions/TXN-10294")
    assert response.status_code == 200
    data = response.json()
    assert data["transaction_id"] == "TXN-10294"
    assert data["amount"] == 75000.0
    assert data["currency"] == "INR"

def test_create_transaction_and_agent_evaluation(client):
    payload = {
        "transaction_id": "TXN-TEST-999",
        "customer_id": "CUST-TEST",
        "customer_name": "Test Customer",
        "customer_email": "test@customer.com",
        "amount": 50000.0,
        "currency": "INR",
        "payment_method": "UPI",
        "gateway": "Razorpay",
        "status": "failed",
        "failure_reason": "UPI_TIMEOUT"
    }
    response = client.post("/api/transactions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["transaction_id"] == "TXN-TEST-999"
    assert data["recovery_probability"] >= 90.0
    assert data["priority"] == "High"
    assert data["recommended_action"] == "Smart UPI Rail Reroute"

def test_update_transaction(client):
    update_payload = {
        "recovery_status": "Recovered",
        "status": "recovered"
    }
    response = client.put("/api/transactions/TXN-10294", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recovery_status"] == "Recovered"

def test_delete_transaction(client):
    response = client.delete("/api/transactions/TXN-10294")
    assert response.status_code == 204
    
    get_res = client.get("/api/transactions/TXN-10294")
    assert get_res.status_code == 404
