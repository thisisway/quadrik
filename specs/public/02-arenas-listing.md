# Screen: Arenas Listing

**Route:** `/arenas`  
**Auth:** Public  
**Purpose:** Allow players and visitors to discover arenas on the Quadrik platform.

---

## Layout

**Desktop:** Sidebar filters (left 280px) + card grid (right)  
**Mobile:** Filter bar at top (chips) + single-column card list

---

## Sections

### 1. Page Header

- Breadcrumb: `Início > Arenas`
- Headline: `Encontre uma arena` (h1/qNavy)
- Subtext: `+500 arenas em todo o Brasil`
- SearchInput: `Buscar arena, cidade ou modalidade...`

---

### 2. Filters (Desktop Sidebar / Mobile Chips)

**Sport type (multiselect chips):**
- Todas | Beach Tennis | Vôlei de Praia | Padel | Tênis

**Location:**
- State select (UF)
- City text input

**Features (checkboxes):**
- Quadras cobertas
- Estacionamento
- Vestiários
- Loja

**Sort:**
- Relevância | Mais próximas | Melhor avaliadas | Mais reservas

---

### 3. Arena Card Grid

**Desktop:** 3 columns | **Tablet:** 2 columns | **Mobile:** 1 column  
**Card component:** `ArenaCard`

Each `ArenaCard` shows:
- Cover image (16:9, radius-md, object-cover)
- Arena name (h4/qNavy)
- City, State (small/gray)
- Sport type chips (Badge outline)
- Quick stats: `N quadras · ★ 4.8`
- CTA button: `Ver horários` (button secondary sm) → `/arenas/[slug]`

---

### 4. Pagination / Load More

- Button `Carregar mais arenas` or numbered pagination
- Total count: `Mostrando 12 de 89 arenas`

---

## States

| State | Behavior |
|-------|----------|
| Loading | Grid of `ArenaCard` skeletons (6 cards) |
| Empty | `EmptyState`: "Nenhuma arena encontrada. Tente mudar os filtros." |
| Error | `ErrorState` with retry button |

---

## Interactions

- Filter changes → URL query params update → refetch (`?sport=beach-tennis&city=belo-horizonte`)
- Click `Ver horários` → `/arenas/[slug]`
- Search → debounce 300ms → update results

---

## API Dependencies

```
GET /clubs?sport=&city=&state=&page=&limit=12
```

Response fields used: `id`, `name`, `slug`, `city`, `state`, `coverUrl`, `sportTypes[]`, `courtCount`, `rating`
