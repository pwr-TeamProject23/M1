import * as React from "react"
import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "./views/HomePage.tsx"
import LoginPage from "./views/LoginPage/LoginPage.tsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
])
