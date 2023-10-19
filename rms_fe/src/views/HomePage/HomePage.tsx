import * as React from "react"
import { NavBar } from "./NavBar.tsx"
import { Button, Flex, Typography } from "antd"
import { useNavigate } from "react-router-dom"

export const HomePage = () => {
    return (
        <div>
            <MainSection />
            <FeatureSection />

            <FooterSection />
        </div>
    )
}

const MainSection = () => {
    const navigate = useNavigate()

    const mainStyle: React.CSSProperties = {
        height: "90vh",
    }

    const heroSpanStyle: React.CSSProperties = {
        color: "blueviolet",
    }
    return (
        <main style={mainStyle}>
            <NavBar />
            <Flex vertical align="center" style={{ height: "100%" }}>
                <Typography.Title level={1} style={{ fontSize: 60, marginTop: "128px" }}>
                    Discovering reviewers for <span style={heroSpanStyle}>your</span> paper
                </Typography.Title>
                <Typography.Title level={2}>
                    Finding and inviting reviewers for your paper, was never so easy !! <br /> Upload their article and
                    let us do the heavy lifting for you
                </Typography.Title>

                <Flex gap={24} style={{ marginTop: 32 }}>
                    <Button type="primary" size="large" onClick={() => navigate("/login")}>
                        Start now
                    </Button>

                    <Button type="default" size="large" onClick={() => navigate("/login")}>
                        Contact us
                    </Button>
                </Flex>

                <Typography.Title level={4} style={{ marginTop: "120px" }}>
                    Trusted already by
                </Typography.Title>
                <Flex gap={64}>
                    <img
                        src="https://pwr.edu.pl/fcp/mGBUKOQtTKlQhbx08SlkATxYCEi8pMgQGS39VBVJbWCECWR1pXhs_W3dN/_users/code_eCVYRPgYXNVg5Xh09GgBLGl9XR3g8Gh9MDCEUHxYb/logotyp/logotypy-pwr.png"
                        alt="PWR"
                        style={{ height: 128 }}
                    />
                    <img
                        src="https://pwr.edu.pl/fcp/mGBUKOQtTKlQhbx08SlkATxYCEi8pMgQGS39VBVJbWCECWR1pXhs_W3dN/_users/code_eCVYRPgYXNVg5Xh09GgBLGl9XR3g8Gh9MDCEUHxYb/logotyp/logotypy-pwr.png"
                        alt="Something else"
                        style={{ height: 128 }}
                    />
                </Flex>
            </Flex>
        </main>
    )
}

const FeatureSection = () => {
    return <div style={{ minHeight: "60vh", backgroundColor: "#2563EA" }}></div>
}

const FooterSection = () => {
    return (
        <Flex align="center" justify="center" style={{ minHeight: "20vh", backgroundColor: "#E2E8F0" }}>
            <Typography.Title level={5}>
                Disclaimer !! This is a thesis project with closed user base, and is not intended for broader use
            </Typography.Title>
        </Flex>
    )
}
