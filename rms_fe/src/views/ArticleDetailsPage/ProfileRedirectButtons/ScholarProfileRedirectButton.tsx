import { Button, Typography, Flex, List, Avatar, Tooltip, Modal, Badge } from 'antd';
import ScholarLogoSvg from '../../../assets/scholar-logo.svg';
import Icon, { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { getAuthorScholar } from "../../../clients/search-engine.ts"
import { useQuery } from '@tanstack/react-query';

const useScholarAuthor = (author_name: string) => {
    return useQuery({ queryKey: ["author_Scholar", author_name], queryFn: () => getAuthorScholar(author_name), staleTime: 60 * 60 * 1000 })
}

interface ScholarProfileRedirectButtonProps {
    authorName: string;
}

const ScholarProfileRedirectButton = (props: ScholarProfileRedirectButtonProps) => {
    const scholarAuthor = useScholarAuthor(props.authorName);
    const authorsLength = scholarAuthor.data?.authors?.length;

    const ScholarIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={() => <img src={ScholarLogoSvg} alt="Scholar" />} {...props} />
    );

    const handleScholarClick = async () => {
        if (scholarAuthor.data?.authors.length === 1) {
            window.open(scholarAuthor.data.authors[0].scholar_url, '_blank');
        } else {

            Modal.info({
                title: 'Scholar profiles that match with the author name',
                maskClosable: true,
                content: (
                    <div
                        id="scrollableDiv"
                        style={{
                            height: 400,
                            overflow: 'auto',
                            padding: '0 16px',
                        }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={scholarAuthor.data?.authors}
                            renderItem={(author, index) => (
                                <List.Item onClick={() => window.open(author.scholar_url, '_blank')} className='authorListItem'>
                                    <Flex gap={10} style={{ alignItems: "center", width: "100%" }}>
                                        <div style={{ flex: 1 }}>
                                            <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                                        </div>
                                        <div style={{ flex: 10 }}>
                                            <Flex style={{ justifyContent: "space-between", width: "100%" }}>

                                                <Typography.Text strong >{props.authorName}</Typography.Text>

                                            </Flex>
                                        </div>
                                    </Flex>
                                </List.Item>
                            )}
                        />
                    </div>
                ),
                onOk() { },
            });
        }
    };

    return (
        <Tooltip title="Scholar profile">
            <Badge count={authorsLength && authorsLength > 1 ? authorsLength : ""} size='small'>
                <Button
                    shape='circle'
                    loading={scholarAuthor.isFetching}
                    disabled={authorsLength === 0 && !scholarAuthor.isError}
                    danger={scholarAuthor.isError}
                    icon={<ScholarIcon style={{ fontSize: '32px', width: "24 px", height: "24px" }} />}
                    onClick={() => {
                        if (scholarAuthor.isError) {
                            scholarAuthor.refetch();
                            return;
                        }
                        handleScholarClick()
                    }} />
            </Badge>
        </Tooltip>
    )
}

export default ScholarProfileRedirectButton;