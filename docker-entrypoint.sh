#!/bin/sh
set -e

DB_FILE="${ASTRO_DATABASE_FILE:-/app/data/content.db}"
DB_DIR="$(dirname "$DB_FILE")"

mkdir -p "$DB_DIR" /app/data/uploads/avatars
chmod -R 777 /app/data/uploads 2>/dev/null || true

echo "Checking database at $DB_FILE"
node /app/scripts/init-db.mjs

exec node ./dist/server/entry.mjs
