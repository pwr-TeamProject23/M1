import pytest
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from rms.auth.managers import UserManager, UserCookieManager
from rms.migrations.runner import MigrationRunner
from rms.settings import Settings

from rms.__main__ import app
from rms.auth.models import UserCookieOrm
from rms.utils.postgres import get_db
import psycopg2

settings = Settings()


def try_create_database():
    conn = psycopg2.connect(
        database=settings.postgres_db,
        user=settings.postgres_user,
        password=settings.postgres_password,
        host=settings.postgres_uri,
        port=settings.postgres_port,
    )

    conn.autocommit = True
    cursor = conn.cursor()

    try:
        sql = f"""CREATE database {settings.postgres_db}_test"""
        cursor.execute(sql)
    except psycopg2.errors.DuplicateDatabase:
        pass

    conn.close()


@pytest.fixture(scope="session")
def db_engine():
    sqlalchemy_database_url = (
        f"postgresql://"
        f"{settings.postgres_user}:"
        f"{settings.postgres_password}@"
        f"{settings.postgres_uri}:"
        f"{settings.postgres_port}/"
        f"{settings.postgres_db}_test"
    )
    engine = create_engine(sqlalchemy_database_url)
    try_create_database()

    MigrationRunner.run(engine)

    yield engine


@pytest.fixture(scope="function")
def db(db_engine):
    connection = db_engine.connect()
    connection.begin()

    db = Session(bind=connection)

    app.dependency_overrides[get_db] = lambda: db

    yield db

    db.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db):
    app.dependency_overrides[get_db] = lambda: db

    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="function")
def user(db):
    user = UserManager.create_user(
        db,
        email="mrbeast@gmail.com",
        first_name="Mr",
        last_name="Beast",
        password="123456"
    )

    return user


@pytest.fixture(scope="function")
def authenticated_client(db, client, user):
    auth_cookie = UserCookieOrm(
        user_id=user.id,
        value="123456",
        valid_until=datetime.now() + timedelta(days=1),
    )
    UserCookieManager.create(db, auth_cookie)

    client.cookies["auth_cookie"] = auth_cookie.value

    return client
