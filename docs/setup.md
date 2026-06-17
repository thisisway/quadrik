# Quadrik — Local Setup Guide

## Prerequisites

- Node.js 20+ (LTS)
- pnpm 9+
- Docker (for local PostgreSQL + Redis)
- Git

---

## 1. Clone and Install

```bash
git clone https://github.com/your-org/quadrik.git
cd quadrik
pnpm install
```

---

## 2. Environment Variables

Copy the example files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### `apps/api/.env`

```env
# App
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://quadrik:quadrik@localhost:5432/quadrik_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-change-in-production
REFRESH_TOKEN_EXPIRES_IN=7d

# Storage (S3-compatible)
STORAGE_BUCKET=quadrik-dev
STORAGE_REGION=auto
STORAGE_ACCESS_KEY=your-key
STORAGE_SECRET_KEY=your-secret
STORAGE_ENDPOINT=https://your-s3-endpoint.com

# Email
EMAIL_FROM=noreply@quadrik.com.br
RESEND_API_KEY=re_your_key

# Sentry (optional in dev)
SENTRY_DSN=
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 3. Start Infrastructure (Docker)

```bash
# Start PostgreSQL + Redis
docker compose up -d

# Verify
docker compose ps
```

`docker-compose.yml` (at repo root):
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: quadrik
      POSTGRES_PASSWORD: quadrik
      POSTGRES_DB: quadrik_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 4. Database Setup (Prisma)

```bash
# Run migrations
pnpm --filter api prisma migrate dev

# Seed initial data (optional)
pnpm --filter api prisma db seed
```

The seed creates:
- 1 super admin user: `admin@quadrik.com / Admin123!`
- 1 demo club: "Arena Demo"
- 3 demo courts
- Sample bookings, players, tournaments

---

## 5. Start Development Servers

```bash
# All apps in parallel (via Turborepo)
pnpm dev

# Or individually:
pnpm --filter web dev        # → http://localhost:3000
pnpm --filter api dev        # → http://localhost:3001
```

API Swagger docs: `http://localhost:3001/docs`

---

## 6. Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build
pnpm --filter api build
```

---

## 7. Testing

```bash
# All tests
pnpm test

# Unit tests (API)
pnpm --filter api test

# Integration tests (API — requires running DB)
pnpm --filter api test:e2e

# Component tests (web)
pnpm --filter web test
```

---

## 8. Linting & Formatting

```bash
# Lint all packages
pnpm lint

# Format all files
pnpm format

# Type check all packages
pnpm type-check
```

---

## Turborepo Pipeline

`turbo.json` defines the build pipeline:

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "dependsOn": ["build"] },
    "type-check": {}
  }
}
```

---

## Common Issues

### Port already in use

```bash
# Find and kill process on port 3001
npx kill-port 3001
```

### Database connection refused

```bash
# Check if Docker containers are running
docker compose ps

# Restart containers
docker compose restart
```

### Prisma client out of sync

```bash
pnpm --filter api prisma generate
```

### pnpm workspace not found

Ensure `pnpm-workspace.yaml` exists at root:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```
