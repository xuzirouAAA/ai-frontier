import type { Article } from '@/types/article';
import { CATEGORIES } from '@/data/site';
import fs from 'fs';
import path from 'path';

const articlesDirectory = path.join(process.cwd(), 'data/articles');

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) return [];

  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((fn) => fn.endsWith('.json'))
    .map((fn) => {
      const fullPath = path.join(articlesDirectory, fn);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as Article;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return articles;
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.json`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as Article;
  } catch {
    return null;
  }
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((a) => a.featured);
}

export function getRelatedArticles(current: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== current.slug && a.category === current.category)
    .slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

export function getAllCategories(): string[] {
  return [...new Set(getAllArticles().map((a) => a.category))];
}

export function getCategoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name || slug;
}

export function getCategoryDescription(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.description || '';
}

export function paginateArticles(
  articles: Article[],
  page: number,
  perPage: number
): { articles: Article[]; totalPages: number } {
  const totalPages = Math.ceil(articles.length / perPage);
  const start = (page - 1) * perPage;
  return {
    articles: articles.slice(start, start + perPage),
    totalPages,
  };
}
