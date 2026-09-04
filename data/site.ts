import { CALCULATOR_CATEGORIES } from './calculators/registry';

export const SITE_CONFIG = {
  name: 'AI 前沿计算器',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-frontier-three.vercel.app',
  description: 'AI 前沿计算器 - 30+ 专业工具，覆盖 AI 成本、编程、数学、金融、健康等计算需求',
  author: '徐梓柔',
  authorBio: 'AI 科技编辑，关注大模型、编程工具与 AI 创业动态。邮箱：xuzirou2@gmail.com',
  locale: 'zh-CN',
  defaultOgImage: '/og-image.svg',
  articlesPerPage: 12,
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || '',
  calculatorCategories: CALCULATOR_CATEGORIES,
} as const;

export const CATEGORIES = [
  { slug: 'calculator', name: '计算器', description: '所有计算器工具' },
  { slug: 'ai-cost', name: 'AI 成本', description: 'AI 模型、图片、视频、GPU 成本估算' },
  { slug: 'programming', name: '编程开发', description: 'JSON、Base64、正则、URL 等开发工具' },
  { slug: 'math', name: '数学计算', description: '百分比、单位转换、BMI 等日常计算' },
  { slug: 'finance', name: '金融财务', description: '贷款、汇率、工资、投资回报计算' },
  { slug: 'health', name: '健康生活', description: '卡路里、营养、孕产、年龄计算' },
  { slug: 'text', name: '文本工具', description: '字数、阅读时间、大小写转换' },
] as const;
