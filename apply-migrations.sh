#!/bin/sh
# Apply all SQL migrations (./supabase/migrations/*.sql) to the self-hosted
# Supabase Postgres running in this compose stack.
#
# Run from self-hosted healthy:
#   sh apply-migrations.sh
#
# Migrations run in filename (timestamp) order. Designed for a FRESH database;
# re-running on a populated DB will error on non-idempotent statements
# (e.g. CREATE POLICY). To start clean: docker compose down -v && up -d, then re-run.
set -e

MIG_DIR="./supabase/migrations"
PSQL="docker exec -it supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 -q"

[ -d "$MIG_DIR" ] || { echo "ERROR: $MIG_DIR not found."; exit 1; }

# Wait until the db container answers (max ~30s).
i=0
until docker exec -it supabase-db pg_isready -U postgres >/dev/null 2>&1; do
    i=$((i+1)); [ "$i" -gt 30 ] && { echo "ERROR: db not ready"; exit 1; }
    sleep 1
done

for f in "$MIG_DIR"/*.sql; do
    echo ">>> $(basename "$f")"
    $PSQL -f - < "$f"
done

echo "=== Row counts ==="
docker exec -it supabase-db psql -U postgres -d postgres -tAc \
"select 'dimensions='||count(*) from dimensions
 union all select 'documents='||count(*) from documents
 union all select 'dimension_articles='||count(*) from dimension_articles;"
echo "Migrations applied."
