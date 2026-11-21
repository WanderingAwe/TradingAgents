"""Pydantic v2 schemas shared across API modules."""

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict


class ErrorResponse(BaseModel):
    """Standard error response envelope."""

    model_config = ConfigDict(from_attributes=True)

    error: str
    message: str
    status_code: int
    request_id: str
    details: list[dict] | None = None


class PaginationMeta(BaseModel):
    """Pagination metadata for list responses."""

    page: int
    page_size: int
    total: int
    total_pages: int


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated list response."""

    model_config = ConfigDict(from_attributes=True)

    items: list[T]
    meta: PaginationMeta
