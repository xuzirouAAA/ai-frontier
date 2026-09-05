'use client';

import Link from 'next/link';
import { Calculator } from '@/types/calculator';
import { CALCULATOR_CATEGORIES, getRelatedCalculators } from '@/data/calculators/registry';
import CalculatorShell from '@/components/calculator/CalculatorShell';
import Container from '@/components/ui/Container';
import { useI18n } from '@/components/i18n/LocaleProvider';

interface Props {
  calculator: Calculator;
}

export default function CalculatorDetailClient({ calculator }: Props) {
  const { t } = useI18n();
  const categoryInfo = CALCULATOR_CATEGORIES.find((c) => c.slug === calculator.category);
  const related = getRelatedCalculators(calculator.slug);

  return (
    <Container className="py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">{t('common.home')}</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/tools/category/${calculator.category}`}
          className="hover:text-zinc-900 dark:hover:text-white"
        >
          {categoryInfo?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 dark:text-white">{calculator.title}</span>
      </nav>

      {/* Title */}
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">{calculator.title}</h1>
      <p className="mb-8 text-zinc-500">{calculator.description}</p>

      {/* Calculator Shell */}
      <CalculatorShell calculator={calculator} />

      {/* Formula Explanation */}
      <div className="mt-8 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">{t('calculator.formula')}</h2>
        <p className="font-mono text-sm text-zinc-600 dark:text-zinc-300">{calculator.formula}</p>
        <p className="mt-3 text-sm text-zinc-500">
          {t('calculator.disclaimer')}
        </p>
      </div>

      {/* Examples */}
      {calculator.examples && calculator.examples.length > 0 && (
        <div className="mt-8 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">{t('calculator.examples')}</h2>
          <div className="space-y-3">
            {calculator.examples.map((ex, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="font-semibold text-zinc-900 dark:text-white">{ex.label}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('calculator.result')}: {ex.output}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {calculator.faq && calculator.faq.length > 0 && (
        <div className="mt-8 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">{t('calculator.faqTitle')}</h2>
          <div className="space-y-4">
            {calculator.faq.map((item, i) => (
              <div key={i} className="border-b border-zinc-200 pb-4 last:border-0 dark:border-zinc-700">
                <h3 className="font-semibold text-zinc-900 dark:text-white">{item.question}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Calculators */}
      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">{t('calculator.relatedTitle')}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((calc) => (
              <Link
                key={calc.slug}
                href={`/tools/${calc.slug}`}
                className="rounded-xl border border-zinc-200 p-4 transition-all hover:shadow-md dark:border-zinc-700"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-white">{calc.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO Description */}
      <div className="mt-12 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
          {t('pages.about')}{calculator.title}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {calculator.description}
          {calculator.formula ? ` ${t('calculator.formula')}：${calculator.formula}。` : ''}
          {categoryInfo?.description ? ` ${categoryInfo.description}。` : ''}
        </p>
      </div>
    </Container>
  );
}
