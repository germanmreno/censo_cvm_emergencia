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
npm run dev          # API en http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env  # opcional; por defecto usa VITE_API_URL=http://localhost:4000
npm run dev           # http://localhost:5173
```

## Acceso

- **Público**: http://localhost:5173/reporte
- **Admin**: http://localhost:5173/admin/login
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

## Backups

```bash
# Linux/macOS
./scripts/backup-db.sh

# Windows (PowerShell)
.\scripts\backup-db.ps1
```

Los scripts generan dumps `pg_dump` con timestamp y rotación de 7 días en `backups/`.

## Producción

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
# Servir dist/ con Nginx, Caddy o `npx serve dist`
```

En producción, configurar `CORS_ORIGIN` con el dominio final y montar el backend tras un reverse proxy (Nginx) con HTTPS.
