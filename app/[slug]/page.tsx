import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllSlugs, getArticleBySlug, getCategoryName } from '@/lib/articles';
import { SITE_CONFIG } from '@/data/site';
import { buildArticleSchema, buildBreadcrumbSchema, renderJsonLd } from '@/lib/json-ld';
import Container from '@/components/ui/Container';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleSidebar from '@/components/article/ArticleSidebar';
import RelatedArticles from '@/components/article/RelatedArticles';
import AdSlot from '@/components/ads/AdSlot';
import AffiliateRecommendations from '@/components/affiliate/AffiliateRecommendations';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const categoryName = getCategoryName(article.category);

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      tags: article.tags,
      section: categoryName,
    },
    keywords: article.tags.join(', '),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const categoryName = getCategoryName(article.category);
  const articleSchema = buildArticleSchema(article);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: '首页', url: SITE_CONFIG.url },
    { name: categoryName, url: `${SITE_CONFIG.url}/category/${article.category}` },
    { name: article.title, url: `${SITE_CONFIG.url}/${article.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />

      <Container className="py-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          <article>
            <ArticleHeader article={article} />

            {/* 顶部横幅广告 */}
            <div className="mb-8">
              <AdSlot slot="article-top" format="horizontal" />
            </div>

            <ArticleContent
              content={article.content}
              affiliateProducts={article.affiliateProducts}
            />

            {/* 文末广告 */}
            <div className="my-8">
              <AdSlot slot="article-bottom" format="horizontal" />
            </div>

            {/* 联盟声明 */}
            <div className="rounded-lg bg-zinc-50 p-4 text-xs text-zinc-500 dark:bg-zinc-900">
              本文部分链接为推广链接，通过点击购买我们可能会获得少量佣金，但这不会影响您的购买价格。
            </div>

            <RelatedArticles current={article} />
          </article>

          <aside className="hidden space-y-6 lg:block">
            {/* 侧边栏联盟推荐 */}
            <AffiliateRecommendations category={article.category} />
            {/* 侧边栏广告 */}
            <AdSlot slot="sidebar" format="rectangle" />
          </aside>
        </div>
      </Container>
    </>
  );
}
