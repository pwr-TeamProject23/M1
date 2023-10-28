from datetime import datetime

from sqlalchemy import ForeignKey, Table, Column
from sqlalchemy.orm import mapped_column, Mapped, relationship

from rms.utils.postgres import BaseModel


user_group_m2m_table = Table(
    "user_group_m2m",
    BaseModel.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("group_id", ForeignKey("group.id"), primary_key=True),
)

group_permission_m2m_table = Table(
    "group_permission_m2m",
    BaseModel.metadata,
    Column("group_id", ForeignKey("group.id"), primary_key=True),
    Column("permission_id", ForeignKey("permission.id"), primary_key=True),
)

user_permission_m2m_table = Table(
    "user_permission_m2m",
    BaseModel.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("permission_id", ForeignKey("permission.id"), primary_key=True),
)


class UserOrm(BaseModel):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)

    first_name: Mapped[str]
    last_name: Mapped[str]
    email: Mapped[str]

    password: Mapped[str]

    groups: Mapped[list["GroupOrm"]] = relationship(secondary=user_group_m2m_table, back_populates="users")
    permissions: Mapped[list["PermissionOrm"]] = relationship(
        secondary=user_permission_m2m_table, back_populates="users"
    )

    created_at: Mapped[datetime]
    last_login: Mapped[datetime]

    def __repr__(self) -> str:
        return f"User({self.first_name} {self.last_name})"


class UserCookieOrm(BaseModel):
    __tablename__ = "user_cookie"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    value: Mapped[str]
    valid_until: Mapped[datetime]


class PermissionOrm(BaseModel):
    __tablename__ = "permission"

    id: Mapped[int] = mapped_column(primary_key=True)

    code: Mapped[str]
    readable_code: Mapped[str]

    groups: Mapped[list["GroupOrm"]] = relationship(secondary=group_permission_m2m_table, back_populates="permissions")
    users: Mapped[list["UserOrm"]] = relationship(secondary=user_permission_m2m_table, back_populates="permissions")


class GroupOrm(BaseModel):
    __tablename__ = "group"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    users: Mapped[list[UserOrm]] = relationship(secondary=user_group_m2m_table, back_populates="groups")
    permissions: Mapped[list[PermissionOrm]] = relationship(
        secondary=group_permission_m2m_table, back_populates="groups"
    )
