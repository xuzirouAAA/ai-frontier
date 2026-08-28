export interface AffiliateProduct {
  name: string;
  url: string;
  description: string;
  category?: string;
  badge?: string;
}

export const AFFILIATE_LINKS: Record<string, AffiliateProduct> = {
  'cursor-pro': {
    name: 'Cursor Pro',
    url: 'https://www.cursor.com/',
    description: 'AI 编程助手，支持 Claude/GPT-4o 多模型',
    category: 'programming',
    badge: '热销',
  },
  'chatgpt-plus': {
    name: 'ChatGPT Plus',
    url: 'https://chatgpt.com/',
    description: 'OpenAI 高级订阅，优先访问 GPT-5',
    category: 'ai',
  },
  'claude-pro': {
    name: 'Claude Pro',
    url: 'https://claude.ai/',
    description: 'Anthropic 订阅，200K 上下文窗口',
    category: 'ai',
    badge: '推荐',
  },
  'github-copilot': {
    name: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'AI 代码补全，与 GitHub 深度集成',
    category: 'programming',
  },
  'runway-gen4': {
    name: 'Runway Gen-4',
    url: 'https://runwayml.com/',
    description: '专业 AI 视频生成与编辑平台',
    category: 'tools',
  },
  'notion-ai': {
    name: 'Notion AI',
    url: 'https://www.notion.com/product/ai',
    description: 'AI 增强的笔记与协作空间',
    category: 'tools',
  },
};

export function getAffiliateUrl(productSlug: string): string {
  return AFFILIATE_LINKS[productSlug]?.url || '#';
}

export function getAffiliateProductsByCategory(category: string): (AffiliateProduct & { slug: string })[] {
  return Object.entries(AFFILIATE_LINKS)
    .filter(([_, product]) => product.category === category)
    .map(([slug, product]) => ({ ...product, slug }));
}

export function getRelatedAffiliateProducts(articleCategory: string, limit = 3): (AffiliateProduct & { slug: string })[] {
  return getAffiliateProductsByCategory(articleCategory).slice(0, limit);
}

// 补上 slug 字段
export const AFFILIATE_LIST: (AffiliateProduct & { slug: string })[] = Object.entries(AFFILIATE_LINKS).map(
  ([slug, product]) => ({ ...product, slug })
);
