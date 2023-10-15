from rms.file_processing.models import File
from rms.utils.managers import BaseModelManager
from sqlalchemy.orm import Session
from rms.utils.postgres import engine


class FileManager(BaseModelManager[File]):
    __model__ = File

    @classmethod
    def create(cls, **kwargs) -> File:
        with Session(engine) as session:
            file_instance = cls.__model__(**kwargs)
            session.add(file_instance)
            session.commit()
            return file_instance
