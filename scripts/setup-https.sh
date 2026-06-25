#!/usr/bin/env bash
set -euo pipefail

# setup-https.sh (Apache)
# Instala certbot + plugin Apache, configura módulos, despliega el vhost
# reverse proxy, obtiene el cert TLS y activa HTTPS automático.

DOMAIN="${1:-correspondencia.cvm.com.ve}"
EMAIL="${2:-admin@cvm.com.ve}"
APP_DIR="${APP_DIR:-/var/www/html/censo_cvm_emergencia}"
VHOST_SRC="$APP_DIR/apache/censo.conf"
VHOST_DST="/etc/apache2/sites-available/censo.conf"

echo "=== Setup HTTPS con Apache + Let's Encrypt ==="
echo "Dominio:  $DOMAIN"
echo "Email:    $EMAIL"
echo "App dir:  $APP_DIR"
echo

# 0. Auto-fix permisos de scripts
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
chmod +x "$SCRIPT_DIR"/*.sh 2>/dev/null || true

# 1. Instalar certbot + plugin Apache
echo "[1/5] Instalando certbot y plugin Apache..."
if command -v apt-get >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y certbot python3-certbot-apache
elif command -v dnf >/dev/null 2>&1; then
  dnf install -y certbot python3-certbot-apache
elif command -v yum >/dev/null 2>&1; then
  yum install -y certbot python3-certbot-apache
else
  echo "ERROR: gestor de paquetes no soportado (apt/dnf/yum)" >&2
  exit 1
fi
echo "  certbot $(certbot --version 2>&1 | tail -1)"

# 2. Habilitar módulos de Apache necesarios
echo "[2/5] Habilitando módulos de Apache..."
a2enmod proxy proxy_http ssl headers rewrite 2>&1 | sed 's/^/  /'

# 3. Desplegar vhost reverse proxy
echo "[3/5] Desplegando vhost $VHOST_DST..."
if [ ! -f "$VHOST_SRC" ]; then
  echo "ERROR: no se encontró $VHOST_SRC" >&2
  echo "Asegúrate de haber copiado el directorio apache/ a $APP_DIR" >&2
  exit 1
fi
cp "$VHOST_SRC" "$VHOST_DST"
chmod 644 "$VHOST_DST"

# Desactivar el default si está activo
if [ -f /etc/apache2/sites-enabled/000-default.conf ]; then
  echo "  Desactivando default site..."
  a2dissite 000-default 2>&1 | sed 's/^/  /' || true
fi

# Activar nuestro vhost
a2ensite censo 2>&1 | sed 's/^/  /'

# Validar config antes de seguir
echo "  Validando configuración de Apache..."
if ! apache2ctl configtest 2>&1 | sed 's/^/    /'; then
  echo "ERROR: configuración de Apache inválida. Revisa la salida." >&2
  exit 1
fi
systemctl reload apache2
echo "  Apache recargado."

# 4. Obtener certificado e instalar HTTPS con certbot --apache
echo "[4/5] Solicitando certificado Let's Encrypt..."
certbot --apache \
  --non-interactive \
  --agree-tos \
  --no-eff-email \
  --email "$EMAIL" \
  --redirect \
  -d "$DOMAIN"

# 5. Verificar
echo "[5/5] Verificación final..."
echo "  Cert en: /etc/letsencrypt/live/$DOMAIN/"
ls -la "/etc/letsencrypt/live/$DOMAIN/" 2>/dev/null | sed 's/^/    /'

# Mostrar el vhost :443 que certbot generó
echo
echo "  Vhost HTTPS generado:"
grep -A2 "<VirtualHost \*:443>" /etc/apache2/sites-available/censo-le-ssl.conf 2>/dev/null | head -5 | sed 's/^/    /'

echo
echo "=== Listo ==="
echo "Sitio: https://$DOMAIN"
echo
echo "Próximos pasos:"
echo "  1. PM2 ya debe estar corriendo en :3012 y :3013 (loopback)"
echo "  2. Recargar: cd $APP_DIR && pm2 reload ecosystem.config.js --env production"
echo "  3. Probar:  curl -i https://$DOMAIN/health"
echo
echo "Renovación automática:"
echo "  certbot instala un timer systemd o cron en Debian. Verificar:"
echo "    systemctl list-timers | grep certbot"
echo "    sudo certbot renew --dry-run"
