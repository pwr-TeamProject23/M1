import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { extractArticlePdfFeatures, singleArticle, updateArticle } from "../../clients/articles.ts"
import { searchArticles, searchArticlesScholar } from "../../clients/search-engine.ts"
import { Button, Flex, message, Space, Tag, Typography, Steps, Divider, FloatButton, Skeleton, Tabs } from "antd"
import { ArticleCreator, ArticleUpdate } from "../../types/api/article.ts"
import { EyeOutlined, LeftCircleOutlined, SearchOutlined, MailOutlined } from "@ant-design/icons"
import * as React from "react"
import "./ArticleDetailsPage.css"
import { ArticlePreviewModal } from "./ArticlePreviewModal.tsx"
import { useState } from "react"
import { copyToClipboard } from "../../utils/copy.ts"
import { ArticleFeatures } from "./ArticleFeatures.tsx"
import { ScholarSearchBody, SearchBody, SearchResponse } from "../../types/api/search-engine.ts"
import { ArticleRecommendations } from "./ArticleRecommendations.tsx"
import { ArticleRejectionEmailCreatorDialog } from "./ArticleRejectionEmailCreator.tsx"
import { SortingOptionsSelect } from "../../components/forms/SortingOptionsSelect.tsx"
import { ScholarIcon, ScopusIcon } from "../../components/ServicesIcons.tsx"
import { EditableMarkdownField } from "../../components/EditableMarkdownField.tsx"

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

const useSearchArticles = () => {
    return useMutation<SearchResponse, Error, SearchBody>({
        mutationFn: (searchBody: SearchBody) => {
            return searchArticles(searchBody)
        },
        onError: (error) => {
            message.error(error.message)
        },
    })
}

const useSearchArticlesScholar = () => {
    return useMutation<SearchResponse, Error, ScholarSearchBody>({
        mutationFn: (searchBody: ScholarSearchBody) => {
            return searchArticlesScholar(searchBody)
        },
        onError: (error) => {
            message.error(error.message)
        },
    })
}

enum Step {
    ExtractFeatures = 0,
    Recommendations = 1,
}

