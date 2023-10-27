from datetime import datetime

import bcrypt
from sqlalchemy import text, bindparam

from rms.auth.models import User, UserCookie, Group, Permission
from rms.utils.managers import BaseModelManager
from rms.utils.postgres import engine


class UserManager(BaseModelManager[User]):
    __model__ = User

    USER_GROUPS_QUERY = """
        select group_id, name from user_group_m2m join "group" on group_id="group".id where user_id = :id;
    """

    USER_PERMISSIONS_QUERY = """
        select * from permission where id in (
            select permission_id from user_permission_m2m where  user_id = :user_id
            union
            select permission_id from group_permission_m2m where group_id = any(:group_ids)
        )
    """

    @classmethod
    def find_by_email(cls, email: str) -> User | None:
        return cls.find_by_attribute("email", email)

    @classmethod
    def create_user(cls, email: str, password: str, first_name: str, last_name: str) -> User:
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user = User(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            created_at=datetime.now(),
        )
        return cls.create(user)

    @classmethod
    def find_user_with_permissions(cls, user_id: int) -> tuple[User, list[Group], list[Permission]] | None:
        user = cls.find_by_id(user_id)

        if user is None:
            return None

        groups = cls.find_user_groups(user_id)
        group_ids = [group.id for group in groups]
        permissions = cls.find_user_permissions(user_id, group_ids)

        return user, groups, permissions

    @classmethod
    def find_user_groups(cls, user_id: int) -> list[Group]:
        with engine.connect() as connection:
            results = connection.execute(text(cls.USER_GROUPS_QUERY), {"id": user_id})

            return [Group(id=result[0], name=result[1]) for result in results.fetchall()]

    @classmethod
    def find_user_permissions(cls, user_id: int, group_ids: list[id]) -> list[Permission]:
        with engine.connect() as connection:
            q = text(cls.USER_PERMISSIONS_QUERY)
            q.bindparams(bindparam("group_ids", expanding=True))

            results = connection.execute(q, {"user_id": user_id, "group_ids": group_ids})

            return [Permission(id=result[0], code=result[1], readable_code=result[2]) for result in results.fetchall()]


class UserCookieManager(BaseModelManager[UserCookie]):
    __model__ = UserCookie

    @classmethod
    def find_by_value(cls, value: str) -> UserCookie | None:
        return cls.find_by_attribute("value", value)
