# Screen: Player Bookings

**Route:** `/player/reservas`  
**Auth:** Required — PLAYER  
**Purpose:** View all personal court bookings — upcoming and past.

---

## Layout

**Desktop:** Table or card list with filter bar  
**Mobile:** Card list with sticky filter chips

---

## Filter Chips

`Próximas` | `Passadas` | `Todas` | `Pendente` | `Cancelada`

---

## Booking List

Component: `BookingCard` (player variant)

**Upcoming booking:**
```
Quadra Beach 01  ·  Arena Pro
Amanhã, 17 jun  ·  08:00–09:30           [Confirmada]
──────────────────────────────────────
[Av] João + [Av] Pedro + [Av] Ana
R$ 90,00  ·  [Pago]                   [Cancelar]
```

**Past booking:**
```
Quadra Beach 01  ·  Arena Pro
13 jun  ·  08:00–09:30                   [Concluída]
──────────────────────────────────────
R$ 90,00  ·  [Pago]              [Reservar mesmo horário]
```

---

## Booking Detail (Modal or Page)

**Route:** `/player/reservas/[id]`

```
Reserva #4521
──────────────────────────────────────
Quadra: Quadra Beach 01
Arena: Arena Pro, Belo Horizonte
Data: Amanhã, 17 jun 2025
Horário: 08:00 – 09:30
Duração: 90 minutos

Participantes:
  [Av] João Silva  (você)
  [Av] Pedro Costa
  [Av] Ana Martins

Pagamento:
  Total: R$ 90,00
  Status: [Pago]
  Método: PIX

[Cancelar reserva]
```

Cancel booking:
- If within cancellation window → confirm modal → cancel
- If outside window → shows message: "Prazo para cancelamento encerrado. Entre em contato com a arena."

---

## States

| State | Behavior |
|-------|----------|
| Loading | Card skeletons |
| Empty (all) | EmptyState: "Você ainda não tem reservas. [Reservar agora]" |
| Empty (filter) | "Nenhuma reserva com esse filtro." |

---

## API Dependencies

```
GET /bookings?userId=me&status=&page=
GET /bookings/:id
POST /bookings/:id/cancel
```
