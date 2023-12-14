from datetime import datetime
from typing import ClassVar

from pydantic import BaseModel, ConfigDict


class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    last_login: datetime | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class UserPermission(BaseModel):
    id: int
    code: str
    readable_code: str

    model_config = ConfigDict(from_attributes=True)


class UserGroup(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class UserWithPermissions(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    last_login: datetime | None
    created_at: datetime | None

    permissions: list[UserPermission]
    groups: list[UserGroup]

    model_config = ConfigDict(from_attributes=True)


class UserUpdateModel(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None

    permissions: list[int] | None = None
    groups: list[int] | None = None

    flat_update_fields: ClassVar[str] = {
        "first_name",
        "last_name",
        "email",
    }


class UserCreateModel(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

    model_config = ConfigDict(from_attributes=True)
