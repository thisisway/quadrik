# Screen: Tournaments (Manager)

**Route:** `/app/torneios`  
**Auth:** Required — OWNER, MANAGER, ORGANIZER  
**Purpose:** Create, manage, and operate tournaments for the arena.

---

## Layout

**Desktop:** Card grid with toolbar  
**Mobile:** Single-column card list

---

## Toolbar

```
[SearchInput: Nome do torneio...]  [Status ▾]  [+ Criar torneio]
```

**Status filter:** Todos | Rascunho | Inscrições abertas | Em andamento | Encerrado

---

## Tournament Cards Grid

Component: `TournamentCard` (manager variant — includes management actions)

Each card:
- Cover image
- Tournament name + status badge
- Date range
- Sport + category chips
- Stats: N categorias · N inscritos · N partidas
- Actions: `[Gerenciar]` → `/app/torneios/[id]`

---

## Tournament Detail

**Route:** `/app/torneios/[id]`

### Header

- Tournament name (h1)
- Status badge + sport + date
- Action buttons: `[Editar]` `[Publicar]` `[Encerrar]` `[···]`
- Progress bar: Rascunho → Inscrições → Em andamento → Encerrado

### Tabs

`Visão Geral` | `Categorias` | `Inscrições` | `Chaveamento` | `Partidas` | `Resultados`

---

### Tab: Visão Geral

- Description + rules (rich text)
- Key dates (registration start/end, tournament dates)
- Cover image + edit
- Visibility: `[Público ▾]` | `[Privado]`
- Public page link (copy button)

---

### Tab: Categorias

Table of categories:

| Categoria | Modalidade | Gênero | Formato | Limite | Inscritos | Preço | Ações |
|-----------|-----------|--------|---------|--------|-----------|-------|-------|
| A – Avançado | Duplas | Masc. | Mata-mata | 16 | 14 | R$ 120 | Editar |

**Add Category button** → modal:
```
Nome da categoria *
Modalidade *
Gênero: [Masc | Fem | Misto]
Formato: [Grupos + Mata-mata | Apenas mata-mata | Round Robin]
Limite de duplas/jogadores *
Preço de inscrição *
```

---

### Tab: Inscrições

- Filter by category
- Table: Dupla/Jogador | Categoria | Inscrição em | Pagamento | Ações
- Actions: Confirmar inscrição | Recusar | Reembolsar
- Button: `[Gerar chaveamento]` (enabled when registrations complete)

---

### Tab: Chaveamento

- Category selector tabs
- Bracket display:
  - If group stage: round-robin table per group
  - If knockout: bracket tree
- Button: `[Gerar automaticamente]` or `[Editar manualmente]`
- Published/Draft status of bracket

---

### Tab: Partidas

Table of all matches:

| Partida | Categoria | Rodada | Quadra | Horário | Status | Resultado |
|---------|----------|--------|--------|---------|--------|-----------|
| João/Pedro vs Carlos/Ana | Cat A | QF | Quadra 1 | 17/07 09:00 | [Agendada] | — | Lançar |
| ... | | | | | [Realizada] | 6×3 / 6×2 | Ver |

**"Lançar resultado" action** → Result modal:
```
Partida: João/Pedro vs Carlos/Ana
Set 1: [  ] × [  ]
Set 2: [  ] × [  ]
Set 3 (se necessário): [  ] × [  ]
W.O.: [ ] Jogador A  [ ] Jogador B
[Cancelar]  [Salvar resultado]
```

---

### Tab: Resultados

- Podium per category (🥇 🥈 🥉)
- Full standings table
- Button: `[Publicar resultados]`

---

## Create Tournament Wizard

**Step 1 — Informações básicas**
```
Nome do torneio *
Modalidade(s) *
Descrição
Imagem de capa [upload]
```

**Step 2 — Datas**
```
Inscrições: [início] até [fim]
Torneio: [início] até [fim]
```

**Step 3 — Configurações**
```
Visibilidade: [Público | Privado]
Inscrição exige pagamento: [Sim | Não]
Regulamento [textarea]
```

**Step 4 — Categorias**
- Add categories (minimum 1)

**Step 5 — Revisão**
- Summary + Salvar como rascunho | Publicar

---

## API Dependencies

```
GET /clubs/:clubId/tournaments
POST /clubs/:clubId/tournaments
GET /tournaments/:id
PATCH /tournaments/:id
POST /tournaments/:id/categories
POST /tournaments/:id/generate-matches
POST /matches/:id/result
GET /tournaments/:id/matches
```

---

## Business Rules

- Bracket can only be generated when registration deadline has passed
- Result entry updates rankings automatically when configured
- Tournament cannot go back from "Em andamento" to "Inscrições abertas"
- W.O. counts as a win/loss in bracket progression
