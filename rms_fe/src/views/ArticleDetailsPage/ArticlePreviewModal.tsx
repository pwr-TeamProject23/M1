import { ArticleWithDetails } from "../../types/api/article.ts"
import { Empty, Modal } from "antd"

export type ArticlePreviewModalProps = {
    isOpen: boolean
    article: ArticleWithDetails
    onClose: () => void
}

export function ArticlePreviewModal(props: ArticlePreviewModalProps) {
    return (
        <Modal open={props.isOpen} onCancel={props.onClose} onOk={props.onClose} footer={[]}>
            <object data={props.article.file.path} type="application/json">
                <Empty description="There was an error loading the pdf file" />
            </object>
        </Modal>
    )
}
