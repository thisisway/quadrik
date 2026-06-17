# Screen: Tournament Public Page

**Route:** `/torneios/[slug]`  
**Auth:** Public (registration requires auth)  
**Purpose:** Display full tournament details: categories, bracket, schedule, results, and registered players.

---

## Layout

**Desktop:** Full-width hero + tabs with content + sidebar  
**Mobile:** Single column with sticky registration CTA at bottom

---

## Sections

### 1. Hero

- Cover image (full-width, 320px height)
- Bottom overlay with:
  - Tournament name (h1/white)
  - Arena name + city (small/white)
  - Date range + status badge

---

### 2. Info Bar (below hero)

Horizontal strip (bg white, shadow-sm):
- `📅 20–25 Jul 2025`
- `🏸 Beach Tennis`
- `📍 Arena Pro, Belo Horizonte`
- `👥 34/64 inscritos`
- Status badge

---

### 3. Tabs Navigation

`Inscrições` | `Categorias` | `Chaveamento` | `Resultados` | `Programação`

---

### 4. Tab: Inscrições (default)

- Registration deadline countdown or notice
- Registered players list grouped by category
- Each entry: PlayerAvatar + Name + Partner (if doubles) + category
- CTA (if open): `[Inscrever-se]` (button primary) → opens category selection modal

**Registration Modal:**
1. Select category
2. Select partner (if doubles) — search player by name
3. Review price + confirm payment
4. Redirect to payment or show payment instructions

---

### 5. Tab: Categorias

Table per category:

| Categoria | Modalidade | Gênero | Limite | Inscritos | Status |
|-----------|-----------|--------|--------|-----------|--------|
| A – Avançado | Duplas | Masculino | 16 | 14 | Abertas |
| B – Intermediário | Duplas | Misto | 16 | 8 | Abertas |
| Sub-18 | Simples | Feminino | 8 | 8 | Esgotada |

---

### 6. Tab: Chaveamento (Bracket)

- Group stage: grid of round-robin tables
- Knockout: bracket tree (SVG or library component)
- Match result display: `João/Pedro 6×3 Carlos/Ana`
- Status per match: `Realizada` (success) | `Agendada` (info) | `W.O.` (warning)

---

### 7. Tab: Resultados

- Podium display: 🥇 1st, 🥈 2nd, 🥉 3rd
- Full results table by category

---

### 8. Tab: Programação

- Day-by-day schedule table
- Court assignments per match
- Time + participants + court

---

### 9. Sidebar (Desktop)

- Registration CTA card
- Price per category
- Key dates list
- Arena contact

---

## States

| State | Behavior |
|-------|----------|
| Not started | Registration open, no bracket yet |
| In progress | Live bracket with results |
| Finished | Podium + full results, registration closed |
| Registration full | "Inscrições encerradas" notice |

---

## API Dependencies

```
GET /tournaments/:id
GET /tournaments/:id/categories
GET /tournaments/:id/registrations
GET /tournaments/:id/matches
POST /tournaments/:id/register
```
