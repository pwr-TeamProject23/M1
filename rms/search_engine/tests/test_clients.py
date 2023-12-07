from pytest_httpx import HTTPXMock
import pytest
from rms.search_engine.clients import ScopusApi
from rms.search_engine.models import SearchBody


@pytest.mark.asyncio
async def test_query_params(httpx_mock: HTTPXMock):
    httpx_mock.add_response(
        json={"some_key": "some_value"},
        url="https://api.elsevier.com/content/search/scopus?query=%28TITLE%28%22test%22%29%29&count=5&view=COMPLETE&sort=-relevancy",
    )
    test_input = SearchBody(title="test", count=5)

    client = ScopusApi()
    await client.search(test_input)
