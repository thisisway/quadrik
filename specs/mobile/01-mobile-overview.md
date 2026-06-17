# Mobile App — Screen Overview

**Platform:** React Native + Expo  
**Router:** Expo Router (file-based)  
**Status:** Future phase (Phase 4 of roadmap)

---

## Navigation Structure

### Player App

```
(tabs)/
  index.tsx           → Início (Home)
  matches.tsx         → Partidas
  tournaments.tsx     → Torneios
  ranking.tsx         → Ranking
  profile.tsx         → Perfil

(modal)/
  create-match.tsx    → Create match modal
  booking-detail.tsx  → Booking detail
  tournament-detail.tsx

(auth)/
  onboarding.tsx
  login.tsx
  register.tsx
```

**Bottom Tabs:**
```
[Início]  [Partidas]  [Torneios]  [Ranking]  [Perfil]
```

---

### Teacher App

```
(tabs)/
  today.tsx           → Hoje (schedule for the day)
  classes.tsx         → Aulas (class list)
  students.tsx        → Alunos
  commissions.tsx     → Comissões
  profile.tsx         → Perfil
```

**Bottom Tabs:**
```
[Hoje]  [Aulas]  [Alunos]  [Comissões]  [Perfil]
```

---

### Manager App (Quick Operations)

```
(tabs)/
  schedule.tsx        → Agenda
  bookings.tsx        → Reservas
  financial.tsx       → Financeiro
  alerts.tsx          → Alertas
  more.tsx            → Mais (links to full features)
```

**Bottom Tabs:**
```
[Agenda]  [Reservas]  [Financeiro]  [Alertas]  [Mais]
```

---

## Mobile Screen Specs

### Onboarding

- 3-step swiper (React Native Reanimated)
- Step 1: "Bora jogar? Encontre partidas e reserve quadras."
- Step 2: "Competições perto de você. Entre em torneios."
- Step 3: "Acompanhe seu ranking e evolução."
- Skip + Get started buttons
- Background: grad-sun on last step

### Login (Mobile)

- Logo centered at top
- Gradient background (sand)
- Email + password inputs
- "Entrar" button (full-width, grad-sun)
- Social auth: Google
- Link: "Criar conta"

### Player Home (Mobile)

- Sticky header: logo + notification bell
- Hero: "Bora jogar, João?" with sport filter chips (horizontal scroll)
- Open match cards (vertical scroll)
- "Próximas reservas" section
- "Torneios em destaque" horizontal scroll
- Bottom tab navigation

### Create Match (Modal — Bottom Sheet)

- BottomSheet component (snap point: 85vh)
- Sport type selector (grid of chips)
- Level picker (Iniciante / Intermediário / Avançado)
- Arena search
- Date + time pickers
- "Criar e publicar" CTA

### Booking Detail (Modal)

- BottomSheet (snap: 70vh)
- Court + date + time header
- Participants avatars
- Payment status
- Cancel / Share actions

### Check-In

- Available when booking is today and within 30min of start time
- QR code or tap button
- Arena staff scans or player self-checks

### Result Entry (Player)

- After match is played
- Simple score form (per set)
- Both players must confirm OR organizer confirms

### Teacher — Today View

- List of classes for today
- Each class: time, court, number of students
- Tap → attendance list

### Teacher — Attendance

- Student list with check/uncheck
- Absense reason (optional)
- Save button

### Manager — Quick Booking (Mobile)

- Date + court chip selection
- Time slot grid (compact)
- Customer search
- Payment confirmation

---

## Mobile Design Rules

1. **Minimum tap target:** 44×44px
2. **Safe area:** Always respect `useSafeAreaInsets` for bottom nav and status bar
3. **Gesture handling:** Swipe back on iOS, back button on Android
4. **Keyboard avoidance:** Forms should use `KeyboardAvoidingView`
5. **Image loading:** Use `expo-image` with blur-hash placeholder
6. **Loading:** Prefer skeleton over spinner for content areas
7. **Error handling:** Toast messages via notification (not alert dialogs)
8. **Animations:** React Native Reanimated for smooth transitions (tab switch, sheet open)
