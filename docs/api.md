# Quadrik — API Reference

**Base URL:** `https://api.quadrik.com.br/v1`  
**Documentation:** Swagger UI at `/docs` (non-production environments)  
**Authentication:** `Authorization: Bearer <accessToken>`  
**Content-Type:** `application/json`

---

## Response Format

### Success

```json
{
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 89, "totalPages": 5 }
}
```

### Error

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [{ "field": "email", "message": "Email inválido" }],
  "timestamp": "2025-06-17T10:00:00Z",
  "path": "/auth/register"
}
```

---

## Auth Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/logout` | Logout | Required |
| POST | `/auth/refresh` | Refresh access token | Public (refresh token) |
| POST | `/auth/forgot-password` | Send reset email | Public |
| POST | `/auth/reset-password` | Reset password | Public (reset token) |
| GET | `/auth/me` | Current user info | Required |
| POST | `/auth/switch-club` | Switch club context | Required |

---

## Clubs

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs` | List public clubs | Public |
| POST | `/clubs` | Create club | OWNER |
| GET | `/clubs/:id` | Get club details | Public |
| PATCH | `/clubs/:id` | Update club | OWNER, MANAGER |
| DELETE | `/clubs/:id` | Delete club | OWNER |
| GET | `/clubs/:id/members` | List team members | MANAGER+ |
| POST | `/clubs/:id/invite` | Invite team member | OWNER, MANAGER |

---

## Courts

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/courts` | List courts | Public |
| POST | `/clubs/:clubId/courts` | Create court | MANAGER+ |
| GET | `/courts/:id` | Get court | Public |
| PATCH | `/courts/:id` | Update court | MANAGER+ |
| DELETE | `/courts/:id` | Delete court | OWNER |

---

## Bookings

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/bookings` | List bookings | MANAGER+ |
| POST | `/clubs/:clubId/bookings` | Create booking | RECEPTIONIST+ or PLAYER (own) |
| GET | `/bookings/:id` | Get booking | Owner or RECEPTIONIST+ |
| PATCH | `/bookings/:id` | Update booking | MANAGER+ |
| POST | `/bookings/:id/cancel` | Cancel booking | MANAGER+ or PLAYER (own, within rules) |
| POST | `/bookings/:id/confirm-payment` | Confirm payment | RECEPTIONIST+ |
| POST | `/bookings/:id/no-show` | Mark no-show | RECEPTIONIST+ |
| GET | `/bookings?userId=me` | My bookings | PLAYER |

### Query Parameters (GET /clubs/:clubId/bookings)

```
?date=2025-06-17
?from=2025-06-01&to=2025-06-30
?courtId=uuid
?status=pending,confirmed
?paymentStatus=pending,overdue
?page=1&limit=20
```

---

## Players

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/players` | List players | MANAGER+ |
| POST | `/clubs/:clubId/players` | Create player profile | MANAGER+ or self |
| GET | `/players/:id` | Get player | Public (if public profile) |
| PATCH | `/players/:id` | Update player | MANAGER+ or self |
| GET | `/players/:id/bookings` | Player's bookings | MANAGER+ or self |
| GET | `/players/:id/matches` | Player's matches | Public |
| GET | `/players/:id/tournaments` | Player's tournaments | Public |

---

## Teachers

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/teachers` | List teachers | MANAGER+ |
| POST | `/clubs/:clubId/teachers` | Create teacher | MANAGER+ |
| GET | `/teachers/:id` | Get teacher | MANAGER+ |
| PATCH | `/teachers/:id` | Update teacher | MANAGER+ |
| GET | `/teachers/:id/classes` | Teacher's classes | MANAGER+ or self |
| GET | `/teachers/:id/commissions` | Teacher's commissions | MANAGER+, FINANCE, self |

---

## Classes

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/classes` | List classes | MANAGER+, TEACHER |
| POST | `/clubs/:clubId/classes` | Create class | MANAGER+ |
| GET | `/classes/:id` | Get class | MANAGER+, TEACHER |
| PATCH | `/classes/:id` | Update class | MANAGER+ |
| GET | `/classes/:id/students` | Class students | MANAGER+, TEACHER |
| POST | `/classes/:id/attendance` | Submit attendance | MANAGER+, TEACHER |
| GET | `/classes/:id/attendance` | Get attendance | MANAGER+, TEACHER |

### POST /classes/:id/attendance body

