from rms.search_engine.clients import ScopusArticleSearchApi, DblpAuthorSearchApi, ScholarAuthorSearchApi
from rms.search_engine.models import SearchBody, ScopusSearchResponse, SearchResponse, Affiliation, Author, Article
from rms.search_engine.models.dblp_models import DblpAuthorSearchBody, DblpAuthorResponse
from rms.search_engine.models.scholar_models import ScholarAuthorSearchBody, ScholarAuthorResponse


def transform_scopus_response(scopus_response: ScopusSearchResponse) -> SearchResponse:
    articles = []

    for entry in scopus_response.search_results.entry:

        if entry.error is not None:
            continue

        affiliations = [
            Affiliation(
                scopus_url=f"https://www.scopus.com/affil/profile.uri?afid={affiliation.afid}",
                scopus_id=affiliation.afid,
                name=affiliation.affilname,
                city=affiliation.affiliation_city,
                country=affiliation.affiliation_country
            )
            for affiliation in entry.affiliation
        ]

        authors = [
            Author(
                scopus_url=f"https://www.scopus.com/authid/detail.uri?authorId={author.authid}",
                scopus_id=author.authid,
                name=author.authname,
                surname=author.surname,
                given_name=author.given_name,
                initials=author.initials,
                affiliation_ids=[afid.value for afid in author.afid]
            )
            for author in entry.author
        ]

        link_dict = {link.ref: link.href for link in entry.link}

        article = Article(
            identifier=entry.identifier,
            eid=entry.eid,
            title=entry.title,
            creator=entry.creator,
            publication_name=entry.publication_name,
            cited_by_count=entry.cited_by_count,
            cover_date=entry.cover_date,
            scopus_url=link_dict.get("scopus"),
            scopus_citedby_url=link_dict.get("scopus-citedby"),
            full_text_url=link_dict.get("full-text"),
            description=entry.dc_description,
            affiliations=affiliations,
            authors=authors,
            source_id=entry.source_id
        )
        articles.append(article)

    return SearchResponse(
        articles=articles,
        total_results=scopus_response.search_results.total_results,
        items_per_page=scopus_response.search_results.items_per_page
    )


async def search_scopus_service(body: SearchBody) -> SearchResponse:
    client = ScopusArticleSearchApi()
    scopus_response = await client.search(body)
    return transform_scopus_response(scopus_response)


async def get_author_dblp_service(body: DblpAuthorSearchBody) -> DblpAuthorResponse | None:
    client = DblpAuthorSearchApi()
    response = await client.search(body)

    if response.result.hits.total == 0:
        return None

    author = response.result.hits.hit[0]

    return DblpAuthorResponse(
        dblp_id=author.id,
        dblp_url=author.info.url
    )


async def get_author_scholar_service(body: ScholarAuthorSearchBody) -> ScholarAuthorResponse | None:
    client = ScholarAuthorSearchApi()
    response = await client.search(body)

    if response is None:
        return None

    return ScholarAuthorResponse(
        scholar_id=response.scholar_id,
        scholar_url=f"https://scholar.google.com/citations?user={response.scholar_id}",
        url_picture=response.url_picture,
        homepage=response.homepage,
        cited_by=response.citedby,
        cited_by_5y=response.citedby5y,
        i10_index=response.i10index,
        i10_index_5y=response.i10index5y,
        interests=response.interests,
        email_domain=response.email_domain
    )
