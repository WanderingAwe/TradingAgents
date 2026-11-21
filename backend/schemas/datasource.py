"""Pydantic v2 schemas for DataSource."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class DataSourceBase(BaseModel):
    """Shared DataSource fields."""

    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)

    source_code: str = Field(..., min_length=1, max_length=64)
    name: str = Field(..., min_length=1, max_length=255)
    provider: str = Field(..., min_length=1, max_length=255)
    source_type: str = Field(..., min_length=1, max_length=64)
    is_active: bool = Field(default=True)
    source_url: str | None = Field(default=None, max_length=1024)
    terms_url: str | None = Field(default=None, max_length=1024)

    @field_validator("source_code")
    @classmethod
    def _normalize_source_code(cls, v: str) -> str:
        return v.strip().upper()


class DataSourceCreate(DataSourceBase):
    """Schema for creating a data source."""

    pass


class DataSourceUpdate(BaseModel):
    """Schema for updating a data source (all fields optional)."""

    name: str | None = Field(default=None, min_length=1, max_length=255)
    provider: str | None = Field(default=None, min_length=1, max_length=255)
    source_type: str | None = Field(default=None, min_length=1, max_length=64)
    is_active: bool | None = None
    source_url: str | None = Field(default=None, max_length=1024)
    terms_url: str | None = Field(default=None, max_length=1024)


class DataSourceResponse(DataSourceBase):
    """Schema returned for a data source."""

    id: int
    created_at: datetime
    updated_at: datetime
