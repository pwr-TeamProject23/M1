import { User } from "../../../types/api/user.ts"
import { Button, Row, Table } from "antd"
import { ColumnsType, ColumnType } from "antd/es/table"
import { useNavigate } from "react-router-dom"

export type UsersTableProps = {
    users: User[]
    isLoading: boolean
}

const tableColumns: ColumnsType<User> = [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Name",
        dataIndex: "first_name",
        key: "first_name",
        render: (_, row) => {
            return (
                <div>
                    {row.first_name} {row.last_name}
                </div>
            )
        },
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Last seen",
        dataIndex: "last_login",
        key: "last_login",
        render: (value) => {
            if (value == null) {
                return <div> Never </div>
            }

            return <div>{new Date(value).toLocaleString()}</div>
        },
    },
    {
        title: "Created at",
        dataIndex: "created_at",
        key: "created_at",
        render: (value) => {
            if (value == null) {
                return <div> Never </div>
            }

            return <div>{new Date(value).toLocaleString()}</div>
        },
    },
]

export const UsersTable = (props: UsersTableProps) => {
    const navigate = useNavigate()

    const actionsColumn: ColumnType<User> = {
        title: "Actions",
        key: "actions",
        align: "end",
        render: (_, user) => (
            <Row>
                <Button onClick={() => navigate(`/app/admin/users/${user.id}`)}> View </Button>
            </Row>
        ),
    }

    const columns = [...tableColumns, actionsColumn]
    return <Table dataSource={props.users} loading={props.isLoading} columns={columns} rowKey="id" />
}
