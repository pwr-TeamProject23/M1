import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "./views/HomePage/HomePage.tsx"
import LoginPage from "./views/LoginPage/LoginPage.tsx"
import { ArticleListPage } from "./views/ArticleListPage/ArticleListPage.tsx"
import { MainAppScaffold } from "./views/MainAppScaffold.tsx"
import { ArticleCreationPage } from "./views/ArticleCreationPage/ArticleCreationPage.tsx"
import { ArticleDetailsPage } from "./views/ArticleDetailsPage/ArticleDetailsPage.tsx"

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
        element: <MainAppScaffold />,
        children: [
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
