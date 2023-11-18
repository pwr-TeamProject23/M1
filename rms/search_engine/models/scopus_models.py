from pydantic import BaseModel, Field


class ScopusLink(BaseModel):
    ref: str | None = Field(alias="@ref", default=None)
    href: str | None = Field(alias="@href", default=None)


class ScopusAFID(BaseModel):
    fa: bool = Field(alias="@_fa")
    value: str = Field(alias="$")


class ScopusAffiliation(BaseModel):
    affiliation_url: str | None = Field(alias="affiliation-url", default=None)
    afid: str | None = None
    affilname: str | None = None
    affiliation_city: str | None = Field(alias="affiliation-city", default=None)
    affiliation_country: str | None = Field(alias="affiliation-country", default=None)


class ScopusAuthor(BaseModel):
    author_url: str | None = Field(alias="author-url", default=None)
    authid: str | None = None
    authname: str | None = None
    surname: str | None = None
    given_name: str | None = Field(alias="given-name", default=None)
    initials: str | None = None
    afid: list[ScopusAFID] = []


class ScopusEntry(BaseModel):
    identifier: str | None = Field(alias="dc:identifier", default=None)
    eid: str | None = None
    title: str | None = Field(alias="dc:title", default=None)
    creator: str | None = Field(alias="dc:creator", default=None)
    publication_name: str | None = Field(alias="prism:publicationName", default=None)
    cited_by_count: str | None = Field(alias="citedby-count", default=None)
    cover_date: str | None = Field(alias="prism:coverDate", default=None)
    link: list[ScopusLink] = []
    dc_description: str | None = Field(alias="dc:description", default=None)
    affiliation: list[ScopusAffiliation] = []
    author: list[ScopusAuthor] = []
    source_id: str | None = Field(alias="source-id", default=None)
    error: str | None = Field(alias="error", default=None)
    volume: str | None = Field(alias="prism:volume", default=None)
    issue_id: str | None = Field(alias="prism:issueIdentifier", default=None)
    doi: str | None = Field(alias="prism:doi", default=None)
    article_number: str | None = Field(alias="article-number", default=None)
    authhKeywords: str | None = Field(alias="authkeywords", default=None)


class ScopusSearch(BaseModel):
    entry: list[ScopusEntry] = []
    total_results: str | None = Field(alias="opensearch:totalResults", default=None)
    items_per_page: str | None = Field(alias="opensearch:itemsPerPage", default=None)


class ScopusSearchResponse(BaseModel):
    search_results: ScopusSearch | None = Field(alias="search-results", default=None)
