import type { Metadata } from 'next';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: '隐私政策',
  description: 'AI 前沿资讯的隐私政策，说明我们如何收集、使用和保护您的个人信息。',
};

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <article className="prose prose-zinc mx-auto max-w-3xl dark:prose-invert">
        <h1>隐私政策</h1>
        <p className="text-sm text-zinc-500">最后更新：2026 年 7 月 22 日</p>

        <h2>1. 信息收集</h2>
        <p>
          当您访问 AI 前沿资讯（以下简称"本网站"）时，我们可能会收集以下类型的信息：
        </p>
        <ul>
          <li><strong>自动收集的信息：</strong>包括 IP 地址、浏览器类型、操作系统、访问时间、浏览页面等基本访问日志。</li>
          <li><strong>Cookie 和跟踪技术：</strong>我们使用 Google AdSense 和 Google Analytics，这些服务可能会在您的设备上放置 Cookie 以提供个性化广告和分析流量。</li>
        </ul>

        <h2>2. 信息使用</h2>
        <p>我们收集的信息用于以下目的：</p>
        <ul>
          <li>改善网站内容和用户体验</li>
          <li>展示个性化的 Google AdSense 广告</li>
          <li>分析网站流量和使用趋势（Google Analytics）</li>
          <li>遵守法律义务</li>
        </ul>

        <h2>3. Google AdSense</h2>
        <p>
          本网站使用 Google AdSense 展示广告。Google 作为第三方供应商，使用 Cookie 在本网站上投放广告。
          Google 使用 DART Cookie 根据用户对本网站和其他互联网网站的访问记录来投放广告。
        </p>
        <p>
          用户可以通过访问 <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google 广告设置页面</a> 选择退出个性化广告。
        </p>

        <h2>4. Google Analytics</h2>
        <p>
          本网站使用 Google Analytics 分析流量。Google Analytics 使用 Cookie 收集匿名访问数据，
          包括您访问本网站的频率、访问页面和来源网站等。这些数据用于改进网站内容和服务。
        </p>

        <h2>5. 第三方链接</h2>
        <p>
          本网站包含一些联盟营销链接（包括但不限于 Cursor、ChatGPT、Claude 等产品）。
          当您通过这些链接购买产品时，我们可能会获得佣金。这不影响您支付的价格。
        </p>

        <h2>6. 数据安全</h2>
        <p>
          我们采取合理的技术措施保护您的个人信息安全。但请注意，互联网上的数据传输不能保证 100% 安全。
        </p>

        <h2>7. 您的权利</h2>
        <p>您有权：</p>
        <ul>
          <li>要求删除我们收集的关于您的个人信息</li>
          <li>选择退出 Google 个性化广告</li>
          <li>通过浏览器设置禁用 Cookie</li>
        </ul>

        <h2>8. 联系我们</h2>
        <p>如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
        <p>
          邮箱：privacy@ai-frontier.vercel.app
        </p>

        <h2>9. 政策更新</h2>
        <p>
          我们可能会不时更新本隐私政策。重大变更时，我们会在网站上发布通知。
          建议您定期查看本页面以了解最新信息。
        </p>
      </article>
    </Container>
  );
}
