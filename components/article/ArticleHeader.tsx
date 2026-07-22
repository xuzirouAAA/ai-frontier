import type { Article } from '@/types/article';
import Breadcrumbs from './Breadcrumbs';
import ArticleMeta from './ArticleMeta';
import Badge from '@/components/ui/Badge';
import { CATEGORIES } from '@/data/site';
import { SITE_CONFIG } from '@/data/site';

interface ArticleHeaderProps {
  article: Article;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const category = CATEGORIES.find((c) => c.slug === article.category);

  const breadcrumbs = [
    { name: '首页', url: SITE_CONFIG.url },
    { name: category?.name || article.category, url: `${SITE_CONFIG.url}/category/${article.category}` },
    { name: article.title, url: `${SITE_CONFIG.url}/${article.slug}` },
  ];

  return (
    <header className="mb-8">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mb-4">
        <Badge href={`/category/${article.category}`}>{category?.name || article.category}</Badge>
      </div>
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        {article.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-zinc-500">
        {article.description}
      </p>
      <div className="mt-4">
        <ArticleMeta article={article} />
      </div>
      {article.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}
    </header>
  );
}
