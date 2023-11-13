import React, { useState, useEffect, useRef } from 'react';
import { Input, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InputRef } from 'antd/lib/input';

export type EditableTagsInputProps = {
    value?: string[];
    onChange?: (newTags: string[]) => void;
};

export const EditableTagsInput: React.FC<EditableTagsInputProps> = ({ value = [], onChange }) => {
    const [tags, setTags] = useState<string[]>(value);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [newTagValue, setNewTagValue] = useState('');

    useEffect(() => {
        setTags(value);
    }, [value]);

    const handleTagChange = (newTags: string[]) => {
        setTags(newTags);
        onChange?.(newTags);
    };

    const handleCreate = () => {
        if (newTagValue && !tags.includes(newTagValue)) {
            const newTags = [...tags, newTagValue];
            handleTagChange(newTags);
            setNewTagValue('');
        }
        setEditIndex(null);
    };

    const handleEdit = (index: number, newTag: string) => {
        const newTags = [...tags];
        newTags[index] = newTag;
        handleTagChange(newTags);
        setEditIndex(null);
    };

    const handleDelete = (index: number) => {
        const newTags = tags.filter((_, idx) => idx !== index);
        handleTagChange(newTags);
    };

    return (
        <Space wrap>
            {tags.map((tag, index) => (
                <EditableTag
                    key={`${tag}-${index}`}
                    tag={tag}
                    isEdited={index === editIndex}
                    onEdit={() => setEditIndex(index)}
                    onSave={(newTag) => handleEdit(index, newTag)}
                    onDelete={() => handleDelete(index)}
                />
            ))}
            {editIndex === -1 ? (
                <Input
                    type="text"
                    size="small"
                    value={newTagValue}
                    onChange={(e) => setNewTagValue(e.target.value)}
                    onPressEnter={handleCreate}
                    onBlur={handleCreate}
                    ref={inputRef => inputRef?.focus()}
                />
            ) : (
                <Tag
                    icon={<PlusOutlined />}
                    onClick={() => setEditIndex(-1)}
                >
                    New Tag
                </Tag>
            )}
        </Space>
    );
};
type EditableTagProps = {
    tag: string;
    isEdited: boolean;
    icon?: React.ReactNode;
    onEdit: () => void;
    onSave: (newTag: string) => void;
    onDelete: () => void;
};

const EditableTag: React.FC<EditableTagProps> = ({ tag, isEdited, icon, onEdit, onSave, onDelete }) => {
    const inputRef = useRef<InputRef>(null);
    const [editValue, setEditValue] = useState(tag);

    useEffect(() => {
        if (isEdited) {
            inputRef.current?.focus();
        }
    }, [isEdited]);

    const handleSave = () => {
        onSave(editValue);
        setEditValue('');
    };

    if (isEdited) {
        return (
            <Input
                ref={inputRef}
                type="text"
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onPressEnter={handleSave}
                onBlur={handleSave}
            />
        );
    }

    return (
        <Tag
            icon={icon}
            closable={true}
            onClick={onEdit}
            onClose={onDelete}
        >
            {tag}
        </Tag>
    );
};
