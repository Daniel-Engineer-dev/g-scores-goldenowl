#!/bin/sh
set -e

echo "▶ Applying database migrations..."
npx prisma migrate deploy

# Boot-seeding is opt-in (RUN_SEED=1). Enabled for local docker-compose, but
# left OFF on cloud hosts to avoid blocking startup / health-check timeouts
# while importing 1M+ rows — seed those from a machine with more resources.
if [ "$RUN_SEED" = "1" ]; then
  echo "▶ Seeding database (skips automatically if already populated)..."
  node dist/prisma/seed.js
else
  echo "▶ Skipping boot seed (RUN_SEED != 1)."
fi

echo "▶ Starting server..."
exec node dist/src/server.js
