import { createBrowserRouter, useNavigate } from "react-router-dom"
import { HomePage } from "./views/HomePage/HomePage.tsx"
import LoginPage from "./views/LoginPage/LoginPage.tsx"
import { ArticleListPage } from "./views/ArticleListPage/ArticleListPage.tsx"
import { MainAppScaffold } from "./views/MainAppScaffold.tsx"
import { ArticleCreationPage } from "./views/ArticleCreationPage/ArticleCreationPage.tsx"
import { ArticleDetailsPage } from "./views/ArticleDetailsPage/ArticleDetailsPage.tsx"
import { useAuthStore } from "./state/authState.ts"
import { ReactNode, useEffect } from "react"
import { UsersListPage } from "./views/Admin/Users/UsersListPage.tsx"

type ProtectedRouteProps = {
    children: ReactNode
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
    const { isLoggedIn, user } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        isLoggedIn().then((loggedIn) => {
            if (!loggedIn) {
                navigate("/login")
            }
        })
    }, [])

    if (!user) {
        return <></>
    }

    return props.children
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/app",
        element: (
            <ProtectedRoute>
                <MainAppScaffold />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/app/admin/users",
                element: <UsersListPage />,
            },
            // Non admin pages
            {
                path: "/app/articles",
                element: <ArticleListPage />,
            },
            {
                path: "/app/articles/create",
                element: <ArticleCreationPage />,
            },
            {
                path: "/app/articles/:id",
                element: <ArticleDetailsPage />,
            },
        ],
    },
])
