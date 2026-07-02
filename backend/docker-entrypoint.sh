#!/bin/sh
set -e

echo "▶ Applying database migrations..."
npx prisma migrate deploy

echo "▶ Seeding database (skips automatically if already populated)..."
node dist/prisma/seed.js

echo "▶ Starting server..."
exec node dist/src/server.js
