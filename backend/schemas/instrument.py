"""Pydantic v2 schemas for Instrument."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class InstrumentBase(BaseModel):
    """Shared Instrument fields."""

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)

    symbol: str = Field(..., min_length=1, max_length=32)
    name: str = Field(..., min_length=1, max_length=255)
    exchange: str = Field(..., min_length=1, max_length=32)
    instrument_type: str = Field(default="EQUITY", max_length=32)
    currency: str = Field(default="USD", min_length=3, max_length=8)
    country_code: str = Field(default="US", min_length=2, max_length=2)
    is_active: bool = Field(default=True)

    @field_validator("symbol")
    @classmethod
    def _normalize_symbol(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("exchange")
    @classmethod
    def _normalize_exchange(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("currency")
    @classmethod
    def _normalize_currency(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("country_code")
    @classmethod
    def _normalize_country_code(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("instrument_type")
    @classmethod
    def _normalize_instrument_type(cls, v: str) -> str:
        return v.strip().upper()


class InstrumentCreate(InstrumentBase):
    """Schema for creating an instrument."""

    pass


class InstrumentUpdate(BaseModel):
    """Schema for updating an instrument (all fields optional)."""

    name: str | None = Field(default=None, min_length=1, max_length=255)
    instrument_type: str | None = Field(default=None, max_length=32)
    currency: str | None = Field(default=None, min_length=3, max_length=8)
    country_code: str | None = Field(default=None, min_length=2, max_length=2)
    is_active: bool | None = None


class InstrumentResponse(InstrumentBase):
    """Schema returned for an instrument."""

    id: int
    created_at: datetime
    updated_at: datetime
