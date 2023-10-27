import axios from "axios"
import { User } from "../types/api/user.ts"

export const listUsers = async () => {
    const response = await axios.get("admin/users")

    return response.data as User[]
}
