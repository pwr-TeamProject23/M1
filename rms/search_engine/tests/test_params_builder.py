import pytest
from rms.search_engine.clients import ScopusApi
from rms.search_engine.models import SearchBody


@pytest.mark.parametrize(
    "test_input,expected",
    (
        (
            SearchBody(title="test"),
            {
                "query": '(TITLE("test"))',
                "count": 3,
                "view": "COMPLETE",
                "sort": "-relevancy,-citedby-count,-coverDate",
            },
        ),
        (
            SearchBody(title="test", keywords=["key1", "key2"]),
            {
                "query": '(TITLE("test")) AND (KEY("key1") OR KEY("key2"))',
                "count": 3,
                "view": "COMPLETE",
                "sort": "-relevancy,-citedby-count,-coverDate",
            },
        ),
        (
            SearchBody(title="test", abstract_keywords=["word1", "word2"]),
            {
                "query": '(TITLE("test")) AND (ABS("word1") OR ABS("word2"))',
                "count": 3,
                "view": "COMPLETE",
                "sort": "-relevancy,-citedby-count,-coverDate",
            },
        ),
        (
            SearchBody(title="test", keywords=["key1", "key2"], abstract_keywords=["word1", "word2"]),
            {
                "query": '(TITLE("test")) AND (KEY("key1") OR KEY("key2")) AND (ABS("word1") OR ABS("word2"))',
                "count": 3,
                "view": "COMPLETE",
                "sort": "-relevancy,-citedby-count,-coverDate",
            },
        ),
    ),
)
def test_scopus_client_params_builder(test_input, expected):
    client = ScopusApi()
    assert client.build_params(test_input) == expected


@pytest.mark.parametrize(
    "title,expected_query_part",
    [
        ("A study with models", 'TITLE("study")'),
        ("Using architecture for building", 'TITLE("building")'),
        ("The importance of design in database architecture", 'TITLE("database")'),
        ("Analysis and modeling of systems", 'TITLE("Analysis") OR TITLE("modeling") OR TITLE("systems")'),
    ],
)
def test_title_stop_words_removal(title, expected_query_part):
    client = ScopusApi()
    search_body = SearchBody(title=title)
    params = client.build_params(search_body)

    assert expected_query_part in params["query"]
