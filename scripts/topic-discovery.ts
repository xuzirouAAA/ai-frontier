/**
 * AI 热点话题发现模块 - CI 友好，多数据源
 *
 * 数据源（均无需认证，CI 可用）:
 *   1. Hacker News API - 英文 AI/科技热点
 *   2. InfoQ RSS       - 中文技术/AI 标题
 *   3. X (可选)        - 仅当本地存在 x-tweet-fetcher skill 时才尝试
 *   4. 话题池兜底       - 前三个源均失败或不足时补充
 *
 * 用法:
 *   npx tsx scripts/topic-discovery.ts --test   # 独立运行，打印发现的话题（不生成文章）
 */

import * as fs from 'fs';
import * as path from 'path';

const ARTICLES_DIR = path.join(__dirname, '..', 'data', 'articles');
const XTF_DISCOVER = path.join(
  process.env.HOME || process.env.USERPROFILE || '~',
  '.claude/skills/x-tweet-fetcher/scripts',
  'x_discover.py'
);

// ─── AI 相关性关键词 ──────────────────────────────────────────

const AI_KEYWORDS_EN = [
  'artificial intelligence', 'machine learning', 'deep learning', 'gpt', 'openai',
  'anthropic', 'claude', 'gemini', 'llm', 'chatgpt', 'copilot', 'diffusion',
  'transformer', 'chatbot', 'inference', 'rag', 'agentic', 'autonomous',
  'deepseek', 'neural', 'embedding', 'multimodal', 'coding assistant',
];

const AI_KEYWORDS_ZH = [
  '人工智能', '大模型', '机器学习', '深度学习', '智能体', '多模态',
  '神经网络', '算法', '机器人', 'GPT', 'Claude', 'Agent', 'AI',
];

export function isAIRelevant(title: string): boolean {
  const lower = title.toLowerCase();
  if (/\bai\b/.test(lower)) return true;
  if (AI_KEYWORDS_EN.some((k) => lower.includes(k))) return true;
  if (AI_KEYWORDS_ZH.some((k) => title.includes(k))) return true;
  return false;
}

// ─── 标题去重 ─────────────────────────────────────────────────

/** 小写、去除标点/空格等，保留中英文与数字（兼容 ES2017，不依赖 \p{...}） */
export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^0-9a-z一-鿿]+/g, '').trim();
}

/** bigram Jaccard 相似度，0-1，对中英文标题均有效 */
export function titleSimilarity(a: string, b: string): number {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;

  const bigrams = (s: string): Set<string> => {
    const set = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const ga = bigrams(na);
  const gb = bigrams(nb);
  let intersection = 0;
  for (const g of ga) if (gb.has(g)) intersection++;
  const union = ga.size + gb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function isDuplicateTitle(title: string, existingTitles: string[], threshold = 0.62): boolean {
  if (!title) return false;
  for (const existing of existingTitles) {
    if (titleSimilarity(title, existing) >= threshold) return true;
  }
  return false;
}

// ─── 已有文章 ─────────────────────────────────────────────────

export function getExistingTitles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8')).title;
      } catch {
        return '';
      }
    })
    .filter(Boolean);
}

// ─── HTTP 工具 ───────────────────────────────────────────────

// 标准浏览器 UA：部分站点（如 InfoQ）对非浏览器 UA 返回旧缓存内容
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': BROWSER_UA },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.text();
  } finally {
    clearTimeout(timer);
  }
}

// ─── Hacker News ─────────────────────────────────────────────

export async function fetchHackerNews(limit = 15): Promise<string[]> {
  const raw = await fetchWithTimeout('https://hacker-news.firebaseio.com/v0/topstories.json');
  const ids: number[] = (JSON.parse(raw) as number[]).slice(0, 60);
  const titles: string[] = [];

  await Promise.all(ids.slice(0, 30).map(async (id) => {
    try {
      const item = JSON.parse(
        await fetchWithTimeout(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      ) as { title?: string };
      const title = (item.title || '').trim();
      if (title && isAIRelevant(title)) titles.push(title);
    } catch { /* 单条失败跳过 */ }
  }));

  return titles.slice(0, limit);
}

// ─── InfoQ RSS ───────────────────────────────────────────────

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&amp;/g, '&');
}

const MAX_ITEM_AGE_MS = 90 * 24 * 60 * 60 * 1000; // InfoQ 只保留 90 天内条目，避免陈旧话题

function parseRSSItems(xml: string): { title: string; pubDate: string }[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.map((item) => {
    const titleM = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const dateM = item.match(/<pubDate>([^<]+)<\/pubDate>/);
    return {
      title: titleM ? decodeXmlEntities(titleM[1]).replace(/\s+/g, ' ').trim() : '',
      pubDate: dateM ? dateM[1].trim() : '',
    };
  });
}

