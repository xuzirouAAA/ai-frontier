import Link from 'next/link';
import { CATEGORIES } from '@/data/site';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">AI 前沿计算器</h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              提供 30+ 专业计算器工具，覆盖 AI 成本、编程开发、数学计算、金融财务、健康生活等领域。
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">工具分类</h3>
            <ul className="space-y-2">
              {CATEGORIES.filter((c) => c.slug !== 'calculator').map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tools/category/${cat.slug}`}
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
                  href="/author"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  关于作者
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
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  联系我们
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  服务条款
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          <p>本站提供免费在线计算器工具，计算结果仅供参考，不构成专业建议。</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} AI 前沿计算器. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
