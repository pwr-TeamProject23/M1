from datetime import datetime

from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from rms.auth.managers import UserManager


class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    last_login: datetime | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


def list_all_users(db: Session):
    return [User.model_validate(user) for user in UserManager.all(db)]
