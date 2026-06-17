# Quadrik Component Library

All components live in `packages/ui/src/`. Each component must have: variants, loading state, disabled state, accessibility attributes, and basic tests.

---

## Component Catalog

### Form & Input

| Component | Description | Key Variants |
|-----------|-------------|--------------|
| `Button` | Primary interactive element | `primary` (sun gradient), `secondary` (outline), `ghost`, `danger` / sizes: `sm`, `md`, `lg` |
| `IconButton` | Icon-only button | `solid`, `outline`, `ghost` / sizes: `sm`, `md`, `lg` |
| `Input` | Text input | `default`, `error`, `success`, `disabled` / with prefix/suffix slot |
| `Textarea` | Multi-line input | `default`, `error`, `resizable` |
| `Select` | Dropdown selector | `default`, `error`, `multi` |
| `SearchInput` | Input with search icon + clear button | Default, loading, active |
| `DatePicker` | Calendar date selector | Single, range |
| `TimePicker` | Time slot selector | Grid layout with time slots |

### Display & Feedback

| Component | Description | Key Variants |
|-----------|-------------|--------------|
| `Badge` | Compact label | `default`, `success`, `warning`, `error`, `info` / `solid`, `outline`, `subtle` |
| `StatusBadge` | Booking/match/payment status | Maps to domain status values with semantic colors |
| `Toast` | Transient notification | `success`, `error`, `warning`, `info` with icon |
| `EmptyState` | Empty list/page state | With icon, title, description, CTA |
| `LoadingState` | Skeleton or spinner | `skeleton`, `spinner` |
| `ErrorState` | Error boundary fallback | With retry action |

### Cards

| Component | Description | Key Variants |
|-----------|-------------|--------------|
| `Card` | Base card container | Default, hover, selected |
| `MetricCard` | Dashboard KPI card | With trend indicator (up/down/neutral) |
| `MatchCard` | Player-facing match card | Open, full, confirmed, cancelled |
| `CourtCard` | Court display card | Available, occupied, maintenance |
| `BookingCard` | Booking summary card | Pending, confirmed, cancelled, completed |
| `PlayerAvatar` | Player photo + name | `sm` (32px), `md` (48px), `lg` (64px), `xl` (96px) |
| `PlayerCard` | Full player profile card | Compact, expanded |
| `TournamentCard` | Tournament summary card | Open, in-progress, finished |
| `DashboardCard` | Manager dashboard widget | With icon, value, label |
| `FinancialCard` | Financial summary card | Revenue, pending, overdue |

### Layout & Navigation

| Component | Description | Key Variants |
|-----------|-------------|--------------|
| `NavigationSidebar` | Desktop left sidebar | Collapsed, expanded |
| `MobileBottomNav` | Mobile bottom tab bar | Player, Teacher, Manager variants |
| `Tabs` | Horizontal tab navigation | `line`, `pill` |
| `SegmentedControl` | Toggle between views | 2-4 options |

### Overlay

| Component | Description | Key Variants |
|-----------|-------------|--------------|
| `Modal` | Centered dialog | `sm` (400px), `md` (560px), `lg` (720px) |
| `Drawer` | Side panel | `left`, `right` / `sm`, `md`, `lg` widths |
| `BottomSheet` | Mobile bottom sheet | Snap points: half, full |

### Specialized

| Component | Description | Notes |
|-----------|-------------|-------|
| `RankingTable` | Ranking leaderboard | Position, avatar, name, points, trend |
| `BookingCalendar` | Agenda grid view | Daily, weekly / per court |

---

## Button Specification

### Variants

```
primary   → background: grad-sun, text: white, hover: opacity 0.92
secondary → background: white, border: qNavy 2px, text: qNavy, hover: bg sand
ghost     → background: transparent, text: qNavy, hover: bg grayXLight
danger    → background: error, text: white, hover: opacity 0.92
```

### Sizes

```
sm → height: 36px, px: 16px, font: 14px/600
md → height: 44px, px: 20px, font: 15px/700
lg → height: 52px, px: 28px, font: 16px/700
```

### States

```
default  → base styles
hover    → slight opacity or background shift
focus    → 2px offset ring in qBlue
active   → scale: 0.98
loading  → spinner replaces label, disabled pointer events
disabled → opacity: 0.4, cursor: not-allowed
```

---

## StatusBadge Color Mapping

| Status | Color | Background |
|--------|-------|------------|
| `confirmed` / `paid` / `active` | `#10B981` | `#D1FAE5` |
| `pending` | `#F59E0B` | `#FEF3C7` |
| `cancelled` / `overdue` / `error` | `#EF4444` | `#FEE2E2` |
| `completed` | `#0477BF` | `#DBEAFE` |
| `no-show` | `#707070` | `#F0F0F0` |
| `maintenance` | `#F47A32` | `#FED7AA` |

---

## Accessibility Requirements

- All interactive elements: `tabIndex`, `aria-label` or visible label
- Buttons: keyboard activatable (Enter/Space)
- Modals: focus trap, `role="dialog"`, `aria-labelledby`
- Form fields: `<label>` associated via `htmlFor`/`id`
- Color is never the only conveyor of meaning (always pair with icon/text)
- Minimum contrast ratio: 4.5:1 for text, 3:1 for UI elements
- Focus ring: `outline: 2px solid #0477BF; outline-offset: 2px`
