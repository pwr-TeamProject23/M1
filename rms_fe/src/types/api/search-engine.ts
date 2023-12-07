export type Affiliation = {
    scopus_url: string | undefined
    scopus_id: string | undefined
    name: string | undefined
    city: string | undefined
    country: string | undefined
}

export type Author = {
    scopus_url: string | undefined
    scopus_id: string | undefined
    scholar_url: string | undefined
    name: string | undefined
    surname: string
    given_name: string
    initials: string | undefined
    affiliation_ids: string[]
}

export type Article = {
    identifier: string | undefined
    eid: string | undefined
    title: string | undefined
    creator: string | undefined
    publication_name: string | undefined
    cited_by_count: string | undefined
    cover_date: string | undefined
    scopus_url: string | undefined
    scopus_citedby_url: string | undefined
    fullTextUrl: string | undefined
    description: string | undefined
    affiliations: Affiliation[] | undefined
    authors: Author[]
    source_id: string | undefined
    doi_url: string | undefined
    volume: string | undefined
    issue_id: string | undefined
    article_number: string | undefined
    keywords: string[] | undefined
}

export type SearchResponse = {
    articles: Article[]
    total_results: string | undefined
    items_per_page: string | undefined
}

export type SearchBody = {
    title: string | undefined
    keywords: string[] | undefined
    abstractKeywords: string[] | undefined
    count: number | undefined
    sort_by: string[] | undefined
}

export type ScholarSearchBody = {
    keywords: string[] | undefined
    num_articles: number | undefined
}

export type DblpAuthor = {
    dblp_id: string | undefined
    dblp_url: string | undefined
}

export type DblpAuthorResponse = {
    authors: DblpAuthor[]
}

export type ScholarAuthor = {
    scholar_id: string | undefined
    scholar_url: string | undefined
    url_picture: string | undefined
    homepage: string | null
    cited_by: number | undefined
    cited_by_5y: number | undefined
    i10_index: number | undefined
    i10_index_5y: number | undefined
    interests: string[] | undefined
    email_domain: string | undefined
}

export type ScholarAuthorResponse = {
    authors: ScholarAuthor[]
}

export type ScopusAuthor = {
    scopus_id: string | undefined
    scopus_url: string | undefined
    eid: string | undefined
    orcid: string | undefined
    given_name: string | undefined
    surname: string | undefined
    initials: string | undefined
    documents_count: number | undefined
}

export type ScopusAuthorResponse = {
    authors: ScopusAuthor[]
}
