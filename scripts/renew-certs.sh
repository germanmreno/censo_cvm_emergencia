#!/usr/bin/env bash
set -euo pipefail

# renew-certs.sh
# Renueva los certificados de Let's Encrypt y los redistribuye a la app.
# Diseñado para correr vía cron (ej. 0 3 * * *).

APP_DIR="${APP_DIR:-/var/www/html/censo_cvm_emergencia}"
DOMAIN="${DOMAIN:-correspondencia.cvm.com.ve}"
LIVE_DIR="/etc/letsencrypt/live/$DOMAIN"
CERT_DIR="$APP_DIR/certs"

echo "[renew] $(date -Iseconds) - renovando certificados..."

# Renovar (no-op si no toca)
certbot renew --quiet --standalone --preferred-challenges http --http-01-port 80 || {
  echo "[renew] certbot renew falló. Abortando." >&2
  exit 1
}

# Verificar que el cert existe
if [ ! -f "$LIVE_DIR/fullchain.pem" ]; then
  echo "[renew] No se encontró $LIVE_DIR/fullchain.pem" >&2
  exit 1
fi

# Redistribuir al directorio de la app
mkdir -p "$CERT_DIR"
cp "$LIVE_DIR/fullchain.pem" "$CERT_DIR/fullchain.pem"
cp "$LIVE_DIR/privkey.pem"   "$CERT_DIR/privkey.pem"
chmod 644 "$CERT_DIR/fullchain.pem"
chmod 600 "$CERT_DIR/privkey.pem"

# Recargar PM2 sin downtime (los servers leen el cert al iniciar, no en cada req,
# así que un restart es necesario para tomar el nuevo cert)
if command -v pm2 >/dev/null 2>&1; then
  cd "$APP_DIR"
  pm2 reload ecosystem.config.js
  echo "[renew] PM2 recargado con certificados nuevos"
fi

echo "[renew] OK"
