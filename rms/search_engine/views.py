from fastapi import APIRouter
from rms.search_engine.models import SearchBody, SearchResponse
from rms.search_engine.services import search_scopus_service

router = APIRouter()


@router.post("/discover_reviewers")
async def search_scopus(body: SearchBody) -> SearchResponse:
    return await search_scopus_service(body)
