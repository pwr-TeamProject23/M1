import { Button, Form, Input, Modal, Select } from "antd"
import { User } from "../../types/api/user.ts"
import { useAuthStore } from "../../state/authState.ts"
import { rejectionReasonMap, rejectionReasons } from "./rejectionEmailGenerator.ts"
import { ArticleWithDetails } from "../../types/api/article.ts"
import { CopyOutlined } from "@ant-design/icons"

export type ArticleRejectionEmailCreatorDialogProps = {
    isOpen: boolean
    article?: ArticleWithDetails
    onClose: () => void
}

export const ArticleRejectionEmailCreatorDialog = (props: ArticleRejectionEmailCreatorDialogProps) => {
    return (
        <Modal
            title="Compose rejection email"
            width="70vw"
            open={props.isOpen}
            onOk={props.onClose}
            onCancel={props.onClose}
        >
            <ArticleRejectionEmailCreator article={props.article} />
        </Modal>
    )
}

const ArticleRejectionEmailCreator = (props: { article?: ArticleWithDetails }) => {
    const user = useAuthStore((store) => store.user)
    const [form] = Form.useForm()

    const recipient = Form.useWatch("recipient", form)
    const article_name = Form.useWatch("article_title", form)
    const article_eisej = Form.useWatch("article_eisej", form)
    const reasons = Form.useWatch("rejection_reasons", form)

    const email = emailGenerator(recipient, article_name, article_eisej, reasons || [], user)

    return (
        <>
            <Form form={form} layout="vertical">
                <Form.Item label="Recipient" name="recipient">
                    <Input placeholder="Recipient" />
                </Form.Item>

                <Form.Item label="Article title" name="article_title">
                    <Input placeholder="Article title" defaultValue={props.article?.name} />
                </Form.Item>

                <Form.Item label="Article EISEJ" name="article_eisej">
                    <Input placeholder="Article EISEJ" />
                </Form.Item>

                <Form.Item label="Rejection reason" name="rejection_reasons">
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        options={rejectionReasons}
                    />
                </Form.Item>
            </Form>

            <div>
                <div style={{ display: "flex" }}>
                    <h3>Email preview: </h3>
                    <Button
                        style={{ marginLeft: "auto" }}
                        icon={<CopyOutlined />}
                        onClick={() => navigator.clipboard.writeText(email)}
                    >
                        Copy
                    </Button>
                </div>
                <pre style={{ whiteSpace: "pre-wrap" }}>{email}</pre>
            </div>
        </>
    )
}

const emailGenerator = (
    recipient: string,
    articleName: string,
    article_eisej: string,
    rejectionReasons: string[],
    user: User | null
) => {
    const mappedRejectionReasons = rejectionReasons.map((r) => `${rejectionReasonMap[r] || r} \n`)
    return (
        "Dear {recipient}\n\n" +
        "We hope this message finds you well. " +
        "We want to thank you for submitting your paper to the e-Informatica Software Engineering Journal titled '{title}' ({eisej}). " +
        "After careful consideration and review by our editorial team, " +
        "we regret to inform you that your paper has been desk-rejected at this stage of the review process." +
        "\n\n\n" +
        "The main issues that contributed to the desk rejection of your paper are as follows:\n" +
        "- {rejection_reasons}" +
        "\n\n\n" +
        "Best Regards\n" +
        "Sincerely,\n" +
        "{user}\n" +
        "e-Informatica Software Engineering Journal\n" +
        "{user_email}\n"
    )
        .replace("{recipient}", recipient)
        .replace("{title}", articleName)
        .replace("{eisej}", article_eisej)
        .replace("{rejection_reasons}", mappedRejectionReasons.join("- "))
        .replace("{user}", `${user?.first_name} ${user?.last_name}`)
        .replace("{user_email}", user?.email || "")
}
