# Prompt Mestre de Desenvolvimento — Plataforma Quadrik

> Use este documento como prompt técnico completo para orientar uma equipe de desenvolvimento, uma IA de programação, um arquiteto de software ou um time de produto na criação da plataforma Quadrik.

---

## 1. Contexto do Projeto

Você deve atuar como arquiteto de software, tech lead, product designer e engenheiro full-stack sênior para desenvolver a plataforma **Quadrik**, um sistema moderno para esportes de praia e esportes de raquete, inspirado em soluções como Letzplay, mas com experiência mais bonita, robusta, intuitiva e preparada para web, iPhone e Android.

A plataforma deve atender três públicos principais:

1. **Jogadores / Atletas**  
   Pessoas que querem encontrar partidas, reservar quadras, participar de torneios, acompanhar rankings, ver estatísticas e interagir com a comunidade.

2. **Gestores de arenas, clubes, academias e condomínios**  
   Pessoas que precisam controlar agenda, quadras, aulas, clientes, professores, pagamentos, torneios, rankings, relatórios e comunicação.

3. **Professores e organizadores**  
   Pessoas que precisam controlar aulas, alunos, presença, reposições, comissões, torneios, categorias, partidas e resultados.

O objetivo é construir um produto escalável, mobile-first, visualmente forte e operacionalmente simples.

---

## 2. Objetivo Principal

Desenvolver uma plataforma completa com:

- sistema web administrativo;
- área pública para arenas, clubes, torneios e rankings;
- app mobile futuro para iOS e Android;
- backend robusto, modular e seguro;
- banco de dados relacional bem estruturado;
- design system próprio baseado no **Quadrik Design System Pro**;
- arquitetura preparada para crescimento, multiunidade, permissões, automações e relatórios.

A plataforma deve parecer moderna, esportiva, confiável, rápida e fácil de usar.

---

## 3. Stack Técnica Obrigatória/Recomendada

### 3.1 Frontend Web

Use:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** para componentes acessíveis de baixo nível
- **React Hook Form** para formulários
- **Zod** para validação
- **TanStack Query** para cache e sincronização de dados
- **TanStack Table** para tabelas avançadas
- **Recharts** ou biblioteca semelhante para gráficos

O frontend web será usado para:

- site institucional;
- landing pages;
- páginas públicas de arenas;
- páginas públicas de torneios;
- dashboard do gestor;
- painel financeiro;
- agenda de quadras;
- gerenciamento de clientes;
- rankings;
- torneios;
- relatórios.

### 3.2 Mobile

Preparar arquitetura para:

- **React Native**
- **Expo**
- **TypeScript**
- **Expo Router**
- **React Native Reanimated** quando necessário
- **React Native Gesture Handler**
- **TanStack Query**
- **Zod**

O mobile será usado principalmente para:

- app do jogador;
- app do professor;
- operações rápidas do gestor;
- notificações push;
- reservas;
- partidas;
- torneios;
- ranking;
- check-in;
- lançamento de resultado.

### 3.3 Backend

Use:

- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **Redis** para cache e filas
- **BullMQ** para jobs assíncronos
- **JWT + refresh tokens** para autenticação
- **RBAC** para permissões
- **Swagger/OpenAPI** para documentação da API

### 3.4 Infraestrutura

Ambiente inicial recomendado:

- Web: Vercel
- API: Railway, Render, Fly.io, AWS ou Google Cloud
- Banco: PostgreSQL gerenciado
- Cache/Fila: Redis gerenciado
- Storage: S3 compatível
- CI/CD: GitHub Actions
- Observabilidade: Sentry + logs estruturados

---

## 4. Arquitetura do Repositório

Organizar como monorepo:

