# Quadrik API — NestJS
# Build context: root of monorepo (/)
# Easypanel: Source=Github, Branch=main, Caminho de Build=/

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/validators/package.json ./packages/validators/
RUN pnpm install --frozen-lockfile

# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY packages/types/ ./packages/types/
COPY packages/validators/ ./packages/validators/
COPY apps/api/ ./apps/api/
# Schema is at apps/api/prisma/schema.prisma — Prisma finds apps/api/package.json as root
WORKDIR /app/apps/api
RUN ./node_modules/.bin/prisma generate
WORKDIR /app
# NestJS webpack build — bundles workspace packages into dist/main.js
RUN pnpm --filter @quadrik/api build

# ── Stage 3: production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
# Run from apps/api so Node resolves @prisma/client, @nestjs/* etc. from
# apps/api/node_modules (pnpm workspace pattern)
WORKDIR /app/apps/api
ENV NODE_ENV=production

# Root node_modules: workspace packages (@quadrik/types, @quadrik/validators)
COPY --from=builder /app/node_modules /app/node_modules
# App node_modules: @prisma/client, @nestjs/*, etc. + Prisma engine binary
COPY --from=builder /app/apps/api/node_modules ./node_modules
# Compiled TypeScript output
COPY --from=builder /app/apps/api/dist ./dist
# Prisma schema + migrations needed for migrate deploy at startup
COPY --from=builder /app/apps/api/prisma ./prisma
COPY apps/api/package.json ./package.json

EXPOSE 3001
# Run migrations then start the app
# Resolve any failed migration left from a previous crashed deploy, then apply migrations
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate resolve --rolled-back 20260617210239_init 2>/dev/null; ./node_modules/.bin/prisma migrate deploy && node dist/main.js"]
