export type User = {
    id: number
    first_name: string
    last_name: string
    email: string
    last_login: Date | null
    created_at: Date | null
}

export type CreateUser = Omit<User, "id" | "last_login" | "created_at">
export type EditUser = Partial<CreateUser & { groups: number[] }>

export type UserGroup = {
    id: number
    name: string
}

export type UserPermission = {
    id: number
    code: string
    readable_code: string
}

export type UserWithPermissions = User & {
    groups: UserGroup[]
    permissions: UserPermission[]
}
