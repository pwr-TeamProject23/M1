export const backendUrl = (path: string) => {
    const rootPath = import.meta.env.VITE_APP_BACKEND_URL

    return rootPath + path
}