export const ArticleDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const article = useArticle(id!)
    const articleFeatures = useExtractArticleFeatures(id!)
    const updateArticle = useUpdateArticle(id!)

    const [pdfPreviewIsOpen, setPdfPreviewIsOpen] = useState(false)
    const [recommendations, setRecommendations] = useState<SearchResponse>()
    const [recommendationsScholar, setRecommendationsScholar] = useState<SearchResponse>()
    const [currentStep, setCurrentStep] = useState(0)
    const [searchParameters, setSearchParameters] = useState<SearchBody>()
    const [isRejectionEmailDialogOpen, setIsRejectionEmailDialogOpen] = useState(false)

    const stepsRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (currentStep === Step.Recommendations) {
            stepsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [currentStep])

    const searchArticles = useSearchArticles()
    const searchArticlesScholar = useSearchArticlesScholar()

    const handleGenerateRecommendations = (searchBody: SearchBody) => {
        setSearchParameters(searchBody)
        searchArticles.mutate(searchBody, {
            onSuccess: (data) => {
                setCurrentStep(Step.Recommendations)
                setRecommendations(data)
                handleGenerateRecommendationsScholar({
                    keywords: searchBody.keywords,
                    num_articles: searchBody.count,
                })
            },
        })
    }

    const handleGenerateRecommendationsScholar = (searchBody: ScholarSearchBody) => {
        searchArticlesScholar.mutate(searchBody, {
            onSuccess: (data) => {
                setCurrentStep(Step.Recommendations)
                setRecommendationsScholar(data)
            },
        })
    }

    const handleRecommendationsReload = () => {
        if (!searchParameters) {
            return
        }
        searchArticles.mutate(searchParameters, {
            onSuccess: (data) => {
                setRecommendations(data)
            },
        })
    }

    const handleSortingChange = (newSorting: string[]) => {
        setSearchParameters({ ...searchParameters!, sort_by: newSorting })
    }

    const handleStepChange = (current: number) => {
        setCurrentStep(current)
    }

    if (!article.data) {
        return <div>is loading</div>
    }

    const steps = [
        {
            title: "Extract Features",
            content: (
                <ArticleFeatures
                    article={article.data}
                    features={articleFeatures.data}
                    onFetch={articleFeatures.refetch}
                    isLoadingFeatures={articleFeatures.isLoading}
                    isLoadingArticles={searchArticles.isPending}
                    onGenerateRecommendations={handleGenerateRecommendations}
                    onGenerateRecommendationsScholar={handleGenerateRecommendationsScholar}
                />
            ),
        },
        {
            title: "Recommendations",
            content: (
                <Tabs
                    defaultValue={0}
                    centered
                    items={[
                        {
                            label: "Google Scholar",
                            key: "google-scholar",
                            icon: <ScholarIcon />,
                            children: (
                                <ScholarRecommendationsTab
                                    recommendations={recommendationsScholar}
                                    searchParameters={searchParameters}
                                    isLoading={searchArticlesScholar.isPending}
                                />
                            ),
                        },
                        {
                            label: "Scopus",
                            key: "scopus",
                            icon: <ScopusIcon />,
                            children: (
                                <ScopusRecommendationsTab
                                    handleRecommendationsReload={handleRecommendationsReload}
                                    handleSortingChange={handleSortingChange}
                                    recommendations={recommendations}
                                    searchParameters={searchParameters}
                                    isLoading={searchArticles.isPending}
                                />
                            ),
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <div style={{ padding: "2em 4em" }}>
            <ArticleRejectionEmailCreatorDialog
                isOpen={isRejectionEmailDialogOpen}
                article={article.data}
                eisej_id={articleFeatures.data?.eisej_id}
                onClose={() => setIsRejectionEmailDialogOpen(false)}
            />
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
                <Flex gap={12}>
                    <Button icon={<MailOutlined />} onClick={() => setIsRejectionEmailDialogOpen(true)}>
                        Compose rejection email
                    </Button>
                    <Button icon={<EyeOutlined />} onClick={() => setPdfPreviewIsOpen(true)}>
                        Preview pdf
                    </Button>
                </Flex>
            </Flex>

            <Typography.Paragraph>
                <ArticleDetails creator={article.data.creator} createdAt={article.data.created_at} />
            </Typography.Paragraph>
            <Space>
                <Tag
                    color="processing"
                    style={{ userSelect: "none", cursor: "pointer" }}
                    onClick={() => copyToClipboard(article.data.file.path)}
                >
                    Uploaded file
                </Tag>
                {articleFeatures.data?.eisej_id && (
                    <Tag
                        style={{ userSelect: "none", cursor: "pointer" }}
                        onClick={() => copyToClipboard(articleFeatures.data.eisej_id)}
                    >
                        {articleFeatures.data?.eisej_id}
                    </Tag>
                )}
            </Space>

            <Typography.Title level={4} style={{ marginTop: "2em" }}>
                Notes to the article
            </Typography.Title>
            <EditableMarkdownField
                value={article.data.notes}
                onSubmit={(value) => updateArticle.mutate({ notes: value })}
            />

            <Flex vertical align="center">
                <Flex
                    ref={stepsRef}
                    vertical
                    align="center"
                    style={{
                        position: "sticky",
                        top: "0",
                        background: "white",
                        zIndex: "1000",
                        width: "100%",
                        paddingTop: "10px",
                    }}
                >
                    <Steps
                        current={currentStep}
                        style={{ width: "50%" }}
                        percent={articleFeatures.isFetched && currentStep === 0 ? 50 : 0}
                        labelPlacement="vertical"
                        onChange={handleStepChange}
                        items={steps}
                    />

                    <Divider style={{ margin: "0px" }} />
                </Flex>
                <div style={{ width: "70vw" }} className="steps-content">
                    {steps[currentStep].content}
                </div>
            </Flex>

            <ArticlePreviewModal
                isOpen={pdfPreviewIsOpen}
                article={article.data}
                onClose={() => setPdfPreviewIsOpen(false)}
            />

            <FloatButton.BackTop />
        </div>
    )
}

type ArticleDetailsProps = {
    creator: ArticleCreator
    createdAt: string
}

export const ArticleDetails = (props: ArticleDetailsProps) => {
    const fullName = props.creator ? `${props.creator.first_name} ${props.creator.last_name}` : "Unknown"
    return (
        <>
            Created by: {fullName} on {new Date(props.createdAt).toLocaleString()}
        </>
    )
}

type ScopusRecommendationsTabProps = {
    recommendations?: SearchResponse
    handleSortingChange: (newSorting: string[]) => void
    handleRecommendationsReload: () => void
    searchParameters?: SearchBody
    isLoading: boolean
}

const ScopusRecommendationsTab: React.FC<ScopusRecommendationsTabProps> = ({
    recommendations,
    handleSortingChange,
    handleRecommendationsReload,
    searchParameters,
    isLoading,
}) => {
    return (
        <div style={{ minHeight: "100vh" }}>
            <Flex gap={5} style={{ marginTop: "10px" }}>
                <SortingOptionsSelect
                    handleSortingChange={handleSortingChange}
                    selectedLabels={searchParameters?.sort_by}
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleRecommendationsReload}
                    loading={isLoading}
                >
                    Reload
                </Button>
            </Flex>
            {isLoading ? (
                Array(searchParameters?.count)
                    .fill(null)
                    .map((_, n) => (
                        <Flex vertical key={n} gap={10} style={{ marginTop: "20px" }}>
                            <Skeleton active />
                            <Divider />
                        </Flex>
                    ))
            ) : (
                <ArticleRecommendations recommendations={recommendations} />
            )}
        </div>
    )
}

type ScholarRecommendationsTabProps = {
    recommendations?: SearchResponse
    searchParameters?: SearchBody
    isLoading: boolean
}

const ScholarRecommendationsTab: React.FC<ScholarRecommendationsTabProps> = ({
    recommendations,
    searchParameters,
    isLoading,
}) => {
    return (
        <div style={{ minHeight: "100vh", marginTop: "10px" }}>
            {isLoading ? (
                Array(searchParameters?.count)
                    .fill(null)
                    .map((_, n) => (
                        <Flex vertical key={n + 25} gap={10} style={{ marginTop: "20px" }}>
                            <Skeleton active />
                            <Divider />
                        </Flex>
                    ))
            ) : (
                <ArticleRecommendations recommendations={recommendations} />
            )}
        </div>
    )
}
