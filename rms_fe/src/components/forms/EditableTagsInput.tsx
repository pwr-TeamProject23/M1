import { Form, Input, InputRef, Space, Tag } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { NoOp } from "../../utils/functions.ts"

export type EditableTagsInputProps = {
    name: string
}

export function EditableTagsInput(props: EditableTagsInputProps) {
    const form = Form.useFormInstance()
    const values = Form.useWatch(props.name, { form, preserve: true }) as string[]
    const [openEditTag, setOpenEditTag] = useState<number | null>(null)

    const onCreate = (newValue: string) => {
        form.setFieldValue(props.name, [...values, newValue])
        setOpenEditTag(null)
    }

    const onEdit = (index: number, newValue: string) => {
        const valuesCopy = [...values]

        valuesCopy[index] = newValue
        form.setFieldValue(props.name, valuesCopy)
        setOpenEditTag(null)
    }

    const onDelete = (index: number) => {
        const newValues = values.filter((_, idx) => idx !== index)

        form.setFieldValue(props.name, newValues)
    }

    return (
        <Space wrap>
            {(values || []).map((value, index) => (
                <EditableTag
                    key={value}
                    value={value}
                    isEdited={index === openEditTag}
                    onEditStart={() => setOpenEditTag(index)}
                    onEditStop={() => setOpenEditTag(null)}
                    onSave={(newValue) => onEdit(index, newValue)}
                    onDelete={() => onDelete(index)}
                />
            ))}

            <EditableTag
                value="New Tag"
                icon={<PlusOutlined />}
                closable={false}
                isEdited={-1 === openEditTag}
                onEditStart={() => setOpenEditTag(-1)}
                onEditStop={() => setOpenEditTag(null)}
                onSave={(newValue) => onCreate(newValue)}
                onDelete={NoOp}
            />
        </Space>
    )
}

type EditableTagProps = {
    value: string
    closable?: boolean
    icon?: React.ReactNode
    isEdited: boolean

    onEditStart: () => void
    onEditStop: () => void
    onSave: (newValue: string) => void
    onDelete: () => void
}
const EditableTag = (props: EditableTagProps) => {
    const closable = props.closable ?? true

    const inputRef = useRef<InputRef>(null)

    const [editValue, setEditValue] = useState(props.value)

    const onClick = (isDouble: boolean) => {
        if (isDouble || (!isDouble && props.icon)) {
            props.onEditStart()
        }
    }

    const onEnter = () => {
        props.onSave(editValue)
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [props.isEdited])

    if (props.isEdited) {
        return (
            <Input
                ref={inputRef}
                type="text"
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onPressEnter={onEnter}
                onBlur={props.onEditStop}
            />
        )
    }

    return (
        <Tag
            key={props.value}
            icon={props.icon}
            closable={closable}
            onClick={() => onClick(false)}
            onDoubleClick={() => onClick(true)}
            onClose={() => props.onDelete()}
        >
            {props.value}
        </Tag>
    )
}
