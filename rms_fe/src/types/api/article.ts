import { ApiFile } from "./file.ts"
import { Pretty } from "../utils.ts"

export type Article = {
    id: number
    name: string
    notes: string

    created_at: string
    file_id: number
}

export type CreateArticle = Omit<Article, "id" | "created_at">

export type ArticleUpdate = Partial<Pick<Article, "name" | "notes">>

export type ArticleWithDetails = Pretty<Omit<Article, "file_id"> & { file: ApiFile }>
