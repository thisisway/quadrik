# Screen: Clients

**Route:** `/app/clientes`  
**Auth:** Required — OWNER, MANAGER, RECEPTIONIST  
**Purpose:** Manage all registered clients (players) of the arena, including contact info, history, and financial status.

---

## Layout

**Desktop:** Full table + detail drawer  
**Mobile:** Card list + modal detail

---

## Toolbar

```
[SearchInput: Nome, email, telefone...]  [Filtros ▾]  [+ Novo cliente]
```

**Filters:**
- Status: Todos | Ativos | Inadimplentes | Inativos
- Plan: Avulso | Mensalista | Aluno
- Date added: range picker

---

## Table (Desktop)

| Avatar + Nome | Email | Telefone | Plano | Reservas | Saldo Dev. | Status | Ações |
|---------------|-------|----------|-------|----------|-----------|--------|-------|
| [Av] João Silva | joao@... | (31) 99999... | Mensalista | 12 | R$ 0 | [Ativo] | ··· |
| [Av] Maria Souza | maria@... | (11) 98888... | Avulso | 5 | R$ 90 | [Devedor] | ··· |

**Row click** → Client detail drawer

---

## Client Detail Drawer / Page

**Route:** `/app/clientes/[id]`

**Sections:**

1. **Header**
   - Avatar (96px), name, phone, email, status badge
   - Action buttons: Editar | Enviar mensagem | ···

2. **Quick Stats (4 MetricCards)**
   - Total reservas
   - Receita total
   - Saldo devedor
   - Última visita

3. **Financial History Tab**
   - Table: Date | Description | Value | Status | Actions
   - Includes bookings, class payments, subscriptions

4. **Booking History Tab**
   - List of all past and future bookings
   - `BookingCard` compact components

5. **Notes Tab**
   - Free text notes about the client
   - Add note form at top

---

## New / Edit Client Modal

```
Nome completo *
Email
Telefone *
CPF (optional)
Endereço (optional)
Plano: [Avulso | Mensalista | Aluno]
Observações
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | Table skeleton |
| Empty | EmptyState: "Nenhum cliente cadastrado ainda." + CTA |
| Empty search | "Nenhum resultado para '[search term]'." |

---

## API Dependencies

```
GET /clubs/:clubId/players?status=&plan=&page=
GET /players/:id
POST /clubs/:clubId/players
PATCH /players/:id
GET /players/:id/bookings
GET /players/:id/payments
```
