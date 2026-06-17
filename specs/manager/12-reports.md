# Screen: Reports

**Route:** `/app/relatorios`  
**Auth:** Required — OWNER, MANAGER, FINANCE  
**Purpose:** Analytical reports for business decisions — revenue, occupancy, players, teachers, tournaments.

---

## Layout

**Desktop:** Report selector (tabs) + filter bar + chart + data table  
**Mobile:** Stacked — chart above fold, table below

---

## Report Tabs

`Receita` | `Ocupação` | `Jogadores` | `Professores` | `Torneios`

---

## Global Filter Bar (all tabs)

```
Período: [Este mês ▾]  [Data início] — [Data fim]    [Exportar CSV]
```

---

## Tab: Receita

**KPI cards row:**
- Total receita
- Ticket médio
- Número de transações
- Inadimplência %

**Charts:**
- Line chart: Receita diária
- Donut chart: Receita por categoria (Reservas / Aulas / Torneios)
- Bar chart: Receita por modalidade

**Data table:**
- Date | Category | Count | Total value

---

## Tab: Ocupação

**KPI cards:**
- Taxa de ocupação média
- Quadra mais utilizada
- Horário de pico
- Horas totais reservadas

**Charts:**
- Heatmap: Hour × Day occupancy (Mon–Sun vs 07:00–22:00) — deeper color = higher occupancy
- Bar chart: Ocupação por quadra
- Bar chart: Ocupação por modalidade

**Data table:**
- Court | Average occupancy % | Total hours | Peak day/hour

---

## Tab: Jogadores

**KPI cards:**
- Total jogadores únicos
- Novos no período
- Frequência média (reservas/jogador)
- Mais ativo (name + count)

**Chart:**
- Bar: New players per month
- Pie: Player level distribution (Iniciante / Intermediário / Avançado)

**Table:**
- Top 20 most active players: Name | Reservas | Modalidade favorita | Último check-in

---

## Tab: Professores

**KPI cards:**
- Total aulas realizadas
- Taxa de presença média
- Total comissão a pagar
- Professor com mais alunos

**Charts:**
- Bar: Aulas por professor
- Bar: Taxa de presença por turma

**Table:**
- Teacher | Classes held | Students | Avg attendance | Commission total

---

## Tab: Torneios

**KPI cards:**
- Total torneios no período
- Total inscrições
- Receita de torneios
- Torneio com mais participantes

**Table:**
- Tournament | Date | Categories | Registered | Revenue | Status

---

## States

| State | Behavior |
|-------|----------|
| Loading | Chart skeletons + KPI card skeletons |
| No data in period | EmptyState: "Sem dados para o período selecionado." |
| Export loading | Button spinner |

---

## API Dependencies

```
GET /clubs/:clubId/reports/revenue?from=&to=
GET /clubs/:clubId/reports/occupancy?from=&to=
GET /clubs/:clubId/reports/players?from=&to=
GET /clubs/:clubId/reports/teachers?from=&to=
GET /clubs/:clubId/reports/tournaments?from=&to=
```
