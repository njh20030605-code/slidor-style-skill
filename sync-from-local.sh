#!/bin/bash
# 把本机 ~/.claude/skills/slidor-style 同步进本仓库，并跑 scrub.sh 脱敏。
# 本机版是真源；公开版只在 scrub.sh 里做两件事：换掉个人化的触发描述、删掉 references/brand-*.md（品牌内部资料）。
set -euo pipefail
R="$(cd "$(dirname "$0")" && pwd)"
rsync -a --delete --exclude .DS_Store --exclude '._*' --exclude __pycache__ \
  "$HOME/.claude/skills/slidor-style/" "$R/slidor-style/"
bash "$R/scrub.sh"
cd "$R" && git status --short