```txt
quadrik/
  apps/
    web/
      src/
        app/
        components/
        features/
        layouts/
        lib/
        hooks/
        styles/
    mobile/
      app/
      src/
        components/
        features/
        hooks/
        services/
    api/
      src/
        modules/
        common/
        config/
        database/
        jobs/
        main.ts

  packages/
    ui/
      src/
        Button/
        Input/
        Card/
        Badge/
        Modal/
        MatchCard/
        BookingCard/
        RankingTable/
    design-tokens/
      src/
        colors.ts
        typography.ts
        radius.ts
        shadows.ts
        spacing.ts
        index.ts
    types/
    validators/
    api-client/
    utils/

  prisma/
    schema.prisma
    migrations/

  docs/
    architecture.md
    api.md
    design-system.md
    product-requirements.md
```

Use Turborepo ou Nx para gerenciar builds e pacotes compartilhados.

---

## 5. Design System Quadrik

A interface deve seguir rigorosamente o design system anexado.

### 5.1 Identidade

Nome visual: **Quadrik**  
Conceito: plataforma de matchmaking, comunidade e gestão para esportes de praia e raquete.  
Sensação desejada: energia, movimento, confiança, diversão, clareza e profissionalismo.

### 5.2 Tom de Voz

A linguagem deve ser direta, positiva e esportiva.

Use frases como:

- Bora jogar?
- Criar partida
- Entrar no torneio
- Reservar agora
- Ver horários livres
- Subir resultado
- Confirmar presença
- Chamar jogadores
- Você está dentro!
- Partida confirmada

Para o gestor, use uma linguagem objetiva:

- Receita de hoje
- Reservas pendentes
- Quadras ocupadas
- Pagamentos vencidos
- Alunos ativos
- Horários livres
- Taxa de ocupação
- Criar torneio
- Ver relatório

### 5.3 Cores Principais

Converter os tokens CSS em tokens TypeScript e Tailwind.

```ts
export const colors = {
  qRed: '#EF3E3E',
  qOrange: '#F47A32',
  qYellow: '#FFD43B',
  qNavy: '#071B3A',
  qBlue: '#0477BF',

  qRedLight: '#F5A8A8',
  qRedDark: '#C72F2F',
  qOrangeLight: '#F9A868',
  qOrangeDark: '#D46426',
  qBlueLight: '#4BA3DB',
  qBlueDark: '#035699',

  sand: '#FFF9EC',
  sand2: '#EFE3C8',
  sand3: '#E5D7AA',
  white: '#FFFFFF',
  graphite: '#222222',
  gray: '#707070',
  grayLight: '#A9A9A9',
  grayLighter: '#D8D8D8',
  grayXLight: '#F0F0F0',
  black: '#000000',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};
```

### 5.4 Gradientes

```ts
export const gradients = {
  sun: 'linear-gradient(135deg, #EF3E3E 0%, #F47A32 48%, #FFD43B 100%)',
  sea: 'linear-gradient(135deg, #071B3A 0%, #0477BF 100%)',
  sunset: 'linear-gradient(180deg, #F47A32 0%, #EF3E3E 100%)',
  sky: 'linear-gradient(180deg, #0477BF 0%, #071B3A 100%)',
};
```

Use o gradiente `sun` para ações principais, destaques e elementos de energia.  
Use o gradiente `sea` para áreas institucionais, dados, confiança e seções de gestão.

### 5.5 Tipografia

Fonte principal:

