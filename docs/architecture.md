# Quadrik — Architecture

## Overview

Quadrik is a multi-tenant SaaS platform for beach and racket sports management. The architecture follows a monorepo structure with clear separation between web frontend, mobile app, and backend API.

---

## Monorepo Structure

```
quadrik/
  apps/
    web/                    → Next.js web app (manager dashboard + public pages + player area)
    mobile/                 → React Native + Expo (player app — Phase 4)
    api/                    → NestJS REST API

  packages/
    ui/                     → Shared UI component library
    design-tokens/          → Quadrik Design System tokens (TS + CSS)
    types/                  → Shared TypeScript types
    validators/             → Shared Zod schemas
    api-client/             → Auto-generated or manual API client
    utils/                  → Shared utility functions

  prisma/
    schema.prisma           → Database schema
    migrations/             → Prisma migration files

  design-system/            → Design system documentation
  specs/                    → Screen specifications
  docs/                     → Technical documentation
```

**Monorepo manager:** Turborepo  
**Package manager:** pnpm (workspaces)

---

## Frontend Web (`apps/web`)

**Framework:** Next.js 14+ (App Router)  
**Language:** TypeScript (strict)

```
apps/web/
  src/
    app/                    → Next.js App Router pages
      (public)/             → Public routes (/)
      (auth)/               → Auth routes (/login, /cadastro)
      (manager)/app/        → Manager dashboard (/app/...)
      (player)/player/      → Player area (/player/...)
      api/                  → API route handlers (webhooks, etc.)
    components/             → Shared web components
    features/               → Feature-scoped components + logic
      bookings/
      tournaments/
      rankings/
      financial/
      ...
    layouts/                → Layout components (sidebar, header, etc.)
    lib/                    → Utilities: api client, query client, auth helpers
    hooks/                  → Custom React hooks
    styles/                 → Global CSS, Tailwind config
```

**Key libraries:**
| Library | Purpose |
|---------|---------|
| Next.js | SSR, SSG, routing |
| React | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styles |
| Radix UI | Accessible UI primitives |
| React Hook Form | Form state + validation |
| Zod | Schema validation |
| TanStack Query | Server state cache + sync |
| TanStack Table | Advanced data tables |
| Recharts | Charts and graphs |

---

## Mobile (`apps/mobile`)

**Framework:** React Native + Expo (SDK 51+)  
**Router:** Expo Router (file-based)  
**Language:** TypeScript (strict)

**Status:** Phase 4 — architecture prepared, not yet built.

```
apps/mobile/
  app/                      → Expo Router pages
    (tabs)/                 → Bottom tab navigation
    (auth)/                 → Auth screens
    (modal)/                → Modals
  src/
    components/             → Mobile-specific components
    features/               → Feature modules
    hooks/                  → Custom hooks
    services/               → API service layer
```

**Key libraries:**
- React Native Reanimated (animations)
- React Native Gesture Handler (swipe, drag)
- TanStack Query (data fetching)
- Expo Image, Expo Notifications, Expo Router

---

## Backend API (`apps/api`)

**Framework:** NestJS  
**Language:** TypeScript (strict)  
**Database:** PostgreSQL (Prisma ORM)

```
apps/api/
  src/
    modules/                → Feature modules
      auth/
      users/
      clubs/
      courts/
      bookings/
      players/
      teachers/
      classes/
      tournaments/
      matches/
      rankings/
      payments/
      notifications/
      reports/
      files/
      audit/
    common/
      guards/               → Auth guards, role guards
      decorators/           → Custom decorators
      interceptors/         → Logging, transform
      filters/              → Global exception filters
      pipes/                → Validation pipes
    config/                 → App config (env, database, redis)
    database/               → Prisma module
    jobs/                   → BullMQ workers
    main.ts                 → Bootstrap
```

**Each module contains:**
```
module.ts
controller.ts
service.ts
repository.ts (or uses PrismaService directly)
dto/
  create-xxx.dto.ts
  update-xxx.dto.ts
  query-xxx.dto.ts
entities/
  xxx.entity.ts
guards/ (if needed)
xxx.module.spec.ts
```

