from sqlalchemy import Select
from sqlalchemy.orm import Session

from rms.auth.models import User, UserCookie
from rms.utils.managers import BaseModelManager
from rms.utils.postgres import engine


class UserManager(BaseModelManager[User]):
    __model__ = User

    @classmethod
    def find_by_email(cls, email: str) -> User | None:
        with Session(engine) as session:
            query = Select(cls.__model__).where(cls.__model__.email == email)
            found_models = list(session.scalars(query))

            if found_models:
                return found_models[0]

            return None


class UserCookieManager(BaseModelManager[UserCookie]):
    __model__ = UserCookie
