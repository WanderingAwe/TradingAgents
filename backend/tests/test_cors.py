"""Tests for CORS middleware.

Verifies that configured origins are allowed, disallowed origins are rejected,
and preflight requests behave correctly.

CORS does not provide authentication or authorization; it only controls which
browser origins may access the API via cross-origin browser requests.
"""

from fastapi.testclient import TestClient

ALLOWED_ORIGIN = "http://localhost:5173"
DISALLOWED_ORIGIN = "http://evil.example.com"


def test_cors_allowed_origin_get(client: TestClient) -> None:
    """A request from a configured origin receives CORS headers."""
    response = client.get(
        "/api/v1/instruments",
        headers={"Origin": ALLOWED_ORIGIN},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == ALLOWED_ORIGIN


def test_cors_disallowed_origin_get(client: TestClient) -> None:
    """A request from a disallowed origin does not receive CORS headers."""
    response = client.get(
        "/api/v1/instruments",
        headers={"Origin": DISALLOWED_ORIGIN},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") is None


def test_cors_preflight_allowed(client: TestClient) -> None:
    """A CORS preflight from a configured origin is allowed."""
    response = client.options(
        "/api/v1/instruments",
        headers={
            "Origin": ALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == ALLOWED_ORIGIN
    assert "access-control-allow-methods" in response.headers


def test_cors_preflight_disallowed(client: TestClient) -> None:
    """A CORS preflight from a disallowed origin is not allowed."""
    response = client.options(
        "/api/v1/instruments",
        headers={
            "Origin": DISALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
    )
    # Preflight from disallowed origin should not be allowed.
    assert response.headers.get("access-control-allow-origin") is None
