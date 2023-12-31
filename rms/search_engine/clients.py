import httpx
from abc import ABC
from typing import Any

from rms.search_engine.models import SearchBody, ScopusSearchResponse
from rms.search_engine.models.dblp_models import DblpAuthorClientResponse
from rms.search_engine.models.scholar_models import ScholarAuthorClientResponse, ScholarApiAuthor, \
    ScholarArticlesClientResponse, ScholarApiArticle, ScholarArticlesSearchBody
from rms.search_engine.models.scopus_models import ScopusAuthorResponse
from rms.search_engine.utils import StopWordsProcessor
from rms.settings import Settings
from scholarly import scholarly


class ScopusClient(ABC):
    def __init__(self):
        self.settings = Settings()
        self.headers = {"httpAccept": "application/json", "X-ELS-APIKey": self.settings.scopus_api_key}
        self.scopus_search_api_endpoint = self.settings.scopus_search_endpoint
        self.scopus_author_api_endpoint = self.settings.scopus_author_endpoint


class ScopusApi(ScopusClient):
    def __init__(self):
        super().__init__()
        self.stop_words_processor = StopWordsProcessor()

    async def search(self, query: SearchBody) -> ScopusSearchResponse:
        params = self.build_params(query)

        async with httpx.AsyncClient() as client:
            response = await client.get(self.scopus_search_api_endpoint, headers=self.headers, params=params)
            response.raise_for_status()

            return ScopusSearchResponse(**response.json())

    async def get_author(self, author_lastname: str, author_firstname: str) -> ScopusAuthorResponse:
        params = self.build_author_params(author_lastname, author_firstname)

        async with httpx.AsyncClient() as client:
            response = await client.get(self.scopus_author_api_endpoint, headers=self.headers, params=params)
            response.raise_for_status()

            return ScopusAuthorResponse(**response.json())

    @staticmethod
    def build_author_params(author_lastname: str, author_firstname: str) -> dict[str, Any]:
        params = {
            "query": f"AUTHLASTNAME({author_lastname}) AND AUTHFIRST({author_firstname})",
            "view": "STANDARD",
        }

        return params

    def build_params(self, query: SearchBody) -> dict[str, Any]:
        criteria = [
            self._build_title_criteria(query.title),
            self._build_keywords_criteria(query.keywords),
            self._build_abstract_keywords_criteria(query.abstract_keywords),
        ]

        combined_criteria = " AND ".join(filter(None, criteria))
        sorting_criteria = self._build_sorting_criteria(query.sort_by)

        params = {
            "query": combined_criteria,
            "count": query.count,
            "view": "COMPLETE",
            "sort": sorting_criteria,
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

    @staticmethod
    def _build_sorting_criteria(sorting: list[str] | None) -> str:
        if not sorting:
            return ""
        return ",".join(sorting)


class DblpClient(ABC):
    def __init__(self):
        self.settings = Settings()
        self.headers = {
            "httpAccept": "application/json",
        }
        self.dblp_search_api_endpoint = self.settings.dblp_search_endpoint


class DblpApi(DblpClient):

    async def get_author(self, author_name: str) -> DblpAuthorClientResponse:
        params = self.build_params(author_name)

        async with httpx.AsyncClient() as client:
            response = await client.get(self.dblp_search_api_endpoint, headers=self.headers, params=params)
            response.raise_for_status()

            return DblpAuthorClientResponse(**response.json())

    @staticmethod
    def build_params(author_name: str) -> dict[str, Any]:
        params = {
            "q": author_name,
            "format": "json"
        }

        return params


class ScholarClient(ABC):
    def __init__(self):
        self.sections = ["basics", "indices"]


class ScholarApi(ScholarClient):

    async def get_author(self, author_name: str) -> ScholarAuthorClientResponse | None:
        authors = []

        try:
            search_query = scholarly.search_author(author_name)

            for item in search_query:
                author = scholarly.fill(item, sections=self.sections)
                authors.append(ScholarApiAuthor(**author))

        except StopIteration:
            pass
        finally:
            return ScholarAuthorClientResponse(authors=authors)

    @staticmethod
    async def search(query: ScholarArticlesSearchBody) -> ScholarArticlesClientResponse | None:

        articles = []

        found_num = 0

        search_query = scholarly.search_pubs(
            query=" ".join(query.keywords),
            year_low=2005,
        )

        for article in search_query:
            if found_num < query.num_articles:
                articles.append(ScholarApiArticle(**article))
                found_num += 1
            else:
                break

        return ScholarArticlesClientResponse(articles=articles)
