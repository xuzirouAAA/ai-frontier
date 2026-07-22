import { getRelatedAffiliateProducts } from '@/lib/affiliate';
import AffiliateLink from './AffiliateLink';

interface AffiliateRecommendationsProps {
  category: string;
}

/**
 * 联盟产品推荐组件
 * 根据文章分类展示相关的推荐产品
 */
export default function AffiliateRecommendations({ category }: AffiliateRecommendationsProps) {
  const products = getRelatedAffiliateProducts(category);

  if (products.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        推荐工具
      </h3>
      <div className="space-y-3">
        {products.map((product) => (
          <AffiliateLink
            key={product.slug}
            productSlug={product.slug}
            className="block rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {product.name}
                </span>
                <p className="mt-0.5 text-xs text-zinc-500">{product.description}</p>
              </div>
              {product.badge && (
                <span className="ml-2 shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {product.badge}
                </span>
              )}
            </div>
          </AffiliateLink>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-zinc-400">
        通过上述链接购买，我们可能会获得佣金
      </p>
    </div>
  );
}
