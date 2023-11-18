from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_password: str
    postgres_user: str
    postgres_db: str
    postgres_port: int
    postgres_uri: str

    scopus_api_key: str
    scopus_search_endpoint: str
    allowed_origins: str
    dblp_search_endpoint: str

    minio_access_id: str
    minio_secret_key: str
