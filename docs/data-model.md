# Quadrik — Data Model

All table and column names are in English (snake_case for PostgreSQL, camelCase in Prisma).

---

## Entity Relationship Overview

```
User ──┬── UserProfile
       ├── ClubMember ──── Club ──┬── Court ──── CourtSchedule
       │                          │              └── Booking ──── BookingParticipant
       │                          │                  └── Payment
       │                          ├── Player ─────── RankingEntry
       │                          ├── Teacher ─────── Class ──── ClassStudent
       │                          ├── Tournament ─── TournamentCategory
       │                          │                  └── TournamentRegistration
       │                          ├── Match ─────── MatchParticipant
       │                          ├── Ranking ────── RankingEntry
       │                          ├── Notification
       │                          ├── AuditLog
       │                          ├── Product
       │                          └── Subscription ── Plan
       └── File
```

---

## Tables

### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | varchar(255) | |
| email | varchar(255) UNIQUE | |
| phone | varchar(20) | |
| password_hash | varchar(255) | bcrypt |
| avatar_url | varchar(500) | |
| status | enum(active, inactive, blocked) | DEFAULT active |
| email_verified_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `user_profiles`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK users.id | UNIQUE |
| sport_level | enum(beginner, intermediate, advanced) | nullable |
| favorite_sports | varchar[] | |
| city | varchar(100) | |
| state | char(2) | |
| bio | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `clubs`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | varchar(255) | |
| slug | varchar(100) UNIQUE | URL-safe |
| description | text | |
| logo_url | varchar(500) | |
| cover_url | varchar(500) | |
| phone | varchar(20) | |
| email | varchar(255) | |
| whatsapp | varchar(20) | |
| website | varchar(255) | |
| address | varchar(500) | |
| city | varchar(100) | |
| state | char(2) | |
| country | char(2) DEFAULT 'BR' | |
| zip_code | varchar(10) | |
| sport_types | varchar[] | |
| status | enum(active, inactive, suspended) | |
| is_public | boolean DEFAULT true | |
| settings | jsonb | booking rules, cancellation policy |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `club_members`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| user_id | uuid FK users.id | |
| role | enum(OWNER, MANAGER, RECEPTIONIST, FINANCE, TEACHER, ORGANIZER) | |
| status | enum(active, invited, inactive) | |
| invited_by | uuid FK users.id | nullable |
| joined_at | timestamp | nullable |
| created_at | timestamp | |

**Unique:** (club_id, user_id)

---

### `courts`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| name | varchar(100) | |
| sport_type | varchar(50) | beach_tennis, volleyball, padel, tennis |
| surface_type | varchar(50) | sand, clay, cement, synthetic, wood |
| is_indoor | boolean DEFAULT false | |
| player_capacity | int DEFAULT 4 | |
| price_per_hour | decimal(10,2) | |
| status | enum(active, inactive, maintenance) | |
| photo_url | varchar(500) | |
| sort_order | int DEFAULT 0 | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `court_schedules`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| court_id | uuid FK courts.id | |
| day_of_week | int | 0=Sun, 1=Mon, ..., 6=Sat |
| opens_at | time | |
| closes_at | time | |
| is_closed | boolean DEFAULT false | |
| created_at | timestamp | |

---

### `bookings`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| court_id | uuid FK courts.id | |
| created_by_id | uuid FK users.id | |
| start_time | timestamp | |
| end_time | timestamp | |
| duration_minutes | int | derived |
| status | enum(pending, confirmed, cancelled, completed, no_show) | |
| price | decimal(10,2) | |
| payment_status | enum(pending, paid, overdue, refunded, cancelled) | |
| payment_method | varchar(50) | pix, cash, card, transfer |
| notes | text | |
| cancelled_at | timestamp | nullable |
| cancelled_by_id | uuid FK users.id | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:**
- `idx_bookings_club_court_start` ON (club_id, court_id, start_time)
- `idx_bookings_created_by` ON (created_by_id)
- `idx_bookings_status_date` ON (status, start_time)

---

### `booking_participants`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK bookings.id | |
| user_id | uuid FK users.id | nullable (guest) |
| guest_name | varchar(255) | nullable |
| is_host | boolean DEFAULT false | |
| created_at | timestamp | |

