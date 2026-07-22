import Link from 'next/link';
import type { Article } from '@/types/article';
import { formatDate } from '@/lib/utils';
import { CATEGORIES } from '@/data/site';
import Badge from '@/components/ui/Badge';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'hero';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const category = CATEGORIES.find((c) => c.slug === article.category);

  if (variant === 'hero') {
    return (
      <Link
        href={`/${article.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
          <div>
            <Badge href={`/category/${article.category}`}>{category?.name || article.category}</Badge>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-blue-600 sm:text-3xl dark:text-white dark:group-hover:text-blue-400">
              {article.title}
            </h2>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-500">
              {article.description}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
            <span>{article.author.name}</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>{article.readingTime} 分钟阅读</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${article.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-center gap-2">
        <Badge href={`/category/${article.category}`}>{category?.name || article.category}</Badge>
      </div>
      <h3 className="text-base font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
        {article.description}
      </p>
      <div className="mt-auto pt-4 flex items-center gap-3 text-xs text-zinc-400">
        <span>{formatDate(article.publishedAt)}</span>
        <span>{article.readingTime} 分钟</span>
      </div>
    </Link>
  );
}