---

## Infrastructure

| Service | Tool | Notes |
|---------|------|-------|
| Web hosting | Vercel | Next.js optimized |
| API hosting | Railway / Fly.io | NestJS container |
| Database | Supabase PostgreSQL / Neon | Managed PostgreSQL |
| Cache + Queues | Upstash Redis | Redis managed |
| Storage | Cloudflare R2 / AWS S3 | File/image uploads |
| CI/CD | GitHub Actions | Build, test, deploy |
| Error tracking | Sentry | Frontend + backend |
| Email | Resend / SendGrid | Transactional email |

---

## Multi-tenancy

Every resource (court, booking, tournament, player, etc.) is scoped to a `club_id`.

- API routes are prefixed: `/clubs/:clubId/...`
- All database queries include `WHERE club_id = ?`
- JWT payload includes `{ userId, clubId, role }` for the current club context
- Users can belong to multiple clubs (via `club_members` table)
- Switching clubs → issues new JWT with different `clubId`

---

## Authentication Flow

```
1. POST /auth/login → { accessToken (15min), refreshToken (7d) }
2. Client stores tokens (httpOnly cookie or secure storage on mobile)
3. Access token sent in Authorization: Bearer header
4. On 401 → client calls POST /auth/refresh → new access token
5. On logout → POST /auth/logout → invalidate refresh token (Redis blacklist)
```

---

## Request Lifecycle (NestJS)

```
Request
  → Guards (JwtAuthGuard, RolesGuard)
  → Interceptors (LoggingInterceptor, TransformInterceptor)
  → Pipes (ValidationPipe — validates DTO via class-validator)
  → Controller method
  → Service (business logic)
  → Repository / Prisma (database)
  → Response
  → (on error) → GlobalExceptionFilter → standardized error response
```

---

## Error Response Standard

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    { "field": "email", "message": "Email inválido" }
  ],
  "timestamp": "2025-06-17T10:00:00Z",
  "path": "/auth/register"
}
```

---

## Async Jobs (BullMQ)

| Queue | Job | Trigger |
|-------|-----|---------|
| `rankings` | `recalculate-ranking` | After tournament match result |
| `notifications` | `send-booking-reminder` | Scheduled: 24h + 2h before booking |
| `notifications` | `send-payment-overdue` | Daily at 09:00 |
| `notifications` | `send-class-reminder` | 1h before class |
| `reports` | `generate-daily-close` | Daily at 23:59 |
| `tournaments` | `close-tournament` | After tournament end date |
| `auth` | `cleanup-expired-sessions` | Daily at 03:00 |

---

## Caching Strategy (Redis)

| Data | TTL | Strategy |
|------|-----|---------|
| Rankings | 5 min | Invalidate on result entry |
| Report data | 15 min | Invalidate on payment/booking change |
| Club settings | 1 hour | Invalidate on settings update |
| Available time slots | 1 min | Short TTL, high freshness needed |
| User session / refresh token | 7 days | Stored in Redis for invalidation |

---

## Security Measures

- Passwords: bcrypt (cost factor 12)
- JWT: RS256 or HS256 with secret rotation
- Rate limiting: `@nestjs/throttler` — 100 req/min general, 10 req/min on auth endpoints
- RBAC: Custom `@Roles()` decorator + `RolesGuard`
- Input validation: `class-validator` on all DTOs + global `ValidationPipe`
- Multi-tenant isolation: `ClubContextGuard` verifies user belongs to requested club
- Audit log: all financial mutations logged in `audit_logs` table
- File upload: type validation + size limit (10MB) + S3 signed URLs

---

## Observability

- **Sentry:** Error tracking on web, mobile, and API
- **Structured logs:** JSON logs with `correlationId`, `userId`, `clubId`, `duration`
- **Health check:** `GET /health` endpoint for uptime monitoring
- **Job monitoring:** BullMQ dashboard (Bull Board) in non-production
