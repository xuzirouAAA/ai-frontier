import type { Article } from '@/types/article';
import { formatDate } from '@/lib/utils';

interface ArticleMetaProps {
  article: Article;
}

export default function ArticleMeta({ article }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">{article.author.name}</span>
      <span className="text-zinc-300 dark:text-zinc-600">·</span>
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      {article.updatedAt && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <span>更新于 {formatDate(article.updatedAt)}</span>
        </>
      )}
      <span className="text-zinc-300 dark:text-zinc-600">·</span>
      <span>{article.readingTime} 分钟阅读</span>
    </div>
  );
}
