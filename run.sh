#!/bin/bash
# Déploiement Wayo Agency (./run.sh), sur le modèle de Wayo-ads/run.sh.
# - Branche : master
# - PM2 : wayoagency sur 127.0.0.1:3010 (le port 3000 reste à Wayo Ads)
# - Maintenance : /var/www/wayoagency-maintenance.flag
#   Nginx doit contenir deploy/nginx-maintenance.snippet dans le server du site Agency.

set -e

APP_NAME="wayoagency"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAINTENANCE_FLAG="/var/www/wayoagency-maintenance.flag"
MAINTENANCE_DIR="/var/www/wayoagency-maintenance"

cd "$PROJECT_DIR" || { echo "Répertoire projet introuvable : $PROJECT_DIR"; exit 1; }

# Toujours le .env du projet : un DATABASE_URL hérité (Wayo Ads, par exemple) ne doit pas migrer une autre base.
unset DATABASE_URL
if [ -f .env ]; then
  DATABASE_URL="$(grep -m1 '^DATABASE_URL=' .env | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
  export DATABASE_URL
fi
if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL est absent de .env. Le déploiement s'arrête avant la maintenance."
  exit 1
fi

echo "Récupération de master..."
git fetch origin
git checkout master
git pull origin master

release_maintenance() {
  if [ -f "$MAINTENANCE_FLAG" ]; then
    echo "Fin de la maintenance..."
    sudo rm -f "$MAINTENANCE_FLAG" 2>/dev/null || rm -f "$MAINTENANCE_FLAG" 2>/dev/null || true
    sudo nginx -s reload 2>/dev/null || nginx -s reload 2>/dev/null || true
  fi
}

# Arrêt, Ctrl+C ou coupure SSH : retirer l'écran. Un second signal ne doit pas
# interrompre ce retrait.
on_stop() {
  trap '' INT TERM HUP
  set +e
  release_maintenance
}

trap on_stop EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

echo "Page de maintenance..."
sudo mkdir -p "$MAINTENANCE_DIR"
sudo cp -f maintenance/index.html maintenance/favicon.avif "$MAINTENANCE_DIR/"
sudo touch "$MAINTENANCE_FLAG"
sudo nginx -s reload 2>/dev/null || echo "Rechargement Nginx ignoré. Ajouter deploy/nginx-maintenance.snippet."

if [ ! -f ".last-deploy-hash" ] || [ "$(md5sum package.json 2>/dev/null | awk '{print $1}')" != "$(cat .last-deploy-hash 2>/dev/null)" ]; then
  echo "Installation des dépendances..."
  npm install --include=dev
  md5sum package.json | awk '{print $1}' > .last-deploy-hash
fi

echo "Vidage du cache..."
rm -rf .next/cache .next/standalone/.next/cache

echo "Build..."
export NODE_OPTIONS="--max-old-space-size=2048${NODE_OPTIONS:+ $NODE_OPTIONS}"
npm run build

echo "Copie des assets standalone..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
if [ ! -f ".next/standalone/.next/server/middleware-manifest.json" ] && [ -f ".next/server/middleware-manifest.json" ]; then
  mkdir -p .next/standalone/.next/server
  cp .next/server/middleware-manifest.json .next/standalone/.next/server/middleware-manifest.json
fi

echo "Migrations..."
npx tsx scripts/migrate.ts
npx tsx scripts/seed.ts

pm2 delete "$APP_NAME" 2>/dev/null || true
echo "Démarrage PM2 : $APP_NAME"
pm2 start ecosystem.config.cjs --only wayoagency-proxy || pm2 restart wayoagency-proxy
pm2 start ecosystem.config.cjs --only "$APP_NAME"
pm2 save
pm2 status wayoagency-proxy "$APP_NAME"

release_maintenance
echo "Déploiement terminé."
