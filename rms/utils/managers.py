from typing import TypeVar, Generic, cast, Any

from sqlalchemy.orm import Session
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.sql.expression import ColumnElement

from rms.utils.postgres import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseModelManager(Generic[T]):
    __model__: BaseModel

    @classmethod
    def all(cls, db: Session) -> list[T]:
        return db.query(cls.__model__).all()

    @classmethod
    def find_by_id(cls, db: Session, model_id: int) -> T | None:
        return db.query(cls.__model__).where(cls.__model__.id == model_id).first()

    @classmethod
    def list_by_properties(cls, db: Session, property_name: str, value: list[Any]) -> list[T]:
        try:
            column = cast(ColumnElement, getattr(cls.__model__, property_name))
            query = db.query(cls.__model__).where(column.in_(value))

            return query.all()
        except InvalidRequestError:
            raise ValueError(f"Attribute {property_name} not found as a column in model {cls.__model__}.")

    @classmethod
    def create(cls, db: Session, instance: T) -> T:
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance

    @classmethod
    def delete(cls, db: Session, instance: T) -> None:
        db.delete(instance)
        db.commit()

    @classmethod
    def find_by_attribute(cls, db: Session, attribute: str, value: any) -> T | None:
        try:
            column = cast(ColumnElement, getattr(cls.__model__, attribute))
            query = db.query(cls.__model__).where(column == value)

            return query.first()
        except InvalidRequestError:
            raise ValueError(f"Attribute {attribute} not found as a column in model {cls.__model__}.")
