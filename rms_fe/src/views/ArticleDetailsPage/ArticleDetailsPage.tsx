import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { extractArticlePdfFeatures, singleArticle, updateArticle } from "../../clients/articles.ts"
import { Button, Col, Empty, Flex, message, Row, Space, Spin, Tag, Typography } from "antd"
import { EditableTextField } from "../../components/EditableTextField.tsx"
import { ArticleUpdate } from "../../types/api/article.ts"
import { EyeOutlined, LeftCircleOutlined } from "@ant-design/icons"
import * as React from "react"
import { ArticlePreviewModal } from "./ArticlePreviewModal.tsx"
import { useState } from "react"
import { copyToClipboard } from "../../utils/copy.ts"
import { ArticleFeatures } from "./ArticleFeatures.tsx"

const useArticle = (id: string | number) => {
    return useQuery({ queryKey: ["article", id], queryFn: () => singleArticle(id) })
}

const useUpdateArticle = (id: string | number) => {
    const client = useQueryClient()

    return useMutation({
        mutationFn: (data: ArticleUpdate) => updateArticle(id, data),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["article", id] }).then()
            message.success("Article notes updated successfully").then()
        },
    })
}

const useExtractArticleFeatures = (id: string | number) => {
    return useQuery({
        queryKey: ["article", id, "features"],
        queryFn: () => extractArticlePdfFeatures(id),
        enabled: false,
    })
}

export const ArticleDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const article = useArticle(id!)
    const articleFeatures = useExtractArticleFeatures(id!)
    const updateArticle = useUpdateArticle(id!)

    const [pdfPreviewIsOpen, setPdfPreviewIsOpen] = useState(false)

    const notesStyle: React.CSSProperties = {
        border: "1px solid gray",
        borderRadius: "4px",
        padding: "4px 8px",
    }

    if (!article.data) {
        return <div>is loading</div>
    }

    return (
        <div style={{ padding: "2em 4em" }}>
            <Button
                size="large"
                style={{ marginBottom: "1em" }}
                icon={<LeftCircleOutlined />}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>

            <Flex justify="space-between">
                <Typography.Title>{article.data.name}</Typography.Title>
                <Button icon={<EyeOutlined />} onClick={() => setPdfPreviewIsOpen(true)}>
                    Preview pdf
                </Button>
            </Flex>

            <Typography.Paragraph>
                Created by: Jan Kowalski on {new Date(article.data.created_at).toLocaleString()}
            </Typography.Paragraph>
            <Space>
                <Tag
                    color="processing"
                    style={{ userSelect: "none", cursor: "pointer" }}
                    onClick={() => copyToClipboard(article.data.file.path)}
                >
                    Uploaded file
                </Tag>
                <Tag
                    style={{ userSelect: "none", cursor: "pointer" }}
                    onClick={() => copyToClipboard("20231016103951")}
                >
                    EISEJ: 20231016103951
                </Tag>
            </Space>

            <Typography.Title level={4} style={{ marginTop: "2em" }}>
                Notes to the article
            </Typography.Title>
            <EditableTextField value={article.data.notes} onSubmit={(value) => updateArticle.mutate({ notes: value })}>
                <Typography.Paragraph style={notesStyle}>
                    {article.data.notes || "Notes regarding the article"}
                </Typography.Paragraph>
            </EditableTextField>

            <Row style={{ marginTop: "6em" }}>
                <Col span={12}>
                    <Typography.Title level={5}>
                        Extracted features
                        {articleFeatures.isLoading && <Spin style={{ marginLeft: "12px" }} />}
                    </Typography.Title>
                    <ArticleFeatures features={articleFeatures.data} onFetch={articleFeatures.refetch} />
                </Col>
                <Col span={12}>
                    <Typography.Title level={5}>Proposed Reviewers</Typography.Title>
                    <Empty description="There are no recommendations yet" />
                </Col>
            </Row>

            <ArticlePreviewModal
                isOpen={pdfPreviewIsOpen}
                article={article.data}
                onClose={() => setPdfPreviewIsOpen(false)}
            />
        </div>
    )
}