```txt
Goldplay, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

Hierarquia:

```txt
Display Bold: 48px / 900
Heading 1:    40px / 900
Heading 2:    32px / 900
Heading 3:    24px / 800
Heading 4:    20px / 800
Body Text:    16px / 700
Body Regular: 15px / 600
Small Text:   14px / 600
Label:        12px / 700 uppercase
```

### 5.6 Radius

```ts
export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  full: 999,
};
```

### 5.7 Sombras

```ts
export const shadows = {
  xs: '0 2px 4px rgba(7,27,58,.06)',
  sm: '0 4px 12px rgba(7,27,58,.08)',
  md: '0 12px 30px rgba(7,27,58,.12)',
  lg: '0 18px 50px rgba(7,27,58,.15)',
  xl: '0 28px 60px rgba(7,27,58,.20)',
};
```

### 5.8 Componentes Obrigatórios

Criar uma biblioteca de componentes reutilizáveis:

```txt
Button
IconButton
Input
Textarea
Select
SearchInput
DatePicker
TimePicker
Badge
StatusBadge
Card
MetricCard
MatchCard
CourtCard
BookingCard
PlayerAvatar
PlayerCard
TournamentCard
RankingTable
BookingCalendar
Modal
Drawer
BottomSheet
Tabs
SegmentedControl
Toast
EmptyState
LoadingState
ErrorState
DashboardCard
FinancialCard
NavigationSidebar
MobileBottomNav
```

Cada componente deve ter:

- variantes;
- estados de loading;
- estados disabled;
- acessibilidade;
- testes básicos;
- documentação simples de uso.

---

## 6. Princípios de UX

A experiência deve seguir estes princípios:

1. **Mobile-first**  
   Todas as telas precisam funcionar perfeitamente em celular.

2. **Ação rápida**  
   O usuário deve conseguir reservar, criar partida, lançar resultado ou confirmar presença em poucos toques.

3. **Clareza operacional**  
   Gestores precisam encontrar rapidamente agenda, financeiro, clientes e alertas.

4. **Hierarquia visual forte**  
   Informação principal sempre destacada. Evitar telas densas e confusas.

5. **Feedback imediato**  
   Toda ação deve responder com loading, sucesso, erro ou confirmação.

6. **Estados vazios úteis**  
   Nunca mostrar tela vazia sem orientação.

7. **Acessibilidade**  
   Garantir contraste, labels, foco visível, navegação por teclado e textos legíveis.

---

## 7. Perfis e Permissões

Criar autenticação com papéis e permissões.

### 7.1 Perfis

```txt
SUPER_ADMIN
OWNER
MANAGER
RECEPTIONIST
FINANCE
TEACHER
ORGANIZER
PLAYER
```

### 7.2 Permissões

Exemplos:

```txt
club.create
club.update
club.delete
court.create
court.update
booking.create
booking.cancel
booking.view_all
payment.view
payment.create
payment.refund
teacher.manage
tournament.create
tournament.update
match.result.update
ranking.manage
report.revenue.view
report.occupancy.view
user.invite
role.manage
```

Implementar RBAC desde o início.

---

## 8. Módulos do Backend

Criar os módulos principais no NestJS:

```txt
auth
users
profiles
clubs
arenas
courts
bookings
players
teachers
classes
tournaments
matches
rankings
payments
plans
subscriptions
notifications
reports
products
orders
permissions
audit
files
settings
```

Cada módulo deve conter:

```txt
controller
service
repository ou prisma service
dto
entities/types
guards quando necessário
tests
```

---

## 9. Modelo Inicial de Dados

Criar schema Prisma com pelo menos as seguintes entidades:

```txt
User
UserProfile
Role
Permission
Club
ClubMember
Arena
Court
CourtSchedule
Booking
BookingParticipant
Player
Teacher
Class
ClassStudent
Tournament
TournamentCategory
TournamentRegistration
Match
MatchParticipant
Ranking
RankingEntry
Payment
Invoice
Plan
Subscription
Notification
Product
Order
OrderItem
AuditLog
File
```

### 9.1 Campos Importantes

#### User

```txt
id
name
email
phone
passwordHash
avatarUrl
status
createdAt
updatedAt
```

#### Club

```txt
id
name
slug
description
logoUrl
coverUrl
phone
email
address
city
state
country
status
createdAt
updatedAt
```

#### Court

```txt
id
clubId
name
sportType
surfaceType
isIndoor
status
createdAt
updatedAt
```

#### Booking

```txt
id
clubId
courtId
createdById
startTime
endTime
status
price
paymentStatus
notes
createdAt
updatedAt
```

#### Tournament

```txt
id
clubId
name
slug
description
sportType
startDate
endDate
registrationStart
registrationEnd
status
visibility
coverUrl
createdAt
updatedAt
```

#### Match

```txt
id
tournamentId
categoryId
round
courtId
startTime
status
score
winnerId
createdAt
updatedAt
```

#### Payment

```txt
id
clubId
userId
bookingId optional
subscriptionId optional
amount
status
method
dueDate
paidAt
createdAt
updatedAt
```

---

## 10. Funcionalidades do MVP

### 10.1 Autenticação

Implementar:

- login;
- cadastro;
- logout;
- refresh token;
- recuperação de senha;
- proteção de rotas;
- sessão persistente;
- convite para membros da equipe;
- troca de perfil quando o usuário participa de mais de uma arena/clube.

### 10.2 Gestão de Clubes e Arenas

Implementar:

- criação de clube/arena;
- edição de dados;
- upload de logo e capa;
- configuração de horários de funcionamento;
- configuração de modalidades;
- configuração de regras de reserva;
- configuração de política de cancelamento;
- multiunidade.

### 10.3 Quadras

Implementar:

- cadastro de quadras;
- nome da quadra;
- modalidade;
- tipo de piso;
- status ativa/inativa/manutenção;
- preço por horário;
- bloqueios de horário;
- visualização por agenda.

### 10.4 Agenda e Reservas

Implementar:

- calendário diário;
- calendário semanal;
- filtro por quadra;
- filtro por modalidade;
- criar reserva;
- cancelar reserva;
- reagendar reserva;
- confirmar pagamento;
- adicionar participantes;
- status: pendente, confirmada, cancelada, concluída, no-show;
- prevenção de conflito de horário;
- bloqueio de agenda para manutenção/eventos.

### 10.5 Jogadores

Implementar:

- cadastro de jogador;
- perfil esportivo;
- modalidade favorita;
- nível técnico;
- histórico de jogos;
- partidas futuras;
- ranking;
- estatísticas básicas.

### 10.6 Professores e Aulas

Implementar:

- cadastro de professores;
- agenda do professor;
- criação de aulas;
- criação de turmas;
- alunos vinculados;
- lista de presença;
- reposição;
- comissão;
- relatório de aulas.

### 10.7 Financeiro

Implementar:

- pagamentos de reservas;
- pagamentos de aulas;
- mensalidades;
- inadimplência;
- receitas;
- despesas simples;
- fechamento diário;
- filtros por período;
- exportação CSV;
- status: pendente, pago, vencido, cancelado, estornado.

### 10.8 Torneios

Implementar:

- criação de torneio;
- categorias;
- inscrições;
- lista de inscritos;
- geração de partidas;
- grupos;
- mata-mata;
- lançamento de resultado;
- publicação de tabela;
- página pública do torneio;
- status da competição.

### 10.9 Rankings

Implementar:

- ranking por clube;
- ranking por modalidade;
- ranking por categoria;
- pontuação manual ou automática;
- atualização após resultados;
- histórico de movimentação.

### 10.10 Comunicação

Implementar:

- notificações internas;
- e-mail;
- push preparado para mobile;
- lembrete de reserva;
- lembrete de aula;
- aviso de pagamento vencido;
- confirmação de inscrição;
- resultado lançado.

---

## 11. Telas Web Obrigatórias

### 11.1 Área Pública

Criar:

```txt
/                       Landing page
/arenas                 Listagem pública de arenas
/arenas/[slug]          Página pública da arena
/torneios               Listagem pública de torneios
/torneios/[slug]        Página pública do torneio
/rankings/[slug]        Ranking público
/login                  Login
/cadastro               Cadastro
```

### 11.2 Dashboard do Gestor

Criar:

```txt
/app/dashboard
/app/agenda
/app/reservas
/app/clientes
/app/jogadores
/app/professores
/app/aulas
/app/financeiro
/app/torneios
/app/torneios/[id]
/app/rankings
/app/relatorios
/app/configuracoes
```

### 11.3 Área do Jogador Web

Criar:

```txt
/player/home
/player/partidas
/player/reservas
/player/torneios
/player/ranking
/player/perfil
/player/pagamentos
```

---

## 12. Telas Mobile Futuras

Preparar arquitetura para as seguintes telas no app:

```txt
onboarding
login
cadastro
home jogador
buscar partidas
criar partida
reservar quadra
minhas reservas
detalhe da reserva
torneios
detalhe do torneio
ranking
perfil
notificações
agenda professor
presença de alunos
comissões
agenda gestor
reserva rápida
```

A navegação mobile deve usar bottom tabs:

```txt
Início
Partidas
Torneios
Ranking
Perfil
```

Para professor:

```txt
Hoje
Aulas
Alunos
Comissões
Perfil
```

Para gestor:

```txt
Agenda
Reservas
Financeiro
Alertas
Mais
```

---

## 13. Regras de Negócio Essenciais

### 13.1 Reserva

- Uma quadra não pode ter duas reservas no mesmo horário.
- Reservas podem ter status pendente, confirmada, cancelada, concluída ou no-show.
- O gestor pode cancelar qualquer reserva.
- O jogador só pode cancelar dentro das regras configuradas pela arena.
- Reservas podem ter pagamento obrigatório ou não.
- Reservas podem ser criadas por gestor, recepção ou jogador.

### 13.2 Torneio

- Torneios pertencem a um clube/arena.
- Torneios podem ter várias categorias.
- Cada categoria pode ter limite de inscrições.
- Inscrição pode exigir pagamento.
- Resultados devem atualizar partidas e rankings quando aplicável.
- Página pública deve mostrar categorias, inscritos, programação e resultados.

### 13.3 Ranking

- Ranking pode ser manual ou automático.
- Pontuação pode variar por torneio, partida, categoria ou regra personalizada.
- Deve armazenar histórico de pontuação.
- Deve permitir recalcular ranking por job assíncrono.

### 13.4 Financeiro

- Todo pagamento deve ter status.
- Pagamentos podem estar vinculados a reserva, aula, plano, inscrição ou pedido.
- Deve ser possível filtrar por vencidos, pagos e pendentes.
- Deve haver trilha de auditoria para alterações financeiras.

---

## 14. API Inicial

Criar endpoints REST documentados.

### Auth

```txt
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

