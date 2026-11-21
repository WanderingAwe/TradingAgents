"""Structured API error responses.

All errors returned by the backend follow a consistent envelope so frontend
clients can handle them predictably. Internal exception details and stack
traces are never leaked to clients.
"""

from uuid import uuid4

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    """A single validation or error detail."""

    field: str | None = None
    message: str


class ErrorResponse(BaseModel):
    """Standard error response envelope."""

    error: str
    message: str
    status_code: int
    request_id: str
    details: list[ErrorDetail] | None = None


def _generate_request_id() -> str:
    return uuid4().hex


def error_response(
    *,
    error: str,
    message: str,
    status_code: int,
    request_id: str | None = None,
    details: list[ErrorDetail] | None = None,
) -> JSONResponse:
    """Build a JSON error response with the standard envelope."""
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            error=error,
            message=message,
            status_code=status_code,
            request_id=request_id or _generate_request_id(),
            details=details,
        ).model_dump(mode="json"),
    )


def add_request_id_middleware(app):
    """Add a middleware that injects a request ID into every response header.

    The request ID is also available in error responses for tracing.
    """

    @app.middleware("http")
    async def _request_id_middleware(request: Request, call_next):
        request_id = _generate_request_id()
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


def add_exception_handlers(app):
    """Add exception handlers that return structured error responses."""

    @app.exception_handler(HTTPException)
    async def _http_exception_handler(request: Request, exc: HTTPException):
        request_id = getattr(request.state, "request_id", None) or _generate_request_id()
        return error_response(
            error="request_error",
            message=exc.detail if isinstance(exc.detail, str) else "Request failed",
            status_code=exc.status_code,
            request_id=request_id,
        )

    @app.exception_handler(Exception)
    async def _unhandled_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", None) or _generate_request_id()
        # Never leak internal exception details to clients.
        return error_response(
            error="internal_error",
            message="An unexpected error occurred",
            status_code=500,
            request_id=request_id,
        )
