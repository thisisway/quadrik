# Quadrik UI Patterns

## Layout Patterns

### Desktop Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px fixed)    │  MAIN CONTENT AREA              │
│  ─────────────────────    │  ─────────────────────────────  │
│  Logo                     │  Header (arena name + profile)  │
│  ─────────────────────    │  ─────────────────────────────  │
│  Nav items                │  Page content (scrollable)      │
│  - Dashboard              │                                 │
│  - Agenda                 │                                 │
│  - Reservas               │                                 │
│  - Clientes               │                                 │
│  - ...                    │                                 │
│  ─────────────────────    │                                 │
│  Arena switcher           │                                 │
│  User profile             │                                 │
└─────────────────────────────────────────────────────────────┘
```

**Sidebar:** bg white, border-right: 1px solid sand2, shadow-sm  
**Header:** bg white, border-bottom: 1px solid sand2, height 64px, sticky  
**Content:** bg grayXLight or sand, padding 32px

---

### Mobile Player Layout

```
┌─────────────────────┐
│  HEADER (56px)      │  ← arena logo + notifications icon
│─────────────────────│
│                     │
│  SCROLLABLE CONTENT │
│                     │
│                     │
│─────────────────────│
│  BOTTOM NAV (64px)  │  ← Início | Partidas | Torneios | Ranking | Perfil
└─────────────────────┘
```

**Bottom nav:** bg white, border-top: 1px solid sand2, safe-area padding  
**Active tab:** icon + label in qOrange, inactive: grayLight  

---

## Card Patterns

### Metric Card (Dashboard)

```
┌──────────────────────────────┐
│  [Icon]    Label             │  ← gray/700 label
│                              │
│  R$ 3.480                    │  ← h2/navy value
│  ↑ 12% vs ontem              │  ← small/success trend
└──────────────────────────────┘
```
padding: 24px | radius: lg | shadow: sm | bg: white

---

### Booking Card

```
┌──────────────────────────────────────────────────────┐
│  Quadra Beach 01   [Confirmada ✓]                    │
│  08:00 – 09:30  ·  Hoje, 17 jun                     │
│  ─────────────────────────────────────────────────  │
│  [Avatar] João Silva + [Avatar] +2 mais              │
│  R$ 90,00  ·  Pago                                   │
└──────────────────────────────────────────────────────┘
```

---

### Match Card (Player)

```
┌──────────────────────────────────────────────────────┐
│  Beach Tennis · Intermediário        [Aberta]        │
│  ─────────────────────────────────────────────────  │
│  [Avatar] João                                       │
│  [Avatar] + vaga                    →  Entrar       │
│  ─────────────────────────────────────────────────  │
│  📍 Arena Pro  ·  Amanhã 07:00                      │
└──────────────────────────────────────────────────────┘
```

---

## Agenda / Calendar Pattern

### Day View (Manager)

```
         Quadra 1        Quadra 2        Quadra 3
07:00  │[Reserva-conf]│              │              │
08:00  │              │[Reserva-pend]│              │
09:00  │[Aula-Beach]  │[Reserva-conf]│              │
10:00  │              │              │[Bloqueio]    │
11:00  │[Reserva-conf]│              │              │
```

- Each cell: 60min = 80px height
- Color by status: confirmed=success-subtle, pending=warning-subtle, block=grayXLight
- Click on empty slot → quick booking modal
- Click on reservation → detail drawer

---

## Form Patterns

### Field Layout

```
Label (12px/700/uppercase/graphite)
[Input field                    ]
Helper text or error message
```

### Form Section

```
Section title (h4/navy)
─────────────────────────
Field 1
Field 2
[CTA button — full width on mobile]
```

---

## Status Color Mapping (Universal)

| Status | Text Color | Background | Border | Use Case |
|--------|-----------|------------|--------|----------|
| `confirmed` / `paid` / `active` | `#10B981` | `#D1FAE5` | `#6EE7B7` | Booking confirmed, payment paid |
| `pending` | `#F59E0B` | `#FEF3C7` | `#FCD34D` | Awaiting action or payment |
| `cancelled` | `#EF4444` | `#FEE2E2` | `#FCA5A5` | Booking or match cancelled |
| `overdue` | `#EF4444` | `#FEE2E2` | `#FCA5A5` | Payment overdue |
| `completed` | `#0477BF` | `#DBEAFE` | `#93C5FD` | Booking/match finished |
| `no-show` | `#707070` | `#F0F0F0` | `#D8D8D8` | Player didn't show up |
| `maintenance` | `#F47A32` | `#FED7AA` | `#FDBA74` | Court under maintenance |
| `in-progress` | `#0477BF` | `#DBEAFE` | `#93C5FD` | Tournament/match ongoing |

---

## Navigation Patterns

### Sidebar Navigation Item

```
[Icon]  Label                  ← default: gray/600
[Icon]  Label       ●          ← active: qOrange + left border 3px qOrange bg sand
```

### Bottom Tab Item

```
   [Icon]
   Label              ← active: qOrange | inactive: grayLight
```

---

## Empty State Pattern

```
          [Illustration or Icon — 80px]

          Nenhuma reserva ainda
          
          Crie a primeira reserva da arena
          e ela vai aparecer aqui.
          
          [Button: Criar reserva]
```

Center-aligned, max-width 400px, icon in grayLighter, title h3/navy, body body-regular/gray

---

## Loading Skeleton Pattern

Match the shape of the content being loaded:

- Text lines: `h-4 bg-grayXLight rounded-full animate-pulse`
- Cards: Full card shape with muted background
- Avatars: Circle skeleton matching avatar size
- Tables: Row skeletons matching column widths
