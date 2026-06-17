# Screen: Player Tournaments

**Route:** `/player/torneios`  
**Auth:** Required — PLAYER  
**Purpose:** Browse tournaments, view registrations, and track matches.

---

## Tabs

`Explorar` | `Minhas inscrições` | `Meus resultados`

---

## Tab: Explorar

- Same as public `/torneios` listing but with:
  - "Já inscrito" badge on enrolled tournaments
  - Personalized filters based on player's sport preferences

---

## Tab: Minhas inscrições

List of tournaments the player has registered for:

```
Torneio Verão Arena Pro                [Inscrições abertas]
Beach Tennis  ·  Cat B Intermediário
20–25 Jul 2025
──────────────────────────────────────
Sua inscrição: João Silva + Pedro Costa  [Confirmada]
Pagamento: R$ 120  ·  [Pago]
                                    [Ver torneio]
```

---

## Tab: Meus resultados

- Past tournaments with finish position
- Match history within tournaments
- Points earned

```
Torneio Arena Pro — Verão 2025
Beach Tennis  ·  Cat B
🥈 2º lugar  ·  +80 pontos no ranking

Partidas:
  QF: João/Pedro vs Carlos/Ana  → 6×3 / 6×2  ✓
  SF: João/Pedro vs Marcos/Felipe → 6×4 / 6×3  ✓
  F:  João/Pedro vs Bruno/Thiago → 3×6 / 4×6  ✗
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | Card skeletons |
| No registrations | EmptyState: "Você ainda não está inscrito em nenhum torneio." |

---

## API Dependencies

```
GET /tournaments?status=open
GET /tournaments?userId=me
GET /tournaments/:id/matches?userId=me
```
