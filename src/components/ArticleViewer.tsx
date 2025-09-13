import React from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Badge,
  makeStyles,
  tokens,
  Body1,
  Title3
} from '@fluentui/react-components';
import { CalendarRegular } from '@fluentui/react-icons';
import type { ParsedArticle } from '../utils/markdownParser';

const useStyles = makeStyles({
  card: {
    margin: tokens.spacingVerticalM,
    maxWidth: '800px',
    width: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  metadata: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground2
  },
  content: {
    padding: tokens.spacingVerticalM,
    lineHeight: '1.6',
    '& h1': {
      fontSize: tokens.fontSizeBase600,
      fontWeight: tokens.fontWeightSemibold,
      marginBottom: tokens.spacingVerticalM,
      color: tokens.colorNeutralForeground1
    },
    '& h2': {
      fontSize: tokens.fontSizeBase500,
      fontWeight: tokens.fontWeightSemibold,
      marginTop: tokens.spacingVerticalL,
      marginBottom: tokens.spacingVerticalS,
      color: tokens.colorNeutralForeground1
    },
    '& h3': {
      fontSize: tokens.fontSizeBase400,
      fontWeight: tokens.fontWeightSemibold,
      marginTop: tokens.spacingVerticalM,
      marginBottom: tokens.spacingVerticalS,
      color: tokens.colorNeutralForeground1
    },
    '& p': {
      marginBottom: tokens.spacingVerticalS,
      color: tokens.colorNeutralForeground1
    },
    '& pre': {
      backgroundColor: tokens.colorNeutralBackground2,
      padding: tokens.spacingVerticalM,
      borderRadius: tokens.borderRadiusMedium,
      overflow: 'auto',
      marginBottom: tokens.spacingVerticalS
    },
    '& code': {
      backgroundColor: tokens.colorNeutralBackground2,
      padding: '2px 4px',
      borderRadius: tokens.borderRadiusSmall,
      fontFamily: 'Consolas, Monaco, monospace',
      fontSize: tokens.fontSizeBase200
    },
    '& pre code': {
      backgroundColor: 'transparent',
      padding: 0
    },
    '& ul, & ol': {
      marginBottom: tokens.spacingVerticalS,
      paddingLeft: tokens.spacingHorizontalL
    },
    '& li': {
      marginBottom: tokens.spacingVerticalXS
    },
    '& blockquote': {
      borderLeft: `4px solid ${tokens.colorBrandBackground}`,
      paddingLeft: tokens.spacingHorizontalM,
      marginLeft: 0,
      marginBottom: tokens.spacingVerticalS,
      fontStyle: 'italic',
      color: tokens.colorNeutralForeground2
    }
  }
});

interface ArticleViewerProps {
  article: ParsedArticle;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({ article }) => {
  const styles = useStyles();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <div className={styles.header}>
            <Title3>{article.metadata.title}</Title3>
            <div className={styles.metadata}>
              <CalendarRegular />
              <Text size={300}>{formatDate(article.metadata.date)}</Text>
              <Badge appearance="outline" size="small">
                文章
              </Badge>
            </div>
          </div>
        }
      />
      <CardPreview>
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: article.htmlContent }}
        />
      </CardPreview>
    </Card>
  );
};