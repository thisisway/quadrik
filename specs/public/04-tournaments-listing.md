# Screen: Tournaments Listing

**Route:** `/torneios`  
**Auth:** Public  
**Purpose:** Allow players to discover and browse tournaments across all arenas.

---

## Layout

**Desktop:** Filter bar top + 3-column card grid  
**Mobile:** Filter chips (horizontal scroll) + single-column list

---

## Sections

### 1. Page Header

- Headline: `Torneios` (h1/qNavy)
- Subtext: `Encontre competições abertas para inscrição`
- SearchInput: `Buscar torneio, modalidade ou arena...`

---

### 2. Filters

**Status chips (single select):**
`Todos` | `Inscrições abertas` | `Em andamento` | `Encerrados`

**Sport type (multiselect):**
Beach Tennis | Vôlei de Praia | Padel | Tênis

**Category (multiselect):**
Feminino | Masculino | Misto | Sub-18 | Masters

**Date range:**
Start date — End date pickers

**State / City:**
UF select + city text

---

### 3. Tournament Cards Grid

Component: `TournamentCard`

Each card shows:
- Cover image or sport illustration (fallback)
- Status badge: `Inscrições abertas` (success) / `Em andamento` (info) / `Encerrado` (gray)
- Tournament name (h4/qNavy)
- Arena name + city (small/gray)
- Date range: `20–25 Jul 2025`
- Sport + categories row (Badge chips)
- Registrations: `34/64 inscritos`
- CTA: `Ver torneio` (button secondary sm)

---

### 4. Featured Tournament Banner (optional)

- Full-width card with grad-sun background
- Featured tournament highlight
- CTA: `[Inscrever-se]`

---

## States

| State | Behavior |
|-------|----------|
| Loading | 6 card skeletons |
| Empty | EmptyState: "Nenhum torneio encontrado para esses filtros." |
| Error | ErrorState with retry |

---

## Interactions

- Filter change → update URL params → refetch
- Card click → `/torneios/[slug]`

---

## API Dependencies

```
GET /tournaments?status=&sport=&category=&state=&city=&page=&limit=12
```
