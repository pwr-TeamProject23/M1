import React from 'react';
import { List, Avatar, Popover, Flex, Empty, Typography, Space, Tooltip } from 'antd';
import { Author, SearchResponse } from '../../types/api/search-engine';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import Icon, { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import "./ArticleRecommendations.css"
import { getInitials } from '../../utils/search-engine.ts';
import DblpProfileRedirectButton from './ProfileRedirectButtons/DblpProfileRedirectButton.tsx';
import ScopusProfileRedirectButton from './ProfileRedirectButtons/ScopusProfileRedirectButton.tsx';
import ScholarProfileRedirectButton from './ProfileRedirectButtons/ScholarProfileRedirectButton.tsx';


export type ArticleRecommendationsProps = {
    recommendations: SearchResponse | undefined;
};

export const ArticleRecommendations: React.FC<ArticleRecommendationsProps> = ({ recommendations }) => {

    if (!recommendations || recommendations.articles.length === 0) {
        return <Empty description="No recommendations found. Try to adjust keywords or document title."></Empty>
    }

    return (
        <List
            itemLayout="horizontal"
            dataSource={recommendations.articles}
            renderItem={item => (
                <List.Item>

                    <Flex vertical style={{ width: "100%" }}>
                        <Flex>

                            <Flex vertical flex={7}>

                                <AuthorList authors={item.authors} />
                                <Typography.Link href={item.doi_url} target="_blank" rel="noopener noreferrer">
                                    <Typography.Title level={4} className="titleText">{item.title}</Typography.Title>
                                </Typography.Link>
                                <Typography.Text type="secondary">
                                    {item.publication_name} {item.volume} {item.issue_id ? `(${item.issue_id})` : null}
                                </Typography.Text>
                                <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                    {item.description}
                                </Typography.Paragraph>
                            </Flex>

                            <Flex vertical flex={1} gap={5} style={{ alignItems: "flex-end" }}>
                                <Tooltip title="Cover date">
                                    <Flex gap={5} style={{ width: "fit-content" }}>
                                        {item.cover_date}
                                        <CalendarOutlined />
                                    </Flex>
                                </Tooltip>

                                <Tooltip title="Cited by count">
                                    <Flex gap={5} style={{ width: "fit-content" }}>
                                        {item.cited_by_count}
                                        <EditOutlined />
                                    </Flex>
                                </Tooltip>
                            </Flex>

                        </Flex>
                    </Flex>
                </List.Item>
            )}
        />
    );
};



const AuthorList: React.FC<{ authors: Author[] }> = ({ authors }) => {
    const DotSvg = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#2563ea'" viewBox="0 0 2 10">
            <circle cx="1" cy="4" r="2" />
        </svg>
    );

    const DotIcon = (props: Partial<CustomIconComponentProps>) => (
        <Icon component={DotSvg} {...props} />
    );

    return (
        <Space split={<DotIcon />} className='authorsList'>
            {authors.map(author => (
                <AuthorPopover key={author.scopus_id} author={author} />
            ))}
        </Space>
    );
};



const AuthorPopover: React.FC<{ author: Author }> = ({ author }) => {
    const initials = getInitials(author.name);

    const popoverContent = (
        <Flex vertical gap={15}>
            <Flex align='center' gap={10}>
                <Avatar style={{ backgroundColor: '#87d068' }}>{initials}</Avatar>
                <b>{author.given_name} {author.surname}</b>
            </Flex>
            <AuthorLinks author={author} />
        </Flex>
    );

    return (
        <Popover content={popoverContent}>
            <Typography.Link >{author.given_name} {author.surname}</Typography.Link>
        </Popover>
    );
};




const AuthorLinks: React.FC<{ author: Author }> = ({ author }) => {

    const authorName = author.given_name + " " + author.surname;

    return (
        <Flex style={{width: "100%", justifyContent: "space-around"}}>
            <ScopusProfileRedirectButton author_firstname={author.given_name} author_lastname={author.surname} url={author.scopus_url} />
            <DblpProfileRedirectButton authorName={authorName} />
            <ScholarProfileRedirectButton authorName={authorName} />
        </Flex>
    );
};
