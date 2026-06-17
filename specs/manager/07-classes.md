# Screen: Classes

**Route:** `/app/aulas`  
**Auth:** Required — OWNER, MANAGER, TEACHER  
**Purpose:** Create and manage classes, student enrollments, attendance, and makeups.

---

## Layout

**Desktop:** List view (left) + calendar/detail (right)  
**Mobile:** Tab between "Aulas" and "Agenda"

---

## Tabs at Page Level

`Turmas` | `Agenda de Aulas` | `Presença` | `Reposições`

---

## Tab: Turmas (Classes)

### Toolbar
```
[SearchInput: Nome da turma...]  [Modalidade ▾]  [Professor ▾]  [+ Nova turma]
```

### Table

| Turma | Professor | Horários | Modalidade | Alunos | Vagas | Status | Ações |
|-------|----------|---------|-----------|--------|-------|--------|-------|
| Beach Tennis Iniciante A | Carlos Mendes | Seg/Qua 07:00 | Beach Tennis | 8/10 | 2 | [Ativa] | ··· |

---

## Tab: Agenda de Aulas

- Same calendar component as `/app/agenda`
- Filtered to show only class slots
- Color: info-subtle (blue)
- Teacher filter chips at top

---

## Tab: Presença

**Select class + date:**
```
Turma: [Select — Beach Tennis Iniciante A]
Data: [17 jun 2025 ▾]
```

**Attendance list:**

| Aluno | Plano | Check-in | Ações |
|-------|-------|---------|-------|
| [Av] Ana Martins | Mensalista | [✓ Presente] | Falta com justificativa |
| [Av] Bruno Lima | Mensalista | [○ Ausente] | Justificar | Reposição |

**Submit:** `[Salvar presença]`

---

## Tab: Reposições

- Pending makeup sessions list
- Student + original class missed + available makeup slots
- Actions: Schedule makeup | Mark completed

---

## New Class Modal

```
Nome da turma *
Professor * [select]
Modalidade * [select]
Quadra * [select]
Horários recorrentes:
  [Dia semana ▾] [Hora início] até [Hora fim]  [+ Adicionar dia]
Vagas máximas *
Valor mensalidade *
Data início *
Data fim (optional)
```

---

## API Dependencies

```
GET /clubs/:clubId/classes?teacher=&sport=
GET /classes/:id
POST /clubs/:clubId/classes
PATCH /classes/:id
POST /classes/:id/attendance
GET /classes/:id/students
```

---

## Business Rules

- A class has recurring weekly slots that generate bookings automatically
- Absences without justification count towards the student's attendance rate
- Makeups must be scheduled within 30 days (configurable)
- Teacher commission is calculated per class held (not just scheduled)
