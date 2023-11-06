import axios from "axios"
import { CreateUser, EditUser, User, UserGroup, UserPermission, UserWithPermissions } from "../types/api/user.ts"

export const listUsers = async () => {
    const response = await axios.get("admin/users")

    return response.data as User[]
}

export const singleUser = async (id: string | number) => {
    const response = await axios.get(`admin/users/${id}`)

    return response.data as UserWithPermissions
}

export const createUser = async (body: CreateUser) => {
    const response = await axios.post("admin/users", body)

    return response.data as User
}

export const editUser = async (id: string | number, body: EditUser) => {
    const response = await axios.patch(`admin/users/${id}`, body)

    return response.data as User
}

// Permissions

export const listPermissions = async () => {
    const response = await axios.get("admin/permissions")

    return response.data as UserPermission[]
}

export const listGroups = async () => {
    const response = await axios.get("admin/groups")

    return response.data as UserGroup[]
}
