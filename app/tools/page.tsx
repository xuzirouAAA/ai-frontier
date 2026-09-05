'use client';

import Link from 'next/link';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import Container from '@/components/ui/Container';
import { CALCULATOR_CATEGORIES, getAllCalculatorSlugs, getCalculatorBySlug } from '@/data/calculators/registry';
import { useI18n } from '@/components/i18n/LocaleProvider';

const TOOLS_PER_PAGE = 9;

export default function ToolsPage() {
  const { t } = useI18n();
  const calculators = getAllCalculatorSlugs().map((slug) => getCalculatorBySlug(slug)!);
  const categories = CALCULATOR_CATEGORIES;

  return (
    <Container className="py-8 sm:py-12">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">{t('common.home')}</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 dark:text-white">{t('toolsPage.title')}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">{t('toolsPage.title')}</h1>
      <p className="mb-8 text-zinc-500">{t('toolsPage.subtitle')}</p>

      <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">{t('toolsPage.categoryTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const iconMap: Record<string, string> = {
              cpu: '⚡', code: '💻', sigma: '📐',
              dollar: '💰', heart: '❤️', type: '📝',
            };
            return (
              <div key={category.slug} className="bg-white rounded-xl border border-zinc-200 p-6 text-center transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-3xl mb-3">{iconMap[category.icon] || '🔧'}</div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {t(`nav.categories.${category.slug}`)}
                </h3>
                <p className="text-sm text-zinc-500">{category.description}</p>
                <Link
                  href={`/tools/category/${category.slug}`}
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  {t('common.viewAll')}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">{t('toolsPage.featuredTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.slice(0, TOOLS_PER_PAGE).map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-zinc-500">{t('home.footerNote')}</p>
      </div>
    </Container>
  );
}
