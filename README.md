# SG Referidos - SaaS Multi-tenant Referral Platform

Plataforma SaaS multiusuario para generación viral de leads basada en referidos. Similar a UpViral, Viral Loops y KickoffLabs.

## Stack Tecnológico

| Capa       | Tecnología                               |
| ---------- | ---------------------------------------- |
| Backend    | Node.js, Express.js, Sequelize ORM       |
| Base Datos | PostgreSQL con índices y constraints     |
| Frontend   | Vue.js 3, Pinia, Vue Router, Bootstrap 5 |
| Auth       | JWT + bcrypt                             |
| Uploads    | Multer (PDF, imágenes)                   |
| Seguridad  | Helmet, CORS, Rate Limiting, validación  |

## Arquitectura

```
sg-referral-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, env, migrations, seed
│   │   ├── models/          # 9 modelos + associations
│   │   ├── controllers/     # 8 controladores
│   │   ├── services/        # 7 servicios de negocio
│   │   ├── routes/          # 8 módulos de rutas
│   │   ├── middlewares/     # auth JWT, roles, upload, error, rate-limit
│   │   ├── validators/      # express-validator rules
│   │   └── utils/           # API response, logger, helpers
│   ├── uploads/             # Archivos subidos
│   ├── server.js            # Entry point
│   └── .env                 # Variables de entorno
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── user/        # Dashboard, Campaigns
│   │   │   ├── admin/       # Admin Dashboard, Users, Campaigns
│   │   │   └── public/      # Landing pages render
│   │   ├── layouts/         # UserLayout (sidebar azul), AdminLayout (sidebar roja)
│   │   ├── stores/          # Pinia (auth, campaigns, toast)
│   │   ├── services/        # Axios API client
│   │   ├── router/          # Routes + guards
│   │   └── components/      # Reutilizables
│   ├── vite.config.js
│   └── package.json
├── database/init.sql        # Esquema completo SQL
└── README.md
```

## Modelos de Datos (9 tablas)

| Tabla            | Descripción                        |
| ---------------- | ---------------------------------- |
| `users`          | Usuarios con roles (admin/user)    |
| `campaigns`      | Campañas de cada usuario           |
| `landing_pages`  | Landing page por campaña           |
| `landing_sections` | Bloques CMS dinámicos            |
| `rewards`        | Niveles de recompensa              |
| `reward_files`   | PDFs asignados a recompensas       |
| `referrals`      | Tracking de referidos              |
| `uploads`        | Galería de archivos del usuario    |
| `analytics`      | Eventos de tracking                |

## API REST Endpoints

### Auth
| Método | Ruta                  | Descripción          |
| ------ | --------------------- | -------------------- |
| POST   | `/api/auth/register`  | Registro de usuario  |
| POST   | `/api/auth/login`     | Inicio de sesión     |
| GET    | `/api/auth/profile`   | Perfil (auth)        |

### Campañas
| Método | Ruta                          | Descripción          |
| ------ | ----------------------------- | -------------------- |
| GET    | `/api/campaigns`              | Listar campañas      |
| POST   | `/api/campaigns`              | Crear campaña        |
| GET    | `/api/campaigns/:id`          | Obtener campaña      |
| PUT    | `/api/campaigns/:id`          | Actualizar           |
| PATCH  | `/api/campaigns/:id/status`   | Cambiar estado       |
| POST   | `/api/campaigns/:id/duplicate`| Duplicar             |
| DELETE | `/api/campaigns/:id`          | Eliminar             |
| GET    | `/api/campaigns/stats`        | Estadísticas usuario |

### Landing Pages (CMS)
| Método | Ruta                                        | Descripción               |
| ------ | ------------------------------------------- | ------------------------- |
| PUT    | `/api/landing/:campaignId/page`             | Actualizar landing        |
| POST   | `/api/landing/:campaignId/sections`         | Crear/editar sección      |
| DELETE | `/api/landing/:campaignId/sections/:id`     | Eliminar sección          |
| PUT    | `/api/landing/:campaignId/sections/reorder` | Reordenar secciones       |

### Recompensas
| Método | Ruta                                       | Descripción         |
| ------ | ------------------------------------------ | ------------------- |
| POST   | `/api/rewards/:campaignId`                 | Crear recompensa    |
| DELETE | `/api/rewards/:id/campaigns/:campaignId`    | Eliminar            |
| POST   | `/api/rewards/:id/campaigns/:campaignId/files` | Subir PDF     |

### Admin
| Método | Ruta                         | Descripción           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/admin/users`           | Listar usuarios       |
| PATCH  | `/api/admin/users/:id/toggle`| Activar/bloquear      |
| GET    | `/api/admin/campaigns`       | Listar campañas       |
| PATCH  | `/api/admin/campaigns/:id/toggle` | Activar/pausar   |

### Dashboard
| Método | Ruta                       | Descripción              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/api/dashboard/user`      | Stats del usuario        |
| GET    | `/api/dashboard/admin`     | Stats globales (admin)   |

### Público
| Método | Ruta               | Descripción                |
| ------ | ------------------ | -------------------------- |
| GET    | `/api/c/:slug`     | Landing page de campaña    |

## Local Setup

```bash
# 1. Crear BD
psql -U postgres -c "CREATE DATABASE sg_referral;"
psql -U postgres -d sg_referral -f database/init.sql

# 2. Backend
cd backend
cp .env.example .env   # editar credenciales
npm install
npm run db:migrate
npm run dev            # http://localhost:4000

# 3. Seed (opcional)
npm run db:seed        # admin@sgreferidos.com / admin123

# 4. Frontend
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Credenciales por defecto (seed)

| Rol    | Email                  | Password  |
| ------ | ---------------------- | --------- |
| Admin  | admin@sgreferidos.com  | admin123  |
| User   | demo@sgreferidos.com   | demo123   |

## Funcionalidades

- **Auth JWT** con registro, login, roles (admin/user)
- **Dashboard usuario** con estadísticas de campañas, leads, referidos
- **CRUD de campañas** con estados (draft, active, paused, completed)
- **Landing Page Builder CMS** con secciones dinámicas (hero, beneficios, testimonios, FAQ)
- **Sistema de recompensas** multi-nivel con subida de PDFs
- **Panel Admin** con gestión de usuarios y campañas
- **Landing pública renderizada desde DB** con diseño dinámico
- **Protección de rutas** en frontend con guards
- **Rate limiting**, Helmet, CORS, validación completa

## Roles

| Rol    | Acceso                          |
| ------ | ------------------------------- |
| admin  | Panel admin + todas las APIs    |
| user   | Su dashboard + campañas propias |

## Extensibilidad

Para producción agregar:
- Redis para caché y sesiones
- CDN para archivos (S3/Cloudflare R2)
- Worker para analytics (Bull/BullMQ)
- WebSockets para tiempo real
- Stripe para pagos
- Docker + docker-compose
