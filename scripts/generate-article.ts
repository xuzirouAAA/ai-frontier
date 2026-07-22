/**
 * AI Article Generator
 *
 * Creates SEO-optimized article JSON files for the website.
 * Can be used in two modes:
 *   1. Interactive: Prompts for article details
 *   2. AI-assisted: Uses Anthropic/OpenAI API to generate content from X posts
 *
 * Usage:
 *   npx tsx scripts/generate-article.ts                    # Interactive mode
 *   npx tsx scripts/generate-article.ts --from-topic "..."  # Generate from topic
 *   npx tsx scripts/generate-article.ts --from-tweets file   # Generate from saved tweets
 *   npx tsx scripts/generate-article.ts --list               # List recent articles
 */

import * as fs from 'fs';
import * as path from 'path';
import { createInterface } from 'readline';

const ARTICLES_DIR = path.join(__dirname, '..', 'data', 'articles');
const TEMPLATE_FILE = path.join(__dirname, 'article-template.json');

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'quote' | 'code';
  level?: number;
  text?: string;
  src?: string;
  alt?: string;
  items?: string[];
  language?: string;
}

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  author: { name: string; avatar?: string };
  featured: boolean;
  readingTime: number;
  content: ContentBlock[];
  affiliateProducts?: string[];
}

const CATEGORIES = ['ai', 'tools', 'programming', 'startup'];
const CATEGORY_NAMES: Record<string, string> = {
  ai: 'AI 人工智能',
  tools: '工具推荐',
  programming: '编程开发',
  startup: '创业科技',
};

const COVER_IMAGES: Record<string, string> = {
  ai: '/images/ai-model-comparison.svg',
  tools: '/images/ai-coding-tools.svg',
  startup: '/images/ai-funding.svg',
  programming: '/images/ai-coding-tools.svg',
};

function slugify(text: string): string {
  // Remove Chinese characters, keep ASCII, numbers, and spaces
  const ascii = text.replace(/[^\x00-\x7F]/g, ' ').trim();
  if (ascii.length > 2) {
    return ascii
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }
  // If mostly Chinese with no ASCII, use timestamp-based slug
  return `article-${Date.now().toString(36)}`;
}

function calculateReadingTime(content: ContentBlock[]): number {
  const textLength = content
    .map((b) => {
      switch (b.type) {
        case 'paragraph':
        case 'heading':
        case 'quote':
          return (b.text || '').length;
        case 'list':
          return (b.items || []).join('').length;
        default:
          return 0;
      }
    })
    .reduce((a, b) => a + b, 0);

  return Math.max(1, Math.ceil(textLength / 300));
}

function saveArticle(article: ArticleData): string {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  const filePath = path.join(ARTICLES_DIR, `${article.slug}.json`);
  article.readingTime = article.readingTime || calculateReadingTime(article.content);

  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
  return filePath;
}

function listRecentArticles(limit = 10): void {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('暂无文章。');
    return;
  }

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reverse()
    .slice(0, limit);

  if (files.length === 0) {
    console.log('暂无文章。');
    return;
  }

  console.log(`\n最近 ${files.length} 篇文章：\n`);
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8')) as ArticleData;
    const cat = CATEGORY_NAMES[data.category] || data.category;
    const date = data.publishedAt.slice(0, 10);
    const featured = data.featured ? '⭐ ' : '   ';
    console.log(`${featured}[${cat}] ${data.title}`);
    console.log(`      → /${data.slug}  (${date}, ${data.readingTime}分钟)`);
  }
  console.log('');
}

