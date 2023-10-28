import pytest

from rms.auth.managers import UserManager
from rms.auth.models import UserOrm


@pytest.fixture
def test_user(db) -> UserOrm:
    return UserManager.create_user(
        db,
        first_name="John",
        last_name="Wick",
        email="john.wick@gmail.com",
        password="password",
    )


def test_user_listing(client, db, test_user):
    response = client.get("/admin/users")
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) == 1
