"""Observation ORM model.

Represents an observation collected from a data source. Timestamps
distinguish observation time, publication time, and retrieval time.
Historical observations are preserved when their source or instrument
is removed (foreign keys use SET NULL).
"""

from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base
from backend.models.base import TimestampMixin


class Observation(Base, TimestampMixin):
    """An observation collected from a data source."""

    __tablename__ = "observations"

    __table_args__ = (
        Index("ix_observation_source_observed", "data_source_id", "observed_at"),
        Index("ix_observation_instrument_observed", "instrument_id", "observed_at"),
        Index("ix_observation_type_observed", "observation_type", "observed_at"),
    )

    data_source_id: Mapped[int | None] = mapped_column(
        ForeignKey("data_sources.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    instrument_id: Mapped[int | None] = mapped_column(
        ForeignKey("instruments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    observation_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    observed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )
    retrieved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    numeric_value: Mapped[float | None] = mapped_column(nullable=True)
    text_value: Mapped[str | None] = mapped_column(String(4096), nullable=True)
    unit: Mapped[str | None] = mapped_column(String(32), nullable=True)
    currency: Mapped[str | None] = mapped_column(String(8), nullable=True)
    external_reference: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    raw_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    data_source = relationship("DataSource", lazy="selectin")
    instrument = relationship("Instrument", lazy="selectin")

    def __repr__(self) -> str:
        return f"Observation(type={self.observation_type!r}, observed_at={self.observed_at})"
