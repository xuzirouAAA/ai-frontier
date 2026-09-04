import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CALCULATOR_CATEGORIES, getCalculatorsByCategory } from '@/data/calculators/registry';
import CategoryPageClient from './CategoryPageClient';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CALCULATOR_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = CALCULATOR_CATEGORIES.find((c) => c.slug === category);
  return {
    title: categoryInfo?.name || category,
    alternates: { canonical: `/tools/category/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryInfo = CALCULATOR_CATEGORIES.find((c) => c.slug === category);
  if (!categoryInfo) notFound();

  const calculators = getCalculatorsByCategory(category);
  return <CategoryPageClient category={category} categoryInfo={categoryInfo} calculators={calculators} />;
}
