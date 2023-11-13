import React from 'react';
import { List, Avatar, Popover, Flex, Empty } from 'antd';
import { Author, SearchResponse } from '../../types/api/search-engine';
import { LinkOutlined } from '@ant-design/icons';

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
                    <List.Item.Meta
                        avatar={<AuthorAvatars authors={item.authors} />}
                        title={item.title}
                        description={item.description}
                    />
                </List.Item>
            )}
        />
    );
};

const AuthorAvatars: React.FC<{ authors: Author[] }> = ({ authors }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {authors.map(author => (
            <AuthorPopover key={author.scopus_id} author={author} />
        ))}
    </div>
);

const AuthorPopover: React.FC<{ author: Author }> = ({ author }) => {
    const initials = getInitials(author.name);

    const popoverContent = (
        <Flex vertical>
            <Flex align='center' gap={10}>
                <Avatar style={{ backgroundColor: '#87d068' }}>{initials}</Avatar>
                <b>{author.name}</b>
            </Flex>
            <AuthorLinks author={author} />
        </Flex>
    );

    return (
        <Popover content={popoverContent} placement='right'>
            <Avatar style={{ backgroundColor: '#87d068', margin: '4px' }}>{initials}</Avatar>
        </Popover>
    );
};

const AuthorLinks: React.FC<{ author: Author }> = ({ author }) => (
    <>
        <AuthorLink icon={<LinkOutlined />} url={author.scopus_url} label="Scopus Profile" />
        <AuthorLink icon={<LinkOutlined />} url={"#"} label="DBLP Profile" />
        <AuthorLink icon={<LinkOutlined />} url={"#"} label="Scolar Profile" />
    </>
);

const AuthorLink: React.FC<{ icon: React.ReactNode; url?: string; label: string }> = ({ icon, url, label }) => {
    if (!url) return null;

    return (
        <Flex gap={5}>
            {icon}
            <a href={url} target="_blank" rel="noopener noreferrer">{label}</a>
        </Flex>
    );
};

const getInitials = (name: string | undefined) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
};
