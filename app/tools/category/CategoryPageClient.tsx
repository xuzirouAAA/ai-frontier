'use client';

import Link from 'next/link';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import Container from '@/components/ui/Container';
import { Calculator } from '@/types/calculator';
import { CalculatorCategory } from '@/types/calculator';
import { useI18n } from '@/components/i18n/LocaleProvider';

interface Props {
  category: string;
  categoryInfo: CalculatorCategory;
  calculators: Calculator[];
}

export default function CategoryPageClient({ categoryInfo, calculators }: Props) {
  const { t } = useI18n();

  return (
    <Container className="py-8 sm:py-12">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">{t('common.home')}</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 dark:text-white">{categoryInfo.name}</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">{categoryInfo.name}</h1>
      <p className="mb-8 text-zinc-500">{categoryInfo.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} />
        ))}
      </div>
    </Container>
  );
}
