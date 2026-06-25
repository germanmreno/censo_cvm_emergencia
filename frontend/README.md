# Censo Emergencia CVM - Frontend

SPA en React + Vite para el Censo de Contingencia por Emergencia Sísmica de la CVM.

## Stack

- React 18 + Vite 5
- React Router 6
- TanStack Query (data fetching / caché)
- React Hook Form + Zod (validación)
- Axios (cliente HTTP)
- Recharts (gráficos del dashboard)
- Tailwind CSS (estilos + branding CVM)

## Setup

```bash
npm install
cp .env.example .env
# (opcional) editar VITE_API_URL si el backend no está en localhost:4000

npm run dev
# Abre http://localhost:5173
```

El dev server de Vite proxifica `/api/*` → `http://localhost:4000`.

## Build de producción

```bash
npm run build      # genera dist/
npm run preview    # sirve el build
```

## Rutas

- `/` — Landing pública con accesos.
- `/reporte` — Formulario público de reporte.
- `/admin/login` — Login administrativo.
- `/admin` — Dashboard (protegido).
- `/admin/reportes` — Listado con filtros.
- `/admin/reportes/:id` — Detalle + cambio de estatus.

## Branding CVM

Colores definidos en `tailwind.config.js` (extensión `cvm`):
- `primary` `#8FA463`, `secondary` `#0E2A47`, `accent` `#E8DCC4`, `background` `#FAF8F2`, `emergency` `#B91C1C`.