### Clubs

```txt
GET    /clubs
POST   /clubs
GET    /clubs/:id
PATCH  /clubs/:id
DELETE /clubs/:id
```

### Courts

```txt
GET    /clubs/:clubId/courts
POST   /clubs/:clubId/courts
GET    /courts/:id
PATCH  /courts/:id
DELETE /courts/:id
```

### Bookings

```txt
GET    /clubs/:clubId/bookings
POST   /clubs/:clubId/bookings
GET    /bookings/:id
PATCH  /bookings/:id
POST   /bookings/:id/cancel
POST   /bookings/:id/confirm-payment
```

### Players

```txt
GET    /clubs/:clubId/players
POST   /clubs/:clubId/players
GET    /players/:id
PATCH  /players/:id
```

### Teachers

```txt
GET    /clubs/:clubId/teachers
POST   /clubs/:clubId/teachers
GET    /teachers/:id
PATCH  /teachers/:id
```

### Classes

```txt
GET    /clubs/:clubId/classes
POST   /clubs/:clubId/classes
GET    /classes/:id
PATCH  /classes/:id
POST   /classes/:id/attendance
```

### Tournaments

```txt
GET    /tournaments
POST   /clubs/:clubId/tournaments
GET    /tournaments/:id
PATCH  /tournaments/:id
POST   /tournaments/:id/categories
POST   /tournaments/:id/register
POST   /tournaments/:id/generate-matches
```

