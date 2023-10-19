import * as React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { router } from "./router.tsx"
import { setupAxios } from "./utils/api.ts"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

setupAxios()
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
)
