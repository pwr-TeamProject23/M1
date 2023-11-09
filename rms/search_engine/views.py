from fastapi import APIRouter
from starlette.responses import JSONResponse

from rms.search_engine.models import SearchBody, SearchResponse
from rms.search_engine.models.dblp_models import DblpAuthorSearchBody, DblpAuthorResponse
from rms.search_engine.models.scholar_models import ScholarAuthorSearchBody, ScholarAuthorResponse
from rms.search_engine.services import search_scopus_service, get_author_dblp_service, get_author_scholar_service

router = APIRouter()


@router.post("/discover_reviewers")
async def search_scopus(body: SearchBody) -> SearchResponse:
    return await search_scopus_service(body)


@router.get("/get_author_dblp", response_model=DblpAuthorResponse)
async def get_author_dblp(body: DblpAuthorSearchBody) -> DblpAuthorResponse | JSONResponse:
    author = await get_author_dblp_service(body)

    if author is None:
        return JSONResponse(status_code=200, content={})

    return author


@router.get("/get_author_scholar", response_model=ScholarAuthorResponse)
async def get_author_scholar(body: ScholarAuthorSearchBody) -> ScholarAuthorResponse | JSONResponse:
    author = await get_author_scholar_service(body)

    if author is None:
        return JSONResponse(status_code=200, content={})

    return author
