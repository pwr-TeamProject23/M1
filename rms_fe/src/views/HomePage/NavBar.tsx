import * as React from "react"
import { Button, Flex } from "antd"
import "./NavBar.css"
import { useNavigate } from "react-router-dom"

export const NavBar = () => {
    const containerStyle: React.CSSProperties = {
        padding: "2em 4em",
    }

    return (
        <nav>
            <Flex style={containerStyle} align="center">
                <img src="public/vite.svg" alt="" />
                <span>RMS</span>

                <div style={{ margin: "1em 2em" }}>
                    <NavBarItem href="/features"> Features </NavBarItem>
                    <NavBarItem href="/testimonials"> Testimonials </NavBarItem>
                    <NavBarItem href="/pricing"> Pricing </NavBarItem>
                </div>

                <LoginButton />
                <GetStartedButton />
            </Flex>
        </nav>
    )
}

type NavBarItemProps = React.PropsWithChildren<{
    href: string
}>
const NavBarItem = (props: NavBarItemProps) => {
    return (
        <a href={props.href} className="nav-bar-item">
            {props.children}
        </a>
    )
}

const LoginButton = () => {
    const navigate = useNavigate()

    return (
        <Button type="text" style={{ marginLeft: "auto" }} onClick={() => navigate("/login")}>
            Login
        </Button>
    )
}

const GetStartedButton = () => {
    const navigate = useNavigate()
    return (
        <Button type="primary" style={{ marginLeft: "24px" }} onClick={() => navigate("/login")}>
            Get Started
        </Button>
    )
}
