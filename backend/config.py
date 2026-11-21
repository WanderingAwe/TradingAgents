"""Backend application configuration.

Configuration is sourced from environment variables with safe defaults.
Never commit actual credentials or .env files containing secrets.
"""

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    environment: str = Field(default="development", description="Application environment")
    debug: bool = Field(default=False, description="Debug mode")
    log_level: str = Field(default="INFO", description="Logging level")

    # API
    api_v1_prefix: str = Field(default="/api/v1", description="API v1 route prefix")
    cors_origins: str = Field(
        default="http://localhost:5173",
        description="Comma-separated list of allowed CORS origins",
    )

    # Database
    database_url: str = Field(
        default="sqlite:///.local/data/trading_terminal.db",
        description="SQLAlchemy database URL (SQLite default, PostgreSQL for production)",
    )
    database_echo: bool = Field(default=False, description="Enable SQLAlchemy statement logging")

    @property
    def cors_origins_list(self) -> list[str]:
        """Return CORS origins as a list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def sqlite_data_dir(self) -> Path:
        """Return the directory for SQLite database files."""
        if self.database_url.startswith("sqlite:///"):
            db_path = Path(self.database_url.replace("sqlite:///", ""))
            return db_path.parent
        return Path(".local/data")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()


def get_database_url() -> str:
    """Return the resolved database URL."""
    return get_settings().database_url
