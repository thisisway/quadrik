# Screen: Bookings List

**Route:** `/app/reservas`  
**Auth:** Required — OWNER, MANAGER, RECEPTIONIST  
**Purpose:** Tabular view of all bookings with filtering, search, and bulk actions.

---

## Layout

**Desktop:** Full-width table with toolbar above  
**Mobile:** Card list with filter drawer

---

## Toolbar

```
[SearchInput: Buscar por cliente, quadra...]   [Filtros ▾]   [+ Nova reserva]
```

**Filter Drawer / Dropdown:**
- Date range: [from] — [to]
- Court: multiselect
- Status: Todas | Pendente | Confirmada | Cancelada | Concluída | No-show
- Payment: Todos | Pago | Pendente | Vencido

---

## Table (Desktop)

Component: `TanStack Table`

| # | Cliente | Quadra | Data | Horário | Duração | Valor | Pagamento | Status | Ações |
|---|---------|--------|------|---------|---------|-------|-----------|--------|-------|
| 4521 | João Silva | Quadra 1 | 17 jun | 08:00 | 90min | R$ 90 | [Pago ✓] | [Confirmada] | ··· |
| 4520 | Maria Souza | Quadra 2 | 17 jun | 09:30 | 60min | R$ 60 | [Pendente] | [Pendente] | ··· |

**Column features:**
- Sortable columns: Date, Time, Value
- Status column: `StatusBadge` component
- Payment column: `StatusBadge` component
- Actions (···): Dropdown with Ver detalhes | Confirmar pagamento | Cancelar | No-show

**Row click** → Opens booking detail drawer (same as agenda drawer)

---

## Mobile Card List

Each booking as `BookingCard`:
```
Quadra Beach 01  ·  17 jun · 08:00–09:30
João Silva                    [Confirmada]
R$ 90,00  ·  [Pago]
```

---

## Booking Detail (Drawer or Page)

**Route:** `/app/reservas/[id]`

Full detail view:
- All booking info
- Payment history
- Participant list (add/remove)
- Notes section
- Activity log (who created, who confirmed payment, who cancelled)
- Action buttons: Editar | Confirmar pagamento | Cancelar | Marcar no-show

---

## Bulk Actions

- Checkbox on rows → bulk action bar appears
- Available bulk actions: Confirmar pagamento (selected) | Cancelar (selected) | Exportar CSV

---

## States

| State | Behavior |
|-------|----------|
| Loading | Table skeleton (8 rows) |
| Empty | EmptyState: "Nenhuma reserva encontrada com esses filtros." |
| No bookings at all | EmptyState with CTA: "Criar primeira reserva" |

---

## API Dependencies

```
GET /clubs/:clubId/bookings?status=&from=&to=&courtId=&page=&limit=20
GET /bookings/:id
PATCH /bookings/:id
POST /bookings/:id/cancel
POST /bookings/:id/confirm-payment
```

---

## Business Rules

- Only MANAGER/OWNER can cancel confirmed bookings
- Receptionist can create and confirm but not delete
- No-show status can only be set after booking start time
- Cancellation within 24h may trigger refund policy (configurable per club)
