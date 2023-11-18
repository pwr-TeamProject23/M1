export type Affiliation = {
  scopus_url: string | undefined;
  scopus_id: string | undefined;
  name: string | undefined;
  city: string | undefined;
  country: string | undefined;
};

export type Author = {
  scopus_url: string | undefined;
  scopus_id: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  given_name: string | undefined;
  initials: string | undefined;
  affiliation_ids: string[];
};

export type Article = {
  identifier: string | undefined;
  eid: string | undefined;
  title: string | undefined;
  creator: string | undefined;
  publication_name: string | undefined;
  cited_by_count: string | undefined;
  cover_date: string | undefined;
  scopus_url: string | undefined;
  scopus_citedby_url: string | undefined;
  fullTextUrl: string | undefined;
  description: string | undefined;
  affiliations: Affiliation[];
  authors: Author[];
  source_id: string | undefined;
  doi_url: string | undefined;
  volume: string | undefined;
  issue_id: string | undefined;
  article_number: string | undefined;
  keywords: string[] | undefined;

};

export type SearchResponse = {
  articles: Article[];
  total_results: string | undefined;
  items_per_page: string | undefined;
};

export type SearchBody = {
  title: string | undefined;
  keywords: string[] | undefined;
  abstractKeywords: string[] | undefined;
  count: number | undefined;
};
