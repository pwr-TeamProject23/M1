import pytest

from rms.auth.managers import UserManager
from rms.auth.models import User


@pytest.fixture
def test_user(db) -> User:
    return UserManager.create_user(
        db,
        first_name="John",
        last_name="Wick",
        email="john.wick@gmail.com",
        password="password",
    )


def test_login_with_correct_credentials_returns_cookie(client, test_user):
    payload = {
        "email": test_user.email,
        "password": "password",
    }
    response = client.post("/login", json=payload)

    assert response.status_code == 200
    assert response.cookies["auth_cookie"]


def test_login_with_invalid_credentials_fails(client, test_user):
    payload = {
        "email": test_user.email,
        "password": "invalid password",
    }
    response = client.post("/login", json=payload)

    assert response.status_code == 403
    assert response.json()["detail"] == "Unauthorized"
