/**
 * X Trending Content Fetcher
 *
 * Fetches trending AI/tech content from X (Twitter) using x-tweet-fetcher.
 *
 * Usage:
 *   npx tsx scripts/fetch-trending.ts                    # Fetch all tracked accounts
 *   npx tsx scripts/fetch-trending.ts --search "AI agent"  # Search for specific topics
 *   npx tsx scripts/fetch-trending.ts --limit 5           # Limit results per account
 *   npx tsx scripts/fetch-trending.ts --output report      # Output format: report|json
 *
 * Dependencies: x-tweet-fetcher (Python scripts at ~/.claude/skills/x-tweet-fetcher/scripts/)
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const XTF_SCRIPTS = path.join(
  process.env.HOME || process.env.USERPROFILE || '~',
  '.claude/skills/x-tweet-fetcher/scripts'
);

const ACCOUNTS_FILE = path.join(__dirname, 'ai-accounts.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'raw');

interface Account {
  username: string;
  name: string;
  category: string;
  weight: number;
  description: string;
}

interface TrendingTopic {
  title: string;
  source: string;
  url: string;
  category: string;
  snippet: string;
  timestamp: string;
  relevanceScore: number;
}

interface FetchResult {
  timestamp: string;
  topics: TrendingTopic[];
  accountsChecked: number;
  errors: string[];
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadAccounts(): Account[] {
  const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
  const config = JSON.parse(raw);
  return config.accounts || [];
}

function callPythonScript(script: string, args: string[]): string {
  try {
    const cmd = `python3 "${path.join(XTF_SCRIPTS, script)}" ${args.join(' ')}`;
    return execSync(cmd, { encoding: 'utf8', timeout: 30000 });
  } catch (e: unknown) {
    const err = e as { stderr?: string; stdout?: string; message?: string };
    throw new Error(`Python script failed: ${err.message || err.stderr || 'Unknown error'}`);
  }
}

function parseTweetUrl(username: string): string {
  // FxTwitter API format
  return `https://api.fxtwitter.com/${username}/latest`;
}

async function fetchFromFxTwitter(username: string): Promise<TrendingTopic[]> {
  try {
    const url = `https://api.fxtwitter.com/${username}`;
    const response = execSync(`curl -s "${url}"`, { encoding: 'utf8', timeout: 10000 });
    const data = JSON.parse(response);

    if (!data?.tweets?.length) return [];

    return (data.tweets as Array<{
      text?: string;
      url?: string;
      likes?: number;
      retweets?: number;
      created_at?: string;
    }>).slice(0, 5).map((tweet) => ({
      title: (tweet.text || '').slice(0, 100),
      source: `@${username}`,
      url: tweet.url || `https://x.com/${username}`,
      category: 'ai',
      snippet: (tweet.text || '').slice(0, 200),
      timestamp: tweet.created_at || new Date().toISOString(),
      relevanceScore: (tweet.likes || 0) + (tweet.retweets || 0) * 3,
    }));
  } catch {
    return [];
  }
}

async function searchTrending(keyword: string): Promise<TrendingTopic[]> {
  try {
    // Use x_discover.py to search for trending AI content
    const output = callPythonScript('x_discover.py', [
      `--keywords "${keyword}"`,
      '--limit 5',
      '--json',
    ]);

    const results = JSON.parse(output);
    if (!Array.isArray(results)) return [];

    return results
      .filter((r: { url?: string }) => r.url && !r.url.includes('x.com') === false)
      .map((r: { url?: string; title?: string; snippet?: string; publishedDate?: string }, i: number) => ({
        title: (r.title || keyword).slice(0, 100),
        source: 'search',
        url: r.url || '',
        category: inferCategory(keyword),
        snippet: (r.snippet || '').slice(0, 200),
        timestamp: r.publishedDate || new Date().toISOString(),
        relevanceScore: 10 - i,
      }));
  } catch (e) {
    console.error(`[WARN] Search failed for "${keyword}":`, e);
    return [];
  }
}

function inferCategory(keyword: string): string {
  const kw = keyword.toLowerCase();
  if (kw.includes('funding') || kw.includes('startup') || kw.includes('创业')) return 'startup';
  if (kw.includes('coding') || kw.includes('programming') || kw.includes('开发')) return 'programming';
  if (kw.includes('tool') || kw.includes('工具')) return 'tools';
  return 'ai';
}

function calcHotScore(topic: TrendingTopic): number {
  return topic.relevanceScore;
}

function generateReport(result: FetchResult): string {
  const lines: string[] = [];
  lines.push('='.repeat(60));
  lines.push(`  AI 热点趋势报告`);
  lines.push(`  生成时间: ${result.timestamp}`);
  lines.push(`  来源账号: ${result.accountsChecked} 个`);
  lines.push(`  热点话题: ${result.topics.length} 条`);
  lines.push('='.repeat(60));
  lines.push('');

  const sorted = [...result.topics].sort((a, b) => calcHotScore(b) - calcHotScore(a));

  for (const topic of sorted.slice(0, 20)) {
    lines.push(`  [${topic.category.toUpperCase()}] ${topic.title}`);
    lines.push(`  └─ ${topic.source} | 热度: ${topic.relevanceScore}`);
    lines.push('');
  }

  if (result.errors.length > 0) {
    lines.push('── 错误 ──');
    result.errors.forEach((e) => lines.push(`  ⚠ ${e}`));
  }

  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const searchMode = args.includes('--search');
  const searchTerm = searchMode ? args[args.indexOf('--search') + 1] : '';
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) || 10 : 10;
  const outputFormat = args.includes('--output')
    ? args[args.indexOf('--output') + 1] || 'report'
    : 'report';

  const accounts = loadAccounts();
  const topics: TrendingTopic[] = [];
  const errors: string[] = [];

  console.log(`[fetch-trending] 开始获取 AI 热点内容...`);
  console.log(`[fetch-trending] 追踪 ${accounts.length} 个账号`);

  // Fetch from tracked accounts
  for (const account of accounts.slice(0, limit)) {
    try {
      const accountTopics = await fetchFromFxTwitter(account.username);
      topics.push(...accountTopics);
      process.stdout.write('.');
    } catch (e) {
      errors.push(`@${account.username}: ${e}`);
      process.stdout.write('x');
    }
  }

  // Search for trending topics if keywords are configured
  const keywordsFile = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
  const keywords = JSON.parse(keywordsFile).searchKeywords || [];

  if (searchTerm) {
    const searchResults = await searchTrending(searchTerm);
    topics.push(...searchResults);
  } else {
    // Use a subset of keywords for trend discovery
    const activeKeywords = keywords.slice(0, 3);
    for (const kw of activeKeywords) {
      const searchResults = await searchTrending(kw);
      topics.push(...searchResults);
    }
  }

  console.log(`\n[fetch-trending] 完成! 获取到 ${topics.length} 条热点`);

  const result: FetchResult = {
    timestamp: new Date().toISOString(),
    topics,
    accountsChecked: accounts.length,
    errors,
  };

  // Save raw data
  ensureDir(OUTPUT_DIR);
  const dateStr = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `trending-${dateStr}.json`),
    JSON.stringify(result, null, 2),
    'utf8'
  );

  // Output
  if (outputFormat === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(generateReport(result));
  }
}

main().catch(console.error);
