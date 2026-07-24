import Link from 'next/link';
import { CATEGORIES } from '@/data/site';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">AI 前沿资讯</h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              专注AI与科技前沿的中文资讯站，为你精选最新AI工具、技术突破与行业动态。
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">分类</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">关于</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  关于我们
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          &copy; {new Date().getFullYear()} AI 前沿资讯. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
