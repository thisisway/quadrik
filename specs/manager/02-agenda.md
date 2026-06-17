# Screen: Manager Agenda

**Route:** `/app/agenda`  
**Auth:** Required — OWNER, MANAGER, RECEPTIONIST  
**Purpose:** Visual calendar to manage all court bookings, classes, and blocks for the day or week.

---

## Layout

**Desktop:** Full content area, sidebar collapsed option  
**Mobile:** Day view only, vertical scroll, court toggle at top

---

## Header Controls

```
[← Hoje →]  [Data: 17 jun 2025 ▾]    Dia | Semana    [+ Nova reserva]
[Quadra: Todas ▾]  [Modalidade: Todas ▾]  [Status: Todos ▾]
```

---

## Main: Day View (default)

### Time Axis

- Left column: hours from `07:00` to `22:00`, each row = 60min = 80px height
- 30min sub-markers (lighter line)

### Court Columns

- Each court = 1 column
- Column header: court name + sport icon + status badge (Active/Maintenance)
- Minimum 3 courts visible, horizontal scroll for more

### Slot Cell States

| State | Visual |
|-------|--------|
| Available | White bg, hover: sand, cursor pointer |
| Confirmed booking | success-subtle bg (#D1FAE5), green left border 4px |
| Pending booking | warning-subtle bg (#FEF3C7), amber left border 4px |
| Cancelled | grayXLight bg, strikethrough label |
| Class / Aula | info-subtle bg (#DBEAFE), blue left border 4px |
| Block / Manutenção | diagonal pattern fill, grayLighter |

### Booking Block Content (when space allows)

```
[08:00 – 09:30]
João Silva
R$ 90,00 · [Confirmada]
```

### Interactions

- **Click available slot** → Quick booking modal
- **Click existing booking** → Booking detail drawer (right side)
- **Drag booking** → Reschedule (if drag-and-drop implemented, phase 2)

---

## Week View

- X-axis: 7 days (Mon–Sun), each day = column
- Y-axis: hours (07:00–22:00)
- Court switcher: Tab/select at top to choose which court to show in week view
- More compact cells (no price shown, just initials + status color)

---

## Booking Detail Drawer

Opens from right (320px wide):

```
Reserva #4521
─────────────────────────────
Quadra: Quadra Beach 01
Data: Seg, 17 jun 2025
Horário: 08:00 – 09:30

Criado por: Maria (Recepção)
─────────────────────────────
Participantes:
  [Avatar] João Silva (titular)
  [Avatar] Pedro Costa
  [Avatar] + Adicionar

─────────────────────────────
Financeiro:
  Valor: R$ 90,00
  Status: [Pendente]
  [✓ Confirmar pagamento]

─────────────────────────────
Notas: "Cliente vai atrasar 10min"

[Editar]  [Cancelar reserva]
```

---

## Quick Booking Modal

Triggered by clicking an available slot:

```
Nova Reserva
─────────────────────────────
Quadra: Quadra Beach 01 (pre-filled)
Data: 17 jun 2025 (pre-filled)
Horário: 08:00 (pre-filled)
Duração: [60min ▾] → end time calculated

Cliente:
[SearchInput — nome ou telefone]

Valor: R$ [  90,00  ]
Pagamento: [Pendente ▾]

Observações: [textarea]

[Cancelar]  [Criar reserva]
```

---

## Block / Maintenance Modal

Triggered by "Bloquear horário" button:

```
Bloquear horário
─────────────────────────────
Quadra: [Select]
Data início: [DatePicker]
Hora início: [TimePicker]
Data fim: [DatePicker]
Hora fim: [TimePicker]
Motivo: [Select: Manutenção | Evento | Reservado | Outro]
Observação: [textarea]

[Cancelar]  [Bloquear]
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton grid |
| No bookings | Empty day view with available slots visible |
| All slots full | Grid fully colored, no white cells |

---

## API Dependencies

```
GET /clubs/:clubId/courts               — Court list
GET /clubs/:clubId/bookings?date=       — Bookings for day view
GET /clubs/:clubId/bookings?from=&to=  — Bookings for week view
POST /clubs/:clubId/bookings           — Create quick booking
PATCH /bookings/:id                    — Update booking
POST /bookings/:id/cancel              — Cancel booking
POST /bookings/:id/confirm-payment     — Mark payment confirmed
```

---

## Business Rules

- A court cannot have two overlapping bookings
- Blocking a court cancels any existing pending bookings in that window (confirm modal required)
- Classes show in the same grid as bookings but with different visual style
- Minimum booking duration: 60 minutes (configurable per club)