---

### `players`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK users.id | UNIQUE |
| club_id | uuid FK clubs.id | |
| level | enum(beginner, intermediate, advanced) | |
| favorite_sport | varchar(50) | |
| status | enum(active, inactive) | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `teachers`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK users.id | |
| club_id | uuid FK clubs.id | |
| sports | varchar[] | |
| commission_rate | decimal(5,2) | percentage |
| status | enum(active, inactive) | |
| bio | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `classes`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| teacher_id | uuid FK teachers.id | |
| court_id | uuid FK courts.id | |
| name | varchar(255) | |
| sport_type | varchar(50) | |
| level | enum(beginner, intermediate, advanced) | |
| max_students | int | |
| price_per_month | decimal(10,2) | |
| schedule | jsonb | [{dayOfWeek, startTime, endTime}] |
| status | enum(active, inactive, finished) | |
| start_date | date | |
| end_date | date | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `class_students`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| class_id | uuid FK classes.id | |
| player_id | uuid FK players.id | |
| status | enum(active, inactive, dropped) | |
| enrolled_at | date | |
| created_at | timestamp | |

---

### `class_attendance`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| class_id | uuid FK classes.id | |
| player_id | uuid FK players.id | |
| class_date | date | |
| status | enum(present, absent, justified, makeup) | |
| notes | text | |
| created_at | timestamp | |

---

### `tournaments`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| name | varchar(255) | |
| slug | varchar(100) UNIQUE | |
| description | text | |
| sport_type | varchar(50) | |
| cover_url | varchar(500) | |
| start_date | date | |
| end_date | date | |
| registration_start | date | |
| registration_end | date | |
| status | enum(draft, registration_open, in_progress, finished, cancelled) | |
| visibility | enum(public, private) | |
| requires_payment | boolean DEFAULT false | |
| regulations | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `tournament_categories`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| tournament_id | uuid FK tournaments.id | |
| name | varchar(100) | e.g., "A – Avançado" |
| sport_type | varchar(50) | |
| gender | enum(male, female, mixed) | |
| format | enum(group_knockout, knockout, round_robin) | |
| max_registrations | int | |
| registration_price | decimal(10,2) | |
| created_at | timestamp | |

---

### `tournament_registrations`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| tournament_id | uuid FK tournaments.id | |
| category_id | uuid FK tournament_categories.id | |
| player_id | uuid FK players.id | |
| partner_id | uuid FK players.id | nullable (doubles) |
| status | enum(pending, confirmed, rejected, withdrawn) | |
| payment_id | uuid FK payments.id | nullable |
| registered_at | timestamp | |
| created_at | timestamp | |

---

### `matches`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| tournament_id | uuid FK tournaments.id | nullable (friendly match) |
| category_id | uuid FK tournament_categories.id | nullable |
| club_id | uuid FK clubs.id | |
| court_id | uuid FK courts.id | nullable |
| round | varchar(50) | QF, SF, F, Group A, etc. |
| match_number | int | within round |
| start_time | timestamp | nullable |
| status | enum(scheduled, in_progress, completed, cancelled, walkover) | |
| score | jsonb | [{set: 1, home: 6, away: 3}, ...] |
| winner_id | uuid FK players.id | nullable |
| is_walkover | boolean DEFAULT false | |
| notes | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `match_participants`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| match_id | uuid FK matches.id | |
| player_id | uuid FK players.id | |
| side | enum(home, away) | |
| partner_id | uuid FK players.id | nullable (doubles) |
| created_at | timestamp | |

---

### `rankings`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| name | varchar(255) | |
| sport_type | varchar(50) | |
| category | varchar(100) | |
| type | enum(manual, automatic) | |
| is_public | boolean DEFAULT true | |
| season_start | date | |
| season_end | date | nullable |
| last_calculated_at | timestamp | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `ranking_entries`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| ranking_id | uuid FK rankings.id | |
| player_id | uuid FK players.id | |
| position | int | |
| previous_position | int | nullable |
| points | decimal(10,2) | |
| tournaments_played | int DEFAULT 0 | |
| wins | int DEFAULT 0 | |
| losses | int DEFAULT 0 | |
| updated_at | timestamp | |

