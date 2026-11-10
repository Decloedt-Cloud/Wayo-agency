#!/bin/sh
set -e
node --import tsx scripts/migrate.ts
node --import tsx scripts/seed.ts
node server.js