```json
{
  "date": "2025-06-17",
  "attendance": [
    { "playerId": "uuid", "status": "present" },
    { "playerId": "uuid", "status": "absent", "notes": "Avisei com antecedência" }
  ]
}
```

---

## Tournaments

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/tournaments` | List public tournaments | Public |
| POST | `/clubs/:clubId/tournaments` | Create tournament | MANAGER+, ORGANIZER |
| GET | `/tournaments/:id` | Get tournament | Public |
| PATCH | `/tournaments/:id` | Update tournament | MANAGER+, ORGANIZER |
| POST | `/tournaments/:id/publish` | Publish tournament | MANAGER+, ORGANIZER |
| POST | `/tournaments/:id/categories` | Add category | MANAGER+, ORGANIZER |
| PATCH | `/tournaments/:id/categories/:catId` | Update category | MANAGER+, ORGANIZER |
| GET | `/tournaments/:id/registrations` | List registrations | MANAGER+, ORGANIZER, Public (summary) |
| POST | `/tournaments/:id/register` | Register for tournament | PLAYER |
| POST | `/tournaments/:id/generate-matches` | Generate bracket | MANAGER+, ORGANIZER |

---

## Matches

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/matches` | List open matches | Public |
| POST | `/matches` | Create match | PLAYER |
| GET | `/matches/:id` | Get match | Public |
| PATCH | `/matches/:id` | Update match | Creator or MANAGER+ |
| POST | `/matches/:id/join` | Join match | PLAYER |
| POST | `/matches/:id/leave` | Leave match | PLAYER |
| POST | `/matches/:id/result` | Submit result | MANAGER+, ORGANIZER, or both participants confirm |
| GET | `/tournaments/:id/matches` | Tournament matches | Public |

---

## Rankings

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/rankings` | List rankings | Public |
| POST | `/clubs/:clubId/rankings` | Create ranking | MANAGER+, ORGANIZER |
| GET | `/rankings/:id` | Get ranking | Public |
| PATCH | `/rankings/:id` | Update ranking | MANAGER+, ORGANIZER |
| GET | `/rankings/:id/entries` | Get ranking entries | Public |
| POST | `/rankings/:id/recalculate` | Trigger recalculation | MANAGER+, ORGANIZER |
| PATCH | `/rankings/:id/entries/:playerId` | Manual point update | MANAGER+, ORGANIZER |

---

## Payments

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/payments` | List payments | MANAGER+, FINANCE |
| POST | `/clubs/:clubId/payments` | Create payment entry | MANAGER+, FINANCE, RECEPTIONIST |
| GET | `/payments/:id` | Get payment | MANAGER+, FINANCE, owner |
| POST | `/payments/:id/confirm` | Confirm payment | MANAGER+, FINANCE, RECEPTIONIST |
| POST | `/payments/:id/refund` | Issue refund | OWNER, MANAGER |
| GET | `/payments?userId=me` | My payments | PLAYER |

---

## Reports

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/clubs/:clubId/reports/revenue` | Revenue report | OWNER, MANAGER, FINANCE |
| GET | `/clubs/:clubId/reports/occupancy` | Occupancy report | OWNER, MANAGER |
| GET | `/clubs/:clubId/reports/players` | Players report | OWNER, MANAGER |
| GET | `/clubs/:clubId/reports/teachers` | Teachers report | OWNER, MANAGER |
| GET | `/clubs/:clubId/reports/tournaments` | Tournaments report | OWNER, MANAGER |
| GET | `/clubs/:clubId/reports/daily-close` | Daily close | OWNER, MANAGER, FINANCE |

**Common query params for reports:** `?from=2025-06-01&to=2025-06-30&format=json|csv`

---

## Files

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| POST | `/files/upload` | Upload file | Required |
| DELETE | `/files/:id` | Delete file | Owner or MANAGER+ |

Upload returns: `{ id, url, storageKey, mimeType, sizeBytes }`

---

## Notifications

| Method | Route | Description | Required Role |
|--------|-------|-------------|---------------|
| GET | `/notifications` | My notifications | Required |
| PATCH | `/notifications/:id/read` | Mark as read | Owner |
| POST | `/notifications/read-all` | Mark all as read | Required |

---

## Pagination

All list endpoints support:
```
?page=1&limit=20
```

Default: `page=1, limit=20`, max limit: `100`.

Response `meta`:
```json
{
  "page": 1,
  "limit": 20,
  "total": 89,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false
}
```
