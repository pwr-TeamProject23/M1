import axios from "axios"

export const setupAxios = () => {
    axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_URL
    axios.defaults.withCredentials = true
}

export function getCookie(name: string): string | null {
    const pattern = RegExp(name + "=.[^;]*")
    const matched = document.cookie.match(pattern)
    if (matched) {
        const cookie = matched[0].split("=")
        return cookie[1]
    }
    return null
}