### Matches

```txt
GET   /tournaments/:id/matches
GET   /matches/:id
PATCH /matches/:id
POST  /matches/:id/result
```

### Rankings

```txt
GET  /clubs/:clubId/rankings
POST /clubs/:clubId/rankings
GET  /rankings/:id
POST /rankings/:id/recalculate
```

### Reports

```txt
GET /clubs/:clubId/reports/revenue
GET /clubs/:clubId/reports/occupancy
GET /clubs/:clubId/reports/players
GET /clubs/:clubId/reports/teachers
GET /clubs/:clubId/reports/tournaments
```

---

## 15. Performance e Otimização

Aplicar desde o início:

### 15.1 Frontend

- carregamento por rota;
- skeleton loading;
- cache de consultas;
- debounce em buscas;
- paginação em tabelas;
- virtualização em listas grandes;
- imagens otimizadas;
- evitar bundle grande;
- lazy loading em gráficos e relatórios;
- estados vazios bem desenhados.

### 15.2 Backend

- paginação obrigatória;
- filtros por data e status;
- índices no banco;
- logs estruturados;
- rate limit em login e endpoints sensíveis;
- validação de payload;
- tratamento global de erros;
- jobs para tarefas pesadas;
- cache para rankings e relatórios.

### 15.3 Banco de Dados

