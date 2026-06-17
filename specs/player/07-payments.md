# Screen: Player Payments

**Route:** `/player/pagamentos`  
**Auth:** Required — PLAYER  
**Purpose:** View all financial transactions — bookings, classes, tournament registrations.

---

## Layout

**Desktop:** Table with filter bar  
**Mobile:** Card list with filter chips

---

## Summary Row (top)

```
[MetricCard: Total pago este mês]  [MetricCard: Pendente]
```

---

## Filter Chips

`Todos` | `Pendente` | `Pago` | `Cancelado`

---

## Payment List / Table

| Data | Descrição | Valor | Status | Ações |
|------|----------|-------|--------|-------|
| 17 jun | Reserva Quadra 01 — Arena Pro | R$ 90 | [Pago] | Recibo |
| 20 jun | Inscrição Torneio Verão — Cat B | R$ 120 | [Pendente] | Pagar |
| 10 jun | Mensalidade Junho — Turma Beach A | R$ 300 | [Pago] | Recibo |

---

## Pending Payment Detail

For pending items with action:
```
Inscrição Torneio Verão
──────────────────────────────────────
Arena Pro  ·  Categoria B Intermediário
Vencimento: 20 jun 2025
Valor: R$ 120,00

Formas de pagamento:
  ○ PIX (gerar QR Code)
  ○ Transferência bancária
  (Cartão de crédito — em breve)

[Pagar agora]
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | List skeleton |
| Empty | EmptyState: "Nenhum pagamento encontrado." |

---

## API Dependencies

```
GET /payments?userId=me&status=&page=
GET /payments/:id
```
