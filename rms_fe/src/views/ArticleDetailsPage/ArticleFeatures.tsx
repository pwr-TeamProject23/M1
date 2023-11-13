import { Button, Form, Input, Typography, Empty, Flex, InputNumber } from 'antd';
import { ExtractedPdfFeatures } from '../../types/api/article.ts';
import { EditableTagsInput } from '../../components/forms/EditableTagsInput.tsx';
import { SearchBody } from '../../types/api/search-engine.ts';

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

export const ArticleFeatures = (props: ArticleFeaturesProps) => {
    const [form] = Form.useForm<IArticleFeaturesForm>()
    const initialValues = {
        ...props.features,
        count: 3
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

    const handleFormSubmit = (values: IArticleFeaturesForm) => {

        props.onGenerateRecommendations(
            {
                title: values.name,
                keywords: values.keywords,
                abstractKeywords: values.abstractKeywords,
                count: values.count,
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


                        {props.features.authors.map((author, index) => (
                            <Typography.Paragraph key={index}>{author}</Typography.Paragraph>
                        ))}
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