Criar índices como:

```sql
CREATE INDEX idx_bookings_club_court_start ON bookings(club_id, court_id, start_time);
CREATE INDEX idx_bookings_player_start ON bookings(player_id, start_time);
CREATE INDEX idx_payments_club_status_due ON payments(club_id, status, due_date);
CREATE INDEX idx_matches_tournament_status ON matches(tournament_id, status);
CREATE INDEX idx_rankings_club_category ON rankings(club_id, category_id);
CREATE INDEX idx_users_email ON users(email);
```

---

## 16. Jobs e Automações

Implementar workers para:

```txt
recalcular rankings
gerar relatórios financeiros
enviar lembretes de reserva
enviar lembretes de aula
enviar cobrança de vencidos
processar inscrições de torneio
fechar torneios
calcular ocupação de quadras
limpar sessões expiradas
```

---

## 17. Segurança

Implementar:

- hash de senha com bcrypt ou argon2;
- JWT curto + refresh token;
- proteção CSRF onde aplicável;
- validação de entrada;
- sanitização de textos;
- rate limit;
- logs de auditoria;
- controle de permissões por clube;
- isolamento multi-tenant;
- não expor dados financeiros sem permissão;
- não permitir acesso cruzado entre arenas.

---

## 18. Observabilidade

Adicionar:

- Sentry para frontend, mobile e backend;
- logs estruturados no backend;
- rastreamento de erros de API;
- métricas de latência;
- monitoramento de jobs;
- alertas de falha em pagamentos, notificações e jobs críticos.

---

## 19. Qualidade de Código

Exigir:

- TypeScript strict;
- ESLint;
- Prettier;
- testes unitários para regras de negócio;
- testes de integração para API;
- testes básicos de componentes;
- commits organizados;
- pull requests com revisão;
- documentação mínima por módulo.

---

## 20. Entregáveis Esperados

Ao desenvolver, entregar:

1. Estrutura inicial do monorepo.
2. Design tokens implementados.
3. Biblioteca básica de UI.
4. Backend NestJS configurado.
5. Prisma + PostgreSQL configurados.
6. Autenticação completa.
7. RBAC inicial.
8. CRUD de clubes/arenas.
9. CRUD de quadras.
10. Agenda e reservas.
11. Dashboard inicial.
12. Página pública de arena.
13. Base para torneios.
14. Documentação de API.
15. Guia de setup local.

---

## 21. Critérios de Aceite

O MVP será considerado aprovado quando:

- o gestor conseguir criar uma arena;
- o gestor conseguir cadastrar quadras;
- o gestor conseguir criar reservas sem conflito de horário;
- o jogador conseguir visualizar horários e reservar;
- o dashboard mostrar reservas do dia, receita e ocupação;
- o sistema respeitar permissões;
- as telas seguirem o design system Quadrik;
- a interface for responsiva;
- a API estiver documentada;
- houver tratamento adequado de erros;
- houver base preparada para mobile.

---

## 22. Instruções de Implementação para IA/Dev

Ao implementar, siga este comportamento:

