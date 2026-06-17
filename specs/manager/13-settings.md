# Screen: Settings

**Route:** `/app/configuracoes`  
**Auth:** Required — OWNER, MANAGER (some sections OWNER only)  
**Purpose:** Configure all aspects of the arena: profile, courts, operating hours, booking rules, team, plans, and notifications.

---

## Layout

**Desktop:** Left sidebar navigation (settings sections) + right content  
**Mobile:** Section list → tap → detail view

---

## Settings Sections

```
Sidebar:
  🏟️  Arena
  🎾  Quadras
  🕐  Horários
  📋  Regras de Reserva
  👥  Equipe
  💳  Plano & Assinatura
  🔔  Notificações
  🔐  Segurança
  🌐  Página Pública
```

---

## Section: Arena

```
Informações básicas:
  Nome da arena *
  Slug (URL pública) *  → quadrik.com.br/arenas/[slug]
  Descrição
  Modalidades [multiselect chips]
  Telefone
  Email
  Site
  WhatsApp

Localização:
  Endereço
  Complemento
  Bairro
  Cidade *
  Estado *
  CEP *

Imagens:
  Logo [upload — 1:1 ratio]
  Capa [upload — 16:9 ratio]

[Salvar alterações]
```

---

## Section: Quadras

Table of courts + add/edit/delete:

| Nome | Modalidade | Piso | Coberta | Status | Preço/hora | Ações |
|------|-----------|------|---------|--------|-----------|-------|
| Quadra Beach 01 | Beach Tennis | Areia | Não | [Ativa] | R$ 60 | Editar |

**Add / Edit Court Modal:**
```
Nome da quadra *
Modalidade * [select]
Tipo de piso * [Areia | Saibro | Cimento | Sintético | Madeira]
É coberta? [toggle]
Capacidade de jogadores
Preço por hora *
Status: [Ativa | Inativa | Manutenção]
Foto [upload]
```

---

## Section: Horários

Operating hours per day of week:

| Dia | Aberto | Abre | Fecha |
|-----|--------|------|-------|
| Segunda | [✓] | 07:00 | 22:00 |
| Terça   | [✓] | 07:00 | 22:00 |
| ... | | | |
| Domingo | [✓] | 08:00 | 18:00 |

Holiday exceptions: add specific dates with custom hours or "Fechado".

---

## Section: Regras de Reserva

```
Antecedência mínima para reserva: [1 hora ▾]
Antecedência máxima para reserva: [30 dias ▾]
Duração mínima: [60 min ▾]
Duração máxima: [180 min ▾]
Intervalo entre slots: [30 min ▾]
Cancelamento pelo jogador: [Até X horas antes ▾]
Pagamento obrigatório: [Sim | Não]
Número máximo de reservas ativas por cliente: [N]
```

---

## Section: Equipe

**Team members table:**

| Nome | Email | Papel | Status | Ações |
|------|-------|-------|--------|-------|
| João Gestor | joao@... | MANAGER | [Ativo] | Editar | Remover |
| Ana Recep | ana@... | RECEPTIONIST | [Ativo] | Editar |

**Invite member:**
```
Email *
Papel * [MANAGER | RECEPTIONIST | FINANCE | ORGANIZER]
[Enviar convite]
```

---

## Section: Plano & Assinatura

- Current plan display: `Plano Pro — R$ 299/mês`
- Next billing date
- Usage meters: Courts used / limit, Team members, Tournaments
- `[Fazer upgrade]` `[Cancelar plano]`
- Billing history table

---

## Section: Notificações

Toggle switches:
```
[✓] Lembrete de reserva (email)      24h antes
[✓] Lembrete de reserva (WhatsApp)   2h antes
[✓] Aviso de pagamento vencido       no dia
[✓] Confirmação de inscrição em torneio
[✓] Resultado de partida lançado
[✓] Novos clientes cadastrados
```

---

## Section: Segurança

```
Trocar senha
  Senha atual *
  Nova senha *
  Confirmar nova senha *
  [Salvar]

Autenticação em dois fatores [toggle]
Sessões ativas — list with "Encerrar sessão" per device
```

---

## Section: Página Pública

```
URL pública: quadrik.com.br/arenas/arena-pro [copiar]
Visibilidade: [Público | Oculto]
Exibir ranking: [Sim | Não]
Exibir torneios: [Sim | Não]
Exibir avaliações: [Sim | Não]
```

---

## API Dependencies

```
GET /clubs/:id
PATCH /clubs/:id
GET /clubs/:clubId/courts
POST /clubs/:clubId/courts
PATCH /courts/:id
DELETE /courts/:id
GET /clubs/:clubId/members
POST /user/invite
PATCH /clubs/:clubId/settings
```
