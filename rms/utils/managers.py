from typing import TypeVar, Generic, cast

from sqlalchemy import Select
from sqlalchemy.orm import Session
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.sql.expression import ColumnElement

from rms.utils.postgres import BaseModel, engine

T = TypeVar("T", bound=BaseModel)


class BaseModelManager(Generic[T]):
    __model__: BaseModel

    @classmethod
    def _get_session(cls) -> Session:
        return Session(engine, expire_on_commit=False)

    @classmethod
    def all(cls) -> list[T]:
        with cls._get_session() as session:
            query = Select(cls.__model__)

            return list(session.scalars(query))

    @classmethod
    def find_by_id(cls, model_id: int) -> T | None:
        with cls._get_session() as session:
            query = Select(cls.__model__).where(cls.__model__.id == model_id)
            found_models = list(session.scalars(query))

            if found_models:
                return cast(T, found_models[0])

            return None

    @classmethod
    def create(cls, instance: T) -> T:
        with cls._get_session() as session:
            session.add(instance)
            session.commit()
            session.refresh(instance)
            return instance

    @classmethod
    def find_by_attribute(cls, attribute: str, value: any) -> T | None:
        with cls._get_session() as session:
            try:
                column: ColumnElement = cast(ColumnElement, getattr(cls.__model__, attribute))
                query = Select(cls.__model__).where(column == value)
                found_models = list(session.scalars(query))

                if found_models:
                    return cast(T, found_models[0])

                return None
            except InvalidRequestError:
                raise ValueError(f"Attribute {attribute} not found as a column in model {cls.__model__}.")
