# Screen: Players

**Route:** `/app/jogadores`  
**Auth:** Required — OWNER, MANAGER  
**Purpose:** Manage sports profiles of players linked to the arena — different from the general clients list (focuses on sports/competitive data).

---

## Layout

**Desktop:** Table + detail panel  
**Mobile:** Card list

---

## Toolbar

```
[SearchInput: Nome do jogador...]  [Modalidade ▾]  [Nível ▾]  [+ Adicionar jogador]
```

---

## Table

| Avatar + Nome | Modalidade | Nível | Ranking | W/L | Últimos jogos | Ações |
|---------------|-----------|-------|---------|-----|---------------|-------|
| [Av] João Silva | Beach Tennis | Intermediário | #3 | 18/6 | ● ● ● ○ ● | ··· |

---

## Player Profile Detail

**Route:** `/app/jogadores/[id]`

Sections:
1. **Hero card** — avatar, name, sport badges, level badge, ranking position
2. **Stats row** — Partidas: 24 | Vitórias: 18 | Derrotas: 6 | Win rate: 75%
3. **Ranking History** — sparkline chart showing ranking over time
4. **Match History** — table of recent matches with opponents, score, result
5. **Tournament History** — list of tournaments participated, finish position
6. **Booking History** — link to client bookings

---

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton table |
| Empty | EmptyState: "Nenhum jogador cadastrado com perfil esportivo." |

---

## API Dependencies

```
GET /clubs/:clubId/players?type=competitive&sport=&level=
GET /players/:id
GET /players/:id/matches
GET /players/:id/tournaments
```
