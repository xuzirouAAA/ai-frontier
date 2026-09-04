import Link from 'next/link';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/article/Breadcrumbs';
import { CALCULATOR_CATEGORIES, getAllCalculatorSlugs, getCalculatorBySlug } from '@/data/calculators/registry';

export default function HomePage() {
  const calculators = getAllCalculatorSlugs().map((slug) => getCalculatorBySlug(slug)!);
  const categories = CALCULATOR_CATEGORIES;

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: '首页', url: '/' },
        ]}
      />
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">计算器工具</h1>
      <p className="mb-8 text-zinc-500">AI 前沿计算器，提供 30+ 实用计算工具，覆盖 AI 成本、编程、数学、金融、健康等领域。</p>

      <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">按分类浏览</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const iconMap: Record<string, string> = {
              'cpu': '🤖',
              'code': '💻',
              'sigma': '📐',
              'dollar': '💰',
              'heart': '❤️',
              'type': '📝',
            };
            return (
              <div key={category.slug} className="bg-white rounded-xl border border-zinc-200 p-6 text-center transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-3xl mb-3">{iconMap[category.icon] || '🔧'}</div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{category.name}</h3>
                <p className="text-sm text-zinc-500">{category.description}</p>
                <Link
                  href={`/tools/category/${category.slug}`}
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  查看所有工具 →
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">热门推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.slice(0, 9).map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-zinc-500">
          本站提供免费计算器工具，所有计算基于公开公式。如需专业财务或医疗建议，请咨询专业人士。
        </p>
      </div>
    </Container>
  );
}
