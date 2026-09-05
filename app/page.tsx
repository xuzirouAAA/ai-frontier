'use client';

import Link from 'next/link';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import Container from '@/components/ui/Container';
import AdSlot from '@/components/ads/AdSlot';
import { getAllCalculatorSlugs, getCalculatorBySlug } from '@/data/calculators/registry';
import { CALCULATOR_CATEGORIES } from '@/data/calculators/registry';
import { useI18n } from '@/components/i18n/LocaleProvider';
import { SITE_CONFIG } from '@/data/site';

const TOOLS_PER_PAGE = 12;

export default function HomePage() {
  const { t } = useI18n();
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
              {t('home.badge', undefined, { count: calculators.length })}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
              {t('home.title')}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
              {t('home.description', undefined, { count: calculators.length })}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/tools"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                {t('home.browseAll')}
              </Link>
              <a
                href="#categories"
                className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                {t('home.browseByCategory')}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Category Grid */}
      <section id="categories" className="py-12 sm:py-16">
        <Container>
          <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-white">
            {t('home.categoryTitle')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const iconMap: Record<string, string> = {
                cpu: '⚡', code: '💻', sigma: '📐',
                dollar: '💰', heart: '❤️', type: '📝',
              };
              return (
                <Link
                  key={category.slug}
                  href={`/tools/category/${category.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center transition-all hover:shadow-lg hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-900"
                >
                  <span className="text-3xl mb-2">{iconMap[category.icon] || '🔧'}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {t(`nav.categories.${category.slug}`)}
                  </span>
                  <span className="mt-1 text-xs text-zinc-400">
                    {t('home.toolsCount', undefined, { count: calculators.filter((c) => c.category === category.slug).length })}
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
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {t('home.featuredTitle')}
            </h2>
            <Link href="/tools" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              {t('common.viewAll')}
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
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
              {t('home.whyTitle')}
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 mt-10 text-left">
              {[
                { key: 'transparent' },
                { key: 'noRegister' },
                { key: 'updated' },
              ].map((item) => (
                <div key={item.key}>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 dark:bg-blue-950">
                    <span className="text-xl">✓</span>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                    {t(`home.whyItems.${item.key}.title`)}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t(`home.whyItems.${item.key}.desc`)}
                  </p>
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
