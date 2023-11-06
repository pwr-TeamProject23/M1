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
import { UsersDetailPage } from "./views/Admin/Users/UsersDetailPage.tsx"

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
                path: "admin",
                children: [
                    {
                        path: "users",
                        children: [
                            {
                                path: "",
                                element: <UsersListPage />,
                            },
                            {
                                path: ":id",
                                element: <UsersDetailPage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "articles",
                children: [
                    {
                        path: "",
                        element: <ArticleListPage />,
                    },
                    {
                        path: "create",
                        element: <ArticleCreationPage />,
                    },
                    {
                        path: ":id",
                        element: <ArticleDetailsPage />,
                    },
                ],
            },
        ],
    },
])
