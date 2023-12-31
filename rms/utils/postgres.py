from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base

from rms.settings import Settings

settings = Settings()


SQLALCHEMY_DATABASE_URL = (
    f"postgresql://"
    f"{settings.postgres_user}:"
    f"{settings.postgres_password}@"
    f"{settings.postgres_uri}:"
    f"{settings.postgres_port}/"
    f"{settings.postgres_db}"
)
engine = create_engine(SQLALCHEMY_DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
BaseModel = declarative_base()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
