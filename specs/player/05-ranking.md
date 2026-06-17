# Screen: Player Ranking

**Route:** `/player/ranking`  
**Auth:** Required — PLAYER  
**Purpose:** View full rankings. Highlight player's own position.

---

## Layout

**Desktop:** Centered narrow layout (max 900px)  
**Mobile:** Full width, sticky player position banner

---

## My Position Banner (Sticky — Mobile)

```
Sua posição: #3  ·  Beach Tennis Masc. A  ·  1.240 pts  ↑ +2
```

Background: grad-sun, text white, radius-full pill

---

## Filter Bar

```
Arena: [Arena Pro ▾]   Modalidade: [Beach Tennis ▾]   Categoria: [Masc. A ▾]
```

---

## Ranking Table

Component: `RankingTable`

**Top 3 special display:**
```
🥇 #1  [Av large] João Silva          1.240 pts  ↑ +2
🥈 #2  [Av large] Pedro Costa         1.180 pts  —
🥉 #3  [Av large] Ana Martins           980 pts  ↓ -1
```
(Podium-style layout with gradient accent)

**Rest of table:**
Standard rows. Player's own row highlighted with sand2 background.

---

## Ranking History Card (Player's own)

```
Sua evolução — últimos 3 meses
[Sparkline chart — position over time]
Melhor posição: #2 (15 mai)  ·  Torneios: 4  ·  Vitórias: 18
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | Table skeleton |
| Not ranked yet | Banner: "Participe de um torneio para entrar no ranking!" |
| Empty | EmptyState: "Este ranking ainda não tem dados." |

---

## API Dependencies

```
GET /rankings/:id/entries?page=
GET /rankings/:id/entries?userId=me&neighborhood=true
```
