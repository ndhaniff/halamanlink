#!/bin/sh
set -e

DB_FILE="${ASTRO_DATABASE_FILE:-/app/data/content.db}"
DB_DIR="$(dirname "$DB_FILE")"

mkdir -p "$DB_DIR" /app/data/uploads/avatars

node /app/scripts/init-db.mjs

exec node ./dist/server/entry.mjs
