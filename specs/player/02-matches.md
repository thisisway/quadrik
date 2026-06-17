# Screen: Player Matches

**Route:** `/player/partidas`  
**Auth:** Required — PLAYER  
**Purpose:** Browse and join open matches, and create new matches.

---

## Layout

**Desktop:** Filter sidebar + match grid  
**Mobile:** Filter chips + vertical list

---

## Header / Filter Bar

**Filter chips (horizontal scroll):**
`Todas` | `Abertas` | `Minhas partidas` | `Hoje` | `Esta semana`

**Secondary filters (collapsible):**
- Sport: Beach Tennis | Vôlei | Padel | Tênis
- Level: Iniciante | Intermediário | Avançado
- Format: Simples | Duplas | 4×4
- Arena (text search)
- Date picker

**Sort:** Mais próximas | Mais recentes | Horário

---

## Match List

Component: `MatchCard`

For "Abertas" tab — matches with open spots:

```
Beach Tennis · Duplas · Intermediário      [2 vagas]
──────────────────────────────────────────────────
[Av] João Silva (criador)
[Av] [?] Vaga    [Av] [?] Vaga
──────────────────────────────────────────────────
📍 Arena Pro  ·  Amanhã, 17 jun  ·  08:00
                                    [Entrar na partida →]
```

For "Minhas partidas" tab:
- My past and upcoming matches
- With result if completed

---

## Create Match Button

Floating action button (mobile) or header button (desktop): `[+ Criar partida]`

---

## Create Match Modal / Page

**Route:** `/player/partidas/nova`

```
Criar partida
──────────────────────────────────
Modalidade * [Beach Tennis ▾]
Formato * [Duplas ▾]
Nível * [Intermediário ▾]
Arena * [SearchInput — buscar arena]
Data * [DatePicker]
Horário * [TimePicker]
Duração * [90 min ▾]
Vagas abertas: [2 ▾]
Convidar jogador específico: [SearchInput — opcional]
Observações: [textarea]

[Cancelar]  [Criar e publicar]
```

After creating: auto-redirects to match detail.

---

## Match Detail

**Route:** `/player/partidas/[id]`

```
Beach Tennis · Duplas · Intermediário
──────────────────────────────────────────
📍 Arena Pro, BH
📅 Amanhã, 17 jun · 08:00–09:30

Jogadores:
  [Av] João Silva  (Criador)
  [Av] Pedro Costa
  [Av] [?] Vaga → [Entrar]
  [Av] [?] Vaga → [Entrar]

Status: [Aberta] / [Confirmada] / [Realizada]

[Compartilhar link]  [Sair da partida]
```

Result (if completed):
```
Resultado: João/Pedro  6×3  Carlos/Ana
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | 6 card skeletons |
| Empty | EmptyState: "Nenhuma partida encontrada. [Criar partida]" |
| Full match | Card shows "Partida completa" badge, no join button |
| Past match | Shows result or "Sem resultado" |

---

## API Dependencies

```
GET /matches?status=open&sport=&level=&page=
GET /matches?userId=me
POST /matches
GET /matches/:id
POST /matches/:id/join
POST /matches/:id/leave
```
