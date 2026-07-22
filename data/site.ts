export const SITE_CONFIG = {
  name: 'AI 前沿资讯',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-frontier-three.vercel.app',
  description: '专注AI与科技前沿的中文资讯站，为你精选最新AI工具、技术突破与行业动态',
  author: 'AI前沿团队',
  locale: 'zh-CN',
  defaultOgImage: '/og-image.svg',
  articlesPerPage: 12,
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || '',
} as const;

export const CATEGORIES = [
  { slug: 'ai', name: 'AI 人工智能', description: '人工智能最新进展、模型发布与技术分析' },
  { slug: 'tools', name: '工具推荐', description: '精选AI效率工具，提升工作与创作效率' },
  { slug: 'programming', name: '编程开发', description: 'AI辅助编程、开发框架与技术实践' },
  { slug: 'startup', name: '创业科技', description: 'AI创业公司与科技行业趋势洞察' },
] as const;
