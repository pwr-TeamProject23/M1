import axios from 'axios';
import { SearchBody, SearchResponse } from '../types/api/search-engine';


export const searchArticles = async (searchBody: SearchBody): Promise<SearchResponse> => {
    const response = await axios.post<SearchResponse>('search_engine/discover_reviewers', searchBody);
    return response.data;
}
