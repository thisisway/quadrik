# Screen: Register

**Route:** `/cadastro`  
**Auth:** Unauthenticated only  
**Purpose:** Create a new Quadrik account — for both managers and players.

---

## Layout

**Desktop:** Split — left brand panel (40%) + right form (60%)  
**Mobile:** Full-screen form

---

## Sections

### 1. Left Panel (Desktop)

- Background: grad-sun
- White text
- Headline: `Comece grátis hoje`
- Benefits list:
  - ✓ 14 dias grátis, sem cartão
  - ✓ Configuração em minutos
  - ✓ Suporte incluso

---

### 2. Registration Form (Right / Full mobile)

**Header:**
- Heading: `Criar sua conta` (h2/qNavy)
- Sub: `Grátis por 14 dias. Sem cartão de crédito.`

**Step 1 — Account type selector:**
```
┌──────────────────┐  ┌──────────────────┐
│   🏟️ Sou gestor  │  │   🎾 Sou jogador  │
│  de arena/clube  │  │  / atleta         │
└──────────────────┘  └──────────────────┘
```
Card selection — click to highlight, changes form fields below.

**Step 2 — Personal Info:**
```
Nome completo *
[text input]

Email *
[email input]

Telefone *
[phone input — mask: (00) 00000-0000]

Senha *
[password input — strength indicator]

Confirmar senha *
[password input]
```

**If Manager selected, also:**
```
Nome da arena / clube *
[text input]

Cidade *
[text input]

Estado *
[select UF]
```

**Terms:**
```
[checkbox] Concordo com os [Termos de Uso] e [Política de Privacidade]
```

**CTA:**
- `[Criar conta]` — button primary full-width lg

**Footer link:**
- `Já tem conta? [Entrar]` → `/login`

---

## States

| State | Behavior |
|-------|----------|
| Loading | Button spinner, fields disabled |
| Validation error | Inline error messages per field |
| Email already in use | Field error: "Este email já está cadastrado. [Fazer login?]" |
| Success | Auto-login → onboarding flow or dashboard |

---

## Validation

```
name:           required, min 3 chars
email:          required, valid format, unique
phone:          required, valid BR format
password:       required, min 8 chars, at least 1 number
confirmPassword:must match password
clubName:       required if role=MANAGER
terms:          must be checked
```

---

## API Dependencies

```
POST /auth/register
Body: { name, email, phone, password, role, clubName?, city?, state? }
Response: { accessToken, refreshToken, user }
```
