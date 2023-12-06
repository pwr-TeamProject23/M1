import React, { useState } from "react"
import { Select } from "antd"

type SortOption = {
    label: string
    criterion: string
    order: "+" | "-"
}

const OPTIONS: SortOption[] = [
    { label: "Relevancy", criterion: "relevancy", order: "-" },
    { label: "Citations (desc)", criterion: "citedby-count", order: "-" },
    { label: "Citations (asc)", criterion: "citedby-count", order: "+" },
    { label: "Publication Year (desc)", criterion: "pubyear", order: "-" },
    { label: "Publication Year (asc)", criterion: "pubyear", order: "+" },
]

const getSortOptions = (sortStrings: string[]): SortOption[] => {
    return sortStrings
        .map((sortStr) => {
            const order = sortStr.charAt(0) as "+" | "-"
            const criterion = sortStr.substring(1)

            return OPTIONS.find((option) => option.order === order && option.criterion === criterion)
        })
        .filter((option): option is SortOption => Boolean(option))
}

export type SortingOptionsSelectProps = {
    onChange?: (newCriteria: string[]) => void
    handleSortingChange?: (newSorting: string[]) => void
    selectedLabels?: string[]
}

export const SortingOptionsSelect: React.FC<SortingOptionsSelectProps> = ({
    onChange,
    handleSortingChange,
    selectedLabels,
}) => {
    const [selectedItems, setSelectedItems] = useState<SortOption[]>(getSortOptions(selectedLabels || []))

    const filteredOptions = OPTIONS.filter(
        (option) => !selectedItems.some((selectedItem) => selectedItem.criterion === option.criterion)
    )

    const handleCriteriaChange = (selectedLabels: string[]) => {
        const newSelectedItems = selectedLabels
            .map((label) => OPTIONS.find((option) => option.label === label)!)
            .filter(
                (option) =>
                    !selectedItems.some((selectedItem) => selectedItem.criterion === option.criterion) ||
                    selectedItems.includes(option)
            )
        setSelectedItems(newSelectedItems)
        handleSortingChange?.(newSelectedItems.map((item) => item.order + item.criterion))
        onChange?.(newSelectedItems.map((item) => item.order + item.criterion))
    }

    return (
        <>
            <Select
                showSearch={false}
                mode="multiple"
                placeholder="Sort by"
                value={selectedItems.map((item) => item.label)}
                style={{ width: "100%" }}
                onChange={handleCriteriaChange}
                options={filteredOptions.map((option) => ({
                    value: option.label,
                    label: option.label,
                }))}
            />
        </>
    )
}
