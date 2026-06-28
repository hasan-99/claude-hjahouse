#!/usr/bin/env bash
# Build a static export and publish it to the gh-pages branch.
# Usage: npm run deploy
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_URL="https://github.com/hasan-99/claude-hjahouse.git"

cd "$ROOT"
echo "▸ Building static export (GITHUB_PAGES=true)…"
GITHUB_PAGES=true npm run build

TMP="$(mktemp -d)"
cp -r out/. "$TMP/"
cd "$TMP"
touch .nojekyll
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy static export"
echo "▸ Pushing to gh-pages…"
git push -f "$REPO_URL" gh-pages

echo "✅ Deployed → https://hasan-99.github.io/claude-hjahouse/"
