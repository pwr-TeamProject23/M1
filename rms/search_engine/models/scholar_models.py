from pydantic import BaseModel


class   ScholarArticlesSearchBody(BaseModel):
    keywords: list[str] = []
    num_articles: int = 10


class ScholarAuthor(BaseModel):
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


class ScholarAuthorResponse(BaseModel):
    authors: list[ScholarAuthor] = []


class ScholarApiAuthor(BaseModel):
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


class ScholarAuthorClientResponse(BaseModel):
    authors: list[ScholarApiAuthor] = []


class Bib(BaseModel):
    abstract: str | None
    author: list[str] = []
    pub_year: str | None
    title: str | None
    venue: str | None


class ScholarApiArticle(BaseModel):
    author_id: list[str] = []
    bib: Bib | None
    citedby_url: str | None = None
    eprint_url: str | None = None
    filled: bool | None
    gsrank: int | None
    num_citations: int | None
    pub_url: str | None = None
    source: str | None = None
    url_add_sclib: str | None = None
    url_scholarbib: str | None = None


class ScholarArticlesClientResponse(BaseModel):
    articles: list[ScholarApiArticle] = []
