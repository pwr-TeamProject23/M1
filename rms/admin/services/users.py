from sqlalchemy.orm import Session

from rms.admin.services.models import User, UserWithPermissions, UserGroup, UserPermission, UserUpdateModel, \
    UserCreateModel
from rms.auth.managers import UserManager, GroupManager


def list_all_users(db: Session):
    return [User.model_validate(user) for user in UserManager.all(db)]


def get_detailed_user(db: Session, user_id: int) -> UserWithPermissions | None:
    output = UserManager.find_user_with_permissions(db, user_id)

    if output is None:
        return None

    user, groups, permissions = output

    groups = [UserGroup.model_validate(group) for group in groups]
    permissions = [UserPermission.model_validate(permission) for permission in permissions]

    return UserWithPermissions(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        last_login=user.last_login,
        created_at=user.created_at,
        groups=groups,
        permissions=permissions,
    )


def partial_user_update(db: Session, id_: int, fields: UserUpdateModel) -> UserWithPermissions | None:
    user = UserManager.find_by_id(db, id_)

    if user is None:
        return None

    user_group_ids = set((group.id for group in user.groups))

    for key, value in fields.model_dump(exclude_unset=True).items():
        if key in fields.flat_update_fields:
            setattr(user, key, value)

        if key == "groups" and value is not None:
            group_ids: set[int] = set(value)
            added_groups = group_ids - user_group_ids
            removed_groups = user_group_ids - group_ids

            for removed_group in removed_groups:
                group = GroupManager.find_by_id(db, removed_group)
                user.groups.remove(group)

            for added_group in added_groups:
                group = GroupManager.find_by_id(db, added_group)
                user.groups.append(group)

    UserManager.create(db, user)

    return get_detailed_user(db, id_)


def create_user(db: Session, user_data: UserCreateModel) -> UserWithPermissions:
    new_user = UserManager.create_user(
        db,
        email=user_data.email,
        password=user_data.password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )

    return get_detailed_user(db, new_user.id)
