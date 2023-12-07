import { Button, Typography, Flex, List, Avatar, Tooltip, Modal, Badge } from "antd"
import { DblpIcon } from "../../../components/ServicesIcons.tsx"
import { getAuthorDBLP } from "../../../clients/search-engine.ts"
import { useQuery } from "@tanstack/react-query"
import "./ProfileRedirectButton.css"

const useDblpAuthor = (author_name: string) => {
    return useQuery({
        queryKey: ["author_dblp", author_name],
        queryFn: () => getAuthorDBLP(author_name),
        staleTime: 60 * 60 * 1000,
    })
}

interface DblpProfileRedirectButtonProps {
    authorName: string
}

const DblpProfileRedirectButton = (props: DblpProfileRedirectButtonProps) => {
    const dblpAuthor = useDblpAuthor(props.authorName)
    const authorsLength = dblpAuthor.data?.authors?.length

    const handleDblpClick = async () => {
        if (dblpAuthor.data?.authors.length === 1) {
            window.open(dblpAuthor.data.authors[0].dblp_url, "_blank")
        } else {
            Modal.info({
                title: "DBLP profiles that match with the author name",
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
                            dataSource={dblpAuthor.data?.authors}
                            renderItem={(author, index) => (
                                <List.Item
                                    onClick={() => window.open(author.dblp_url, "_blank")}
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

    const isDisabled = authorsLength === 0 && !dblpAuthor.isError

    return (
        <Tooltip title="Dblp profile">
            <Badge count={authorsLength && authorsLength > 1 ? authorsLength : ""} size="small">
                <Button
                    shape="circle"
                    loading={dblpAuthor.isFetching}
                    danger={dblpAuthor.isError}
                    disabled={isDisabled}
                    style={{ backgroundColor: isDisabled ? "#DDDDDD" : "" }}
                    icon={<DblpIcon style={{ fontSize: "32px", width: "24 px", height: "24px" }} />}
                    onClick={() => {
                        if (dblpAuthor.isError) {
                            dblpAuthor.refetch()
                            return
                        }
                        handleDblpClick()
                    }}
                />
            </Badge>
        </Tooltip>
    )
}

export default DblpProfileRedirectButton
