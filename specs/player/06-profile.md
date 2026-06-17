# Screen: Player Profile

**Route:** `/player/perfil`  
**Auth:** Required — PLAYER  
**Purpose:** View and edit the player's sports profile, preferences, and account settings.

---

## Layout

**Desktop:** 2 columns — profile card (left 30%) + tabs content (right 70%)  
**Mobile:** Single column — profile card at top, tabs below

---

## Profile Card

```
[Avatar 96px — editable]
João Silva
Beach Tennis · Intermediário
BH, MG

[Editar perfil]
```

**Stats row:**
- Partidas: 48
- Vitórias: 36
- Win rate: 75%
- Ranking: #3

---

## Tabs

`Sobre` | `Histórico` | `Configurações`

---

## Tab: Sobre

```
Modalidades preferidas: [Beach Tennis] [Vôlei]
Nível técnico: Intermediário
Disponibilidade: Manhãs e fins de semana
Arena preferida: Arena Pro
Bio: "Jogo beach tennis há 3 anos. Adoro duplas!"
```

---

## Tab: Histórico

**Filter:** `Partidas` | `Torneios` | `Reservas`

Match history list:
- Date, sport, partner, opponent, result, venue

Tournament list:
- Tournament name, category, finish position, points

---

## Tab: Configurações

```
Notificações:
  [✓] Novas partidas abertas na minha modalidade
  [✓] Lembretes de reserva
  [✓] Resultados de torneio
  [✓] Atualizações de ranking

Conta:
  Email: joao@email.com
  Telefone: (31) 99999-0000
  [Alterar senha]
  [Sair da conta]
```

---

## Edit Profile Modal / Form

```
Foto de perfil [upload]
Nome completo *
Apelido
Telefone
Cidade
Estado
Modalidade(s) preferida(s) [multiselect]
Nível técnico [select]
Bio [textarea — 200 chars max]
```

---

## API Dependencies

```
GET /profiles/me
PATCH /profiles/me
GET /matches?userId=me
GET /tournaments?userId=me&participated=true
```
