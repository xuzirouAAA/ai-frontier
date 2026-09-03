/**
 * 人工审核发布脚本
 *
 * 扫描 data/articles/ 中 editorStatus === 'published' 的文章，
 * 执行 git add/commit/push，供 Vercel 部署。
 *
 * 用法:
 *   npx tsx scripts/publish-reviewed.ts
 *
 * 环境变量:
 *   (无特殊要求，使用本地 git 配置)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const ARTICLES_DIR = path.join(__dirname, '..', 'data', 'articles');

function getPublishedArticles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => {
      try {
        const article = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8'));
        return article.editorStatus === 'published';
      } catch {
        return false;
      }
    });
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   人工审核发布工具');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  const published = getPublishedArticles();

  if (published.length === 0) {
    console.log('📭 没有标记为 published 的文章需要发布。');
    console.log('   请在文章 JSON 中设置 "editorStatus": "published" 后再运行。');
    process.exit(0);
  }

  console.log(`[publish] 📋 发现 ${published.length} 篇待发布文章:`);
  published.forEach((f) => console.log(`   - ${f.replace('.json', '')}`));
  console.log('');

  try {
    console.log('[publish] 📤 提交到 GitHub...');
    execSync('git add data/articles/', { encoding: 'utf8', timeout: 15000 });
    const date = new Date().toISOString().slice(0, 10);
    execSync(`git commit -m "📝 人工审核发布 ${date}: ${published.length} 篇文章"`, {
      encoding: 'utf8',
      timeout: 15000,
    });
    execSync('git push', { encoding: 'utf8', timeout: 60000 });
    console.log('[publish] ✅ 已推送到 GitHub，Vercel 将自动部署');
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message.includes('nothing to commit')) {
      console.log('[publish] ℹ️ 没有新内容需要提交');
    } else {
      console.error(`[publish] ⚠️ 推送失败: ${err.message}`);
      process.exit(1);
    }
  }
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
