import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { SITE_CONFIG, CATEGORIES } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const staticPages = [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    ...CATEGORIES.map((cat) => ({
      url: `${SITE_CONFIG.url}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  const articlePages = articles.map((article) => ({
    url: `${SITE_CONFIG.url}/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...articlePages];
}
