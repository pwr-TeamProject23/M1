import { LoginCredentials } from "../types/api/auth"
import axios from "axios"
import { User } from "../types/api/user.ts"

export const login = async (data: LoginCredentials) => {
    const response = await axios.post("login", data)

    return response.data
}

export const logout = async () => {
    const response = await axios.post("logout")

    return response.data
}

export const getCurrentUser = async () => {
    const response = await axios.get("me")

    return response.data as User
}
