# Screen: Financial

**Route:** `/app/financeiro`  
**Auth:** Required — OWNER, MANAGER, FINANCE  
**Purpose:** Track all revenue, payments, and financial status of the arena.

---

## Layout

**Desktop:** Full-width with metric cards top + table below  
**Mobile:** Stacked cards + swipeable table

---

## Page Tabs

`Visão Geral` | `Pagamentos` | `Receitas` | `Despesas` | `Fechamento`

---

## Tab: Visão Geral

### Filter Bar
```
Período: [Hoje ▾] | Semana | Mês | [Data custom]    [Exportar CSV]
```

### Metric Cards (4)

| Card | Value |
|------|-------|
| Receita do período | R$ 18.420 |
| Recebido | R$ 14.980 |
| Pendente | R$ 2.440 |
| Vencido / Inadimplente | R$ 1.000 |

### Revenue Chart

- Line chart: Receita diária nos últimos 30 dias
- Stacked bars: Reservas vs Aulas vs Torneios vs Outros
- Color: qBlue / qOrange / qRed

### Breakdown by Category

| Categoria | Valor | % |
|-----------|-------|---|
| Reservas | R$ 9.800 | 53% |
| Mensalidades | R$ 5.200 | 28% |
| Torneios | R$ 1.980 | 11% |
| Outros | R$ 1.440 | 8% |

---

## Tab: Pagamentos

### Toolbar
```
[SearchInput: Cliente, descrição...]  [Status ▾]  [Tipo ▾]  [Período ▾]  [+ Lançar pagamento]
```

**Status filter chips:** Todos | Pendente | Pago | Vencido | Cancelado | Estornado

### Table

| # | Cliente | Descrição | Vencimento | Valor | Método | Status | Ações |
|---|---------|----------|-----------|-------|--------|--------|-------|
| 892 | João Silva | Reserva #4521 | 17/06 | R$ 90 | PIX | [Pago] | ··· |
| 893 | Maria Souza | Mensalidade Jun | 15/06 | R$ 300 | — | [Vencido] | Cobrar |
| 894 | Bruno Lima | Inscrição Torneio | 20/06 | R$ 120 | — | [Pendente] | Confirmar |

**Row actions (···):**
- Confirmar pagamento
- Estornar (with confirmation modal)
- Enviar cobrança (WhatsApp/email)
- Ver detalhes

---

## Tab: Receitas

- Similar table but shows income line items
- Grouped by type: Reserva | Aula | Torneio | Produto

---

## Tab: Despesas

- Simple expenses log
- Fields: Date, Description, Category, Value, Paid by
- Categories: Manutenção | Folha | Produtos | Marketing | Outros

---

## Tab: Fechamento Diário

- Date selector
- Summary card: Total entradas | Total saídas | Saldo do dia
- Print button → PDF

---

## Payment Confirmation Modal

```
Confirmar pagamento
─────────────────────────────
Cliente: João Silva
Valor: R$ 90,00
Método: [PIX ▾]  /  [Dinheiro]  /  [Cartão]  /  [Transferência]
Data do pagamento: [17/06/2025]
Observação: [optional]

[Cancelar]  [Confirmar]
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | Metric card skeletons + table skeleton |
| Empty (filtered) | "Nenhum pagamento encontrado nesse período." |
| Empty (all) | EmptyState with CTA to create first booking |

---

## API Dependencies

```
GET /clubs/:clubId/reports/revenue?from=&to=
GET /clubs/:clubId/payments?status=&from=&to=&page=
POST /payments/:id/confirm
POST /payments/:id/refund
GET /clubs/:clubId/reports/daily-close?date=
```

---

## Business Rules

- Payment statuses: `pending` → `paid` | `pending` → `cancelled` | `paid` → `refunded`
- Overdue = `due_date < today AND status = pending`
- Every payment change generates an audit log entry
- Finance role cannot issue refunds (OWNER/MANAGER only)
- CSV export respects current filters
