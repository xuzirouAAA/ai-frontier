import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/data/site';
import { getCalculatorBySlug, CALCULATOR_CATEGORIES } from '@/data/calculators/registry';
import CalculatorDetailClient from './CalculatorDetailClient';

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

  // Pass calculator data to client component for i18n rendering
  return <CalculatorDetailClient calculator={calculator} />;
}
