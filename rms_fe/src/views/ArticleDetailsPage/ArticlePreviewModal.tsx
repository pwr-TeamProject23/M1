import { ArticleWithDetails } from "../../types/api/article.ts"
import { Empty, Modal } from "antd"

export type ArticlePreviewModalProps = {
    isOpen: boolean
    article: ArticleWithDetails
    onClose: () => void
}

export function ArticlePreviewModal(props: ArticlePreviewModalProps) {
    const path = `${import.meta.env.VITE_APP_BACKEND_URL}files/get/${props.article.file.path}`

    return (
        <Modal
            open={props.isOpen}
            onCancel={props.onClose}
            closeIcon={false}
            onOk={props.onClose}
            footer={[]}
            width="90vw"
        >
            <object data={path} type="application/json" style={{ width: "100%", height: "80vh" }}>
                <Empty description="There was an error loading the pdf file" />
            </object>
        </Modal>
    )
}
