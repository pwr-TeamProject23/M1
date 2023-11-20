import {
    Article,
    ArticleUpdate,
    ArticleWithDetails,
    CreateArticle,
    ExtractedPdfFeatures,
} from "../types/api/article.ts"
import axios from "axios"

export const listArticles = async (): Promise<Article[]> => {
    const response = await axios.get("article/")

    return response.data as Article[]
}
export const createArticle = async (data: CreateArticle): Promise<Article> => {
    const response = await axios.post("article/", data)

    return response.data as Article
}

export const updateArticle = async (id: string | number, data: ArticleUpdate): Promise<ArticleUpdate> => {
    const response = await axios.patch(`article/${id}`, data)

    return response.data as Article
}

export const singleArticle = async (id: string | number) => {
    const response = await axios.get(`article/${id}`)

    return response.data as ArticleWithDetails
}

export const extractArticlePdfFeatures = async (id: string | number) => {
    const response = await axios.post(`article/${id}/process-pdf`)

    return response.data as ExtractedPdfFeatures
}
