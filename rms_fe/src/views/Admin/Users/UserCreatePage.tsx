import { Form, Input, Button, message, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../../clients/users.ts'; // This should be your API call function
import { CreateUser } from '../../../types/api/user.ts';
import { LeftCircleOutlined } from '@ant-design/icons';

export const UserCreatePage = () => {
    const navigate = useNavigate();

    const onFinish = async (values: CreateUser) => {
        try {
            await createUser(values);
            message.success('User created successfully');
            navigate('/app/admin/users');
        } catch (error) {
            message.error('Failed to create user');
        }
    };

    return (
        <div>
            <Button
                size="large"
                style={{ margin: "2em 0em 0em 2em", maxWidth: "100px"}}
                icon={<LeftCircleOutlined />}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
            <Flex style={{ width: "100vw", height: "80vh", justifyContent: "center", alignItems: "center" }}>
                <Flex>
                    <Flex vertical>
                        <Typography.Title>Create new user</Typography.Title>
                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item label="First Name" name="first_name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Last Name" name="last_name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button block type="primary" htmlType="submit">Create User</Button>
                            </Form.Item>
                        </Form>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
};
