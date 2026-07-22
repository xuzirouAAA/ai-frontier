#!/bin/bash
# 快速创建新文章
# Usage:
#   bash scripts/new-article.sh                          # 交互式创建
#   bash scripts/new-article.sh "文章标题"                 # 从标题快速创建
#   bash scripts/new-article.sh --topic "AI Agent 趋势"   # 从热点话题创建草稿
#   bash scripts/new-article.sh --list                    # 列出最近文章

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

cd "$PROJECT_DIR" || exit 1

case "${1:-}" in
  --list|-l)
    npx tsx scripts/generate-article.ts --list
    ;;
  --topic|-t)
    shift
    TOPIC="$*"
    echo -e "${BLUE}[INFO]${NC} 从话题创建文章: ${TOPIC}"
    npx tsx scripts/generate-article.ts --from-topic "$TOPIC"
    ;;
  --help|-h)
    echo "用法:"
    echo "  bash scripts/new-article.sh                   交互式创建"
    echo "  bash scripts/new-article.sh '文章标题'        从标题快速创建"
    echo "  bash scripts/new-article.sh --topic '话题'    从话题创建草稿"
    echo "  bash scripts/new-article.sh --list           列出最近文章"
    echo ""
    echo "创建后编辑 data/articles/ 下的 JSON 文件完善内容。"
    echo "文章 URL 由 slug 决定。"
    ;;
  *)
    if [ -n "${1:-}" ]; then
      # Quick create from title
      TITLE="$*"
      echo -e "${BLUE}[INFO]${NC} 从标题创建文章: ${TITLE}"
      npx tsx scripts/generate-article.ts --from-topic "$TITLE"
    else
      # Interactive mode
      npx tsx scripts/generate-article.ts
    fi
    ;;
esac