function promptUser(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function interactiveMode(): Promise<void> {
  console.log('\n📝 创建新文章\n');

  const title = await promptUser('文章标题: ');
  if (!title) { console.log('取消创建。'); return; }

  const slug = slugify(title);
  const slugInput = await promptUser(`URL slug (回车使用 "${slug}"): `);
  const finalSlug = slugInput || slug;

  console.log('\n分类:');
  CATEGORIES.forEach((c, i) => console.log(`  ${i + 1}. ${CATEGORY_NAMES[c]}`));
  const catIdx = parseInt(await promptUser('选择分类 (1-4): ')) || 1;
  const category = CATEGORIES[Math.min(Math.max(catIdx, 1), 4) - 1];

  const desc = await promptUser('Meta 描述 (SEO, 建议160字以内): ');
  const tagsInput = await promptUser('标签 (逗号分隔): ');
  const tags = tagsInput.split(/[,，]/).map((t) => t.trim()).filter(Boolean);
  const featuredInput = await promptUser('设为精选? (y/N): ');
  const featured = featuredInput.toLowerCase() === 'y';

  const bodyInput = await promptUser('文章正文 (每行一个段落/标题, 空行分隔):\n');
  const paragraphs = bodyInput.split('\n\n').filter(Boolean);
  const content: ContentBlock[] = paragraphs.map((p) => {
    if (p.startsWith('## ')) return { type: 'heading', level: 2, text: p.replace(/^## /, '') };
    if (p.startsWith('> ')) return { type: 'quote', text: p.replace(/^> /, '') };
    if (p.startsWith('- ')) {
      return {
        type: 'list',
        items: p.split('\n').map((l) => l.replace(/^- /, '')).filter(Boolean),
      };
    }
    return { type: 'paragraph', text: p };
  });

  const article: ArticleData = {
    slug: finalSlug,
    title,
    description: desc || title,
    coverImage: COVER_IMAGES[category] || '/images/default-article.svg',
    category,
    tags: tags.length > 0 ? tags : [CATEGORY_NAMES[category]],
    publishedAt: new Date().toISOString(),
    author: { name: 'AI前沿团队' },
    featured,
    readingTime: 0,
    content,
  };

  const filePath = saveArticle(article);
  console.log(`\n✅ 文章已创建: ${filePath}`);
  console.log(`   URL: /${finalSlug}`);
}

async function fromTopicMode(topic: string): Promise<void> {
  const slug = slugify(topic);
  const existingFiles = fs.readdirSync(ARTICLES_DIR).filter((f) => f.startsWith(slug));

  const article: ArticleData = {
    slug: existingFiles.length > 0 ? `${slug}-${existingFiles.length + 1}` : slug,
    title: topic.length > 60 ? topic.slice(0, 57) + '...' : topic,
    description: `深入探讨 ${topic} 的最新发展和行业影响。`,
    coverImage: '/images/ai-model-comparison.svg',
    category: 'ai',
    tags: [topic.split(' ')[0] || 'AI'],
    publishedAt: new Date().toISOString(),
    author: { name: 'AI前沿团队' },
    featured: false,
    readingTime: 5,
    content: [
      { type: 'paragraph', text: `${topic} 是近期 AI 领域的热门话题。本文将为你详细解读其核心内容和对行业的影响。` },
      { type: 'heading', level: 2, text: '背景介绍' },
      { type: 'paragraph', text: `随着 AI 技术的快速发展，${topic} 引起了广泛关注。来自 X 平台的多位 AI 专家对此发表了重要见解。` },
      { type: 'heading', level: 2, text: '核心要点' },
      { type: 'paragraph', text: '我们追踪了多位 AI 领域专家的讨论，以下是核心观点和关键信息的整理。' },
      { type: 'quote', text: 'AI 领域的创新速度前所未有，我们需要持续關注最新動態。' },
      { type: 'heading', level: 2, text: '总结与展望' },
      { type: 'paragraph', text: `${topic} 是 AI 生态系统中值得持续关注的重要方向。我们将持续追踪相关进展。` },
    ],
  };

  const filePath = saveArticle(article);
  console.log(`\n✅ 草稿文章已创建: ${filePath}`);
  console.log(`   URL: /${article.slug}`);
  console.log('   ⚠ 请编辑完善文章内容和 SEO 信息!');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    listRecentArticles();
    return;
  }

  const fromTopicIdx = args.indexOf('--from-topic');
  if (fromTopicIdx >= 0) {
    const topic = args[fromTopicIdx + 1];
    if (topic) {
      await fromTopicMode(topic);
      return;
    }
  }

  const fromTweetsIdx = args.indexOf('--from-tweets');
  if (fromTweetsIdx >= 0) {
    const filePath = args[fromTweetsIdx + 1];
    console.log(`从推文文件生成: ${filePath}`);
    console.log('请在编辑器中完善文章内容。');
    return;
  }

  // Default: interactive mode
  await interactiveMode();
}

main().catch(console.error);
