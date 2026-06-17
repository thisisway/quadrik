# Screen: Arena Public Page

**Route:** `/arenas/[slug]`  
**Auth:** Public  
**Purpose:** Show full arena profile, available courts, schedule, and allow players to book or find matches.

---

## Layout

**Desktop:** Full-width hero + 2-column content (main left, sidebar right)  
**Mobile:** Single column, sticky bottom CTA

---

## Sections

### 1. Hero / Cover

- Full-width cover image (max height 360px, object-cover)
- Overlay gradient (bottom 50% → sand/80%)
- On top of overlay (bottom-left):
  - Arena logo (64px avatar, rounded-full, border white 3px)
  - Arena name (h1/white)
  - City, State (small/white 80%)
  - Sport chips (Badge outline white)

---

### 2. Navigation Tabs

Sticky below hero:
- `Horários` | `Sobre` | `Torneios` | `Rankings` | `Avaliações`

---

### 3. Main Content (Left — 65%)

#### Tab: Horários (default)

**Date Selector:**
- Horizontal scroll of day chips: `Sex 17 · Sab 18 · Dom 19 · ...` (7 days)
- Selected day: pill with grad-sun

**Court Filter:**
- All courts | [Court name chips]

**Time Slots Grid:**
- Columns = courts, rows = hours (07:00–22:00)
- Slot states:
  - `Available` → white bg, hover: sand, click → booking modal
  - `Occupied` → grayXLight, strikethrough text, no interaction
  - `Blocked` → pattern fill, "Bloqueado" label

**Book Flow (Modal on slot click):**
1. Confirm time + court
2. Enter contact (if not logged in) or auto-fill
3. Confirm → redirect to `/login` if unauthenticated → complete booking

#### Tab: Sobre

- Description text
- Amenities list (icons + labels): Estacionamento, Vestiários, Loja, Wi-Fi, Lanchonete
- Address with embedded map (Google Maps iframe or static image)
- Opening hours table
- Phone + WhatsApp link

#### Tab: Torneios

- List of upcoming tournaments for this arena
- `TournamentCard` components → links to `/torneios/[slug]`

#### Tab: Rankings

- `RankingTable` for top players at this arena

#### Tab: Avaliações

- Average rating (large number + stars)
- Review cards (reviewer name, date, comment, rating)

---

### 4. Sidebar (Right — 35%)

**Booking Quick Card:**
- `BookingCard` summary component
- CTA: `[Reservar agora]` (button primary full-width)
- Phone: `[WhatsApp]` (button secondary)

**Arena Stats:**
- N quadras
- Horário: 07:00 às 22:00
- Desde: 2019

---

## States

| State | Behavior |
|-------|----------|
| Loading | Cover skeleton + sections skeleton |
| No slots | "Nenhum horário disponível para essa data." + date navigation |
| Arena not found | 404 page with search suggestion |

---

## Interactions

- Date chip click → reload time slots for that date
- Court filter → filter columns
- Available slot click → booking modal
- "Reservar agora" sidebar CTA → scroll to time slots or booking modal

---

## API Dependencies

```
GET /clubs/:slug                    — Arena details
GET /clubs/:clubId/courts           — Court list
GET /clubs/:clubId/bookings?date=   — Occupied slots for date
GET /clubs/:clubId/tournaments      — Upcoming tournaments
GET /rankings/:slug                 — Public ranking
```
