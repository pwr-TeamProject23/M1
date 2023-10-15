from rms.auth.models import User
from rms.utils.managers import BaseModelManager


class UserManager(BaseModelManager[User]):
    __model__ = User
