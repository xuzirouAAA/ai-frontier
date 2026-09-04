import CalculatorCard from '@/components/calculator/CalculatorCard';
import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/article/Breadcrumbs';
import { SITE_CONFIG } from '@/data/site';
import { CALCULATOR_CATEGORIES, getCalculatorsByCategory } from '@/data/calculators/registry';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CALCULATOR_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryInfo = CALCULATOR_CATEGORIES.find((c) => c.slug === category);
  const calculators = getCalculatorsByCategory(category);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: '首页', url: SITE_CONFIG.url },
          { name: categoryInfo?.name || '', url: `/tools/category/${category}` },
        ]}
      />
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">{categoryInfo?.name}</h1>
      <p className="mb-8 text-zinc-500">{categoryInfo?.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} />
        ))}
      </div>
    </Container>
  );
}
