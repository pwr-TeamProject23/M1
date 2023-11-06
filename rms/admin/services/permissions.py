from sqlalchemy.orm import Session

from rms.admin.services import UserPermission, UserGroup
from rms.auth.managers import PermissionManager, GroupManager


def list_all_permissions(db: Session) -> list[UserPermission]:
    permissions = PermissionManager.all(db)

    return [UserPermission.model_validate(permission) for permission in permissions]


def list_all_groups(db: Session) -> list[UserGroup]:
    groups = GroupManager.all(db)

    return [UserGroup.model_validate(group) for group in groups]
