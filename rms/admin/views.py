from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from rms.admin.services import list_all_users
from rms.utils.postgres import get_db

router = APIRouter()


@router.get("/users")
def list_users_view(db: Session = Depends(get_db)):
    return list_all_users(db)
