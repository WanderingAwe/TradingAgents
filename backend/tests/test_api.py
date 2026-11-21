"""Tests for API endpoints."""

from fastapi.testclient import TestClient


def test_create_and_list_instruments(client: TestClient) -> None:
    """Instruments can be created and listed."""
    payload = {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "exchange": "NSE",
        "instrument_type": "EQUITY",
        "currency": "INR",
        "country_code": "IN",
    }
    response = client.post("/api/v1/instruments", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["symbol"] == "RELIANCE"
    assert data["exchange"] == "NSE"
    assert data["id"] is not None

    list_response = client.get("/api/v1/instruments")
    assert list_response.status_code == 200
    instruments = list_response.json()
    assert len(instruments) >= 1


def test_create_duplicate_instrument_rejected(client: TestClient) -> None:
    """Creating a duplicate (exchange, symbol) instrument returns 409."""
    payload = {
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "exchange": "NSE",
        "instrument_type": "EQUITY",
        "currency": "INR",
        "country_code": "IN",
    }
    client.post("/api/v1/instruments", json=payload)
    response = client.post("/api/v1/instruments", json=payload)
    assert response.status_code == 409


def test_get_instrument_by_id(client: TestClient) -> None:
    """Get instrument by id returns the correct instrument."""
    payload = {
        "symbol": "INFY",
        "name": "Infosys Ltd",
        "exchange": "NSE",
        "instrument_type": "EQUITY",
        "currency": "INR",
        "country_code": "IN",
    }
    create_response = client.post("/api/v1/instruments", json=payload)
    instrument_id = create_response.json()["id"]

    get_response = client.get(f"/api/v1/instruments/{instrument_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["id"] == instrument_id
    assert data["symbol"] == "INFY"


def test_get_instrument_not_found(client: TestClient) -> None:
    """Getting a non-existent instrument returns 404 with structured error."""
    response = client.get("/api/v1/instruments/99999")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert "message" in data
    assert "status_code" in data
    assert "request_id" in data
    assert data["status_code"] == 404


def test_create_instrument_invalid_payload(client: TestClient) -> None:
    """Creating an instrument with missing required fields returns 422."""
    response = client.post("/api/v1/instruments", json={"symbol": "RELIANCE"})
    assert response.status_code == 422


def test_instrument_filtering(client: TestClient) -> None:
    """Instruments can be filtered by exchange and instrument type."""
    client.post("/api/v1/instruments", json={
        "symbol": "RELIANCE", "name": "Reliance", "exchange": "NSE",
        "instrument_type": "EQUITY", "currency": "INR", "country_code": "IN",
    })
    client.post("/api/v1/instruments", json={
        "symbol": "BTC", "name": "Bitcoin", "exchange": "COINBASE",
        "instrument_type": "CRYPTO", "currency": "USD", "country_code": "US",
    })

    nse_response = client.get("/api/v1/instruments?exchange=NSE")
    assert nse_response.status_code == 200
    nse_instruments = nse_response.json()
    assert all(i["exchange"] == "NSE" for i in nse_instruments)

    crypto_response = client.get("/api/v1/instruments?instrument_type=CRYPTO")
    assert crypto_response.status_code == 200
    crypto_instruments = crypto_response.json()
    assert all(i["instrument_type"] == "CRYPTO" for i in crypto_instruments)


def test_create_and_list_data_sources(client: TestClient) -> None:
    """Data sources can be created and listed."""
    payload = {
        "source_code": "YFINANCE",
        "name": "Yahoo Finance",
        "provider": "Yahoo",
        "source_type": "MARKET_DATA",
    }
    response = client.post("/api/v1/data-sources", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["source_code"] == "YFINANCE"

    list_response = client.get("/api/v1/data-sources")
    assert list_response.status_code == 200
    sources = list_response.json()
    assert len(sources) >= 1


def test_create_duplicate_data_source_rejected(client: TestClient) -> None:
    """Creating a duplicate source_code returns 409."""
    payload = {
        "source_code": "FRED",
        "name": "FRED",
        "provider": "Federal Reserve",
        "source_type": "MACRO",
    }
    client.post("/api/v1/data-sources", json=payload)
    response = client.post("/api/v1/data-sources", json=payload)
    assert response.status_code == 409


def test_create_and_list_observations(client: TestClient) -> None:
    """Observations can be created and listed."""
    # Create prerequisite data source and instrument
    source_response = client.post("/api/v1/data-sources", json={
        "source_code": "TEST_SRC", "name": "Test Source", "provider": "Test",
        "source_type": "MARKET_DATA",
    })
    source_id = source_response.json()["id"]

    instrument_response = client.post("/api/v1/instruments", json={
        "symbol": "RELIANCE", "name": "Reliance", "exchange": "NSE",
        "instrument_type": "EQUITY", "currency": "INR", "country_code": "IN",
    })
    instrument_id = instrument_response.json()["id"]

    payload = {
        "data_source_id": source_id,
        "instrument_id": instrument_id,
        "observation_type": "PRICE",
        "observed_at": "2026-01-15T09:15:00+00:00",
        "numeric_value": 2450.50,
        "currency": "INR",
    }
    response = client.post("/api/v1/observations", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["observation_type"] == "PRICE"
    assert data["numeric_value"] == 2450.50
    assert data["retrieved_at"] is not None

    list_response = client.get("/api/v1/observations")
    assert list_response.status_code == 200
    observations = list_response.json()
    assert len(observations) >= 1


def test_observation_invalid_foreign_key(client: TestClient) -> None:
    """Creating an observation with a non-existent data source returns 400."""
    payload = {
        "data_source_id": 99999,
        "observation_type": "PRICE",
        "observed_at": "2026-01-15T09:15:00+00:00",
    }
    response = client.post("/api/v1/observations", json=payload)
    assert response.status_code == 400


def test_observation_filtering_and_pagination(client: TestClient) -> None:
    """Observations support filtering by type and pagination."""
    # Create a data source first
    source_response = client.post("/api/v1/data-sources", json={
        "source_code": "TEST_SRC", "name": "Test Source", "provider": "Test",
        "source_type": "MARKET_DATA",
    })
    source_id = source_response.json()["id"]

    # Create multiple observations
    for i in range(5):
        client.post("/api/v1/observations", json={
            "data_source_id": source_id,
            "observation_type": "PRICE",
            "observed_at": f"2026-01-15T09:{i:02d}:00+00:00",
            "numeric_value": float(i),
        })

    # Filter by type
    price_response = client.get("/api/v1/observations?observation_type=PRICE")
    assert price_response.status_code == 200
    price_observations = price_response.json()
    assert all(o["observation_type"] == "PRICE" for o in price_observations)

    # Pagination
    page1 = client.get("/api/v1/observations?limit=2&offset=0")
    assert page1.status_code == 200
    assert len(page1.json()) == 2

    page2 = client.get("/api/v1/observations?limit=2&offset=2")
    assert page2.status_code == 200
    assert len(page2.json()) == 2


def test_get_observation_by_id(client: TestClient) -> None:
    """Get observation by id returns the correct observation."""
    source_response = client.post("/api/v1/data-sources", json={
        "source_code": "TEST_SRC", "name": "Test Source", "provider": "Test",
        "source_type": "MARKET_DATA",
    })
    source_id = source_response.json()["id"]

    create_response = client.post("/api/v1/observations", json={
        "data_source_id": source_id,
        "observation_type": "NEWS",
        "observed_at": "2026-01-15T10:00:00+00:00",
        "text_value": "Breaking news",
    })
    observation_id = create_response.json()["id"]

    get_response = client.get(f"/api/v1/observations/{observation_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["id"] == observation_id
    assert data["observation_type"] == "NEWS"


def test_get_observation_not_found(client: TestClient) -> None:
    """Getting a non-existent observation returns 404 with structured error."""
    response = client.get("/api/v1/observations/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["status_code"] == 404
    assert "request_id" in data


def test_error_response_structure(client: TestClient) -> None:
    """Error responses follow the standard envelope format."""
    response = client.get("/api/v1/instruments/99999")
    assert response.status_code == 404
    data = response.json()
    assert {"error", "message", "status_code", "request_id"}.issubset(data.keys())
    assert isinstance(data["request_id"], str)
    assert len(data["request_id"]) > 0
