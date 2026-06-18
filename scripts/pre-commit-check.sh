#!/usr/bin/env bash
set -euo pipefail

echo "→ lint-staged (ESLint on staged files)"
npx lint-staged

echo "→ ESLint (full project)"
npm run lint

echo "→ TypeScript"
npx tsc --noEmit

echo "→ Unit & integration tests"
npm run test:ci

echo "✓ Pre-commit checks passed"
