import type { Metadata } from 'next';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: '联系我们',
  description: '联系 AI 前沿资讯 - 如有建议、合作意向或问题，欢迎通过邮件与我们联系。',
};

export default function ContactPage() {
  return (
    <Container className="py-8 sm:py-12">
      <article className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">联系我们</h1>

        <section className="space-y-4 text-zinc-600 dark:text-zinc-400">
          <p className="leading-relaxed">
            感谢您访问 AI 前沿资讯。如果您对我们的内容有任何建议、发现错误，
            或希望进行商务合作，欢迎通过邮件与我们联系。
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">联系方式</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>邮件：xuzirou2@gmail.com</li>
          </ul>

          <p className="leading-relaxed">
            我们会在 2-3 个工作日内回复您的来信。如遇紧急问题，请在邮件标题中注明「紧急」。
          </p>
        </section>
      </article>
    </Container>
  );
}
