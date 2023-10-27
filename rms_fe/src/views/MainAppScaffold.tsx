import { NavigateFunction, Outlet, useNavigate } from "react-router-dom"
import { Avatar, Dropdown, Flex, MenuProps, message } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { logout } from "../clients/auth"
import axios from "axios"

const useLogout = (navigate: NavigateFunction) => {
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            message.success("Successfully logged out.")
            navigate("/")
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    message.error("You are not allowed to do that.")
                } else {
                    message.error("Could not log out, please try again.")
                }
            } else {
                message.error("Could not log out, please try again.")
            }
        },
    })
}

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

                <NavBarDropdown />
            </Flex>
        </nav>
    )
}

const NavBarDropdown = () => {
    const navigate = useNavigate()
    const logoutMutation = useLogout(navigate)

    const items: MenuProps["items"] = [
        {
            key: "0",
            label: "Settings",
            disabled: true,
        },
        {
            key: "1",
            label: "User Admin",
            onClick: () => navigate("/app/admin/users"),
        },
        {
            type: "divider",
        },
        {
            label: "Log Out",
            key: "2",
            danger: true,
            onClick: () => logoutMutation.mutate(),
        },
    ]

    return (
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Avatar size={32} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>
    )
}
