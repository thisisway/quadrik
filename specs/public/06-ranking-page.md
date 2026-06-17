# Screen: Public Ranking Page

**Route:** `/rankings/[slug]`  
**Auth:** Public  
**Purpose:** Show the public ranking for a club, sport, or category. Accessible to any visitor.

---

## Layout

**Desktop:** Narrow centered layout (max 800px) with left-aligned content  
**Mobile:** Full-width single column

---

## Sections

### 1. Page Header

- Arena logo + name
- Headline: `Ranking — Beach Tennis Masculino A`
- Subtext: `Atualizado em 15 jun 2025 · 48 jogadores`

---

### 2. Category / Type Filters

Tabs or segmented control:
- Tabs matching available ranking types for this club
- Example: `Geral` | `Beach Tennis` | `Vôlei` | `Sub-18` | `Feminino`

---

### 3. Ranking Table

Component: `RankingTable`

| # | Player | Points | Variation | Tournaments | Matches W/L |
|---|--------|--------|-----------|-------------|-------------|
| 1 | [Avatar] João Silva | 1.240 pts | ↑ +2 | 5 | 18/6 |
| 2 | [Avatar] Pedro Costa | 1.180 pts | — | 4 | 15/8 |
| 3 | [Avatar] Ana Martins | 980 pts | ↓ -1 | 4 | 12/9 |

**Variation icons:**
- ↑ green — moved up
- ↓ red — moved down
- — gray — unchanged
- ★ gold — new entry

Top 3 rows have gradient-left accent (grad-sun for 1st, silver/bronze for 2nd/3rd).

---

### 4. Load More

Button: `Carregar mais` or pagination

---

## States

| State | Behavior |
|-------|----------|
| Loading | 10 row skeletons |
| Empty | EmptyState: "Ranking ainda sem dados. Jogue mais torneios para aparecer aqui!" |
| Error | ErrorState |

---

## Interactions

- Category tab change → refetch ranking
- Player row click → `/player/perfil/[id]` (if public profiles enabled)

---

## API Dependencies

```
GET /rankings/:id
GET /rankings/:id/entries?category=&page=
```
