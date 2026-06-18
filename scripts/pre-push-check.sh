#!/usr/bin/env bash
set -euo pipefail

echo "→ Production build"
npm run build

echo "✓ Pre-push checks passed"
