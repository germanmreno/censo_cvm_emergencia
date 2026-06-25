#!/usr/bin/env bash
set -euo pipefail

# Load env from backend/.env
if [ -f "$(dirname "$0")/../backend/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$(dirname "$0")/../backend/.env"
  set +a
fi

: "${DATABASE_URL:?DATABASE_URL no definida}"

BACKUP_DIR="$(dirname "$0")/../backups"
mkdir -p "$BACKUP_DIR"

TS=$(date +"%Y%m%d-%H%M%S")
FILE="$BACKUP_DIR/censo_emergencia-$TS.sql"

PGPASSWORD=$(node -e "const u=new URL(process.env.DATABASE_URL);process.stdout.write(decodeURIComponent(u.password))" 2>/dev/null || echo "")
HOST=$(node -e "process.stdout.write(new URL(process.env.DATABASE_URL).hostname)" 2>/dev/null || echo "localhost")
PORT=$(node -e "process.stdout.write(new URL(process.env.DATABASE_URL).port||'5432')" 2>/dev/null || echo "5432")
USER=$(node -e "process.stdout.write(new URL(process.env.DATABASE_URL).username)" 2>/dev/null || echo "postgres")
DB=$(node -e "process.stdout.write(new URL(process.env.DATABASE_URL).pathname.slice(1))" 2>/dev/null || echo "censo_emergencia")

export PGPASSWORD
pg_dump -h "$HOST" -p "$PORT" -U "$USER" -d "$DB" -F c -f "$FILE"

echo "Backup OK: $FILE"

# Rotación: mantener últimos 7
ls -1t "$BACKUP_DIR"/censo_emergencia-*.sql | tail -n +8 | xargs -r rm -f
