import { Button, Col, Divider, Flex, Form, Input, Row, Transfer, Typography } from "antd"
import { EditUser, UserGroup, UserPermission, UserWithPermissions } from "../../../types/api/user.ts"
import { useState } from "react"

type UserDetailsFormProps = {
    user: UserWithPermissions
    groups: UserGroup[]
    permissions: UserPermission[]
    onSubmit: (data: EditUser) => void
}

export function UserDetailsForm(props: UserDetailsFormProps) {
    const [form] = Form.useForm()

    return (
        <Form
            initialValues={{
                first_name: props.user.first_name,
                last_name: props.user.last_name,
                email: props.user.email,
                groups: props.user.groups.map((group) => group.id.toString()),
                permissions: props.user.permissions.map((permission) => permission.id.toString()),
            }}
            form={form}
            onFinish={(data) => {
                props.onSubmit({ ...data, groups: form.getFieldValue("groups") })
            }}
        >
            <Form.Item label="First name" name="first_name">
                <Input />
            </Form.Item>

            <Form.Item label="Last name" name="last_name">
                <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
                <Input />
            </Form.Item>

            <Divider />
            <Row>
                <Col span={12}>
                    <Typography.Title level={4}>User Groups</Typography.Title>
                    <GroupTransfer groups={props.groups} />

                    {/*<Typography.Title level={4} style={{ marginTop: "1em" }}>*/}
                    {/*    User Permissions*/}
                    {/*</Typography.Title>*/}
                    {/*<PermissionsTransfer permissions={props.permissions} />*/}
                </Col>
                <Col span={12}>
                    <Typography.Title level={4}>Users permission levels</Typography.Title>
                    {props.user.permissions.map((perm) => (
                        <div key={perm.id}>
                            <Typography.Text>{perm.readable_code}</Typography.Text>
                            <Typography.Text style={{ fontSize: ".9em", color: "gray", marginLeft: "12px" }}>
                                {perm.code}
                            </Typography.Text>
                        </div>
                    ))}
                </Col>
            </Row>
            <Flex justify="end" gap={24} style={{ marginTop: "1em" }}>
                <Button>Cancel</Button>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Flex>
        </Form>
    )
}

const GroupTransfer = (props: { groups: UserGroup[] }) => {
    const form = Form.useFormInstance()

    const userGroups = (Form.useWatch("groups", { form, preserve: true }) as string[]) || []

    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    const onSelect = (leftKeys: string[], rightKeys: string[]) => {
        setSelectedKeys([...leftKeys, ...rightKeys])
    }

    const onChange = (nextTargetKeys: string[]) => {
        form.setFieldValue("groups", nextTargetKeys)
    }

    return (
        <Transfer
            dataSource={props.groups}
            titles={["Available Groups", "User Groups"]}
            targetKeys={userGroups}
            selectedKeys={selectedKeys}
            showSearch
            showSelectAll={false}
            onChange={onChange}
            onSelectChange={onSelect}
            rowKey={(group) => group.id.toString()}
            render={(item) => item.name}
            listStyle={{
                width: "45%",
                height: "300px",
            }}
        />
    )
}

// Temporarily disabled will be fixed in a followup
// const PermissionsTransfer = (props: { permissions: UserPermission[] }) => {
//     const form = Form.useFormInstance()
//
//     const userGroups = (Form.useWatch("permissions", { form, preserve: true }) as string[]) || []
//
//     const [selectedKeys, setSelectedKeys] = useState<string[]>([])
//
//     const onSelect = (leftKeys: string[], rightKeys: string[]) => {
//         setSelectedKeys([...leftKeys, ...rightKeys])
//     }
//
//     const onChange = (nextTargetKeys: string[]) => {
//         form.setFieldValue("permissions", nextTargetKeys)
//     }
//
//     return (
//         <Transfer
//             dataSource={props.permissions}
//             titles={["Available Permissions", "User Permissions"]}
//             targetKeys={userGroups}
//             selectedKeys={selectedKeys}
//             showSearch
//             showSelectAll={false}
//             onChange={onChange}
//             onSelectChange={onSelect}
//             rowKey={(group) => group.id.toString()}
//             render={(item) => item.readable_code}
//             listStyle={{
//                 width: "45%",
//                 height: "300px",
//             }}
//         />
//     )
// }
