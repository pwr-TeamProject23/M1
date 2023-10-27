import { User } from "../../../types/api/user.ts"
import { Table } from "antd"
import { ColumnsType } from "antd/es/table"

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
    return <Table dataSource={props.users} loading={props.isLoading} columns={tableColumns} rowKey="id" />
}