export async function fetchInfoQ(limit = 15): Promise<string[]> {
  const xml = await fetchWithTimeout('https://www.infoq.cn/feed');
  const now = Date.now();
  const recent = parseRSSItems(xml).filter(({ title, pubDate }) => {
    if (!title || !isAIRelevant(title)) return false;
    const ts = pubDate ? Date.parse(pubDate) : NaN;
    return Number.isNaN(ts) || now - ts <= MAX_ITEM_AGE_MS;
  });
  return recent.map((i) => i.title).slice(0, limit);
}

// ─── X (本地可选) ────────────────────────────────────────────

export async function discoverFromX(): Promise<string[]> {
  if (!fs.existsSync(XTF_DISCOVER)) return [];
  // execFileSync 直接 spawn（不经过 shell），python3 不存在时静默抛错被捕获，不产生噪音
  const { execFileSync } = await import('child_process');
  const out: string[] = [];

  try {
    const accounts = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'ai-accounts.json'), 'utf8')
    ) as { searchKeywords?: string[] };
    const keywords = accounts.searchKeywords || [];

    for (const kw of keywords.slice(0, 5)) {
      try {
        const output = execFileSync(
          'python3',
          [XTF_DISCOVER, '--keywords', kw, '--limit', '3', '--json'],
          { encoding: 'utf8', timeout: 15000, stdio: ['ignore', 'pipe', 'ignore'] }
        );
        const results = JSON.parse(output);
        if (Array.isArray(results)) {
          for (const r of results as { title?: string }[]) {
            if (r.title) out.push(r.title.trim());
          }
        }
      } catch { /* 单关键词失败跳过 */ }
    }
  } catch { /* 无配置文件则跳过 */ }

  return out;
}

// ─── 话题池兜底 ──────────────────────────────────────────────

const FALLBACK_TOPICS: string[] = [
  '2026年最新AI突破性进展',
  'AI编程工具重磅更新',
  'AI创业公司获得大额融资',
  '大语言模型性能对比最新结果',
  'AI视频生成技术重大突破',
  '开源AI模型最新动态',
  'AI Agent自动化框架发展趋势',
  'AI搜索引擎与传统搜索对比',
  'AI辅助编程最佳实践',
  'AI图像生成工具横向评测',
  'AI音乐创作最新进展',
  'AI在医疗领域的最新应用',
  'AI编程助手对比评测',
  '大模型API降价趋势分析',
  'AI芯片竞争格局',
  'AI安全与对齐研究进展',
  '多模态AI模型能力评测',
  'AI教育工具推荐',
  'AI写作工具深度评测',
  '自主AI Agent应用案例',
];

// ─── 去重组合 ────────────────────────────────────────────────

function filterUnique(topics: string[], existingTitles: string[], alreadyChosen: string[]): string[] {
  const chosen = [...alreadyChosen];
  const out: string[] = [];
  for (const t of topics) {
    const topic = t.trim();
    if (!topic) continue;
    const conflict = [...existingTitles, ...chosen].find((e) => isDuplicateTitle(topic, [e]));
    if (!conflict) {
      chosen.push(topic);
      out.push(topic);
    }
  }
  return out;
}

/**
 * 发现新鲜 AI 热点话题（主入口）
 *
 * 顺序：Hacker News → InfoQ → X(本地可选) → 话题池兜底。
 * 多源结果轮转交错，保证中英文话题混合；
 * 每步结果都与「已有文章标题 + 本批已选话题」双向去重。
 * 不足 count 条时返回能提供的条数（宁少勿重）。
 */
export async function discoverFreshTopics(count: number): Promise<string[]> {
  const existingTitles = getExistingTitles();
  const sources: string[][] = [];

  try { sources.push(await fetchHackerNews(Math.ceil(count * 2))); } catch { /* 源失败跳过 */ }
  try { sources.push(await fetchInfoQ(Math.ceil(count * 2))); } catch { /* 源失败跳过 */ }
  try { sources.push(await discoverFromX()); } catch { /* 源失败跳过 */ }

  const interleaved: string[] = [];
  let maxLen = 0;
  for (const s of sources) maxLen = Math.max(maxLen, s.length);
  for (let i = 0; i < maxLen; i++) {
    for (const s of sources) {
      if (i < s.length) interleaved.push(s[i]);
    }
  }

  const chosen = filterUnique(interleaved, existingTitles, []);
  if (chosen.length < count) {
    chosen.push(...filterUnique(FALLBACK_TOPICS, existingTitles, chosen));
  }

  return chosen.slice(0, count);
}

// ─── 独立运行入口（--test 时执行，被其他脚本 import 时不触发） ──

if (process.argv.includes('--test')) {
  (async () => {
    const topics = await discoverFreshTopics(5);
    console.log('发现 AI 热点话题:');
    topics.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    console.log(`\n共 ${topics.length} 条`);
  })().catch((e) => { console.error(e); process.exit(1); });
}
