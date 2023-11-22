import { ArticleWithCreator } from "../../types/api/article.ts"
import { Avatar, Button, Row, Table } from "antd"
import type { ColumnsType, ColumnType } from "antd/es/table"
import { getLocale } from "../../utils/locale.ts"
import { UserOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

export type ArticlesTableProps = {
    data: ArticleWithCreator[]
    isLoading: boolean
}

const tableColumns: ColumnsType<ArticleWithCreator> = [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Author",
        dataIndex: "creator",
        key: "author",
        align: "end",
        render: (value) => (
            <p>
                {value ? `${value.first_name} ${value.last_name}` : "Unknown"}
                <Avatar size={32} icon={<UserOutlined />} style={{ marginLeft: "8px" }} />
            </p>
        ),
    },
    {
        title: "Created",
        dataIndex: "created_at",
        key: "created_at",
        align: "end",
        render: (value) => {
            const valueAsDate = new Date(value)
            const locale = getLocale()
            const intl = Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" })

            return <p>{intl.format(valueAsDate)}</p>
        },
    },
]

export const ArticlesTable = (props: ArticlesTableProps) => {
    const navigate = useNavigate()

    const actionsColumn: ColumnType<ArticleWithCreator> = {
        title: "Actions",
        key: "actions",
        align: "end",
        render: (_, row) => (
            <Row align="middle">
                <Button onClick={() => navigate(`/app/articles/${row.id}`)}>View</Button>
            </Row>
        ),
    }

    const columns = [...tableColumns, actionsColumn]
    return <Table dataSource={props.data} columns={columns} loading={props.isLoading} rowKey="id" />
}
