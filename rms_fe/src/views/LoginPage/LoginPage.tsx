// @ts-ignore
import * as React from "react"
import "./LoginPage.css"
import { useState } from "react"
import { Form, Input, Button, Row, Col, Typography } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"

type FieldType = {
    email?: string
    password?: string
}

const { Title } = Typography

const LoginPage = () => {
    const [form] = Form.useForm()
    const [emailBlurred, setEmailBlurred] = useState(false)

    const onFinish = (values: FieldType) => {
        console.log("Success: ", values)
        form.resetFields()
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed: ", errorInfo)
    }

    return (
        <Row justify="center" align="middle" className="login-container">
            <Col xs={18} sm={16} md={12} lg={8} xl={6} xxl={4}>
                <Title level={4} className="login-title">
                    Reviewer Matching System
                </Title>
                <Form
                    name="login-form"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 24 }}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
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

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password." }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}

export default LoginPage
