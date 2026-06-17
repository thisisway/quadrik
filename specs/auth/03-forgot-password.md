# Screen: Forgot Password

**Route:** `/esqueci-senha`  
**Auth:** Unauthenticated  
**Purpose:** Allow users to recover access by requesting a password reset email.

---

## Layout

Centered card (max 480px), centered vertically on desktop. Mobile: full-screen with padding.

---

## Screens (multi-step)

### Step 1 — Email Input

- Back link: `← Voltar para o login`
- Icon: lock illustration (80px)
- Heading: `Esqueceu sua senha?` (h2/qNavy)
- Sub: `Digite seu email e enviaremos um link para criar uma nova senha.`

**Form:**
```
Email *
[email input]

[Enviar link de recuperação] — button primary full-width
```

---

### Step 2 — Email Sent Confirmation

Shown after successful submit:

- Icon: envelope ✉️ (80px, qBlue)
- Heading: `Verifique seu email`
- Sub: `Enviamos um link para **email@exemplo.com**. Clique no link para criar uma nova senha.`
- Note: `Não recebeu? Verifique a pasta de spam ou [reenviar].`
- Link: `← Voltar para o login`

---

### Step 3 — Reset Password (via token link)

**Route:** `/nova-senha?token=[jwt]`

- Heading: `Criar nova senha`
- Sub: `Escolha uma senha forte para sua conta.`

**Form:**
```
Nova senha *
[password input — strength indicator]

Confirmar nova senha *
[password input]

[Salvar nova senha] — button primary full-width
```

---

### Step 4 — Success

- Icon: check ✓ (80px, success)
- Heading: `Senha alterada!`
- Sub: `Sua senha foi atualizada. Agora é só entrar.`
- CTA: `[Ir para o login]` → `/login`

---

## States

| State | Behavior |
|-------|----------|
| Email not found | Error toast: "Email não encontrado." |
| Token expired | Error: "Link expirado. [Solicitar novo link]" |
| Token already used | Error: "Este link já foi utilizado." |

---

## API Dependencies

```
POST /auth/forgot-password   — Body: { email }
POST /auth/reset-password    — Body: { token, password }
```
