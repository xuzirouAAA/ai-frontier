/**
 * 每日内容管线
 *
 * 支持两种模式:
 *   1. --discover-only  仅发现热点话题，保存到 data/drafts/topics.json，不生成文章
 *   2. 默认模式（已禁用）生成文章并自动发布（需要 ENABLE_AUTO_PUBLISH=true）
 *
 * 用法:
 *   npx tsx scripts/daily-pipeline.ts --discover-only   # 仅话题发现
 *
 * 环境变量:
 *   ENABLE_AUTO_PUBLISH  - 启用自动文章生成+发布（默认禁用）
 *   MIN_ARTICLES         - 最少文章数（默认 1）
 *   MAX_ARTICLES         - 最多文章数（默认 3）
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { discoverFreshTopics } from './topic-discovery';

const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// ─── 工具函数 ──────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── 发现热点（Hacker News → InfoQ → X → 话题池，多源去重） ────

async function pickTopics(): Promise<string[]> {
  const min = parseInt(process.env.MIN_ARTICLES || '1', 10);
  const max = parseInt(process.env.MAX_ARTICLES || '3', 10);
  const count = randomInt(min, max);

  // discoverFreshTopics 内部已与已有文章标题双向去重，不足时返回能提供的条数（宁少勿重）
  const topics = await discoverFreshTopics(count);
  return topics.slice(0, count);
}

// ─── 主流程 ──────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const discoverOnly = args.includes('--discover-only');

  // ─── 模式 1: 仅发现话题 ──────────────────────────────────────
  if (discoverOnly) {
    console.log('╔══════════════════════════════════════╗');
    console.log('║   话题发现模式');
    console.log('╚══════════════════════════════════════╝');
    console.log('');

    const min = parseInt(process.env.MIN_ARTICLES || '1', 10);
    const max = parseInt(process.env.MAX_ARTICLES || '3', 10);
    const count = randomInt(min, max);

    console.log('[pipeline] 🔍 正在发现新鲜 AI 热点话题...');
    const topics = await discoverFreshTopics(count);
    console.log(`[pipeline] 📋 发现 ${topics.length} 个话题:`);
    topics.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));

    // 保存到 data/drafts/topics.json
    const draftsDir = path.join(__dirname, '..', 'data', 'drafts');
    if (!fs.existsSync(draftsDir)) {
      fs.mkdirSync(draftsDir, { recursive: true });
    }
    const outPath = path.join(draftsDir, 'topics.json');
    const payload = {
      discoveredAt: new Date().toISOString(),
      mode: 'discover-only',
      count: topics.length,
      topics,
    };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`\n[pipeline] 💾 已保存到 ${outPath}`);
    console.log('[pipeline] ✅ 话题发现完成。人工审核后可通过 publish-reviewed.ts 发布。');
    return;
  }

  // ─── 模式 2: 自动文章生成（默认禁用） ──────────────────────────
  if (process.env.ENABLE_AUTO_PUBLISH !== 'true') {
    console.log('[pipeline] ⚠️ 自动文章生成已禁用。如需启用，设置环境变量 ENABLE_AUTO_PUBLISH=true');
    console.log('[pipeline]    当前使用 --discover-only 模式发现话题，人工审核后通过 publish-reviewed.ts 发布。');
    process.exit(0);
  }

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
