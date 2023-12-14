import uuid

from rms.search_engine.clients import ScopusApi, DblpApi, ScholarApi
from rms.search_engine.models import SearchBody, ScopusSearchResponse, SearchResponse, Affiliation, Author, Article
from rms.search_engine.models.dblp_models import DblpAuthorResponse, DblpAuthor
from rms.search_engine.models.models import AuthorSearch, ScopusAuthorResponse
from rms.search_engine.models.scholar_models import ScholarAuthorResponse, ScholarAuthor, ScholarArticlesSearchBody


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
                country=affiliation.affiliation_country,
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
                affiliation_ids=[afid.value for afid in author.afid],
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
            source_id=entry.source_id,
            volume=entry.volume,
            issue_id=entry.issue_id,
            doi_url=f"https://doi.org/{entry.doi}" if entry.doi else None,
            article_number=entry.article_number,
            keywords=[keyword.strip() for keyword in (entry.authhKeywords or "").split("|") if keyword.strip()],
        )
        articles.append(article)

    return SearchResponse(
        articles=articles,
        total_results=scopus_response.search_results.total_results,
        items_per_page=scopus_response.search_results.items_per_page,
    )


async def search_scopus_service(body: SearchBody) -> SearchResponse:
    try:
        client = ScopusApi()
        scopus_response = await client.search(body)
        return transform_scopus_response(scopus_response)
    except Exception as e:
        print(f"Error while searching scopus: {e}")
        return SearchResponse(
            articles=[],
            total_results=None,
            items_per_page=None,
        )


async def get_author_scopus_service(author_lastname: str, author_firstname: str) -> ScopusAuthorResponse:
    client = ScopusApi()
    response = await client.get_author(author_lastname, author_firstname)

    authors = []

    for entry in response.search_results.entry:
        if entry.error is not None:
            continue

        link_dict = {link.ref: link.href for link in entry.link}

        author = AuthorSearch(
            scopus_id=entry.identifier,
            eid=entry.eid,
            orcid=entry.orcid,
            surname=entry.preferred_name.surname,
            given_name=entry.preferred_name.given_name,
            initials=entry.preferred_name.initials,
            document_count=entry.document_count,
            scopus_url=link_dict.get("scopus-author"),
        )
        authors.append(author)

    return ScopusAuthorResponse(authors=authors)


async def get_author_dblp_service(author_name: str) -> DblpAuthorResponse | None:
    client = DblpApi()
    response = await client.get_author(author_name)

    if response.result.hits.total == 0:
        return DblpAuthorResponse(authors=[])

    authors_hits = response.result.hits.hit

    authors = []
    for author in authors_hits:
        if author.info is not None:
            dblp_author = DblpAuthor(dblp_id=author.id, dblp_url=author.info.url)
            authors.append(dblp_author)

    return DblpAuthorResponse(authors=authors)


async def get_author_scholar_service(author_name: str) -> ScholarAuthorResponse | None:
    client = ScholarApi()
    response = await client.get_author(author_name)

    if not response or not response.authors:
        return ScholarAuthorResponse(authors=[])

    authors = [
        ScholarAuthor(
            scholar_id=response.scholar_id,
            scholar_url=f"https://scholar.google.com/citations?user={response.scholar_id}",
            url_picture=response.url_picture,
            homepage=response.homepage,
            cited_by=response.citedby,
            cited_by_5y=response.citedby5y,
            i10_index=response.i10index,
            i10_index_5y=response.i10index5y,
            interests=response.interests,
            email_domain=response.email_domain,
        )
        for response in response.authors
    ]

    return ScholarAuthorResponse(authors=authors)


async def search_scholar_service(query: ScholarArticlesSearchBody) -> SearchResponse:
    client = ScholarApi()
    response = await client.search(query)

    articles = []

    for entry in response.articles:
        if entry.bib is None:
            continue

        authors = []

        for author_idx in range(len(entry.bib.author)):
            author = entry.bib.author[author_idx]
            author_url = None
            if entry.author_id[author_idx] != "":
                author_url = f"https://scholar.google.com/citations?user={entry.author_id[author_idx]}"

            authors.append(
                Author(
                    name=author,
                    surname=author.split(" ")[-1],
                    given_name=" ".join(author.split(" ")[:-1]),
                    scholar_url=author_url,
                )
            )

        article = Article(
            identifier=str(uuid.uuid4()),
            title=entry.bib.title,
            doi_url=entry.pub_url,
            cited_by_count=str(entry.num_citations),
            cover_date=entry.bib.pub_year,
            authors=authors,
            publication_name=entry.bib.venue,
            description=entry.bib.abstract,
        )
        articles.append(article)

    if len(articles) == 0:
        return SearchResponse(articles=[], total_results="0", items_per_page="0")

    return SearchResponse(
        articles=articles, total_results=str(query.num_articles), items_per_page=str(query.num_articles)
    )
