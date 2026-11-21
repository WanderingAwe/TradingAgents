"""Pydantic v2 schemas for Observation."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ObservationBase(BaseModel):
    """Shared Observation fields."""

    model_config = ConfigDict(from_attributes=True)

    data_source_id: int | None = None
    instrument_id: int | None = None
    observation_type: str = Field(..., min_length=1, max_length=64)
    observed_at: datetime
    published_at: datetime | None = None
    numeric_value: float | None = None
    text_value: str | None = Field(default=None, max_length=4096)
    unit: str | None = Field(default=None, max_length=32)
    currency: str | None = Field(default=None, max_length=8)
    external_reference: str | None = Field(default=None, max_length=255)
    source_url: str | None = Field(default=None, max_length=1024)
    raw_payload: dict[str, Any] | None = None


class ObservationCreate(ObservationBase):
    """Schema for creating an observation."""

    pass


class ObservationResponse(ObservationBase):
    """Schema returned for an observation."""

    id: int
    retrieved_at: datetime
    created_at: datetime
    updated_at: datetime
