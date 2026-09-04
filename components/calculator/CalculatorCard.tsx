import Link from 'next/link';
import { Calculator } from '@/types/calculator';
import Badge from '@/components/ui/Badge';
import { CALCULATOR_CATEGORIES } from '@/data/calculators/registry';

interface CalculatorCardProps {
  calculator: Calculator;
}

export default function CalculatorCard({ calculator }: CalculatorCardProps) {
  const categoryInfo = CALCULATOR_CATEGORIES.find((c) => c.slug === calculator.category);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <Badge href={`/tools/category/${calculator.category}`}>{categoryInfo?.name}</Badge>
      </div>
      <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
        <Link href={`/tools/${calculator.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
          {calculator.title}
        </Link>
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        {calculator.description}
      </p>
      <div className="mb-4">
        <p className="text-xs text-zinc-400 mb-1">公式：</p>
        <p className="text-sm font-mono text-zinc-600 dark:text-zinc-300">{calculator.formula}</p>
      </div>
      <div className="mb-4">
        <p className="text-xs text-zinc-400 mb-1">示例：</p>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          {calculator.examples?.slice(0, 2).map((ex, i) => (
            <div key={i} className="mb-1">
              <span className="font-semibold">{ex.label}：</span>
              <span>{ex.output}</span>
            </div>
          ))}
        </div>
      </div>
      <Link
        href={`/tools/${calculator.slug}`}
        className="block w-full rounded-lg bg-blue-600 py-2 px-4 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        使用计算器
      </Link>
    </div>
  );
}
