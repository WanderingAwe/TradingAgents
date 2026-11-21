"""Instrument ORM model.

Represents a financial instrument (equity, ETF, index, crypto, forex, etc.)
traded on an exchange. Symbols and exchanges are normalized to uppercase
to prevent case-variant duplicates.
"""

from sqlalchemy import Boolean, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base
from backend.models.base import TimestampMixin


class Instrument(Base, TimestampMixin):
    """A financial instrument traded on an exchange."""

    __tablename__ = "instruments"

    __table_args__ = (
        UniqueConstraint("exchange", "symbol", name="uq_instrument_exchange_symbol"),
    )

    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    exchange: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    instrument_type: Mapped[str] = mapped_column(
        String(32), nullable=False, index=True, default="EQUITY"
    )
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="USD")
    country_code: Mapped[str] = mapped_column(
        String(2), nullable=False, index=True, default="US"
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def __repr__(self) -> str:
        return f"Instrument(symbol={self.symbol!r}, exchange={self.exchange!r})"
