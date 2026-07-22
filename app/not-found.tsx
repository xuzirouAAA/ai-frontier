import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className="flex flex-1 items-center justify-center py-20">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-zinc-200 dark:text-zinc-700">404</h1>
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">页面未找到</h2>
        <p className="mb-8 text-zinc-500">抱歉，您访问的页面不存在或已被移除。</p>
        <Link
          href="/"
          className="inline-flex rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          返回首页
        </Link>
      </div>
    </Container>
  );
}
