# Censo de Contingencia CVM

> Plataforma de registro de situación del personal y sus familias de la **Corporación Venezolana de Minería** ante la emergencia sísmica (magnitud 7.2 / 7.5) en Venezuela.

Monorepo simple con dos paquetes:

```
censo-emergencia-cvm/
├── backend/       # API REST (Node 20 + Express + Prisma + PostgreSQL 16)
├── frontend/      # SPA (Vite + React 18 + Tailwind + shadcn-style)
├── scripts/       # utilidades (backups)
└── README.md      # este archivo
```

## Stack

| Capa | Tecnología |
|---|---|
| **Servidor** | Node 20, Express 4 (estable, maduro) |
| **ORM** | Prisma 5 (migraciones declarativas, type-safety opcional) |
| **DB** | PostgreSQL 16 nativo (sin Docker) |
| **Validación** | Zod (espejo backend ↔ frontend) |
| **Auth admin** | JWT + bcrypt |
| **Rate limit** | express-rate-limit en endpoints públicos |
| **Frontend** | Vite 5 + React 18 + Tailwind + React Hook Form + TanStack Query + Recharts |
| **UI** | Componentes estilo shadcn/ui (Button, Card, Input, Select, Badge, Alert, Checkbox) |
| **Export** | CSV (`csv-stringify`) y XLSX (`exceljs`) |

## Modelo de datos

`User` · `ContingencyCensus` · `AuditLog`

Enum de situación: `SAFE`, `INJURED`, `DISPLACED`, `MISSING_FAMILY`, `DECEASED`, `OTHER`.
Enum de estatus: `RECEIVED`, `IN_PROCESS`, `ATTENDED`, `CLOSED`.

N° de expediente autogenerado: `EMERG-{YYYY}-{5 dígitos}` único y reiniciable por año.

## Setup (orden obligatorio)

### 1. PostgreSQL nativo

Crear DB y usuario (ajustar contraseña):

```sql
CREATE DATABASE censo_emergencia;
CREATE USER censo_user WITH PASSWORD 'censo_pass';
GRANT ALL PRIVILEGES ON DATABASE censo_emergencia TO censo_user;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET (mínimo 16 chars)
npx prisma migrate dev --name init_contingency
npm run seed         # crea admin: admin@cvm.com.ve / CVM-Emerg-2026!
npm run dev          # API en http://localhost:3012
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env  # opcional; por defecto usa VITE_API_URL=http://localhost:3012
npm run dev           # http://localhost:3013
```

## Acceso

- **Público**: http://localhost:3013/reporte
- **Admin**: http://localhost:3013/admin/login
  - Email: `admin@cvm.com.ve`
  - Password: `CVM-Emerg-2026!`
  - **Rotar la contraseña en el primer ingreso.**

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/contingency` | público (rate-limited 10/min/IP) | Registrar reporte |
| `GET`  | `/api/v1/contingency` | admin/operator | Listado con filtros |
| `GET`  | `/api/v1/contingency/stats` | admin/operator | Conteos para dashboard |
| `GET`  | `/api/v1/contingency/:id` | admin/operator | Detalle |
| `PATCH`| `/api/v1/contingency/:id/status` | admin/operator | Cambiar estatus + nota |
| `GET`  | `/api/v1/contingency/export.csv` | admin | Exportar CSV |
| `GET`  | `/api/v1/contingency/export.xlsx` | admin | Exportar XLSX |
| `POST` | `/api/v1/auth/login` | público | Login admin |
| `GET`  | `/api/v1/auth/me` | autenticado | Usuario actual |
| `GET`  | `/health` | público | Liveness + ping DB |

## Características

- **Formulario público** con rate-limit y validación de cédula V/E/N.
- **Dashboard administrativo** con conteos por situación, estatus y gerencia, más gráficos.
- **Listado filtrable** con paginación, búsqueda y exportación a CSV/XLSX.
- **Auditoría** completa en `AuditLog` para login, cambios de estatus y exportaciones.
- **Transiciones de estatus controladas**: `RECEIVED → IN_PROCESS → ATTENDED → CLOSED`.
- **Branding CVM** con colores corporativos y banner de emergencia.
- **HTTPS nativo** integrado con `certbot` (no requiere Nginx/Apache).

## HTTPS con Apache + Let's Encrypt

Arquitectura recomendada para producción:

```
Internet → Apache (:80/:443) → PM2 censo-web (:3013, loopback)
                                PM2 censo-api (:3012, loopback)
