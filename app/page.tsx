import { getAllArticles, getFeaturedArticles } from '@/lib/articles';
import Container from '@/components/ui/Container';
import ArticleCard from '@/components/article/ArticleCard';
import AdSlot from '@/components/ads/AdSlot';

export default function HomePage() {
  const allArticles = getAllArticles();
  const featured = getFeaturedArticles();
  const latest = allArticles.filter((a) => !a.featured);

  return (
    <Container className="py-8 sm:py-12">
      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-400">精选推荐</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {featured.slice(0, 2).map((article) => (
              <ArticleCard key={article.slug} article={article} variant="hero" />
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-400">最新文章</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article, index) => (
            <span key={article.slug}>
              <ArticleCard article={article} />
              {/* 每6篇文章插入一个广告 */}
              {index > 0 && (index + 1) % 6 === 0 && (
                <div className="col-span-full my-4">
                  <AdSlot slot="home-feed" format="horizontal" />
                </div>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Site Description for SEO */}
      <section className="mt-16 rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">关于 AI 前沿资讯</h2>
        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
          AI 前沿资讯致力于为中文读者提供最新、最深入的 AI 和科技资讯。
          我们追踪 X (Twitter) 平台上的热门 AI 话题，精选最有价值的內容，
          以专业视角为您解读人工智能领域的最新突破、工具推荐和行业趋势。
          无论你是 AI 从业者、科技爱好者还是数字化转型的决策者，
          这里都有你需要的深度内容。
        </p>
      </section>
    </Container>
  );
}
