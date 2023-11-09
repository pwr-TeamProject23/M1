import httpx
from abc import ABC
from typing import Any
from rms.search_engine.models import SearchBody, ScopusSearchResponse
from rms.search_engine.models.dblp_models import DblpAuthorSearchBody, DblpAuthorClientResponse
from rms.search_engine.models.scholar_models import ScholarAuthorSearchBody, ScholarAuthorClientResponse
from rms.search_engine.utils import StopWordsProcessor
from rms.settings import Settings
from scholarly import scholarly


class ScopusClient(ABC):

    def __init__(self):
        self.settings = Settings()
        self.headers = {
            "httpAccept": "application/json",
            "X-ELS-APIKey": self.settings.scopus_api_key
        }
        self.scopus_search_api_endpoint = self.settings.scopus_search_endpoint


class ScopusArticleSearchApi(ScopusClient):

    def __init__(self):
        super().__init__()
        self.stop_words_processor = StopWordsProcessor()

    async def search(self, query: SearchBody) -> ScopusSearchResponse:
        params = self.build_params(query)

        async with httpx.AsyncClient() as client:
            response = await client.get(self.scopus_search_api_endpoint, headers=self.headers, params=params)
            response.raise_for_status()

            return ScopusSearchResponse(**response.json())

    def build_params(self, query: SearchBody) -> dict[str, Any]:
        criteria = [
            self._build_title_criteria(query.title),
            self._build_keywords_criteria(query.keywords),
            self._build_abstract_keywords_criteria(query.abstract_keywords)
        ]

        combined_criteria = " AND ".join(filter(None, criteria))

        params = {
            "query": combined_criteria,
            "count": query.count,
            "view": "COMPLETE",
            "sort": "-relevancy,-citedby_count,-coverDate"
        }

        return params

    def _build_title_criteria(self, title: str | None) -> str:
        if not title:
            return ""
        cleaned_title = self.stop_words_processor.remove_stop_words(title)
        title_parts = cleaned_title.split(" ")
        title_criteria = " OR ".join([f'TITLE("{part}")' for part in title_parts])
        return f"({title_criteria})"

    @staticmethod
    def _build_keywords_criteria(keywords: list[str] | None) -> str:
        if not keywords:
            return ""
        keywords_criteria = " OR ".join([f'KEY("{keyword}")' for keyword in keywords])
        return f"({keywords_criteria})"

    @staticmethod
    def _build_abstract_keywords_criteria(abstract_keywords: list[str] | None) -> str:
        if not abstract_keywords:
            return ""
        abstract_keywords_criteria = " OR ".join([f'ABS("{keyword}")' for keyword in abstract_keywords])
        return f"({abstract_keywords_criteria})"


class DblpClient(ABC):

    def __init__(self):
        self.settings = Settings()
        self.headers = {
            "httpAccept": "application/json",
        }
        self.dblp_search_api_endpoint = self.settings.dblp_search_endpoint


class DblpAuthorSearchApi(DblpClient):

    async def search(self, query: DblpAuthorSearchBody) -> DblpAuthorClientResponse:
        params = self.build_params(query)

        async with httpx.AsyncClient() as client:
            response = await client.get(self.dblp_search_api_endpoint, headers=self.headers, params=params)
            response.raise_for_status()

            return DblpAuthorClientResponse(**response.json())

    @staticmethod
    def build_params(query: DblpAuthorSearchBody) -> dict[str, Any]:
        params = {
            "q": query.author_name,
            "format": "json"
        }

        return params


class ScholarClient(ABC):

    def __init__(self):
        self.sections = ["basics", "indices"]


class ScholarAuthorSearchApi(ScholarClient):

    async def search(self, query: ScholarAuthorSearchBody) -> ScholarAuthorClientResponse | None:
        try:
            search_query = scholarly.search_author(query.author_name)
            first_author_result = next(search_query)
            author = scholarly.fill(first_author_result, sections=self.sections)
        except StopIteration:
            return None

        return ScholarAuthorClientResponse(**author)
