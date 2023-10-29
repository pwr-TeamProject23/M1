import httpx
from abc import ABC
from typing import Any
from rms.search_engine.models import SearchBody, ScopusSearchResponse
from rms.settings import Settings
from rms.search_engine.utils import StopWordsProcessor


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
