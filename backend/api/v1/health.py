"""Health endpoints.

GET /api/v1/health/live  - process liveness
GET /api/v1/health/ready - process + database readiness
"""

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from sqlalchemy import text

from backend.api.deps import DBSession

router = APIRouter()


@router.get("/health/live", summary="Liveness check")
def live() -> dict:
    """Return immediately to verify the application process is responding.

    This endpoint does not touch the database. A successful response means
    the HTTP server is alive.
    """
    return {"status": "alive"}


@router.get("/health/ready", summary="Readiness check")
def ready(db: DBSession) -> dict:
    """Verify that the application and its database are ready.

    A database connection failure results in a non-healthy response.
    """
    try:
        db.execute(text("SELECT 1"))
        database = "connected"
    except Exception:
        database = "disconnected"

    if database == "connected":
        return {
            "status": "ready",
            "database": "connected",
        }

    # Database is not ready; signal unhealthiness with HTTP 503 while keeping
    # the readiness information in the body. No internal error details leaked.
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "status": "not_ready",
            "database": "disconnected",
        },
    )
