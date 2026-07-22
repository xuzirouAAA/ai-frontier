import type { Metadata } from 'next';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: '关于我们',
  description: '了解 AI 前沿资讯 - 专注AI与科技前沿的中文资讯站',
};

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-12">
      <article className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">关于我们</h1>

        <section className="space-y-4 text-zinc-600 dark:text-zinc-400">
          <p className="leading-relaxed">
            AI 前沿资讯是一家专注于人工智能和科技领域的中文资讯网站。
            我们致力于為中文读者提供最新、最深入的 AI 行业动态和技术解读。
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">我们的使命</h2>
          <p className="leading-relaxed">
            在 AI 技术快速迭代的时代，信息過载成为常态。我们的使命是從 X (Twitter) 等平台上的
            海量信息中，筛选出最有价值的内容，经过专业整理和深度解读，
            以高效的方式呈现給中文读者。
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">内容来源</h2>
          <p className="leading-relaxed">
            我们追踪 X 平台上 AI 领域最具影响力的专家、研究机构和技术先驱，
            实时捕获热门话题和突破性进展。每篇文章都经过人工审核和编辑，
            确保信息的准确性和可读性。
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">联系我们</h2>
          <p className="leading-relaxed">
            如有任何建议或合作意向，欢迎通过以下方式与我们联系：
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>邮件：contact@ai-frontier.example.com</li>
            <li>X (Twitter)：@ai_frontier</li>
          </ul>
        </section>
      </article>
    </Container>
  );
}
