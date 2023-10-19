import { Button, Empty, Flex, Typography } from "antd"
import { FileAddOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { listArticles } from "../../clients/articles.ts"
import { useQuery } from "@tanstack/react-query"
import { ArticlesTable } from "./ArticlesTable.tsx"

const useArticles = () => {
    return useQuery({ queryKey: ["articles"], queryFn: listArticles })
}

export const ArticleListPage = () => {
    const navigate = useNavigate()
    const articles = useArticles()

    return (
        <Flex vertical style={{ padding: "2em 4em" }} gap={64}>
            <Typography.Title> Recently uploaded articles </Typography.Title>

            {articles.data?.length === 0 && <Empty />}
            {articles.data?.length !== 0 && <ArticlesTable data={articles.data || []} isLoading={articles.isLoading} />}

            <Button
                type="primary"
                size="large"
                icon={<FileAddOutlined />}
                onClick={() => navigate("/app/articles/create")}
            >
                Add new article
            </Button>
        </Flex>
    )
}
