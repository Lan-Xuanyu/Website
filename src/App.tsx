import React from 'react';
import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  tokens,
  Title1,
  Body1
} from '@fluentui/react-components';
import { ArticleList } from './components/ArticleList';
import './App.css';

const useStyles = makeStyles({
  app: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1
  },
  header: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: tokens.spacingVerticalL,
    textAlign: 'center',
    boxShadow: tokens.shadow4
  },
  main: {
    padding: tokens.spacingVerticalL
  }
});

function App() {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.app}>
        <header className={styles.header}>
          <Title1>技术博客</Title1>
          <Body1>分享前端开发经验与技术洞察</Body1>
        </header>
        <main className={styles.main}>
          <ArticleList />
        </main>
      </div>
    </FluentProvider>
  );
}

export default App;
