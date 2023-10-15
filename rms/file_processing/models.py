from pydantic import BaseModel
from fastapi import UploadFile
from abc import ABC, abstractmethod


class FileUploadResult(BaseModel):
    status: str
    message: str
    file_path: str


class StorageClient(ABC):
    @abstractmethod
    async def upload(self, file: UploadFile, file_name: str) -> str:
        """Upload a file and return its PATH."""
        pass
