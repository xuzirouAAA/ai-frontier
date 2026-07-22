/**
 * AI 自动写作引擎
 *
 * 支持 Agnes AI（OpenAI 兼容）和 Anthropic Claude 两种后端。
 * 通过环境变量 AI_PROVIDER 切换。
 *
 * 用法:
 *   npx tsx scripts/ai-writer.ts                                # 手动输入话题
 *   npx tsx scripts/ai-writer.ts --topic "Llama 4 发布"        # 指定话题
 *   npx tsx scripts/ai-writer.ts --auto                         # 自动发现热点并写作
 *   npx tsx scripts/ai-writer.ts --publish                      # 生成后自动 git push
 *
 * 环境变量:
 *   AI_PROVIDER          - agnes | anthropic（默认 agnes）
 *   AGNES_API_KEY        - Agnes AI API 密钥（AI_PROVIDER=agnes 时必需）
 *   AGNES_MODEL          - Agnes 模型名（默认 agnes-2.0-flash）
 *   ANTHROPIC_API_KEY    - Claude API 密钥（AI_PROVIDER=anthropic 时必需）
 *   ANTHROPIC_MODEL      - Claude 模型名（默认 claude-sonnet-4-20250514）
 */

import * as fs from 'fs';
import * as path from 'path';

// 手动加载 .env.local（dotenv 默认只加载 .env）
import dotenv from 'dotenv';
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// ─── 配置 ───────────────────────────────────────────────────────

const ARTICLES_DIR = path.join(__dirname, '..', 'data', 'articles');
const ACCOUNTS_FILE = path.join(__dirname, 'ai-accounts.json');

const AI_PROVIDER = (process.env.AI_PROVIDER || 'agnes').toLowerCase();
const AGNES_API_KEY = process.env.AGNES_API_KEY || '';
const AGNES_MODEL = process.env.AGNES_MODEL || 'agnes-2.0-flash';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

interface ArticleJSON {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: { name: string };
  featured: boolean;
  readingTime: number;
  content: Array<{
    type: string;
    level?: number;
    text?: string;
    items?: string[];
  }>;
  affiliateProducts?: string[];
}

// ─── 工具函数 ──────────────────────────────────────────────────

function slugify(text: string): string {
  const ascii = text.replace(/[^\x00-\x7F]/g, ' ').trim();
  if (ascii.length > 2) {
    return ascii
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }
  return `article-${Date.now().toString(36)}`;
}

function loadAccounts() {
  try {
    const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { accounts: [], searchKeywords: [] };
  }
}

function getExistingTitles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')).title;
      } catch { return ''; }
    })
    .filter(Boolean);
}

function getCoverForCategory(category: string): string {
  const covers: Record<string, string> = {
    ai: '/images/ai-model-comparison.svg',
    tools: '/images/ai-coding-tools.svg',
    startup: '/images/ai-funding.svg',
    programming: '/images/ai-coding-tools.svg',
  };
  return covers[category] || '/images/default-article.svg';
}

function parseArticleJSON(text: string, debugTag: string): Record<string, unknown> {
  let jsonStr = text;

  // 提取 ```json ``` 包裹的内容
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1].trim();

  // 提取第一个 { 到最后一个 } 之间的内容
  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  // 尝试直接解析
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // JSON 解析失败——保存原始内容以便调试
    const debugFile = path.join(__dirname, '..', 'data', `_debug_${debugTag}.txt`);
    fs.writeFileSync(debugFile, text, 'utf8');
    throw new Error(`JSON 解析失败，已保存调试文件 ${debugFile}: ${e}`);
  }
}

// ─── 系统提示词 ────────────────────────────────────────────────

function buildSystemPrompt(): string {
  const existingTitles = getExistingTitles();
  return `你是一位专业的中文 AI 科技编辑，擅长撰写 SEO 优化的中文技术文章。

写作要求：
1. 文章语言：简体中文，专业但不晦涩
2. 标题 ≤ 50 字，包含核心关键词
3. 描述 ≤ 150 字，吸引点击，包含关键词
4. 正文 1000-1500 字，分 3-5 个小标题（h2/h3）
5. 内容结构：引言 → 背景 → 核心分析 → 要点总结 → 展望
6. 每篇包含 1 个引用块（quote）和 1 个列表（list）
7. 标签 3-5 个
8. 确保事实准确，不编造数据
9. 不要写和以下已有文章标题重复的内容：${existingTitles.join('、') || '（无）'}
10. 分类可选：ai（AI人工智能）、tools（工具推荐）、programming（编程开发）、startup（创业科技）

你必须输出严格的 JSON 格式，不要包含任何其他文字。

重要——JSON 格式要求：
- 所有字符串必须使用双引号，不能使用单引号
- 字符串中的引号必须转义（\\"）
- 不要在字符串值中使用未转义的换行符（\\n 表示换行）
- 输出纯 JSON，不要用 markdown 代码块包裹
- 不要添加任何注释

JSON 格式如下：
{
  "title": "文章标题",
  "description": "SEO 描述",
  "category": "分类slug",
  "tags": ["标签1", "标签2"],
  "featured": false,
  "readingTime": 8,
  "content": [
    { "type": "paragraph", "text": "段落文字" },
    { "type": "heading", "level": 2, "text": "小标题" },
    { "type": "list", "items": ["项目1", "项目2"] },
    { "type": "quote", "text": "引用内容" }
  ],
  "affiliateProducts": []
}

关于联盟产品（affiliateProducts），如果文章内容涉及以下产品，可以添加对应 slug（最多 2 个，只在与内容相关时使用）：
- cursor-pro: Cursor AI 编程工具
- chatgpt-plus: ChatGPT Plus
- claude-pro: Claude Pro
- github-copilot: GitHub Copilot
- runway-gen4: Runway Gen-4 视频生成
- notion-ai: Notion AI`;
}

