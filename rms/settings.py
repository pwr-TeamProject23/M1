from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_password: str
    postgres_user: str
    postgres_db: str
    postgres_port: int
    postgres_uri: str
    blob_url: str
    blob_sas: str
    scopus_api_key: str
    scopus_search_endpoint: str
