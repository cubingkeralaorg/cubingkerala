#!/usr/bin/env bash
set -euo pipefail

# Load local secrets for Prisma CLI without printing values.
# Prefers .env.local (Next.js convention), then .env (Prisma default).
load_env_file() {
  local file="$1"
  if [ -f "$file" ]; then
    set -a
    # shellcheck disable=SC1090
    source "$file"
    set +a
    return 0
  fi
  return 1
}

load_env_file ".env.local" || load_env_file ".env" || true

exec "$@"