// ─── AI 提供商适配层 ──────────────────────────────────────────

async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  if (AI_PROVIDER === 'anthropic') {
    return callAnthropic(systemPrompt, userMessage);
  }
  return callAgnes(systemPrompt, userMessage);
}

/** Agnes AI（OpenAI 兼容） */
async function callAgnes(systemPrompt: string, userMessage: string): Promise<string> {
  if (!AGNES_API_KEY) {
    throw new Error('请设置 AGNES_API_KEY 环境变量（在 .env.local 中添加）');
  }

  const { default: OpenAI } = await import('openai');

  const client = new OpenAI({
    apiKey: AGNES_API_KEY,
    baseURL: 'https://apihub.agnes-ai.com/v1',
  });

  const resp = await client.chat.completions.create({
    model: AGNES_MODEL,
    max_tokens: 8192,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });

  const text = resp.choices?.[0]?.message?.content;
  if (!text) throw new Error('Agnes AI 返回内容为空');
  return text;
}

/** Anthropic Claude */
async function callAnthropic(systemPrompt: string, userMessage: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('请设置 ANTHROPIC_API_KEY 环境变量（在 .env.local 中添加）');
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk');

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const msg = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
  if (!text) throw new Error('Anthropic 返回内容为空');
  return text;
}

// ─── 文章生成 ──────────────────────────────────────────────────

