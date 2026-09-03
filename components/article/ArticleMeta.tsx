import type { Article } from '@/types/article';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ArticleMetaProps {
  article: Article;
}

export default function ArticleMeta({ article }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
      {article.author.avatar ? (
        <img src={article.author.avatar} alt={article.author.name} className="h-5 w-5 rounded-full" />
      ) : null}
      <Link href="/author" className="font-medium text-zinc-700 hover:underline dark:text-zinc-300">
        {article.author.name}
      </Link>
      <span className="text-zinc-300 dark:text-zinc-600">·</span>
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      {article.updatedAt && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <span>更新于 {formatDate(article.updatedAt)}</span>
        </>
      )}
      {article.lastVerified && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <span>校验于 {formatDate(article.lastVerified)}</span>
        </>
      )}
      <span className="text-zinc-300 dark:text-zinc-600">·</span>
      <span>{article.readingTime} 分钟阅读</span>
    </div>
  );
}
