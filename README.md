# anepsa-frontend

Interfaz web para el sistema de gestión de órdenes de avalúo de ANEPSA.

**Stack:** React · Vite · React Router · Axios · Socket.io-client · Vitest · Testing Library

---

## Instalación local

```bash
git clone https://github.com/TU_USUARIO/anepsa-frontend.git
cd anepsa-frontend
npm install --legacy-peer-deps
cp .env.example .env
# Editar .env con la URL de tu backend
npm run dev
```

Abre `http://localhost:5173`

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend (ej: `http://localhost:3000/api`) |
| `VITE_SOCKET_URL` | URL de Socket.io (ej: `http://localhost:3000`) |

---

## Rutas por rol

### Admin
| Ruta | Descripción |
|------|-------------|
| `/admin/dashboard` | Dashboard con resumen de órdenes |
| `/admin/clientes` | Gestión de clientes |
| `/admin/inmuebles` | Gestión de inmuebles |
| `/admin/ordenes` | Gestión de órdenes |
| `/admin/ordenes/:id` | Detalle de orden con cambio de estatus |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/actividad` | Panel de actividad en tiempo real |

### Valuador
| Ruta | Descripción |
|------|-------------|
| `/valuador/dashboard` | Mis órdenes asignadas |
| `/valuador/ordenes/:id` | Detalle de orden |
| `/valuador/notificaciones` | Notificaciones en tiempo real |

---

## Socket.io — Notificaciones en tiempo real

El cliente se conecta con JWT al iniciar sesión:

```js
socketService.connect(accessToken)
```

Admin escucha el room `admin-activity`. Valuador escucha su room individual (`userId`).

Eventos: `orden:actualizada`, `orden:asignada`, `anticipo:pagado`

---

## Anticipo de pago

- Badge amarillo **"Anticipo: Pendiente"** cuando `pagoAnticipo: false`
- Badge verde **"Anticipo: Pagado"** cuando `pagoAnticipo: true`
- Botón **"Pagar anticipo"** cuando existe `anticipoUrl` y no está pagado

---

## Tests

```bash
npm test
```

12 tests en 4 suites: Login, ProtectedRoute, StatusBadge, DashboardAdmin.

---

## Build de producción

```bash
npm run build
```

---

## Deploy en Vercel

1. Conectar el repositorio en [Vercel](https://vercel.com)
2. Configurar variables de entorno: `VITE_API_URL`, `VITE_SOCKET_URL`
3. Agregar secrets en GitHub: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

El workflow `.github/workflows/deploy.yml` hace deploy automático en cada push a `main`.

---

## Docker

```bash
docker build -t anepsa-frontend .
docker run -p 80:80 anepsa-frontend
```
