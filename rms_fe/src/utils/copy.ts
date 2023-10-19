import { message } from "antd"

export const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value)
    message.info("Copied")
}
