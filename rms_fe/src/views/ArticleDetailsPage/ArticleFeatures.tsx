import { Button, Form, Input, Typography, Empty, Flex, InputNumber, List, Avatar, Popover } from 'antd';
import { ExtractedPdfFeatures } from '../../types/api/article.ts';
import { EditableTagsInput } from '../../components/forms/EditableTagsInput.tsx';
import { SearchBody } from '../../types/api/search-engine.ts';
import DblpProfileRedirectButton from './ProfileRedirectButtons/DblpProfileRedirectButton.tsx';
import ScholarProfileRedirectButton from './ProfileRedirectButtons/ScholarProfileRedirectButton.tsx';
import ScopusProfileRedirectButton from './ProfileRedirectButtons/ScopusProfileRedirectButton.tsx';
import { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';

export type ArticleFeaturesProps = {
    features?: ExtractedPdfFeatures;
    onFetch: () => void;
    isLoadingFeatures: boolean;
    isLoadingArticles: boolean;
    onGenerateRecommendations: (searchBody: SearchBody) => void;
};

export type IArticleFeaturesForm = {
    keywords: string[];
    name: string;
    abstractKeywords: string[];
    count: number;
};

export interface AuthorProfileButtonProps {
    authorName: string;
}

export const ArticleFeatures = (props: ArticleFeaturesProps) => {
    const [authorOrcids, setAuthorOrcids] = useState<{ [key: string]: string }>({});
    const [form] = Form.useForm<IArticleFeaturesForm>()
    const initialValues = {
        ...props.features,
        count: 10
    }

    if (!props.features) {
        return (
            <Empty description="Feature extraction was not yet ran">
                <Button type="primary" onClick={props.onFetch} loading={props.isLoadingFeatures}>
                    Process file
                </Button>
            </Empty>
        );
    }

    const handleAuthorOrcid = (authorFirstName: string, authorLastName: string, orcid: string) => {
        setAuthorOrcids(prevOrcids => ({
            ...prevOrcids,
            [`${authorFirstName} ${authorLastName}`]: orcid
        }));
    };

    const handleFormSubmit = (values: IArticleFeaturesForm) => {

        props.onGenerateRecommendations(
            {
                title: values.name,
                keywords: values.keywords,
                abstractKeywords: values.abstractKeywords,
                count: values.count
            }
        );
    };

    return (
        <Form form={form} initialValues={initialValues} onFinish={handleFormSubmit}>
            <Flex style={{ marginTop: "10px" }}>

                <div style={{ flex: 1 }}>
                    <Flex vertical gap={8}>

                        <Form.Item name="keywords" label="Keywords">
                            <EditableTagsInput />
                        </Form.Item>

                        <Form.Item name="name" label="Document Name">
                            <Input />
                        </Form.Item>

                        <Form.Item name="count" label="Number of Recommendations (1-25)">
                            <InputNumber min={1} max={25} />
                        </Form.Item>

                        <List
                            itemLayout="horizontal"
                            dataSource={props.features.authors}
                            renderItem={(author, index) => {
                                const authorName = `${author.first_name} ${author.last_name}`;
                                return (
                                    <List.Item>
                                        <Flex gap={10} style={{ alignItems: "center", width: "100%" }}>
                                            <div style={{ flex: 1 }}>
                                                <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                                            </div>
                                            <div style={{ flex: 10 }}>
                                                <Flex style={{ justifyContent: "space-between", width: "100%"}}>
                                                    <Flex vertical>
                                                    <Flex gap={5} align='center'>
                                                        <Typography.Text strong >{authorName}</Typography.Text>
                                                        {authorOrcids[authorName] && <Popover content={
                                                            <Typography.Text type='secondary'>{`ORCID: ${authorOrcids[authorName]}`}</Typography.Text>
                                                        }>
                                                            <InfoCircleOutlined />
                                                        </Popover>}
                                                    </Flex>
                                                        <Typography.Text type='secondary'>{author.email}</Typography.Text>
                                                    </Flex>

                                                    <Flex gap={10}>
                                                        <ScopusProfileRedirectButton author_firstname={author.first_name} author_lastname={author.last_name} onOrcidUpdate={(orcid) => handleAuthorOrcid(author.first_name, author.last_name, orcid)} />
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
    );
};
