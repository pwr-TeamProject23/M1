import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { editUser, listGroups, listPermissions, singleUser } from "../../../clients/users.ts"
import { Button, message, Typography } from "antd"
import { UserDetailsForm } from "./UserDetailsForm.tsx"
import { LeftCircleOutlined } from "@ant-design/icons"
import { EditUser } from "../../../types/api/user.ts"

const useUserWithPermissions = (id: string | number) => {
    return useQuery({ queryFn: () => singleUser(id), queryKey: ["users", id] })
}

const usePermissions = () => {
    return useQuery({ queryFn: listPermissions, queryKey: ["permissions"] })
}

const useGroups = () => {
    return useQuery({ queryFn: listGroups, queryKey: ["groups"] })
}

const useEditUser = (id: string) => {
    const client = useQueryClient()

    return useMutation({
        mutationFn: (body: EditUser) => editUser(id, body),
        onSuccess: async () => {
            message.success("Saved")
            client.invalidateQueries({ queryKey: ["users", id] }).then()
        },
        onError: () => message.error("There were issues with saving the changes. Please try again later"),
    })
}

export const UsersDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const user = useUserWithPermissions(id!)
    const permissions = usePermissions()
    const groups = useGroups()

    const userMutation = useEditUser(id!)

    if (user.data == null || permissions.data == null || groups.data == null) {
        return <div>Is Loading</div>
    }

    return (
        <div style={{ padding: "2em 4em" }}>
            <Button size="large" icon={<LeftCircleOutlined />} onClick={() => navigate(-1)}>
                Back
            </Button>

            <Typography.Title>
                {user.data.first_name} {user.data.last_name} Details page
            </Typography.Title>

            <UserDetailsForm
                user={user.data}
                groups={groups.data}
                permissions={permissions.data}
                onSubmit={(data) => {
                    userMutation.mutate(data)
                }}
            />
        </div>
    )
}
