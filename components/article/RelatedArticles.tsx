import type { Article } from '@/types/article';
import { getRelatedArticles } from '@/lib/articles';
import ArticleCard from './ArticleCard';

interface RelatedArticlesProps {
  current: Article;
}

export default function RelatedArticles({ current }: RelatedArticlesProps) {
  const related = getRelatedArticles(current);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">相关文章</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
