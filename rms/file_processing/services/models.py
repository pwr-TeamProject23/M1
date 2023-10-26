from pydantic import BaseModel


class PdfArticleData(BaseModel):
    name: str
    authors: list[str]
    keywords: list[str]


class FirstPagePdfData(BaseModel):
    name: str
    authors: list[str]
    keywords: list[str]


class FileUploadResult(BaseModel):
    id: int
    status: str
    message: str
    file_path: str
