import { create } from "zustand"
import { AuthUser } from "../types/api/auth"
import { getCurrentUser } from "../clients/auth"

type AuthStore = {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    isLoggedIn: () => Promise<boolean>
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isLoggedIn: async () => {
        try {
            const user = await getCurrentUser()
            set({ user })
        } catch (e) {
            return false
        }
        return true
    },
}))
