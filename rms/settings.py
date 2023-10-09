from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_password: str
    postgres_user: str
    postgres_db: str
