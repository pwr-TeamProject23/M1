import { InboxOutlined, LeftCircleOutlined } from "@ant-design/icons"
import { Flex, Typography, Upload, UploadProps, message, Form, Input, Button } from "antd"
import { backendUrl } from "../../utils/env.ts"
import { FileUploadResponse } from "../../types/api/file-upload.ts"
import { useEffect, useState } from "react"
import { CreateArticle } from "../../types/api/article.ts"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { createArticle } from "../../clients/articles.ts"
import { useMutation } from "@tanstack/react-query"

const useCreateArticle = (navigate: NavigateFunction) => {
    return useMutation({
        mutationFn: createArticle,
        onSuccess: (article) => {
            message.success("Article created successfully").then()
            navigate(`/app/articles/${article.id}`)
        },
        onError: () => {
            message.error("Could not create the article, please try again").then()
        },
    })
}

export const ArticleCreationPage = () => {
    const navigate = useNavigate()
    const [selectedFile, setSelectedFile] = useState<FileUploadResponse | null>(null)

    const createArticleMutation = useCreateArticle(navigate)

    return (
        <Flex vertical style={{ padding: "2em 4em" }} align="center">
            <Typography.Title style={{ alignSelf: "start" }}>Add new article</Typography.Title>
            <div style={{ width: "80vw" }}>
                <Button size="large" icon={<LeftCircleOutlined />} onClick={() => navigate(-1)}>
                    Back
                </Button>

                <div style={{ marginTop: "2em" }} />

                <FileUpload onFileChange={setSelectedFile} />

                <div style={{ marginTop: "2em" }} />

                <ArticleFormCreate onSubmit={(data) => createArticleMutation.mutate(data)} file={selectedFile} />
            </div>
        </Flex>
    )
}

type FileUploadProps = {
    onFileChange: (fileData: FileUploadResponse | null) => any
}
const FileUpload = (props: FileUploadProps) => {
    const uploadProps: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,
        action: backendUrl("files/upload"),

        beforeUpload: (file) => {
            const isPdf = file.type === "application/pdf"
            if (!isPdf) {
                message.error("You must supply a pdf file").then()
            }

            return isPdf || Upload.LIST_IGNORE
        },
        onChange: (info) => {
            console.log(info.file.status)

            if (info.file.status === "done") {
                const response = info.file.response as FileUploadResponse
                props.onFileChange(response)
                message.success(response.message).then()
            }
        },

        onRemove: () => props.onFileChange(null),
    }

    return (
        <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                files.
            </p>
        </Upload.Dragger>
    )
}

type ArticleFormCreateProps = {
    file: FileUploadResponse | null
    onSubmit: (data: CreateArticle) => void
}
const ArticleFormCreate = (props: ArticleFormCreateProps) => {
    const [form] = Form.useForm()

    const initialValue: CreateArticle = {
        name: "",
        notes: "",
        file_id: -1,
    }

    const submit = (data: CreateArticle) => {
        props.onSubmit(data)
    }

    useEffect(() => {
        form.setFieldValue("file_id", props.file?.id || -1)
    }, [props.file])

    return (
        <Form form={form} initialValues={initialValue} onFinish={submit} requiredMark={false}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="notes" label="Notes" rules={[{ required: false }]}>
                <Input.TextArea rows={5} />
            </Form.Item>

            <Form.Item hidden name="file_id" label="File id" rules={[{ required: true }]}>
                <Input.TextArea rows={5} />
            </Form.Item>

            <Flex>
                <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>
                    Create
                </Button>
            </Flex>
        </Form>
    )
}
