import { Button, Empty, Flex, Typography } from "antd"
import { FileAddOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { listUsers } from "../../../clients/users.ts"
import { UsersTable } from "./UsersTable.tsx"

const useUsers = () => {
    return useQuery({ queryFn: listUsers, queryKey: ["users"] })
}

export const UsersListPage = () => {
    const navigate = useNavigate()
    const users = useUsers()

    return (
        <Flex vertical style={{ padding: "2em 4em" }} gap={64}>
            <Typography.Title> Users </Typography.Title>

            {users.data?.length === 0 && <Empty />}
            {users.data?.length !== 0 && <UsersTable isLoading={users.isLoading} users={users.data!} />}

            <Button
                type="primary"
                size="large"
                icon={<FileAddOutlined />}
                onClick={() => navigate("/app/users/create")}
            >
                Add new User
            </Button>
        </Flex>
    )
}