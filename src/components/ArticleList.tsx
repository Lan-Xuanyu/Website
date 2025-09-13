import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Button,
  Badge,
  makeStyles,
  tokens,
  Body1,
  Title3,
  Spinner
} from '@fluentui/react-components';
import { CalendarRegular, DocumentRegular } from '@fluentui/react-icons';
import { getArticleList, loadMarkdownFile, parseMarkdown } from '../utils/markdownParser';
import type { ArticleMetadata } from '../utils/markdownParser';
import { ArticleViewer } from './ArticleViewer';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
    maxWidth: '1200px',
    margin: '0 auto'
  },
  listView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: tokens.spacingVerticalM
  },
  articleCard: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8
    }
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalS
  },
  metadata: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground2
  },
  preview: {
    padding: `0 ${tokens.spacingVerticalS} ${tokens.spacingVerticalS}`,
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.5',
    flex: 1
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: tokens.spacingVerticalM
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    gap: tokens.spacingHorizontalM
  },
  error: {
    textAlign: 'center',
    color: tokens.colorPaletteRedForeground1,
    padding: tokens.spacingVerticalL
  }
});

interface ArticleListProps {
  onArticleSelect?: (slug: string) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ onArticleSelect }) => {
  const styles = useStyles();
  const [articles, setArticles] = useState<(ArticleMetadata & { slug: string; content: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [loadingArticle, setLoadingArticle] = useState(false);
  
  useEffect(() => {
    loadArticles();
  }, []);
  
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const articleList = await getArticleList();
      setArticles(articleList);
    } catch (err) {
      setError('加载文章列表失败');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleArticleClick = async (article: ArticleMetadata & { slug: string; content: string }) => {
    try {
      setLoadingArticle(true);
      // 直接使用已加载的文章数据
      const parsedArticle = parseMarkdown(article.content);
      setSelectedArticle({
        ...parsedArticle,
        metadata: {
          ...parsedArticle.metadata,
          title: article.title,
          date: article.date
        }
      });
      onArticleSelect?.(article.slug);
    } catch (err) {
      setError('加载文章内容失败');
      console.error('Error loading article:', err);
    } finally {
      setLoadingArticle(false);
    }
  };
  
  const handleBackToList = () => {
    setSelectedArticle(null);
    onArticleSelect?.('');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getPreviewText = (content: string) => {
    // 从文章内容中提取前100个字符作为预览文本
    const cleanContent = content.replace(/[#*`[\]()]|!\[.*?\]\(.*?\)/g, '').trim();
    return cleanContent.length > 100 ? cleanContent.substring(0, 100) + '...' : cleanContent || '点击查看文章详细内容...';
  };
  
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spinner size="medium" />
          <Text>加载文章列表中...</Text>
        </div>
      </div>
    );
  }
  
  if (error && !selectedArticle) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Text size={400}>{error}</Text>
          <Button onClick={loadArticles} style={{ marginTop: tokens.spacingVerticalM }}>
            重试
          </Button>
        </div>
      </div>
    );
  }
  
  if (selectedArticle) {
    return (
      <div className={styles.container}>
        <Button 
          className={styles.backButton}
          appearance="subtle" 
          onClick={handleBackToList}
        >
          ← 返回文章列表
        </Button>
        {loadingArticle ? (
          <div className={styles.loading}>
            <Spinner size="medium" />
            <Text>加载文章内容中...</Text>
          </div>
        ) : (
          <ArticleViewer article={selectedArticle} />
        )}
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <Title3>技术文章</Title3>
      <div className={styles.listView}>
        {articles.map((article) => (
          <Card 
            key={article.slug}
            className={styles.articleCard}
            onClick={() => handleArticleClick(article)}
          >
            <CardHeader
              header={
                <div className={styles.cardHeader}>
                  <Text weight="semibold" size={400}>{article.title}</Text>
                  <div className={styles.metadata}>
                    <CalendarRegular fontSize={14} />
                    <Text size={200}>{formatDate(article.date)}</Text>
                    <Badge appearance="outline" size="extra-small">
                      <DocumentRegular fontSize={12} />
                      文章
                    </Badge>
                  </div>
                </div>
              }
            />
            <CardPreview>
              <div className={styles.preview}>
                <Body1>{getPreviewText(article.content)}</Body1>
              </div>
            </CardPreview>
          </Card>
        ))}
      </div>
      {articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: tokens.spacingVerticalXXL }}>
          <Text size={400}>暂无文章</Text>
        </div>
      )}
    </div>
  );
};