import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllCategories, getArticlesByCategory, getCategoryName, getCategoryDescription } from '@/lib/articles';
import { CATEGORIES } from '@/data/site';
import Container from '@/components/ui/Container';
import ArticleCard from '@/components/article/ArticleCard';
import Breadcrumbs from '@/components/article/Breadcrumbs';
import { SITE_CONFIG } from '@/data/site';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = getCategoryName(category);
  if (!name) return {};
  const description = getCategoryDescription(category);

  return {
    title: `${name} - 最新文章`,
    description: `${description} - AI前沿资讯`,
    alternates: { canonical: `/category/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const name = getCategoryName(category);
  if (!name) notFound();

  const description = getCategoryDescription(category);
  const articles = getArticlesByCategory(category);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: '首页', url: SITE_CONFIG.url },
          { name, url: `${SITE_CONFIG.url}/category/${category}` },
        ]}
      />
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">{name}</h1>
      {description && (
        <p className="mb-8 text-zinc-500">{description}</p>
      )}

      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-400 dark:border-zinc-700">
          该分类暂无文章，敬请期待。
        </div>
      )}
    </Container>
  );
}
