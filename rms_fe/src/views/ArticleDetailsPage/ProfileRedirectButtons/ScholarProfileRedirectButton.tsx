import { Button, Typography, Flex, List, Avatar, Tooltip, Modal, Badge } from "antd"
import { ScholarIcon } from "../../../components/ServicesIcons.tsx"
import { getAuthorScholar } from "../../../clients/search-engine.ts"
import { useQuery } from "@tanstack/react-query"

const useScholarAuthor = (author_name: string) => {
    return useQuery({
        queryKey: ["author_Scholar", author_name],
        enabled: false,
        queryFn: () => getAuthorScholar(author_name),
        staleTime: 60 * 60 * 1000,
    })
}

interface ScholarProfileRedirectButtonProps {
    authorName: string
    url?: string
}

const ScholarProfileRedirectButton = (props: ScholarProfileRedirectButtonProps) => {
    const scholarAuthor = useScholarAuthor(props.authorName)
    const authorsLength = scholarAuthor.data?.authors?.length

    if (!props.url && !scholarAuthor.data) {
        scholarAuthor.refetch()
    }

    const handleScholarClick = async () => {
        if (props.url) {
            window.open(props.url, "_blank")
            return
        }
        if (scholarAuthor.data?.authors.length === 1) {
            window.open(scholarAuthor.data.authors[0].scholar_url, "_blank")
        } else {
            Modal.info({
                title: "Scholar profiles that match with the author name",
                maskClosable: true,
                content: (
                    <div
                        id="scrollableDiv"
                        style={{
                            height: "70vh",
                            overflow: 'auto',
                            padding: '0 16px',
                        }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={scholarAuthor.data?.authors}
                            renderItem={(author, index) => (
                                <List.Item
                                    onClick={() => window.open(author.scholar_url, "_blank")}
                                    className="authorListItem"
                                >
                                    <Flex gap={10} style={{ alignItems: "center", width: "100%" }}>
                                        <div style={{ flex: 1 }}>
                                            <Avatar
                                                src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                            />
                                        </div>
                                        <div style={{ flex: 10 }}>
                                            <Flex style={{ justifyContent: "space-between", width: "100%" }}>
                                                <Typography.Text strong>
                                                    {props.authorName} ({index + 1})
                                                </Typography.Text>
                                            </Flex>
                                        </div>
                                    </Flex>
                                </List.Item>
                            )}
                        />
                    </div>
                ),
                onOk() {},
            })
        }
    }

    const isDisabled = authorsLength === 0 && !scholarAuthor.isError

    return (
        <Tooltip title="Scholar profile">
            <Badge count={authorsLength && authorsLength > 1 ? authorsLength : ""} size="small">
                <Button
                    shape="circle"
                    loading={scholarAuthor.isFetching}
                    disabled={isDisabled}
                    danger={scholarAuthor.isError}
                    style={{ backgroundColor: isDisabled ? "#DDDDDD" : "" }}
                    icon={<ScholarIcon style={{ fontSize: "32px", width: "24 px", height: "24px" }} />}
                    onClick={() => {
                        if (scholarAuthor.isError) {
                            scholarAuthor.refetch()
                            return
                        }
                        handleScholarClick()
                    }}
                />
            </Badge>
        </Tooltip>
    )
}

export default ScholarProfileRedirectButton
