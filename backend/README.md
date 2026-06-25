# Censo Emergencia CVM - Backend

API REST para el Censo de Contingencia por Emergencia Sísmica de la Corporación Venezolana de Minería.

## Stack

- Node 20+ (ESM)
- Express 4
- Prisma 5 + PostgreSQL 16
- Zod (validación)
- JWT (auth admin)
- Pino (logging)
- Helmet, CORS, express-rate-limit
- csv-stringify + exceljs (exportación)

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables
cp .env.example .env
# Editar DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET

# 3. Crear DB en PostgreSQL
#    CREATE DATABASE censo_emergencia;
#    CREATE USER censo_user WITH PASSWORD 'censo_pass';
#    GRANT ALL PRIVILEGES ON DATABASE censo_emergencia TO censo_user;

# 4. Migrar
npx prisma migrate dev --name init_contingency

# 5. Seed (crea admin inicial)
npm run seed

# 6. Dev
npm run dev
# API en http://localhost:3012
```

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/contingency` | Reporte público (rate-limited) |
| `GET`  | `/api/v1/contingency` | Listado con filtros (admin/operator) |
| `GET`  | `/api/v1/contingency/stats` | Conteos para dashboard |
| `GET`  | `/api/v1/contingency/:id` | Detalle |
| `PATCH`| `/api/v1/contingency/:id/status` | Cambiar estatus |
| `GET`  | `/api/v1/contingency/export.csv` | Exportar CSV |
| `GET`  | `/api/v1/contingency/export.xlsx` | Exportar XLSX |
| `POST` | `/api/v1/auth/login` | Login admin |
| `GET`  | `/api/v1/auth/me` | Usuario actual |
| `GET`  | `/health` | Liveness + DB ping |

## Admin por defecto

- Email: `admin@cvm.com.ve`
- Password: `CVM-Emerg-2026!`

## Auditoría

Toda creación, cambio de estatus y exportación se registra en `AuditLog`.
