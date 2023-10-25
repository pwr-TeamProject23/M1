import { LoginCredentials } from "../types/api/auth"
import axios from "axios"

axios.defaults.withCredentials = true

export const login = async (data: LoginCredentials) => {
    const response = await axios.post("login", data)

    return response.data
}

export const logout = async () => {
    const response = await axios.post("logout")

    return response.data
}
