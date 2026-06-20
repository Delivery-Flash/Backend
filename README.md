# DeliveryFlash - Backend

API REST para la plataforma DeliveryFlash, construida con **NestJS**, **Prisma ORM** y **PostgreSQL**.
---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js (v18+) |
| Framework backend | NestJS (sobre Express) |
| ORM | Prisma 6.x |
| Base de datos | PostgreSQL |
| Validaciones | class-validator / class-transformer |
| Hash de contraseñas | bcrypt |

Instalacion de PRISMA version 6

> ```bash
> npm install prisma@6 @prisma/client@6
> ```

---

## Requisitos previos

Antes de clonar el proyecto, verificar tener instalado:

- **Node.js** v18 o superior → verifica con `node -v`
- **npm** (viene con Node.js) → verifica con `npm -v`
- **PostgreSQL** corriendo (local o vía Docker)
- **Git**

- **Docker** y **Docker Compose** (para levantar PostgreSQL sin instalarlo directo en la máquina)

---

## Instalación del backend desde cero

```bash
# Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)
# editar .env con tus credenciales reales

# 5. Aplicar migraciones
npx prisma migrate dev

# 6. Levantar el servidor en modo desarrollo
npm run start:dev
```

Si todo salió bien, la API está corriendo en `http://localhost:3000`.

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (mismo nivel que `package.json`), basado en este ejemplo:

```env
# Conexión a PostgreSQL
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/delivery_flash?schema=public"

# Puerto del servidor (opcional, por defecto 3000)
PORT=3000
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión completa a PostgreSQL. Prisma la lee automáticamente |
| `PORT` | Puerto donde corre el servidor NestJS |

---

## Base de datos

### PostgreSQL con Docker

Crea un archivo `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: usuario
      POSTGRES_DB: delivery_flash
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Levantarlo:

```bash
docker compose up -d
```

Verificar que esté corriendo:

```bash
docker ps
```

Detenerlo (sin borrar datos):

```bash
docker compose down
```

Detenerlo y borrar todos los datos (reset completo):

```bash
docker compose down -v
```

## Levantar el proyecto

```bash
npm run start:dev
```

Modo desarrollo, con recarga automática al guardar cambios. La API queda disponible en:

```
http://localhost:3000
```

Otros modos disponibles:

```bash
npm run start        # modo normal, sin watch
```

---


## Módulos implementados

### `auth` — Autenticación y registro

Maneja todo lo relacionado a identidad y acceso: registro de usuarios, y en el futuro, login.

**Modelo de datos (`User`):**

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | Int | autoincremental, llave primaria |
| `first_name` | String | 3-100 caracteres |
| `last_name` | String | 3-100 caracteres |
| `age` | Int | entre 13 y 120 |
| `email` | String | único, formato válido, 5-30 caracteres |
| `password` | String | hasheado con bcrypt antes de guardar, nunca se devuelve en las respuestas |
| `role` | Enum (`CLIENT`, `RIDER`, `ADMIN`) | por defecto `CLIENT` |
| `createdAt` / `updatedAt` | DateTime | automáticos |


---

## Endpoints disponibles

### `POST /auth/register/client`

Registra un nuevo usuario con rol `CLIENTE`.

**Body (JSON):**

```json
{
  "first_name": "Juan Pérez",
  "last_name": "Juan Pérez",
  "age": 22,
  "email": "juan@test.com",
  "password": "abc12345"
}
```

**Respuesta exitosa — `201 Created`:**

```json
{
  "id": 1,
  "first_name": "Juan Pérez",
  "last_name": "Juan Pérez",
  "age": 22,
  "email": "juan@test.com",
  "role": "CLIENTE",
  "createdAt": "2026-06-20T20:40:18.000Z"
}
```


## Comandos útiles

### Proyecto / NestJS

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Levanta el servidor en modo desarrollo (hot reload) |
| `npm run build` | Compila el proyecto a `/dist` |
| `nest generate module nombre` | Genera un módulo nuevo |
| `nest generate controller nombre` | Genera un controller nuevo |
| `nest generate service nombre` | Genera un service nuevo |
| `nest generate resource nombre` | Genera CRUD completo (controller + service + module + DTOs) |

### Prisma

| Comando | Qué hace |
|---|---|
| `npx prisma migrate dev --name nombre_cambio` | Crea y aplica una nueva migración tras modificar el schema |
| `npx prisma migrate reset` | Borra y recrea la base de datos desde cero (solo desarrollo, borra todos los datos) |
| `npx prisma generate` | Regenera el cliente de Prisma tras cambios en el schema |
| `npx prisma studio` | Abre interfaz visual para ver/editar datos |
| `npx prisma --version` | Verifica la versión instalada |

### Docker

| Comando | Qué hace |
|---|---|
| `docker compose up -d` | Levanta los contenedores en segundo plano |
| `docker compose down` | Detiene los contenedores (conserva los datos) |
| `docker compose down -v` | Detiene y borra los datos (reset completo) |
| `docker ps` | Lista contenedores activos |

---
