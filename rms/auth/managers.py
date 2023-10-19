from rms.auth.models import User, UserCookie
from rms.utils.managers import BaseModelManager


class UserManager(BaseModelManager[User]):
    __model__ = User

    @classmethod
    def find_by_email(cls, email: str) -> User | None:
        return cls.find_by_attribute("email", email)

      
class UserCookieManager(BaseModelManager[UserCookie]):
    __model__ = UserCookie
    
    @classmethod
    def find_by_value(cls, value: str) -> UserCookie | None:
        return cls.find_by_attribute("value", value)
      