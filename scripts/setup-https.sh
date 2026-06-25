#!/usr/bin/env bash
set -euo pipefail

# setup-https.sh
# Solicita certificados TLS a Let's Encrypt usando certbot --standalone
# (no requiere Nginx ni Apache). Útil cuando corres la app con PM2 directamente.

DOMAIN="${1:-correspondencia.cvm.com.ve}"
EMAIL="${2:-admin@cvm.com.ve}"
WEBROOT_PORT="${3:-80}"
EXTRA_DOMAINS="${4:-}"

echo "=== Setup HTTPS con Let's Encrypt ==="
echo "Dominio principal: $DOMAIN"
echo "Email:             $EMAIL"
[ -n "$EXTRA_DOMAINS" ] && echo "Dominios extra:     $EXTRA_DOMAINS"
echo

# 1. Instalar certbot si no existe
if ! command -v certbot >/dev/null 2>&1; then
  echo "[1/4] Instalando certbot..."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y certbot
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y certbot
  elif command -v yum >/dev/null 2>&1; then
    yum install -y certbot
  else
    echo "ERROR: no se detectó apt-get, dnf ni yum. Instala certbot manualmente." >&2
    exit 1
  fi
else
  echo "[1/4] certbot ya instalado: $(certbot --version)"
fi

# 2. Liberar el puerto 80 si PM2 o algo lo está usando
echo "[2/4] Liberando puerto $WEBROOT_PORT..."
PM2_PIDS=$(ss -ltnp 2>/dev/null | awk -v p=":$WEBROOT_PORT" '$4 ~ p {print $0}' || true)
if [ -n "$PM2_PIDS" ]; then
  echo "   Hay procesos escuchando en :$WEBROOT_PORT, deteniendo PM2 temporalmente..."
  pm2 stop all || true
  sleep 2
fi
# Matar cualquier cosa en el puerto
fuser -k "${WEBROOT_PORT}/tcp" 2>/dev/null || true
sleep 1

# 3. Solicitar certificado
echo "[3/4] Solicitando certificado..."
DOMAIN_ARGS=(-d "$DOMAIN")
if [ -n "$EXTRA_DOMAINS" ]; then
  for d in $EXTRA_DOMAINS; do
    DOMAIN_ARGS+=(-d "$d")
  done
fi

certbot certonly \
  --standalone \
  --preferred-challenges http \
  --http-01-port "$WEBROOT_PORT" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --keep-until-expiring \
  "${DOMAIN_ARGS[@]}"

# 4. Configurar renovación y permisos
echo "[4/4] Configurando renovación automática..."
mkdir -p /var/www/html/censo_cvm_emergencia/certs
LIVE_DIR="/etc/letsencrypt/live/$DOMAIN"
if [ ! -d "$LIVE_DIR" ]; then
  echo "ERROR: Let's Encrypt no creó $LIVE_DIR" >&2
  exit 1
fi

# Copiar a un path que la app pueda leer sin root
cp "$LIVE_DIR/fullchain.pem" /var/www/html/censo_cvm_emergencia/certs/fullchain.pem
cp "$LIVE_DIR/privkey.pem"   /var/www/html/censo_cvm_emergencia/certs/privkey.pem
chmod 644 /var/www/html/censo_cvm_emergencia/certs/fullchain.pem
chmod 600 /var/www/html/censo_cvm_emergencia/certs/privkey.pem

# Reiniciar PM2 si estaba corriendo
if command -v pm2 >/dev/null 2>&1; then
  pm2 start all 2>/dev/null || pm2 restart all || true
fi

echo
echo "=== Listo ==="
echo "Certificados en: /var/www/html/censo_cvm_emergencia/certs/"
echo "  - fullchain.pem"
echo "  - privkey.pem"
echo
echo "Próximos pasos:"
echo "  1. Editar ecosystem.config.js y descomentar las líneas HTTPS_*"
echo "     (o exportar HTTPS_CERT/HTTPS_KEY antes de pm2 start)"
echo "  2. cd /var/www/html/censo_cvm_emergencia && pm2 reload ecosystem.config.js"
echo "  3. Verificar: https://$DOMAIN:3013/"
echo
echo "Renovación automática:"
echo "  sudo crontab -e"
echo "  0 3 * * * /opt/censo/scripts/renew-certs.sh"
