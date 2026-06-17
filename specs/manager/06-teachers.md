# Screen: Teachers

**Route:** `/app/professores`  
**Auth:** Required — OWNER, MANAGER  
**Purpose:** Manage teacher profiles, their schedules, commissions, and linked classes.

---

## Layout

**Desktop:** Table + detail drawer  
**Mobile:** Card list

---

## Toolbar

```
[SearchInput: Nome do professor...]  [Status ▾]  [Modalidade ▾]  [+ Novo professor]
```

---

## Table

| Avatar + Nome | Modalidade | Alunos ativos | Aulas/semana | Comissão | Status | Ações |
|---------------|-----------|---------------|--------------|---------|--------|-------|
| [Av] Carlos Mendes | Beach Tennis | 14 | 12 | 30% | [Ativo] | ··· |

---

## Teacher Detail / Profile

**Route:** `/app/professores/[id]`

Sections:

1. **Header**
   - Avatar, name, sport badges, status badge
   - Contact: email + phone
   - Actions: Editar | Ver agenda | ···

2. **Quick Stats**
   - Alunos ativos
   - Aulas este mês
   - Total a receber (commission)
   - Horas lecionadas

3. **Schedule (Agenda) Tab**
   - Week view showing teacher's classes
   - `BookingCalendar` component filtered by teacher

4. **Classes Tab**
   - List of classes this teacher runs
   - Each: class name, schedule, students count, type (individual/group)

5. **Students Tab**
   - List of students linked to this teacher
   - Name, plan, last attendance, payment status

6. **Commissions Tab**
   - Commission calculation table per month
   - Total classes × rate = commission amount
   - Status: paid / pending

---

## New / Edit Teacher Modal

```
Nome completo *
Email *
Telefone *
CPF / CNPJ
Modalidade(s) [multiselect]
Comissão %  [number input]
Status: [Ativo | Inativo]
Bio (optional)
```

---

## States

| State | Behavior |
|-------|----------|
| Loading | Table skeleton |
| Empty | EmptyState: "Nenhum professor cadastrado." + CTA |

---

## API Dependencies

```
GET /clubs/:clubId/teachers
GET /teachers/:id
POST /clubs/:clubId/teachers
PATCH /teachers/:id
GET /teachers/:id/classes
GET /teachers/:id/commissions
```
