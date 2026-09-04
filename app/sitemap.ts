import { MetadataRoute } from 'next';
import { SITE_CONFIG, CATEGORIES } from '@/data/site';
import { getAllCalculatorSlugs, getCalculatorsByCategory } from '@/data/calculators/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugList = getAllCalculatorSlugs();
  const baseUrl = SITE_CONFIG.url;

  const calculatorPages = slugList.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const categoryPages = CATEGORIES.filter((c) => c.slug !== 'calculator').map((cat) => ({
    url: `${baseUrl}/tools/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/author`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  return [...staticPages, ...categoryPages, ...calculatorPages];
}
