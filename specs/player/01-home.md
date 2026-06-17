# Screen: Player Home

**Route:** `/player/home`  
**Auth:** Required — PLAYER role  
**Purpose:** Player's main hub. Show open matches, upcoming bookings, tournaments, and quick actions.

---

## Layout

**Desktop:** 2-column (main content left, right sidebar)  
**Mobile:** Single column, hero at top, bottom navigation

---

## Mobile Bottom Navigation

Component: `MobileBottomNav`

```
[Início] [Partidas] [Torneios] [Ranking] [Perfil]
   ●
```
Active tab: qOrange icon + label. Inactive: grayLight.

---

## Header

- Left: Quadrik logo mark (small)
- Center: Arena name (if in arena context)
- Right: Notification bell (badge count) + Avatar

---

## Sections

### 1. Hero / Greeting

```
Olá, João! 👋
Bora jogar hoje?
```

- Background: sand gradient
- Sub: `Terça, 17 jun 2025`
- Quick stat pill: `Ranking #3 · Beach Tennis`

---

### 2. Quick Actions (chip buttons)

Horizontal scroll row:
```
[+ Criar partida]  [Reservar quadra]  [Ver ranking]  [Meus torneios]
```

---

### 3. Open Matches Near You

- Section title: `Partidas abertas`
- Subtitle + filter chips: `Hoje` | `Amanhã` | `Beach Tennis` | `Vôlei` | `Intermediário`
- Grid of `MatchCard` components (2 col desktop, 1 col mobile)

**MatchCard content:**
```
Beach Tennis · Intermediário            [Aberta]
─────────────────────────────────────────────
[Av] João Silva
[Av] + 1 vaga disponível
─────────────────────────────────────────────
📍 Arena Pro, BH  ·  Amanhã 07:00
                            [Entrar na partida]
```

- Button: `Ver todas as partidas →`

---

### 4. My Upcoming Bookings

- Section title: `Minhas próximas reservas`
- Max 3 items, `BookingCard` compact

```
Quadra Beach 01  ·  Arena Pro
Amanhã  ·  08:00–09:30                [Confirmada]
```

- Button: `Ver todas →` → `/player/reservas`

---

### 5. Featured Tournaments

- Section title: `Torneios em destaque`
- 2 `TournamentCard` components (horizontal scroll mobile)

---

### 6. My Ranking Position

- Compact `RankingTable` showing player's position + 2 above + 2 below
- Link: `Ver ranking completo →` → `/player/ranking`

---

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards for each section |
| No matches | EmptyState: "Nenhuma partida aberta por aqui. Que tal criar uma?" |
| No bookings | "Sem reservas agendadas. [Reservar agora]" |
| No ranking | "Jogue seu primeiro torneio para entrar no ranking!" |

---

## API Dependencies

```
GET /matches?open=true&nearby=true&limit=6
GET /bookings?userId=me&upcoming=true&limit=3
GET /tournaments?featured=true&limit=2
GET /rankings?userId=me&neighborhood=true
```
