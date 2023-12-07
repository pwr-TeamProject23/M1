from fastapi import APIRouter
from starlette.responses import JSONResponse

from rms.search_engine.models import SearchBody, SearchResponse
from rms.search_engine.models.dblp_models import DblpAuthorResponse
from rms.search_engine.models.models import ScopusAuthorResponse
from rms.search_engine.models.scholar_models import ScholarAuthorResponse, ScholarArticlesSearchBody
from rms.search_engine.services import search_scopus_service, get_author_dblp_service, get_author_scholar_service, \
    get_author_scopus_service, search_scholar_service

router = APIRouter()


@router.post("/discover_reviewers")
async def search_scopus(body: SearchBody) -> SearchResponse:
    return await search_scopus_service(body)


@router.get("/get_author_scopus", response_model=ScopusAuthorResponse)
async def get_author_scopus(author_lastname: str, author_firstname: str) -> ScopusAuthorResponse:
    return await get_author_scopus_service(author_lastname, author_firstname)


@router.get("/get_author_dblp", response_model=DblpAuthorResponse)
async def get_author_dblp(author_name: str) -> DblpAuthorResponse | JSONResponse:
    author = await get_author_dblp_service(author_name)

    return author


@router.get("/get_author_scholar", response_model=ScholarAuthorResponse)
async def get_author_scholar(author_name: str) -> ScholarAuthorResponse | JSONResponse:
    author = await get_author_scholar_service(author_name)

    return author


@router.post("/discover_reviewers_scholar")
async def search_scholar(body: ScholarArticlesSearchBody) -> SearchResponse:
    articles = await search_scholar_service(body)

    return articles
