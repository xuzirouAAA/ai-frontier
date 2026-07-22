/**
 * 每日自动内容管线
 *
 * 每天随机生成 1-3 篇文章并自动发布到 GitHub。
 * 专为 GitHub Actions 设计，也支持本地运行。
 *
 * 用法:
 *   npx tsx scripts/daily-pipeline.ts
 *
 * 环境变量:
 *   AGNES_API_KEY  - Agnes AI API 密钥（必需）
 *   MIN_ARTICLES   - 最少文章数（默认 1）
 *   MAX_ARTICLES   - 最多文章数（默认 3）
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const ARTICLES_DIR = path.join(__dirname, '..', 'data', 'articles');

// ─── 话题池 ──────────────────────────────────────────────────

const FALLBACK_TOPICS: string[] = [
  '2025年最新AI突破性进展',
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

// ─── 工具函数 ──────────────────────────────────────────────────

function getExistingSlugs(): Set<string> {
  if (!fs.existsSync(ARTICLES_DIR)) return new Set();
  return new Set(
    fs.readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
  );
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ─── 发现热点（从 X 抓取 + 话题池混合） ────────────────────

async function pickTopics(): Promise<string[]> {
  const min = parseInt(process.env.MIN_ARTICLES || '1', 10);
  const max = parseInt(process.env.MAX_ARTICLES || '3', 10);
  const count = randomInt(min, max);

  const topics: string[] = [];

  // 尝试从 X 发现热点
  try {
    const { execSync } = await import('child_process');
    const accountsFile = path.join(__dirname, 'ai-accounts.json');
    if (fs.existsSync(accountsFile)) {
      const accounts = JSON.parse(fs.readFileSync(accountsFile, 'utf8'));
      const keywords: string[] = accounts.searchKeywords || [];
      for (const kw of keywords.slice(0, 3)) {
        try {
          const searchScript = path.join(
            process.env.HOME || process.env.USERPROFILE || '~',
            '.claude/skills/x-tweet-fetcher/scripts'
          );
          const cmd = `python3 "${path.join(searchScript, 'x_discover.py')}" --keywords "${kw}" --limit 2 --json 2>/dev/null`;
          const output = execSync(cmd, { encoding: 'utf8', timeout: 10000 });
          const results = JSON.parse(output);
          if (Array.isArray(results)) {
            results.forEach((r: { title?: string }) => {
              if (r.title) topics.push(r.title);
            });
          }
        } catch { /* 跳过 */ }
      }
    }
  } catch { /* 无 X 抓取能力，使用话题池 */ }

  // 如果热点不够，从话题池补充
  if (topics.length < count) {
    const existingSlugs = getExistingSlugs();
    const shuffled = shuffleArray(FALLBACK_TOPICS);
    for (const t of shuffled) {
      if (topics.length >= count) break;
      // 简单去重——避免生成非常相似的话题
      const slug = t.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30);
      if (!existingSlugs.has(slug)) {
        topics.push(t);
      }
    }
  }

  // 如果话题池也用完了，允许重复（slug 会加时间戳）
  while (topics.length < count) {
    topics.push(FALLBACK_TOPICS[randomInt(0, FALLBACK_TOPICS.length - 1)]);
  }

  return topics.slice(0, count);
}

// ─── 主流程 ──────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   AI 每日内容管线启动');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  // 随机挑选话题
  const topics = await pickTopics();
  console.log(`[pipeline] 📋 今日计划生成 ${topics.length} 篇文章`);
  topics.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));

  // 生成文章
  const generated: string[] = [];
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n[pipeline] 📝 (${i + 1}/${topics.length}) 正在写作: ${topic}`);

    try {
      // 动态导入 ai-writer 的 generateArticle
      const { generateArticle } = await import('./ai-writer');
      const article = await generateArticle(topic);

      // 保存文章
      const { saveArticle } = await import('./ai-writer');
      const filePath = saveArticle(article);
      console.log(`[pipeline] ✅ 已保存: ${article.title}`);
      generated.push(article.slug);

      // 随机等待 30-90 秒，模拟自然写作间隔
      if (i < topics.length - 1) {
        const delay = 30000 + Math.random() * 60000;
        console.log(`[pipeline] ⏳ 等待 ${Math.round(delay / 1000)} 秒后继续...`);
        await new Promise(r => setTimeout(r, delay));
      }
    } catch (e: unknown) {
      const err = e as Error;
      console.error(`[pipeline] ❌ 写作失败: ${err.message}`);
    }
  }

  // Git 提交并推送
  if (generated.length > 0) {
    console.log('\n[pipeline] 📤 提交到 GitHub...');
    try {
      const { execSync } = await import('child_process');
      execSync('git add data/articles/', { encoding: 'utf8', timeout: 15000 });
      const date = new Date().toISOString().slice(0, 10);
      execSync(`git commit -m "🤖 AI 每日更新 ${date}: 新增 ${generated.length} 篇文章"`, {
        encoding: 'utf8',
        timeout: 15000,
      });
      execSync('git push', { encoding: 'utf8', timeout: 60000 });
      console.log('[pipeline] ✅ 已推送到 GitHub，Vercel 将自动部署');
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message.includes('nothing to commit')) {
        console.log('[pipeline] ℹ️ 没有新内容需要提交');
      } else {
        console.error(`[pipeline] ⚠️ 推送失败: ${err.message}`);
      }
    }
  }

  console.log(`\n[pipeline] ✨ 完成！今日生成 ${generated.length} 篇文章`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
