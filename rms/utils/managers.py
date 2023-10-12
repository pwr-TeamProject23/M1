from typing import TypeVar, Generic, cast

from sqlalchemy import Select
from sqlalchemy.orm import Session

from rms.utils.postgres import BaseModel, engine

T = TypeVar("T", bound=BaseModel)


class BaseModelManager(Generic[T]):
    __model__: BaseModel

    @classmethod
    def all(cls) -> list[T]:
        with Session(engine) as session:
            query = Select(cls.__model__)

            return list(session.scalars(query))

    @classmethod
    def find_by_id(cls, model_id: int) -> T | None:
        with Session(engine) as session:
            query = Select(cls.__model__).where(cls.__model__.id == model_id)
            found_models = list(session.scalars(query))

            if found_models:
                return cast(T, found_models[0])

            return None
