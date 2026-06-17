# Screen: Rankings (Manager)

**Route:** `/app/rankings`  
**Auth:** Required — OWNER, MANAGER, ORGANIZER  
**Purpose:** Create and manage rankings for the arena. View current standings and trigger recalculations.

---

## Layout

**Desktop:** Ranking selector (left sidebar) + ranking table (right)  
**Mobile:** Dropdown selector + table below

---

## Rankings List (Left Panel / Dropdown)

Each ranking:
- Name + sport + category
- Last updated datetime
- Status: Active / Archived

Button: `[+ Criar ranking]`

---

## Ranking Table View

### Header
- Ranking name (h2)
- Sport + Category chips
- Last updated: `Atualizado em 15 jun 2025 às 14:32`
- Actions: `[Recalcular]` `[Editar]` `[Publicar/Despublicar]` `[Exportar]`

### Table

Component: `RankingTable`

| Pos | Var | Player | Points | Tournaments | W/L | Last match |
|-----|-----|--------|--------|-------------|-----|------------|
| 1 | — | [Av] João Silva | 1.240 | 5 | 18/6 | 10 jun |
| 2 | ↑+1 | [Av] Pedro Costa | 1.180 | 4 | 15/8 | 12 jun |

Variation icons: ↑ (success) | ↓ (error) | ★ (new) | — (unchanged)

---

## Create/Edit Ranking Modal

```
Nome do ranking *
Modalidade *
Categoria (e.g., Masculino A, Sub-18 Feminino)
Tipo de pontuação:
  ○ Manual (manager enters points)
  ○ Automático (calculated from tournament results)
Torneios vinculados [multiselect — if automatic]
Tabela de pontos por posição [if automatic]
  1º lugar: [100] pts
  2º lugar: [80] pts
  ...
Visibilidade: [Público | Privado]
```

---

## Recalculate Modal

```
Recalcular ranking
─────────────────────────────
Isso vai processar todos os resultados vinculados
e atualizar as posições do ranking.

Período: [Início de temporada — Hoje]

Este processo pode levar alguns segundos.

[Cancelar]  [Recalcular agora]
```

After trigger: shows progress indicator, then success toast.

---

## Manual Point Edit (per player)

Inline edit on table row → points input → save

---

## States

| State | Behavior |
|-------|----------|
| Loading | Table skeleton |
| No rankings | EmptyState: "Nenhum ranking criado." + CTA |
| Recalculating | Button disabled + loading spinner |
| Outdated | Warning banner: "Ranking desatualizado. Clique em Recalcular." |

---

## API Dependencies

```
GET /clubs/:clubId/rankings
POST /clubs/:clubId/rankings
GET /rankings/:id
PATCH /rankings/:id
POST /rankings/:id/recalculate
GET /rankings/:id/entries
```

---

## Business Rules

- Manual rankings require manager to enter points directly
- Automatic rankings pull from tournament results (match result → ranking entry)
- Recalculate is a background job (BullMQ worker); page polls or shows completion via notification
- Public rankings are visible at `/rankings/[id]`
