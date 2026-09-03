import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { SITE_CONFIG } from '@/data/site';

export const metadata: Metadata = {
  title: '关于作者',
  description: '了解 AI 前沿资讯的编辑徐梓柔',
};

export default function AuthorPage() {
  return (
    <Container className="py-8 sm:py-12">
      <article className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">关于作者</h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            徐
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">徐梓柔</h2>
            <p className="text-sm text-zinc-500">AI 科技编辑</p>
          </div>
        </div>

        <section className="space-y-4 text-zinc-600 dark:text-zinc-400">
          <p className="leading-relaxed">
            我是徐梓柔，一名专注于人工智能领域的科技编辑。我运营 AI 前沿资讯，
            致力于为中文读者筛选、整理和解读 AI 领域最重要的技术突破、工具更新和行业动态。
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">编辑理念</h2>
          <p className="leading-relaxed">
            在 AI 信息爆炸的时代，我关注的是那些真正有技术深度和实用价值的进展。
            每篇文章都经过人工筛选和编辑，力求准确、简洁、有洞察力。
            我的目标是帮助读者在最短时间内理解 AI 技术的核心要点和实际影响。
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">关注领域</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>大语言模型（LLM）进展与对比</li>
            <li>AI 编程工具与开发者体验</li>
            <li>AI 创业公司与投融资动态</li>
            <li>多模态 AI 与创意工具</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">联系方式</h2>
          <p className="leading-relaxed">
            如有建议、合作意向或发现文章错误，欢迎通过
            <a href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">联系我们</a>
            页面与我联系，或直接发送邮件至
            <a href="mailto:xuzirou2@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">xuzirou2@gmail.com</a>。
          </p>
        </section>
      </article>
    </Container>
  );
}