---

### `payments`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| user_id | uuid FK users.id | |
| booking_id | uuid FK bookings.id | nullable |
| subscription_id | uuid FK subscriptions.id | nullable |
| tournament_registration_id | uuid FK tournament_registrations.id | nullable |
| class_id | uuid FK classes.id | nullable |
| description | varchar(255) | |
| amount | decimal(10,2) | |
| status | enum(pending, paid, overdue, cancelled, refunded) | |
| method | varchar(50) | nullable |
| due_date | date | |
| paid_at | timestamp | nullable |
| notes | text | |
| created_by_id | uuid FK users.id | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes:**
- `idx_payments_club_status_due` ON (club_id, status, due_date)
- `idx_payments_user_id` ON (user_id)

---

### `plans`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | varchar(100) | Free, Starter, Pro, Enterprise |
| price_monthly | decimal(10,2) | |
| price_yearly | decimal(10,2) | |
| max_courts | int | |
| max_team_members | int | |
| max_tournaments_per_month | int | |
| features | jsonb | feature flags |
| is_active | boolean DEFAULT true | |
| created_at | timestamp | |

---

### `subscriptions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| plan_id | uuid FK plans.id | |
| status | enum(active, past_due, cancelled, trialing) | |
| current_period_start | date | |
| current_period_end | date | |
| trial_end | date | nullable |
| cancelled_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `notifications`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK users.id | |
| club_id | uuid FK clubs.id | nullable |
| type | varchar(100) | booking_reminder, payment_overdue, result_entered, etc. |
| title | varchar(255) | |
| body | text | |
| data | jsonb | extra payload for deep linking |
| is_read | boolean DEFAULT false | |
| read_at | timestamp | nullable |
| channel | enum(in_app, email, push, whatsapp) | |
| sent_at | timestamp | nullable |
| created_at | timestamp | |

---

### `products`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| name | varchar(255) | |
| description | text | |
| price | decimal(10,2) | |
| stock | int | nullable (unlimited) |
| category | varchar(100) | |
| is_active | boolean DEFAULT true | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `orders`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | |
| user_id | uuid FK users.id | |
| total | decimal(10,2) | |
| status | enum(pending, paid, cancelled) | |
| payment_id | uuid FK payments.id | nullable |
| created_at | timestamp | |

---

### `order_items`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| order_id | uuid FK orders.id | |
| product_id | uuid FK products.id | |
| quantity | int | |
| unit_price | decimal(10,2) | |
| created_at | timestamp | |

---

### `audit_logs`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| club_id | uuid FK clubs.id | nullable |
| user_id | uuid FK users.id | nullable |
| action | varchar(100) | e.g., payment.confirmed, booking.cancelled |
| entity_type | varchar(100) | Payment, Booking, Tournament |
| entity_id | uuid | |
| before | jsonb | state before change |
| after | jsonb | state after change |
| ip_address | varchar(45) | |
| user_agent | varchar(255) | |
| created_at | timestamp | |

---

### `files`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| uploaded_by_id | uuid FK users.id | |
| club_id | uuid FK clubs.id | nullable |
| original_name | varchar(255) | |
| storage_key | varchar(500) | S3 key |
| url | varchar(500) | Public URL |
| mime_type | varchar(100) | |
| size_bytes | bigint | |
| created_at | timestamp | |

---

## Database Indexes

```sql
-- Bookings
CREATE INDEX idx_bookings_club_court_start ON bookings(club_id, court_id, start_time);
CREATE INDEX idx_bookings_created_by ON bookings(created_by_id);
CREATE INDEX idx_bookings_status_date ON bookings(status, start_time);

-- Payments
CREATE INDEX idx_payments_club_status_due ON payments(club_id, status, due_date);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Matches
CREATE INDEX idx_matches_tournament_status ON matches(tournament_id, status);

-- Rankings
CREATE INDEX idx_ranking_entries_ranking_id ON ranking_entries(ranking_id, position);

-- Users
CREATE INDEX idx_users_email ON users(email);

-- Notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Audit
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_club_created ON audit_logs(club_id, created_at);
```