async function generateArticle(topic: string, contextTweets: string[] = []): Promise<ArticleJSON> {
  const systemPrompt = buildSystemPrompt();
  const existingSlugs = new Set(
    fs.existsSync(ARTICLES_DIR)
      ? fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
      : []
  );

  const tweetContext = contextTweets.length > 0
    ? `\n\n以下是 X 平台上关于此话题的相关讨论，请参考这些信息撰写文章：\n${contextTweets.join('\n---\n')}`
    : '';

  const userMessage = `请根据以下话题撰写一篇 SEO 优化的中文文章：\n\n话题：${topic}\n${tweetContext}\n\n注意：\n1. 只输出 JSON，不要包含任何其他文字\n2. 标题控制在 50 字以内\n3. 描述（description）控制在 150 字以内\n4. 正文 1000-1500 字\n5. 分类要合理\n6. 如果话题和 AI/科技无关，请适当调整为 AI 科技视角`;

  const text = await callAI(systemPrompt, userMessage);
  const debugTag = slugify(topic).slice(0, 30) || 'article';
  const parsed = parseArticleJSON(text, debugTag);

  let slug = slugify(parsed.title as string);
  if (existingSlugs.has(slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  return {
    slug,
    title: (parsed.title as string) || topic,
    description: (parsed.description as string) || topic,
    coverImage: getCoverForCategory(parsed.category as string),
    category: (parsed.category as string) || 'ai',
    tags: (parsed.tags as string[]) || ['AI'],
    publishedAt: new Date().toISOString(),
    author: { name: 'AI前沿团队' },
    featured: (parsed.featured as boolean) || false,
    readingTime: (parsed.readingTime as number) || 8,
    content: (parsed.content as ArticleJSON['content']) || [],
    affiliateProducts: (parsed.affiliateProducts as string[]) || [],
  };
}

// ─── 保存文章 ──────────────────────────────────────────────────

function saveArticle(article: ArticleJSON): string {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }
  const filePath = path.join(ARTICLES_DIR, `${article.slug}.json`);
  if (fs.existsSync(filePath)) {
    article.slug = `${article.slug}-${Date.now().toString(36).slice(-4)}`;
  }
  const finalPath = path.join(ARTICLES_DIR, `${article.slug}.json`);
  fs.writeFileSync(finalPath, JSON.stringify(article, null, 2), 'utf8');
  return finalPath;
}

// ─── 热点发现 ──────────────────────────────────────────────────

async function discoverTopics(): Promise<string[]> {
  const accounts = loadAccounts();
  const keywords: string[] = accounts.searchKeywords || [];
  const topics: string[] = [];

  for (const kw of keywords.slice(0, 5)) {
    try {
      const searchScript = path.join(
        process.env.HOME || process.env.USERPROFILE || '~',
        '.claude/skills/x-tweet-fetcher/scripts'
      );
      const cmd = `python3 "${path.join(searchScript, 'x_discover.py')}" --keywords "${kw}" --limit 3 --json 2>/dev/null`;
      const { execSync } = await import('child_process');
      const output = execSync(cmd, { encoding: 'utf8', timeout: 15000 });
      const results = JSON.parse(output);
      if (Array.isArray(results)) {
        results.forEach((r: { title?: string }) => {
          if (r.title) topics.push(r.title);
        });
      }
    } catch { /* 跳过 */ }
  }

  if (topics.length === 0) {
    topics.push(
      '2025年最新AI突破性进展',
      'AI编程工具重磅更新',
      'AI创业公司获得大额融资',
      '大语言模型性能对比最新结果',
      'AI视频生成技术重大突破',
      '开源AI模型最新动态',
      'AI Agent自动化框架发展趋势',
    );
  }

  return [...new Set(topics)].slice(0, 10);
}

// ─── Git 发布 ──────────────────────────────────────────────────

function gitPublish(articleSlug: string) {
  try {
    const { execSync } = require('child_process');
    execSync('git add data/articles/', { encoding: 'utf8', timeout: 10000 });
    execSync(`git commit -m "🤖 AI 自动生成: ${articleSlug}"`, { encoding: 'utf8', timeout: 10000 });
    execSync('git push origin main', { encoding: 'utf8', timeout: 30000 });
    console.log('[publish] ✅ 已推送到 GitHub，Vercel 将自动部署');
  } catch (e: unknown) {
    const err = e as Error;
    console.log(`[publish] ⚠️ 自动发布失败: ${err.message}`);
    console.log('[publish]   手动执行: git push origin main');
  }
}

// ─── 主流程 ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const autoMode = args.includes('--auto');
  const publishMode = args.includes('--publish');
  const topicIdx = args.indexOf('--topic');
  const directTopic = topicIdx >= 0 ? args[topicIdx + 1] : '';

  const providerName = AI_PROVIDER === 'anthropic' ? 'Anthropic Claude' : 'Agnes AI';

  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log(`║   AI 自动写作引擎 [${providerName}]`);
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  // 检查 API 密钥
  if (AI_PROVIDER === 'agnes' && !AGNES_API_KEY) {
    console.error('❌ 请设置 AGNES_API_KEY 环境变量');
    console.error('   在 .env.local 中添加:');
    console.error('   AGNES_API_KEY=你的 Agnes AI 密钥');
    process.exit(1);
  }
  if (AI_PROVIDER === 'anthropic' && !ANTHROPIC_API_KEY) {
    console.error('❌ 请设置 ANTHROPIC_API_KEY 环境变量');
    console.error('   在 .env.local 中添加:');
    console.error('   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx');
    process.exit(1);
  }

  // 获取话题
  let topics: string[] = [];
  if (directTopic) {
    topics = [directTopic];
  } else if (autoMode) {
    console.log('[discover] 🔍 正在发现 AI 热点话题...');
    topics = await discoverTopics();
    console.log(`[discover] 📋 发现 ${topics.length} 个话题`);
    topics.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));
  } else {
    const { createInterface } = await import('readline');
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    topics = [await new Promise<string>(resolve => {
      rl.question('请输入文章话题: ', answer => { rl.close(); resolve(answer.trim()); });
    })];
  }

  if (topics.length === 0) {
    console.error('❌ 没有可写作的话题');
    process.exit(1);
  }

  // 逐个生成文章
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n[write] 📝 (${i + 1}/${topics.length}) 正在写作: ${topic}`);

    try {
      const article = await generateArticle(topic);
      const filePath = saveArticle(article);
      console.log(`[write] ✅ 文章已保存: ${path.basename(filePath)}`);
      console.log(`[write]   标题: ${article.title}`);
      console.log(`[write]   分类: ${article.category}`);
      console.log(`[write]   标签: ${article.tags.join(', ')}`);
      console.log(`[write]   URL: /${article.slug}`);

      if (publishMode) gitPublish(article.slug);
    } catch (e: unknown) {
      const err = e as Error;
      console.error(`[write] ❌ 写作失败: ${err.message}`);
    }

    if (i < topics.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n[summary] ✨ 完成！共生成 ${topics.length} 篇文章`);
  console.log('[summary] 运行 npm run build 验证构建');
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
