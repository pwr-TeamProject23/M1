import { Outlet } from "react-router-dom"
import { Avatar, Flex } from "antd"
import { UserOutlined } from "@ant-design/icons"

export const MainAppScaffold = () => {
    return (
        <div>
            <AppNavBar />
            <Outlet />
        </div>
    )
}

const AppNavBar = () => {
    return (
        <nav style={{ padding: "1em 4em", backgroundColor: "#2563EA" }}>
            <Flex>
                <img src="/public/vite.svg" alt="" />

                <div style={{ marginLeft: "auto" }} />

                <Avatar size={32} icon={<UserOutlined />} />
            </Flex>
        </nav>
    )
}
