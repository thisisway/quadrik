# Screen: Login

**Route:** `/login`  
**Auth:** Unauthenticated only (redirect to `/app/dashboard` if already logged in)  
**Purpose:** Authenticate existing users (managers, players, teachers).

---

## Layout

**Desktop:** Split — left brand panel (40%) + right form (60%)  
**Mobile:** Full-screen form with logo at top, no split panel

---

## Sections

### 1. Left Panel (Desktop only)

- Background: grad-sea
- Quadrik logo + wordmark (white)
- Tagline: `Sua arena no controle. Sua comunidade em movimento.`
- Floating card preview: booking or dashboard metric card illustration
- Bottom text: `+500 arenas confiam no Quadrik`

---

### 2. Login Form (Right / Full mobile)

**Header:**
- Logo (mobile only, 40px)
- Heading: `Bem-vindo de volta` (h2/qNavy)
- Sub: `Entre com seu e-mail e senha`

**Form Fields:**
```
Email *
[email input — type="email", autocomplete="email"]

Senha *
[password input — type="password", toggle show/hide]

[Esqueci minha senha] — right-aligned link (small/qBlue)
```

**CTA:**
- `[Entrar]` — button primary full-width lg

**Divider:** `ou`

**Social Login:**
- `[Continuar com Google]` — button secondary with Google icon
- (Optional) `[Continuar com Apple]` — button secondary with Apple icon

**Footer link:**
- `Não tem conta? [Criar conta grátis]` → `/cadastro`

---

## States

| State | Behavior |
|-------|----------|
| Default | Clean form, fields empty |
| Loading | Button shows spinner, fields disabled |
| Error — wrong credentials | Toast error: "Email ou senha incorretos. Tente novamente." |
| Error — account blocked | Toast error: "Conta bloqueada. Entre em contato com o suporte." |
| Error — unverified email | Banner: "Confirme seu email. [Reenviar confirmação]" |
| Success | Redirect based on role: MANAGER → `/app/dashboard`, PLAYER → `/player/home` |

---

## Interactions

- Enter key on password field → submit form
- "Esqueci minha senha" → `/esqueci-senha`
- After login → redirect to `callbackUrl` query param or role-based default

---

## Validation (client-side)

```
email:    required, valid email format
password: required, min 8 chars
```

---

## API Dependencies

```
POST /auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user: { id, name, email, role } }
```
