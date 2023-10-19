import { PropsWithChildren, useState } from "react"
import { Button, Flex, Input } from "antd"

import "./EditableTextField.css"

export type EditableTextFieldProps = PropsWithChildren<{
    value: string
    onSubmit: (value: string) => void
}>
export const EditableTextField = (props: EditableTextFieldProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [newValue, setNewValue] = useState(props.value)

    const onCancel = () => {
        setIsEditing(false)
        setNewValue(props.value)
    }

    const onSave = () => {
        setIsEditing(false)
        props.onSubmit(newValue)
    }

    if (!isEditing) {
        return (
            <div className="editable-text-field" onClick={() => setIsEditing(true)}>
                {props.children}
            </div>
        )
    }

    return (
        <Flex vertical gap={24}>
            <Input.TextArea autoSize={{ minRows: 3 }} value={newValue} onChange={(e) => setNewValue(e.target.value)} />
            <Flex gap={8} justify="end" style={{ width: "100%" }}>
                <Button onClick={() => onCancel()}>Cancel</Button>
                <Button type="primary" onClick={() => onSave()}>
                    Save
                </Button>
            </Flex>
        </Flex>
    )
}
