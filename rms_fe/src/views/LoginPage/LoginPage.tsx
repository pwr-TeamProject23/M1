import { useEffect, useState } from "react"
import { Form, Input, Button, Typography, message, Flex } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { login } from "../../clients/auth.ts"
import { LoginCredentials } from "../../types/api/auth.ts"
import axios from "axios"
import { useAuthStore } from "../../state/authState.ts"

const useLogin = (navigate: NavigateFunction) => {
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            message.success("Successfully logged in.")
            navigate("/app/articles")
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    message.error("Invalid email and/or password.")
                } else {
                    message.error("Could not log in, please try again.")
                }
            } else {
                message.error("Could not log in, please try again.")
            }
        },
    })
}

const LoginPage = () => {
    const [form] = Form.useForm()
    const [emailBlurred, setEmailBlurred] = useState(false)
    const navigate = useNavigate()

    const loginMutation = useLogin(navigate)

    const userStore = useAuthStore()

    useEffect(() => {
        userStore.isLoggedIn().then((isLoggedIn) => {
            if (isLoggedIn) navigate("/app/articles")
        })
    }, [])

    return (
        <Flex vertical align="center" justify="center" style={{ height: "100vh" }}>
            <Typography.Title level={4}>Reviewer Matching System</Typography.Title>
            <Form
                name="login-form"
                form={form}
                onFinish={(data: LoginCredentials) => loginMutation.mutate(data)}
                autoComplete="off"
                labelCol={{ span: 24 }}
                style={{ maxWidth: "400px", width: "80%" }}
            >
                <Form.Item<LoginCredentials>
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your e-mail." },
                        { type: "email", message: "This is not a valid e-mail." },
                    ]}
                    validateTrigger={emailBlurred ? ["onChange", "onBlur"] : ["onBlur"]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Email" onBlur={() => setEmailBlurred(true)} />
                </Form.Item>

                <Form.Item<LoginCredentials>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter your password." }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loginMutation.isPending} block>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    )
}

export default LoginPage
