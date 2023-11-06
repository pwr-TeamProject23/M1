from pydantic import BaseModel, Field, field_validator


class DblpAuthorSearchBody(BaseModel):
    author_name: str


class DblpAuthorResponse(BaseModel):
    dblp_id: str | None
    dblp_url: str | None


class Note(BaseModel):
    type: str | None = Field(None, alias='@type')
    text: str | None


class Notes(BaseModel):
    note: Note | None


class AuthorInfo(BaseModel):
    author: str | None
    url: str | None
    notes: Notes | None = None


class Hit(BaseModel):
    score: str | None = Field(None, alias='@score')
    id: str | None = Field(None, alias='@id')
    info: AuthorInfo | None
    url: str | None = Field(None, alias='@url')


class Hits(BaseModel):
    total: int | None = Field(None, alias='@total')
    computed: int | None = Field(None, alias='@computed')
    sent: int | None = Field(None, alias='@sent')
    first: int | None = Field(None, alias='@first')
    hit: list[Hit] = []


class Completion(BaseModel):
    sc: int | None = Field(None, alias='@sc', description="Score of relevance indicator")
    dc: int | None = Field(None, alias='@dc', description="Score of relevance indicator(secondary metric")
    oc: int | None = Field(None, alias='@oc', description="Score of relevance indicator(overall metric)")
    id: str | None = Field(None, alias='@id')
    text: str | None


class Completions(BaseModel):
    total: int | None = Field(None, alias='@total')
    computed: int | None = Field(None, alias='@computed')
    sent: int | None = Field(None, alias='@sent')
    c: list[Completion] = Field([], description="List of completion suggestions")

    @field_validator("c", mode="before")
    @classmethod
    def unify_completions_validator(cls, value):
        if value is None:
            return []

        if isinstance(value, dict):
            return [value]

        return value


class Time(BaseModel):
    unit: str | None = Field(None, alias='@unit')
    text: str | None


class Status(BaseModel):
    code: str | None = Field(None, alias='@code')
    text: str | None


class Result(BaseModel):
    query: str | None
    status: Status | None
    time: Time | None
    completions: Completions | None
    hits: Hits | None


class DblpAuthorClientResponse(BaseModel):
    result: Result | None
