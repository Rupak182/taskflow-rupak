from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL:str
    JWT_SECRET:str
    JWT_ALGORITHM:str
    ALLOWED_ORIGINS: list[str]
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=[".env", "../.env"],
        env_file_encoding="utf-8",
        extra="ignore",
    )

Config=Settings()
