# Quadrik — Screen Specifications

All screens follow the Quadrik Design System Pro. See [/design-system](../design-system/) for tokens and components.

## Structure

```
specs/
  public/         → Public-facing pages (unauthenticated)
  manager/        → Manager / admin dashboard
  player/         → Player web area
  mobile/         → Mobile app screens (future)
  auth/           → Authentication screens
```

## Route Map

### Public

| Route | File |
|-------|------|
| `/` | [public/01-landing-page.md](public/01-landing-page.md) |
| `/arenas` | [public/02-arenas-listing.md](public/02-arenas-listing.md) |
| `/arenas/[slug]` | [public/03-arena-page.md](public/03-arena-page.md) |
| `/torneios` | [public/04-tournaments-listing.md](public/04-tournaments-listing.md) |
| `/torneios/[slug]` | [public/05-tournament-page.md](public/05-tournament-page.md) |
| `/rankings/[slug]` | [public/06-ranking-page.md](public/06-ranking-page.md) |

### Auth

| Route | File |
|-------|------|
| `/login` | [auth/01-login.md](auth/01-login.md) |
| `/cadastro` | [auth/02-register.md](auth/02-register.md) |
| `/esqueci-senha` | [auth/03-forgot-password.md](auth/03-forgot-password.md) |

### Manager (`/app`)

| Route | File |
|-------|------|
| `/app/dashboard` | [manager/01-dashboard.md](manager/01-dashboard.md) |
| `/app/agenda` | [manager/02-agenda.md](manager/02-agenda.md) |
| `/app/reservas` | [manager/03-bookings.md](manager/03-bookings.md) |
| `/app/clientes` | [manager/04-clients.md](manager/04-clients.md) |
| `/app/jogadores` | [manager/05-players.md](manager/05-players.md) |
| `/app/professores` | [manager/06-teachers.md](manager/06-teachers.md) |
| `/app/aulas` | [manager/07-classes.md](manager/07-classes.md) |
| `/app/financeiro` | [manager/08-financial.md](manager/08-financial.md) |
| `/app/torneios` | [manager/09-tournaments.md](manager/09-tournaments.md) |
| `/app/torneios/[id]` | [manager/10-tournament-detail.md](manager/10-tournament-detail.md) |
| `/app/rankings` | [manager/11-rankings.md](manager/11-rankings.md) |
| `/app/relatorios` | [manager/12-reports.md](manager/12-reports.md) |
| `/app/configuracoes` | [manager/13-settings.md](manager/13-settings.md) |

### Player (`/player`)

| Route | File |
|-------|------|
| `/player/home` | [player/01-home.md](player/01-home.md) |
| `/player/partidas` | [player/02-matches.md](player/02-matches.md) |
| `/player/reservas` | [player/03-bookings.md](player/03-bookings.md) |
| `/player/torneios` | [player/04-tournaments.md](player/04-tournaments.md) |
| `/player/ranking` | [player/05-ranking.md](player/05-ranking.md) |
| `/player/perfil` | [player/06-profile.md](player/06-profile.md) |
| `/player/pagamentos` | [player/07-payments.md](player/07-payments.md) |

## Spec Template

Each spec file follows this structure:
- **Route** — URL path
- **Purpose** — Who uses it and why
- **Layout** — Desktop and mobile layout description
- **Sections** — All visual sections with content and components
- **Interactions** — Key user flows and actions
- **States** — Empty, loading, error states
- **API Dependencies** — Which endpoints feed this screen
- **Business Rules** — Relevant domain rules for this screen
