# Screen: Landing Page

**Route:** `/`  
**Auth:** Public (unauthenticated)  
**Purpose:** Present the Quadrik platform to arena managers and players. Drive conversions to sign-up and arena demo requests.

---

## Layout

**Desktop:** Full-width sections, max-content-width 1280px, horizontal padding 24px  
**Mobile:** Single column, 16px horizontal padding, mobile-first stacking

---

## Sections

### 1. Navigation Header

**Position:** sticky top, bg white/95 blur, border-bottom sand2  
**Left:** Quadrik logo (mark + wordmark in qNavy)  
**Right (desktop):** Nav links: `Arenas` `Torneios` `Rankings` | CTA `Entrar` (outline) + `Começar grátis` (button primary)  
**Right (mobile):** Hamburger menu → drawer with same links

---

### 2. Hero Section

**Background:** sand gradient → wave/beach illustration subtle overlay  
**Layout (desktop):** 2-column (text left, visual right)  
**Layout (mobile):** single column, visual below text

**Left Column:**
- Eyebrow: `PLATAFORMA DE ESPORTES DE PRAIA` (12px/800/uppercase/qOrange)
- Headline (h1, 48px, qNavy): `Sua arena no controle. Sua comunidade em movimento.`
- Subheadline (body-regular, gray): `Gerencie reservas, torneios, jogadores, professores e pagamentos em um só lugar. Feito para beach tennis, vôlei de praia, padel e muito mais.`
- CTA row: `[Começar grátis]` (button primary lg) + `[Ver demo]` (button ghost lg)
- Social proof: `+500 arenas · +12.000 jogadores · +2.000 torneios`

**Right Column:**
- Dashboard preview screenshot or animated illustration showing:
  - Agenda view with colored bookings
  - Metric cards
  - Player avatars
- Floating badge: `⚡ Partida confirmada — João vs Pedro` with success color

---

### 3. Feature Strip (Pain Points)

**Background:** white  
**Layout:** 3 columns (desktop), 1 column stacked (mobile)

| Icon | Title | Description |
|------|-------|-------------|
| 🗓️ | Agenda sem conflito | Gerencie todas as quadras em uma visão clara. Sem dupla reserva. |
| 🏆 | Torneios completos | Crie categorias, inscrições, chaveamento e resultados em minutos. |
| 💳 | Financeiro integrado | Cobranças, mensalidades, inadimplência e relatórios em um painel. |

---

### 4. Manager Value Proposition

**Background:** grad-sea (navy to blue)  
**Text:** white  
**Layout (desktop):** 2 columns (features left, visual right)

**Left:**
- Section label: `PARA GESTORES` (label/uppercase)
- Headline (h2, white): `Tudo que sua arena precisa`
- Feature list with check icons:
  - Agenda diária e semanal por quadra
  - Controle de clientes e mensalidades
  - Professores, aulas e presença
  - Relatórios de receita e ocupação
  - Torneios e rankings
  - Notificações automáticas

**Right:**
- Dashboard screenshot: metric cards visible (Reservas hoje, Receita hoje, Ocupação, Pendentes)

---

### 5. Player Value Proposition

**Background:** sand  
**Layout (desktop):** 2 columns (visual left, features right)

**Right:**
- Section label: `PARA JOGADORES` (label/uppercase)
- Headline (h2, qNavy): `Bora jogar?`
- Feature list:
  - Encontre partidas abertas perto de você
  - Reserve quadras com facilidade
  - Participe de torneios
  - Acompanhe seu ranking
  - Histórico de jogos e estatísticas
- CTA: `[Criar minha conta]` (button primary)

**Left:**
- Mobile app mockup showing player home screen with match cards

---

### 6. Sport Types

**Background:** white  
**Headline:** `Feito para os melhores esportes de praia`

**Sport chips (pill buttons with icon):**
- 🏸 Beach Tennis
- 🏐 Vôlei de Praia
- 🎾 Padel
- 🏓 Tênis
- ⚽ Beach Soccer

---

### 7. Testimonials

**Background:** sand  
**Layout:** 3 cards (desktop), carousel (mobile)

Each card:
- Quote (body-regular, graphite, italic)
- Avatar + Name + Role (e.g., "Gestor — Arena Pro BH")
- Star rating

---

### 8. Pricing Teaser

**Background:** white  
**Headline:** `Comece grátis. Cresça no seu ritmo.`  
**Subtext:** 14 dias grátis, sem cartão de crédito.  
**CTA:** `[Começar agora]` (button primary lg)

---

### 9. Footer

**Background:** qNavy  
**Text:** white  
**Layout:** 4 columns (desktop), stacked (mobile)

Columns:
1. Logo + tagline + social icons
2. Produto: Arenas, Jogadores, Torneios, Rankings, Preços
3. Empresa: Sobre, Blog, Contato, Imprensa
4. Legal: Privacidade, Termos, Cookies

Bottom row: `© 2025 Quadrik. Todos os direitos reservados.`

---

## Interactions

- **CTA "Começar grátis"** → `/cadastro`
- **"Entrar"** → `/login`
- **"Ver demo"** → Opens video modal or demo sandbox
- **Sport type chips** → `/arenas?sport=beach-tennis` (filtered listing)
- **Arena links** → `/arenas`
- **Smooth scroll** → Anchor links in nav scroll to sections

---

## States

- **Loading:** Page content loads server-side; no skeleton needed (SSG/SSR)
- **Mobile nav:** Drawer slides from right, backdrop closes on click

---

## SEO / Meta

- Title: `Quadrik — Plataforma de Gestão para Esportes de Praia`
- Description: `Gerencie sua arena, quadras, reservas, torneios e jogadores com o Quadrik.`
- OG image: Hero dashboard preview
