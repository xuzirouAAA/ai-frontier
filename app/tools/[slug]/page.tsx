import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/data/site';
import { getCalculatorBySlug, getRelatedCalculators } from '@/data/calculators/registry';
import { CALCULATOR_CATEGORIES } from '@/data/calculators/registry';
import CalculatorShell from '@/components/calculator/CalculatorShell';
import Container from '@/components/ui/Container';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllCalculatorSlugs } = await import('@/data/calculators/registry');
  return getAllCalculatorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) return {};

  const categoryInfo = CALCULATOR_CATEGORIES.find((c) => c.slug === calculator.category);

  return {
    title: `${calculator.title} - ${categoryInfo?.name || ''}`,
    description: calculator.description,
    alternates: { canonical: `/tools/${calculator.slug}` },
    openGraph: {
      title: calculator.title,
      description: calculator.description,
      type: 'article',
    },
  };
}

export default async function CalculatorDetailPage({ params }: Props) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) notFound();

  const categoryInfo = CALCULATOR_CATEGORIES.find((c) => c.slug === calculator.category);
  const related = getRelatedCalculators(slug);

  return (
    <Container className="py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">首页</Link>
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
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">计算公式</h2>
        <p className="font-mono text-sm text-zinc-600 dark:text-zinc-300">{calculator.formula}</p>
        <p className="mt-3 text-sm text-zinc-500">
          本计算器基于公开公式计算，实际结果可能因具体情况而有所不同。如有专业需求，请咨询专业人士。
        </p>
      </div>

      {/* Examples */}
      {calculator.examples && calculator.examples.length > 0 && (
        <div className="mt-8 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">使用示例</h2>
          <div className="space-y-3">
            {calculator.examples.map((ex, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="font-semibold text-zinc-900 dark:text-white">{ex.label}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">结果：{ex.output}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {calculator.faq && calculator.faq.length > 0 && (
        <div className="mt-8 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">常见问题</h2>
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
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">相关计算器</h2>
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

      {/* SEO Description for Search Engines */}
      <div className="mt-12 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">关于{calculator.title}</h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {calculator.description}
          {calculator.formula ? ` 该工具使用公式：${calculator.formula}。` : ''}
          适用于{categoryInfo?.description}等场景。
        </p>
      </div>
    </Container>
  );
}
