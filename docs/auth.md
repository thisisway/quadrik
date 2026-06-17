# Quadrik — Authentication

## Overview

Quadrik uses JWT-based authentication with refresh tokens. All tokens are associated with a specific user and, in manager contexts, a specific club.

---

## Token Structure

### Access Token (JWT)

```json
{
  "sub": "user-uuid",
  "email": "user@email.com",
  "name": "João Silva",
  "clubId": "club-uuid",        // null if no club context (player, new user)
  "role": "MANAGER",            // role in the current club
  "iat": 1718620800,
  "exp": 1718621700             // 15 minutes
}
```

### Refresh Token

- Stored in Redis: `refresh:${userId}:${tokenId}` → `{ clubId, role, issuedAt }`
- TTL: 7 days
- Rotation: each refresh call issues a new refresh token and invalidates the old one
- Stored client-side in httpOnly cookie (web) or SecureStore (mobile)

---

## Endpoints

### POST `/auth/register`

```ts
body: {
  name: string
  email: string
  phone: string
  password: string
  role: 'PLAYER' | 'OWNER'
  clubName?: string      // required if role = OWNER
  city?: string
  state?: string
}

response: {
  accessToken: string
  refreshToken: string
  user: { id, name, email, role }
}
```

Side effects:
- Creates `users` record
- Creates `user_profiles` record
- If OWNER: creates `clubs` record + `club_members` record with role OWNER

---

### POST `/auth/login`

```ts
body: { email: string, password: string }

response: {
  accessToken: string
  refreshToken: string
  user: { id, name, email, clubs: [{ id, name, role }] }
}
```

If user belongs to multiple clubs, `clubs[]` is returned and client must call `/auth/switch-club` to set context.

---

### POST `/auth/refresh`

```ts
headers: { Cookie: 'refreshToken=...' }
// or body: { refreshToken: string }  (mobile)

response: { accessToken: string, refreshToken: string }
```

---

### POST `/auth/logout`

Invalidates refresh token in Redis.

---

### POST `/auth/switch-club`

```ts
body: { clubId: string }

response: { accessToken: string }  // new token with new clubId + role
```

---

### POST `/auth/forgot-password`

```ts
body: { email: string }
```

Sends email with reset link containing a short-lived token (15 min). Token stored in Redis.

---

### POST `/auth/reset-password`

```ts
body: { token: string, password: string }
```

---

### GET `/auth/me`

Returns current user info from the access token.

---

## Guards

### `JwtAuthGuard`

- Validates `Authorization: Bearer <token>`
- Attaches `request.user` with decoded payload
- Applied globally, excluded on public routes via `@Public()` decorator

### `RolesGuard`

- Checks `request.user.role` against `@Roles('MANAGER', 'OWNER')` decorator
- Applied on top of `JwtAuthGuard`

### `ClubContextGuard`

- Verifies the `clubId` in the JWT matches the `:clubId` in the route parameter
- Verifies the user is an active member of that club
- Prevents cross-tenant access

---

## RBAC Permissions Matrix

| Permission | OWNER | MANAGER | RECEPTIONIST | FINANCE | TEACHER | ORGANIZER | PLAYER |
|-----------|-------|---------|--------------|---------|---------|-----------|--------|
| club.update | ✓ | ✓ | | | | | |
| club.delete | ✓ | | | | | | |
| court.create | ✓ | ✓ | | | | | |
| court.update | ✓ | ✓ | | | | | |
| booking.create | ✓ | ✓ | ✓ | | | | ✓ (own) |
| booking.view_all | ✓ | ✓ | ✓ | | | | |
| booking.cancel | ✓ | ✓ | ✓ (pending) | | | | ✓ (own, within rules) |
| payment.view | ✓ | ✓ | | ✓ | | | ✓ (own) |
| payment.create | ✓ | ✓ | ✓ | ✓ | | | |
| payment.refund | ✓ | ✓ | | | | | |
| teacher.manage | ✓ | ✓ | | | | | |
| class.manage | ✓ | ✓ | | | ✓ (own) | | |
| tournament.create | ✓ | ✓ | | | | ✓ | |
| tournament.update | ✓ | ✓ | | | | ✓ | |
| match.result | ✓ | ✓ | | | | ✓ | |
| ranking.manage | ✓ | ✓ | | | | | |
| report.view | ✓ | ✓ | | ✓ | | | |
| user.invite | ✓ | ✓ | | | | | |
| role.manage | ✓ | | | | | | |
| settings.update | ✓ | ✓ | | | | | |

---

## Multi-Club Context

Users can belong to multiple clubs. The flow:

1. User logs in → receives access token with no clubId (if new) or last-used clubId
2. If `clubs.length > 1` → frontend shows club switcher
3. User selects club → `POST /auth/switch-club { clubId }` → new access token with that club's role
4. All subsequent requests use new token

---

## Session Security

- Access token: 15-minute expiry, stateless (no server storage)
- Refresh token: 7-day expiry, stored in Redis (can be revoked)
- Refresh token rotation: each use invalidates old token and issues new one
- Failed refresh (token not found in Redis) → force logout
- On password change: all refresh tokens for that user are invalidated
- On account suspension: add `userId` to Redis blocklist checked by `JwtAuthGuard`
