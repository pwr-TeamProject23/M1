import { Button, Form, Input, Typography, Empty, Flex, InputNumber, List, Avatar, Popover } from "antd"
import { ArticleWithDetails, ExtractedPdfFeatures } from "../../types/api/article.ts"
import { EditableTagsInput } from "../../components/forms/EditableTagsInput.tsx"
import { ScholarSearchBody, SearchBody } from "../../types/api/search-engine.ts"
import DblpProfileRedirectButton from "./ProfileRedirectButtons/DblpProfileRedirectButton.tsx"
import ScholarProfileRedirectButton from "./ProfileRedirectButtons/ScholarProfileRedirectButton.tsx"
import ScopusProfileRedirectButton from "./ProfileRedirectButtons/ScopusProfileRedirectButton.tsx"
import { SortingOptionsSelect } from "../../components/forms/SortingOptionsSelect.tsx"
import { useEffect, useState } from "react"
import { InfoCircleOutlined, ReloadOutlined } from "@ant-design/icons"

export type ArticleFeaturesProps = {
    article: ArticleWithDetails
    features?: ExtractedPdfFeatures
    onFetch: () => void
    isLoadingFeatures: boolean
    isLoadingArticles: boolean
    onGenerateRecommendations: (searchBody: SearchBody) => void
    onGenerateRecommendationsScholar: (searchBody: ScholarSearchBody) => void
}

export type IArticleFeaturesForm = {
    keywords: string[]
    name: string
    abstractKeywords: string[]
    count: number
    sort_by: string[]
}

export const ArticleFeatures = (props: ArticleFeaturesProps) => {
    const storageKey = `article-${props.article.id}`
    const [authorOrcids, setAuthorOrcids] = useState<Record<string, string>>({})
    const [form] = Form.useForm<IArticleFeaturesForm>()
    const initialValues = {
        ...props.features,
        count: 20,
    }

    useEffect(() => {
        const data = localStorage.getItem(storageKey)
        if (!data) return

        try {
            const parsedInitialValues = JSON.parse(data)
            form.setFieldValue("keywords", parsedInitialValues.keywords)
        } catch {
            /* empty */
        }
    }, [])

    if (!props.features) {
        return (
            <Empty description="Feature extraction was not yet ran">
                <Button type="primary" onClick={props.onFetch} loading={props.isLoadingFeatures}>
                    Process file
                </Button>
            </Empty>
        )
    }

    const handleAuthorOrcid = (authorFirstName: string, authorLastName: string, orcid: string) => {
        setAuthorOrcids((prevOrcids) => ({
            ...prevOrcids,
            [`${authorFirstName} ${authorLastName}`]: orcid,
        }))
    }

    const handleFormSubmit = (values: IArticleFeaturesForm) => {
        localStorage.setItem(storageKey, JSON.stringify(values))
        props.onGenerateRecommendations({
            title: values.name,
            keywords: values.keywords,
            abstractKeywords: values.abstractKeywords,
            count: values.count,
            sort_by: values.sort_by,
        })
    }

    const handleRefresh = () => {
        localStorage.removeItem(storageKey)
        form.setFieldValue("keywords", initialValues.keywords)
    }

    return (
        <Form form={form} initialValues={initialValues} onFinish={handleFormSubmit} labelCol={{ span: 24 }}>
            <Flex style={{ marginTop: "10px", gap: "30px" }}>
                <div style={{ flex: 1 }}>
                    <Flex vertical gap={8}>
                        <div>
                            <Button htmlType="button" icon={<ReloadOutlined />} onClick={handleRefresh}>
                                Refresh
                            </Button>
                        </div>
                        <Form.Item name="keywords" label="Keywords::">
                            <EditableTagsInput />
                        </Form.Item>

                        <Form.Item name="name" label="Document Name::">
                            <Input />
                        </Form.Item>

                        <List
                            itemLayout="horizontal"
                            dataSource={props.features.authors}
                            renderItem={(author, index) => {
                                const authorName = `${author.first_name} ${author.last_name}`
                                return (
                                    <List.Item>
                                        <Flex gap={10} style={{ alignItems: "center", width: "100%" }}>
                                            <div style={{ flex: 1 }}>
                                                <Avatar
                                                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                                />
                                            </div>
                                            <div style={{ flex: 10 }}>
                                                <Flex style={{ justifyContent: "space-between", width: "100%" }}>
                                                    <Flex vertical>
                                                        <Flex gap={5} align="center">
                                                            <Typography.Text strong>{authorName}</Typography.Text>
                                                            {authorOrcids[authorName] && (
                                                                <Popover
                                                                    content={
                                                                        <Typography.Text type="secondary">{`ORCID: ${authorOrcids[authorName]}`}</Typography.Text>
                                                                    }
                                                                >
                                                                    <InfoCircleOutlined />
                                                                </Popover>
                                                            )}
                                                        </Flex>
                                                        <Typography.Text type="secondary">
                                                            {author.email}
                                                        </Typography.Text>
                                                    </Flex>

                                                    <Flex gap={10}>
                                                        <ScopusProfileRedirectButton
                                                            author_firstname={author.first_name}
                                                            author_lastname={author.last_name}
                                                            onOrcidUpdate={(orcid) =>
                                                                handleAuthorOrcid(
                                                                    author.first_name,
                                                                    author.last_name,
                                                                    orcid
                                                                )
                                                            }
                                                        />
                                                        <DblpProfileRedirectButton authorName={authorName} />
                                                        <ScholarProfileRedirectButton authorName={authorName} />
                                                    </Flex>
                                                </Flex>
                                            </div>
                                        </Flex>
                                    </List.Item>
                                )
                            }}
                        />
                    </Flex>
                </div>

                <div style={{ flex: 1 }}>
                    <Form.Item name="sort_by" label="Sort By::">
                        <SortingOptionsSelect />
                    </Form.Item>

                    <Form.Item name="count" label="Number of Recommendations (1-25)::">
                        <InputNumber min={1} max={25} />
                    </Form.Item>

                    <Empty description="There are no recommendations yet">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={props.isLoadingArticles}>
                                Generate Recommendations
                            </Button>
                        </Form.Item>
                    </Empty>
                </div>
            </Flex>
        </Form>
    )
}
