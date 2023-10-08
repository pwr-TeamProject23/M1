import * as React from "react"
import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "./views/HomePage.tsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
])
