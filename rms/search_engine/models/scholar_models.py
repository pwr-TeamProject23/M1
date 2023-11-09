from pydantic import BaseModel


class ScholarAuthorSearchBody(BaseModel):
    author_name: str


class ScholarAuthorResponse(BaseModel):
    scholar_id: str | None
    scholar_url: str | None
    url_picture: str | None
    homepage: str | None
    cited_by: int | None
    cited_by_5y: int | None
    i10_index: int | None
    i10_index_5y: int | None
    interests: list[str] = []
    email_domain: str | None


class ScholarAuthorClientResponse(BaseModel):
    container_type: str | None
    filled: list[str] | None
    source: str | None
    scholar_id: str | None
    url_picture: str | None = None
    name: str | None
    affiliation: str | None = None
    email_domain: str | None = None
    interests: list[str] | None = []
    citedby: int | None
    citedby5y: int | None
    hindex: int | None
    hindex5y: int | None
    i10index: int | None
    i10index5y: int | None
    organization: int | None = None
    homepage: str | None = None
