import pytest

from rms.auth.managers import UserManager, GroupManager, PermissionManager
from rms.auth.models import UserOrm, GroupOrm, PermissionOrm


@pytest.fixture
def test_user(db) -> UserOrm:
    return UserManager.create_user(
        db,
        first_name="John",
        last_name="Wick",
        email="john.wick@gmail.com",
        password="password",
    )


def test_user_listing(authenticated_client, db, test_user):
    response = authenticated_client.get("/admin/users")
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) == 2


def test_user_details_raises_when_not_found(authenticated_client):
    response = authenticated_client.get("/admin/users/69")

    assert response.status_code == 404
    assert response.json()["detail"] == "Not Found"


def test_user_details_happy_path(authenticated_client, db, test_user):
    response = authenticated_client.get(f"/admin/users/{test_user.id}")
    data = response.json()

    assert response.status_code == 200
    assert data["id"] == test_user.id
    assert data["groups"] == []
    assert data["permissions"] == []


def test_user_details_displays_correct_groups(authenticated_client, db, test_user):
    p = PermissionOrm(code="can_do_something", readable_code="Can do something")
    p = PermissionManager.create(db, p)

    g = GroupOrm(name="Group 1")
    g.permissions.append(p)
    g = GroupManager.create(db, g)

    test_user.groups.append(g)
    test_user.permissions.append(p)
    test_user = UserManager.create(db, test_user)

    response = authenticated_client.get(f"/admin/users/{test_user.id}")
    data = response.json()

    assert response.status_code == 200
    assert data["id"] == test_user.id
    assert len(data["groups"]) == 1
    assert len(data["permissions"]) == 1


def test_user_update__invalid_id(authenticated_client):
    response = authenticated_client.patch("/admin/users/69", json={})

    assert response.status_code == 404
    assert response.json()["detail"] == "Not Found"


def test_user_update_flat_fields(authenticated_client, db, test_user):
    payload = {"first_name": "Steve", "last_name": "Mielony", "email": "xd@xd.com"}

    response = authenticated_client.patch(f"/admin/users/{test_user.id}", json=payload)
    data = response.json()

    assert response.status_code == 200
    assert data["first_name"] == payload["first_name"]
    assert data["last_name"] == payload["last_name"]
    assert data["email"] == payload["email"]


def test_groups_update(authenticated_client, db, test_user):
    p = PermissionOrm(code="can_do_something", readable_code="Can do something")
    p = PermissionManager.create(db, p)

    g = GroupOrm(name="Group 1")
    g.permissions.append(p)
    g = GroupManager.create(db, g)

    g2 = GroupOrm(name="Group 2")
    g2.permissions.append(p)
    g2 = GroupManager.create(db, g2)

    test_user.groups.append(g2)
    test_user = UserManager.create(db, test_user)

    payload = {"groups": [g.id]}

    response = authenticated_client.patch(f"/admin/users/{test_user.id}", json=payload)
    data = response.json()

    assert response.status_code == 200
    assert len(data["groups"]) == 1
    assert data["groups"][0]["name"] == g.name