```

- Apache es el **único** expuesto a Internet.
- PM2 escucha solo en `127.0.0.1` (no accesible desde fuera).
- `certbot --apache` obtiene el cert y configura HTTPS automáticamente.
- Renovación automática vía timer systemd que instala certbot en Debian.

### 1. Desplegar vhost y cert (una vez)

```bash
cd /var/www/html/censo_cvm_emergencia
chmod +x scripts/*.sh
sudo bash scripts/setup-https.sh correspondencia.cvm.com.ve admin@cvm.com.ve
```

El script:
1. Instala `certbot` + `python3-certbot-apache`.
2. Habilita módulos de Apache: `proxy`, `proxy_http`, `ssl`, `headers`, `rewrite`.
3. Copia `apache/censo.conf` a `/etc/apache2/sites-available/censo.conf`.
4. Desactiva el default site y activa el de CVM.
5. Ejecuta `certbot --apache --redirect -d dominio` → cert + HTTPS vhost + redirect 80→443.
6. Valida la config y recarga Apache.

### 2. Configurar PM2 y variables de entorno

```bash
# backend/.env (o copiar .env.production a .env)
CORS_ORIGIN=http://localhost:3013,https://correspondencia.cvm.com.ve

# frontend/.env.production
# VITE_API_URL=   (vacío: el frontend usará /api/v1 relativo)

# Recargar
cd /var/www/html/censo_cvm_emergencia
npm run build:frontend
pm2 reload ecosystem.config.js --env production
```

### 3. Verificar

```bash
# Frontend
curl -I https://correspondencia.cvm.com.ve/

# Backend (a través de Apache)
curl -i https://correspondencia.cvm.com.ve/health
curl -i https://correspondencia.cvm.com.ve/api/v1/auth/me

# Directo a PM2 (debe estar cerrado, solo loopback)
curl -i http://127.0.0.1:3013/    # 200 (desde el servidor)
curl -i http://190.202.32.92:3013/  # connection refused (correcto)
```

### 4. Renovación automática

`certbot` en Debian instala un timer systemd. Verificar:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

No hace falta cron manual — certbot recarga Apache automáticamente al renovar.

## Backups

```bash
# Linux/macOS
./scripts/backup-db.sh

# Windows (PowerShell)
.\scripts\backup-db.ps1
```

Los scripts generan dumps `pg_dump` con timestamp y rotación de 7 días en `backups/`.

## Producción con PM2

PM2 mantiene ambos servicios vivos, con auto-restart, logs centralizados y arranque en boot.

> ⚠️ **Importante**: `censo-web` (3013) **solo sirve archivos estáticos** (GET/HEAD). El API vive en `censo-api` (3012). En producción **debes** poner Nginx o un proxy delante para que `/api/*` llegue al backend. La forma más simple es usar Nginx — ver [Nginx delante de PM2](#nginx-delante-de-pm2-recomendado).

### Setup en el servidor (una vez)

```bash
# 1. Instalar Node 20+ y clonar el repo
git clone git@github.com:tu-org/censo-emergencia-cvm.git /opt/censo
cd /opt/censo

# 2. Instalar dependencias (sin dev en backend)
cd backend && npm ci --omit=dev && cd ..
cd frontend && npm ci && cd ..
npm ci   # instala pm2 en la raíz

# 3. Configurar variables de entorno
cp backend/.env.example backend/.env
# editar backend/.env: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN
# editar frontend/.env (opcional, solo si el API no está en localhost:3012)

# 4. Migrar DB
npm run migrate:prod

# 5. Build del frontend
npm run build:frontend

# 6. Crear admin inicial (solo la primera vez)
npm run seed
```

### Arrancar ambos servicios

```bash
# Desde la raíz del proyecto
npm run pm2:start         # equivalente a: pm2 start ecosystem.config.js

# Ver estado
pm2 status
# ┌────┬───────────────┬─────────┬──────┬────────┬──────────┐
# │ id │ name          │ mode    │ ↺    │ status │ memory   │
# ├────┼───────────────┼─────────┼──────┼────────┼──────────┤
# │ 0  │ censo-api     │ fork    │ 0    │ online │ 45.2 MB  │
# │ 1  │ censo-web     │ fork    │ 0    │ online │ 22.8 MB  │
# └────┴───────────────┴─────────┴──────┴────────┴──────────┘

# Logs en vivo
npm run pm2:logs          # ambos
pm2 logs censo-api        # solo backend
pm2 logs censo-web        # solo frontend
```

### Persistir tras reinicio del servidor

```bash
# Genera el comando de init según el sistema de init
npm run pm2:startup       # muestra el comando a ejecutar con sudo

# Guardar la lista de procesos actuales
npm run pm2:save          # congela el estado actual

# Tras cualquier reinicio, PM2 levantará censo-api y censo-web automáticamente
```

### Despliegues siguientes (flujo de actualización)

```bash
# 1. En tu máquina local
git pull
# ... cambios ...
git add .
git commit -m "fix: ..."
git push

# 2. En el servidor
cd /opt/censo
git pull
cd backend && npm ci --omit=dev && npx prisma migrate deploy && cd ..
cd frontend && npm ci && npm run build && cd ..
pm2 reload ecosystem.config.js   # cero-downtime reload
```

### Comandos PM2 útiles

| Acción | Comando |
|---|---|
| Iniciar | `npm run pm2:start` |
| Estado | `npm run pm2:status` |
| Logs en vivo | `npm run pm2:logs` |
| Reiniciar ambos | `npm run pm2:restart` |
| Reload sin downtime | `npm run pm2:reload` |
| Detener | `npm run pm2:stop` |
| Eliminar del supervisor | `npm run pm2:delete` |
| Monitor web (puerto 9615) | `pm2 plus` o `pm2 monit` |
| Logs centralizados | `~/.pm2/logs/` |

### Nginx delante de PM2 (recomendado)

PM2 escucha en localhost; Nginx en :80/:443 hace de reverse proxy y sirve HTTPS. **Esto resuelve el 405 que aparece si el navegador hace POST a `:3013`** — Nginx enruta `/api/*` al backend (3012) y el resto al frontend estático (3013).

```nginx
# /etc/nginx/sites-available/censo.conf
server {
  listen 80;
  server_name censo.cvm.gob.ve;

  # Frontend estático servido por PM2
  location / {
    proxy_pass http://127.0.0.1:3013;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # API
  location /api/ {
    proxy_pass http://127.0.0.1:3012/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 8M;
  }
}
```

Activar HTTPS con Let's Encrypt: `sudo certbot --nginx -d censo.cvm.gob.ve`.
