import { marked } from "marked"
import { EditableTextField } from "./EditableTextField.tsx"
import * as React from "react"
import { useEffect, useState } from "react"
import DOMPurify from "dompurify"

export type EditableMarkdownFieldProps = {
    value: string
    onSubmit: (value: string) => void
}

const notesStyle: React.CSSProperties = {
    border: "1px solid #232323",
    borderRadius: "4px",
    padding: "16px 32px",
}

export const EditableMarkdownField = (props: EditableMarkdownFieldProps) => {
    const [markdown, setMarkdown] = useState("")
    useEffect(() => {
        const result = marked.parse(props.value)

        if (typeof result === "string") {
            setMarkdown(DOMPurify.sanitize(result))
        } else {
            result.then((str) => setMarkdown(DOMPurify.sanitize(str)))
        }
    }, [props.value])

    return (
        <EditableTextField value={props.value} onSubmit={props.onSubmit}>
            <p style={notesStyle} dangerouslySetInnerHTML={{ __html: markdown }} />
        </EditableTextField>
    )
}
