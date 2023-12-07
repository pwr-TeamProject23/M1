from pydantic import BaseModel


class Affiliation(BaseModel):
    scopus_url: str | None
    scopus_id: str | None
    name: str | None
    city: str | None
    country: str | None


class Author(BaseModel):
    scopus_url: str | None = None
    scholar_url: str | None = None
    scopus_id: str | None = None
    name: str | None = None
    surname: str | None
    given_name: str | None
    initials: str | None = None
    affiliation_ids: list[str] = []


class Article(BaseModel):
    identifier: str | None
    eid: str | None = None
    title: str | None
    creator: str | None = None
    publication_name: str | None
    cited_by_count: str | None
    cover_date: str | None
    scopus_url: str | None = None
    scopus_citedby_url: str | None = None
    full_text_url: str | None = None
    description: str | None
    affiliations: list[Affiliation] = []
    authors: list[Author] = []
    source_id: str | None = None
    volume: str | None = None
    issue_id: str | None = None
    doi_url: str | None = None
    article_number: str | None = None
    keywords: list[str] = []


class SearchResponse(BaseModel):
    articles: list[Article] = []
    total_results: str | None
    items_per_page: str | None


class SearchBody(BaseModel):
    title: str
    keywords: list[str] = []
    abstract_keywords: list[str] = []
    count: int = 3
    sort_by: list[str] = ["-relevancy"]


class AuthorSearch(BaseModel):
    scopus_id: str | None
    eid: str | None
    orcid: str | None
    surname: str | None
    given_name: str | None
    initials: str | None
    document_count: str | None
    scopus_url: str | None


class ScopusAuthorResponse(BaseModel):
    authors: list[AuthorSearch] = []
