import bcrypt

from rms.auth.models import User, UserCookie
from rms.utils.managers import BaseModelManager


class UserManager(BaseModelManager[User]):
    __model__ = User

    @classmethod
    def find_by_email(cls, email: str) -> User | None:
        return cls.find_by_attribute("email", email)

    @classmethod
    def create_user(cls, email: str, password: str, first_name: str, last_name: str) -> User:
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user = User(email=email, password=hashed_password, first_name=first_name, last_name=last_name)
        return cls.create(user)


class UserCookieManager(BaseModelManager[UserCookie]):
    __model__ = UserCookie

    @classmethod
    def find_by_value(cls, value: str) -> UserCookie | None:
        return cls.find_by_attribute("value", value)
