import { create } from "zustand"
import { getCurrentUser } from "../clients/auth"
import { User } from "../types/api/user.ts"

type AuthStore = {
    user: User | null
    setUser: (user: User | null) => void
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
