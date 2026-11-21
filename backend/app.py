"""FastAPI application factory and entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.v1.router import router as v1_router
from backend.config import get_settings
from backend.errors import add_exception_handlers, add_request_id_middleware


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="Trading Terminal Backend",
        description="Backend API for the Global Intelligence & Trading Terminal",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/api/v1/openapi.json",
    )

    # Request ID middleware for tracing
    add_request_id_middleware(app)

    # Structured error handlers
    add_exception_handlers(app)

    # CORS: explicit origins from configuration. The Vite development proxy is
    # the preferred development approach; this middleware handles cross-origin
    # browser clients against explicit, configured origins only.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount versioned API routes
    app.include_router(v1_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
