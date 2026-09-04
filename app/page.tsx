import Link from 'next/link';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import Container from '@/components/ui/Container';
import AdSlot from '@/components/ads/AdSlot';
import { CALCULATOR_CATEGORIES, getAllCalculatorSlugs, getCalculatorBySlug } from '@/data/calculators/registry';
import { SITE_CONFIG } from '@/data/site';

export const metadata = {
  title: 'AI 前沿计算器 - 30+ 专业在线工具',
  description: 'AI 前沿计算器提供 30+ 免费在线计算工具，覆盖 AI 成本、编程开发、数学计算、金融财务、健康生活、文本工具等类别。公式透明，计算准确。',
};

const TOOLS_PER_PAGE = 12;

export default function HomePage() {
  const calculators = getAllCalculatorSlugs().map((slug) => getCalculatorBySlug(slug)!);
  const categories = CALCULATOR_CATEGORIES;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              {calculators.length} 个在线工具，全部免费使用
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
              {SITE_CONFIG.name}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
              {SITE_CONFIG.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/tools"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                浏览所有工具
              </Link>
              <Link
                href="#categories"
                className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                按分类查找
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Category Grid */}
      <section id="categories" className="py-12 sm:py-16">
        <Container>
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-white">工具分类</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const iconMap: Record<string, string> = {
                cpu: '⚡',
                code: '💻',
                sigma: '📐',
                dollar: '💰',
                heart: '❤️',
                type: '📝',
              };
              return (
                <Link
                  key={category.slug}
                  href={`/tools/category/${category.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center transition-all hover:shadow-lg hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-900"
                >
                  <span className="text-3xl mb-2">{iconMap[category.icon] || '🔧'}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {category.name}
                  </span>
                  <span className="mt-1 text-xs text-zinc-400">
                    {calculators.filter((c) => c.category === category.slug).length} 个工具
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Ad Slot */}
      <Container>
        <AdSlot slot="home-hero" format="horizontal" />
      </Container>

      {/* Featured Calculators */}
      <section className="py-12 sm:py-16 bg-white dark:bg-zinc-900">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">热门工具</h2>
            <Link href="/tools" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.slice(0, TOOLS_PER_PAGE).map((calculator) => (
              <CalculatorCard key={calculator.slug} calculator={calculator} />
            ))}
          </div>
        </Container>
      </section>

      {/* SEO Content */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">为什么选择 AI 前沿计算器？</h2>
            <div className="grid sm:grid-cols-3 gap-8 mt-10 text-left">
              {[
                { title: '公式透明', desc: '每个工具都展示计算公式，结果可验证，不隐藏逻辑。' },
                { title: '无需注册', desc: '所有工具开箱即用，无需登录、无需安装，浏览器直接打开。' },
                { title: '持续更新', desc: 'AI 工具价格实时追踪，费用计算器定期校准最新 API 报价。' },
              ].map((item) => (
                <div key={item.title}>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 dark:bg-blue-950">
                    <span className="text-xl">✓</span>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Footer Ad */}
      <Container>
        <AdSlot slot="home-footer" format="horizontal" />
      </Container>
    </div>
  );
}
