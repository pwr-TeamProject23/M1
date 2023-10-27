import { LoginCredentials, AuthUser } from "../types/api/auth"
import axios from "axios"

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

    return response.data as AuthUser
}
