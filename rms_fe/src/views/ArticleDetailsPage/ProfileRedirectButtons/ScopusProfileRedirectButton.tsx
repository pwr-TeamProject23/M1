import { Avatar, Badge, Button, Flex, List, Modal, Tooltip, Typography } from "antd"
import { ScopusIcon } from "../../../components/ServicesIcons"
import "./ProfileRedirectButton.css"
import { useQuery } from "@tanstack/react-query"
import { getAuthorScopus } from "../../../clients/search-engine"
import { useEffect } from "react"

const useScopusAuthor = (author_lastname: string, author_firstname: string) => {
    return useQuery({
        enabled: false,
        queryKey: ["author_scopus", author_firstname, author_lastname],
        queryFn: () => getAuthorScopus(author_lastname, author_firstname),
        staleTime: 60 * 60 * 1000,
    })
}

interface ScopusProfileRedirectButtonProps {
    author_lastname: string
    author_firstname: string
    url?: string
    onOrcidUpdate?: (orcid: string) => void
}

const ScopusProfileRedirectButton = (props: ScopusProfileRedirectButtonProps) => {
    const scopusAuthor = useScopusAuthor(props.author_firstname, props.author_firstname)
    const authorsLength = scopusAuthor.data?.authors?.length

    if (!props.url && !scopusAuthor.data) {
        scopusAuthor.refetch()
    }

    useEffect(() => {
        if (scopusAuthor.data?.authors.length === 1 && scopusAuthor.data.authors[0].orcid) {
            props.onOrcidUpdate?.(scopusAuthor.data.authors[0].orcid)
        }
    }, [scopusAuthor.data?.authors.length])

    const handleScopusClick = async () => {
        if (props.url) {
            window.open(props.url, "_blank")
            return
        }
        if (scopusAuthor.data?.authors.length === 1) {
            window.open(scopusAuthor.data.authors[0].scopus_url, "_blank")
        } else {
            Modal.info({
                title: "Scopus profiles that match with the author name",
                maskClosable: true,
                content: (
                    <div
                        id="scrollableDiv"
                        style={{
                            height: 400,
                            overflow: "auto",
                            padding: "0 16px",
                        }}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={scopusAuthor.data?.authors}
                            style={{ maxHeight: "50vh" }}
                            renderItem={(author, index) => (
                                <List.Item
                                    onClick={() => window.open(author.scopus_url, "_blank")}
                                    className="authorListItem"
                                >
                                    <Flex gap={10} style={{ alignItems: "center", width: "100%" }}>
                                        <div style={{ flex: 1 }}>
                                            <Avatar
                                                src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                            />
                                        </div>
                                        <div style={{ flex: 10 }}>
                                            <Flex
                                                style={{
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <Typography.Text strong>
                                                    {props.author_firstname} {props.author_lastname} ({index + 1})
                                                </Typography.Text>
                                                {author.orcid && (
                                                    <Typography.Text type="secondary">
                                                        ORCID: {author.orcid}
                                                    </Typography.Text>
                                                )}
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

    const isDisabled = authorsLength === 0 && !scopusAuthor.isError

    return (
        <Tooltip title="Scopus profile">
            <Badge count={authorsLength && authorsLength > 1 ? authorsLength : ""} size="small">
                <Button
                    shape="circle"
                    loading={scopusAuthor.isFetching}
                    danger={scopusAuthor.isError}
                    disabled={isDisabled}
                    style={{ backgroundColor: isDisabled ? "#DDDDDD" : "" }}
                    icon={<ScopusIcon style={{ fontSize: "32px", width: "24 px", height: "24px" }} />}
                    onClick={() => {
                        if (scopusAuthor.isError) {
                            scopusAuthor.refetch()
                            return
                        }
                        handleScopusClick()
                    }}
                />
            </Badge>
        </Tooltip>
    )
}

export default ScopusProfileRedirectButton
