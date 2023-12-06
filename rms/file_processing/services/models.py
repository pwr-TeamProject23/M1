from pydantic import BaseModel


class Author(BaseModel):
    first_name: str
    last_name: str
    email: str | None = None


class PdfArticleData(BaseModel):
    name: str
    authors: list[Author]
    keywords: list[str]


class FirstPagePdfData(BaseModel):
    name: str
    authors: list[Author]
    keywords: list[str]


class FileUploadResult(BaseModel):
    id: int
    status: str
    message: str
    file_path: str
