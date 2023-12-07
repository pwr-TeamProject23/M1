from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from rms.admin.services import list_all_users, get_detailed_user, list_all_permissions, list_all_groups, UserUpdateModel
from rms.admin.services.users import partial_user_update
from rms.auth.dependencies import get_current_user
from rms.auth.models import UserOrm
from rms.utils.exceptions import NotFound
from rms.utils.postgres import get_db

router = APIRouter()


@router.get("/users")
def list_users_view(db: Session = Depends(get_db), user: UserOrm = Depends(get_current_user)):
    return list_all_users(db)


@router.get("/users/{user_id}")
def detail_user_view(user_id: int, db: Session = Depends(get_db), user: UserOrm = Depends(get_current_user)):
    user = get_detailed_user(db, user_id)

    if user is None:
        raise NotFound

    return user


@router.patch("/users/{user_id}")
def partial_user_update_view(user_id: int, body: UserUpdateModel, db: Session = Depends(get_db),
                             user: UserOrm = Depends(get_current_user)):
    user = partial_user_update(db, user_id, body)

    if user is None:
        raise NotFound

    return user


# Permissions


@router.get("/permissions")
def list_permissions_view(db: Session = Depends(get_db)):
    return list_all_permissions(db)


@router.get("/groups")
def list_groups_view(db: Session = Depends(get_db)):
    return list_all_groups(db)
