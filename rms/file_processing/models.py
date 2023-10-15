from pydantic import BaseModel
from fastapi import UploadFile
from abc import ABC, abstractmethod
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column

from rms.utils.postgres import BaseModel as PostgresBaseModel

class File(PostgresBaseModel):
    __tablename__ = "file"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    path: Mapped[str]
    uploaded_at: Mapped[datetime]

    def __repr__(self) -> str:
        return f"File({self.name})"


class FileUploadResult(BaseModel):
    status: str
    message: str
    file_path: str


class StorageClient(ABC):
    @abstractmethod
    async def upload(self, file: UploadFile, file_name: str) -> str:
        """Upload a file and return its PATH."""
        pass
