#!/bin/sh
set -e

DB_FILE="${ASTRO_DATABASE_FILE:-/app/data/content.db}"
DB_DIR="$(dirname "$DB_FILE")"

mkdir -p "$DB_DIR" /app/data/uploads/avatars

if [ ! -s "$DB_FILE" ] && [ -f /app/db-init/content.db ]; then
  echo "Initializing database at $DB_FILE"
  cp /app/db-init/content.db "$DB_FILE"
fi

exec node ./dist/server/entry.mjs
