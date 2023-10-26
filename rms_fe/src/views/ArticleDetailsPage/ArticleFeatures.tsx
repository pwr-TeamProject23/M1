import { ExtractedPdfFeatures } from "../../types/api/article.ts"
import { Button, Empty, Flex, Form, Input, Typography } from "antd"
import { EditableTagsInput } from "../../components/forms/EditableTagsInput.tsx"

export type ArticleFeaturesProps = {
    features?: ExtractedPdfFeatures
    onFetch: () => void
}
export const ArticleFeatures = (props: ArticleFeaturesProps) => {
    if (props.features === undefined) {
        return (
            <Empty description="Feature extraction was not yet ran">
                <Button type="primary" onClick={props.onFetch}>
                    Process file
                </Button>
            </Empty>
        )
    }

    return (
        <Flex vertical gap={12} style={{ overflowY: "scroll" }}>
            <ArticleFeaturesSubmitForm articleFeatures={props.features} />
        </Flex>
    )
}

type ArticleFeaturesSubmitFormProps = {
    articleFeatures: ExtractedPdfFeatures
}
const ArticleFeaturesSubmitForm = (props: ArticleFeaturesSubmitFormProps) => {
    const [form] = Form.useForm()
    const initialValues = props.articleFeatures

    return (
        <Form initialValues={initialValues} labelCol={{ span: 6 }} form={form}>
            <Form.Item name="name">
                <Input />
            </Form.Item>

            <EditableTagsInput name="keywords" />

            {props.articleFeatures.authors.map((author) => (
                <Typography.Paragraph key={author}>{author}</Typography.Paragraph>
            ))}
        </Form>
    )
}
