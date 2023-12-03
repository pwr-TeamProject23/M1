import { ApiFile } from "./file.ts"
import { Pretty } from "../utils.ts"

export type Article = {
    id: number
    name: string
    notes: string

    created_at: string
    creator_id: number
    file_id: number
}

export type ArticleCreator = {
    first_name: string
    last_name: string
    email: string
}

export type CreateArticle = Omit<Article, "id" | "created_at" | "creator_id">

export type ArticleUpdate = Partial<Pick<Article, "name" | "notes">>

export type ArticleWithDetails = Pretty<
    Omit<Article, "file_id" | "creator_id"> & { file: ApiFile; creator: ArticleCreator }
>

export type ArticleWithCreator = Pretty<Omit<Article, "file_id" | "creator_id"> & { creator: ArticleCreator }>

export type Author = {
    first_name: string
    last_name: string
    email?: string
}

export type ExtractedPdfFeatures = {
    name: string
    authors: Author[]
    keywords: string[]
}
