# Screen: Manager Dashboard

**Route:** `/app/dashboard`  
**Auth:** Required — roles: OWNER, MANAGER, RECEPTIONIST, FINANCE  
**Purpose:** Central operations hub. Give the manager a real-time overview of the arena's day.

---

## Layout

**Desktop:** Sidebar (240px) + main content (flex-1), header 64px sticky  
**Mobile:** Bottom nav + scrollable content, no sidebar

---

## Sidebar Navigation

Component: `NavigationSidebar`

```
[Quadrik logo]
[Arena name] ▾  (arena switcher for multi-unit)

─── Operação ───
📅 Dashboard        (active state)
🗓️  Agenda
📋 Reservas
👥 Clientes
🎾 Jogadores
👨‍🏫 Professores
📚 Aulas

─── Negócio ───
💰 Financeiro
🏆 Torneios
📊 Rankings
📈 Relatórios

─── Config ───
⚙️  Configurações

─── Rodapé ───
[Avatar] Nome do usuário
[Logout]
```

---

## Header

- Left: Page title `Dashboard` + date `Terça, 17 jun 2025`
- Right: Notification bell (with badge count) + User avatar + role chip

---

## Main Content Sections

### 1. Metric Cards Row

Component: `MetricCard` — 6 cards, grid 3 cols (desktop) / 2 cols (tablet) / 1 col (mobile)

| Card | Value | Trend |
|------|-------|-------|
| Reservas hoje | 14 | ↑ vs ontem |
| Receita hoje | R$ 3.480 | ↑ 12% |
| Ocupação | 68% | ↑ 5% |
| Pagamentos pendentes | 3 | — |
| Alunos ativos | 47 | ↑ 2 |
| Torneios abertos | 1 | — |

Each `MetricCard`:
- Icon (24px, colored bg circle, brand color)
- Label (12px/700/uppercase/gray)
- Value (h2/qNavy, large number)
- Trend chip (↑ success or ↓ error or — gray)
- bg: white, radius: lg, shadow: sm, padding: 24px

---

### 2. Today's Agenda Summary

- Section title: `Agenda de hoje`
- Link: `Ver agenda completa →`
- Compact timeline: shows next 6 time slots

Each row:
```
08:00  Quadra 1  [Confirmada]  João Silva + 3  R$ 90,00
09:30  Quadra 2  [Pendente]    Maria Souza + 1  R$ 60,00
```
Component: compact `BookingCard` in list form  
Click → `/app/reservas/[id]`

**Floating CTA:** `[+ Nova reserva]` (button primary)

---

### 3. Alert Panel

- Section title: `Alertas` with badge count
- Alert items (max 5 shown, "Ver todos →"):

| Type | Icon | Text |
|------|------|------|
| overdue payment | 🔴 | "3 pagamentos venceram hoje" |
| maintenance | 🟡 | "Quadra 3 em manutenção" |
| tournament closing | 🟠 | "Torneio verão encerra inscrições em 2 dias" |
| new message | 🔵 | "João Silva enviou uma mensagem" |

---

### 4. Occupancy Chart

- Section title: `Ocupação — últimos 7 dias`
- Bar chart (Recharts `BarChart`)
- X-axis: days (Mon–Sun)
- Y-axis: occupancy percentage
- Bar color: gradient qBlue to qNavy
- Hover tooltip: `Seg 13/06: 72%`

---

### 5. Quick Actions

Row of icon buttons:
- `[+ Reserva]` → `/app/reservas/new`
- `[+ Cliente]` → `/app/clientes/new`
- `[+ Aula]` → `/app/aulas/new`
- `[+ Bloqueio]` → agenda block modal
- `[Ver relatório]` → `/app/relatorios`

---

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton for all metric cards + chart |
| No bookings today | Metric card shows 0, agenda shows EmptyState |
| Multi-unit | Arena switcher in sidebar allows switching context; all data updates |

---

## Interactions

- Arena switcher → updates all data to selected club context
- Metric card click → navigates to relevant module (e.g., "Pagamentos pendentes" → `/app/financeiro?status=pending`)
- Alert click → relevant page (overdue → `/app/financeiro`, maintenance → `/app/agenda`)
- `+ Nova reserva` → booking modal

---

## API Dependencies

```
GET /clubs/:clubId/reports/dashboard   — Metric card data
GET /clubs/:clubId/bookings?date=today — Today's bookings
GET /clubs/:clubId/reports/occupancy?period=7d — Chart data
GET /notifications?unread=true         — Alerts
```

---

## Business Rules

- Occupancy = (booked hours / available hours) × 100
- "Pendentes" = bookings with `paymentStatus = pending` for today
- Alerts are priority-sorted: overdue > maintenance > upcoming deadlines