1. Comece criando a arquitetura do monorepo.
2. Configure TypeScript strict em todos os pacotes.
3. Crie primeiro os tokens de design.
4. Crie os componentes base.
5. Crie o backend com módulos bem separados.
6. Crie o schema Prisma com migrations.
7. Implemente autenticação antes das áreas privadas.
8. Implemente permissões antes dos módulos administrativos.
9. Implemente agenda e reserva com prevenção de conflitos.
10. Só depois implemente financeiro, torneios e rankings.
11. Nunca misture regra de negócio diretamente em componentes visuais.
12. Nunca acesse banco diretamente de controllers.
13. Sempre validar entrada com DTO/Zod/class-validator.
14. Sempre retornar erros padronizados.
15. Sempre considerar multi-tenant por clube/arena.

---

## 23. Padrão Visual de Telas

### 23.1 Dashboard Gestor

Criar layout com:

- sidebar lateral no desktop;
- header com nome da arena e perfil;
- cards de métricas no topo;
- agenda resumida;
- lista de alertas;
- gráfico simples de ocupação;
- atalhos rápidos.

Cards principais:

```txt
Reservas hoje
Receita hoje
Ocupação
Pagamentos pendentes
Alunos ativos
Torneios abertos
```

### 23.2 Home Jogador

Criar layout mobile-first com:

- hero com “Bora jogar?”;
- chips de filtro: Hoje, Beach Tennis, Vôlei, Intermediário;
- cards de partidas abertas;
- CTA “Criar partida”;
- próximas reservas;
- torneios em destaque;
- bottom navigation.

### 23.3 Agenda

Criar interface com:

- seleção de data;
- filtros por quadra;
- timeline por horário;
- status coloridos;
- arrastar/reagendar se possível;
- ação rápida para criar reserva;
- modal de detalhes da reserva.

---

## 24. Estados Visuais

Usar cores semânticas:

```txt
Confirmado / Pago: success #10B981
Pendente: warning #F59E0B
Cancelado / Vencido / Erro: error #EF4444
Informativo: info #3B82F6
Ação principal: gradiente sun
Área de gestão/dados: navy/blue
```

---

## 25. Nomenclatura do Produto

Usar nome **Quadrik** em toda a interface.

Slogans possíveis:

```txt
Bora jogar?
Sua arena no controle. Sua comunidade em movimento.
Partidas, reservas e torneios em um só lugar.
O sistema operacional dos esportes de praia.
```

---

## 26. Roadmap Sugerido

### Fase 1 — Fundação

- monorepo;
- design tokens;
- UI kit;
- autenticação;
- RBAC;
- clubes;
- quadras;
- agenda;
- reservas.

### Fase 2 — Operação

- clientes;
- jogadores;
- professores;
- aulas;
- financeiro básico;
- dashboard;
- notificações.

### Fase 3 — Competições

- torneios;
- categorias;
- inscrições;
- partidas;
- resultados;
- rankings;
- páginas públicas.

### Fase 4 — Mobile

- app jogador;
- app professor;
- notificações push;
- reserva rápida;
- ranking;
- torneios;
- check-in.

### Fase 5 — Inteligência

- sugestões de partidas;
- horários ociosos;
- CRM esportivo;
- automações;
- relatórios avançados;
- IA assistente para gestores.

---

## 27. Prompt Final Resumido para Execução

Desenvolva a plataforma Quadrik, um sistema web e mobile-first para gestão de arenas esportivas, reservas de quadras, jogadores, professores, aulas, torneios, rankings, pagamentos e comunidade. Use Next.js, React, TypeScript, Tailwind, NestJS, PostgreSQL, Prisma, Redis, BullMQ e arquitetura monorepo. Siga rigorosamente o Quadrik Design System Pro, com paleta vibrante, tipografia Goldplay, gradientes, cards arredondados, sombras suaves, tom de voz esportivo e experiência mobile-first. Implemente autenticação, RBAC, multi-tenant por clube/arena, módulos separados, API REST documentada, banco relacional bem modelado, agenda sem conflito de horários, dashboard gerencial, páginas públicas e base preparada para app React Native com Expo. Priorize clareza, performance, segurança, acessibilidade e escalabilidade.

