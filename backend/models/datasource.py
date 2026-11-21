"""DataSource ORM model.

Represents a source of external or internally collected data. Source codes
are unique and normalized to uppercase.
"""

from sqlalchemy import Boolean, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base
from backend.models.base import TimestampMixin


class DataSource(Base, TimestampMixin):
    """A source of external or internally collected data."""

    __tablename__ = "data_sources"

    __table_args__ = (
        UniqueConstraint("source_code", name="uq_datasource_source_code"),
    )

    source_code: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    provider: Mapped[str] = mapped_column(String(255), nullable=False)
    source_type: Mapped[str] = mapped_column(
        String(64), nullable=False, index=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    source_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    terms_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    def __repr__(self) -> str:
        return f"DataSource(source_code={self.source_code!r})"
