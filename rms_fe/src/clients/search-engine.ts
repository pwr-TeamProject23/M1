import axios from 'axios';
import { DblpAuthorResponse, ScholarAuthorResponse, ScholarSearchBody, ScopusAuthorResponse, SearchBody, SearchResponse } from '../types/api/search-engine';


export const searchArticles = async (searchBody: SearchBody): Promise<SearchResponse> => {
    const response = await axios.post<SearchResponse>('search_engine/discover_reviewers', searchBody);
    return response.data;
}

export const searchArticlesScholar = async (searchBody: ScholarSearchBody): Promise<SearchResponse> => {
    const response = await axios.post<SearchResponse>('search_engine/discover_reviewers_scholar', searchBody);
    return response.data;

}

export const getAuthorDBLP = async (author_name: string): Promise<DblpAuthorResponse> => {
    const response = await axios.get<DblpAuthorResponse>(`search_engine/get_author_dblp?author_name=${author_name}`);
    return response.data;
};

export const getAuthorScholar = async (author_name: string): Promise<ScholarAuthorResponse> => {
    const response = await axios.get<ScholarAuthorResponse>(`search_engine/get_author_scholar?author_name=${author_name}`);
    return response.data;
};


export const getAuthorScopus = async (author_lastname: string, author_firstname: string): Promise<ScopusAuthorResponse> => {
    const response = await axios.get<ScopusAuthorResponse>(`search_engine/get_author_scopus?author_lastname=${author_lastname}&author_firstname=${author_firstname}`);
    return response.data;
};