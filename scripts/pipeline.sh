#!/bin/bash
# ============================================================
# AI 内容管线 - 从 X 热点发现到文章发布
# ============================================================
# 流程:
#   1. 发现热点: 扫描 X 上 AI 领域热门话题
#   2. 生成报告: 汇总热点主题和关键推文
#   3. 创建文章: 根据热点生成文章草稿
#
# Usage:
#   bash scripts/pipeline.sh                              # 完整管线
#   bash scripts/pipeline.sh discover                     # 仅发现热点
#   bash scripts/pipeline.sh create "话题"                 # 根据话题建文章
#   bash scripts/pipeline.sh status                       # 查看站点状态
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$PROJECT_DIR" || exit 1

discover() {
  echo -e "${BLUE}[Pipeline]${NC} 开始发现 AI 热点话题..."
  npx tsx scripts/fetch-trending.ts 2>&1
  echo ""
  echo -e "${GREEN}[Pipeline]${NC} 热点发现完成!"
  echo "查看原始数据: data/raw/trending-*.json"
}

create() {
  if [ -z "$1" ]; then
    echo -e "${YELLOW}[ERROR]${NC} 请提供话题名称"
    exit 1
  fi
  echo -e "${BLUE}[Pipeline]${NC} 创建文章: $1"
  npx tsx scripts/generate-article.ts --from-topic "$1"
  echo ""
  echo -e "${GREEN}[Pipeline]${NC} 文章草稿已创建!"
  echo "请编辑完善: data/articles/"
}

status() {
  echo -e "${BLUE}[Pipeline]${NC} 站点内容状态"
  echo ""

  # Count articles
  ARTICLE_COUNT=$(find data/articles -name "*.json" 2>/dev/null | wc -l)
  echo -e "  文章总数: ${GREEN}${ARTICLE_COUNT}${NC}"

  # Categories
  echo ""
  echo "  分类分布:"
  if [ "$ARTICLE_COUNT" -gt 0 ]; then
    for f in data/articles/*.json; do
      cat "$f" 2>/dev/null
    done | python3 -c "
import json, sys
from collections import Counter
cats = Counter()
for line in sys.stdin:
    try:
        d = json.loads(line.strip()) if line.strip() else None
    except:
        pass
# Actually let's do it properly
" 2>/dev/null || true

    # Simpler approach with jq or grep
    for cat in ai tools programming startup; do
      COUNT=$(grep -l "\"category\": \"$cat\"" data/articles/*.json 2>/dev/null | wc -l)
      if [ "$COUNT" -gt 0 ]; then
        echo "    $cat: $COUNT 篇"
      fi
    done
  fi

  # Latest article
  echo ""
  LATEST=$(ls -t data/articles/*.json 2>/dev/null | head -1)
  if [ -n "$LATEST" ]; then
    TITLE=$(python3 -c "import json; d=json.load(open('$LATEST')); print(d.get('title',''))" 2>/dev/null)
    echo "  最新文章: $TITLE"
    echo "  URL: /$(basename "$LATEST" .json)"
  fi

  # Build status
  echo ""
  if [ -d ".next" ]; then
    echo "  Build: 已构建"
  else
    echo -e "  Build: ${YELLOW}未构建 (运行 npm run build)${NC}"
  fi
}

# ============================================================

case "${1:-}" in
  discover)
    discover
    ;;
  create)
    shift
    create "$*"
    ;;
  status)
    status
    ;;
  *)
    # Full pipeline
    discover
    echo ""
    echo -e "${GREEN}[Pipeline]${NC} 管线执行完毕!"
    echo ""
    status
    echo ""
    echo "下一步:"
    echo "  bash scripts/pipeline.sh create '话题名称'  - 创建文章"
    echo "  npm run build                               - 构建站点"
    ;;
esac
