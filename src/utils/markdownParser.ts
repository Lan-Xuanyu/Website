import matter from 'gray-matter';
import { marked } from 'marked';
import { Buffer } from 'buffer';

// 为浏览器环境设置全局Buffer
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}

export interface ArticleMetadata {
  title: string;
  date: string;
  [key: string]: any;
}

export interface ParsedArticle {
  metadata: ArticleMetadata;
  content: string;
  htmlContent: string;
}

/**
 * 解析markdown文件内容
 * @param markdownContent - markdown文件的原始内容
 * @returns 解析后的文章对象
 */
export function parseMarkdown(markdownContent: string): ParsedArticle {
  // 使用gray-matter解析front matter
  const { data, content } = matter(markdownContent);
  
  // 使用marked将markdown转换为HTML
  const htmlContent = marked(content);
  
  return {
    metadata: data as ArticleMetadata,
    content,
    htmlContent
  };
}

/**
 * 从文件路径读取markdown文件
 * @param filePath - 文件路径
 * @returns Promise<ParsedArticle>
 */
export async function loadMarkdownFile(filePath: string): Promise<ParsedArticle> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`);
    }
    const content = await response.text();
    return parseMarkdown(content);
  } catch (error) {
    console.error('Error loading markdown file:', error);
    throw error;
  }
}

/**
 * 获取所有文章列表
 * @returns Promise<ArticleMetadata[]>
 */
export async function getArticleList(): Promise<(ArticleMetadata & { slug: string })[]> {
  // 使用动态导入获取所有文章
  const modules = import.meta.glob('/public/articles/*.md', { as: 'raw' });
  
  const articleList = [];
  
  for (const [filePath, module] of Object.entries(modules)) {
    try {
      const content = typeof module === 'function' ? await module() : module;
      const article = parseMarkdown(content);
      const filename = filePath.split('/').pop() || '';
      articleList.push({
        ...article.metadata,
        content: article.content,
        slug: filename.replace('.md', '')
      });
    } catch (error) {
      console.warn(`Failed to load article: ${filePath}`, error);
    }
  }
  
  // 按日期排序（最新的在前）
  return articleList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}