# Quadrik Design System Pro

## Visão Geral

O Quadrik Design System Pro é o sistema de design oficial da plataforma Quadrik. Ele define a identidade visual, tokens de design, componentes reutilizáveis e padrões de UX para todas as superfícies: web, mobile e futuras interfaces.

## Conceito

**Nome:** Quadrik  
**Conceito:** Plataforma de matchmaking, comunidade e gestão para esportes de praia e raquete.  
**Sensação desejada:** Energia, movimento, confiança, diversão, clareza e profissionalismo.

## Princípios de Design

1. **Mobile-first** — Telas projetadas para celular e expandidas para desktop
2. **Hierarquia visual forte** — Informação principal sempre destacada
3. **Feedback imediato** — Toda ação responde com loading, sucesso, erro ou confirmação
4. **Estados vazios úteis** — Nunca mostrar tela vazia sem orientação
5. **Acessibilidade** — Contraste, labels, foco visível, navegação por teclado

## Estrutura

```
design-system/
  README.md               — Este arquivo
  tokens/
    colors.ts             — Paleta de cores
    typography.ts         — Tipografia e hierarquia
    spacing.ts            — Espaçamentos
    radius.ts             — Border radius
    shadows.ts            — Sombras
    gradients.ts          — Gradientes
    index.ts              — Exportações centralizadas
  components.md           — Catálogo de componentes
  patterns.md             — Padrões de UI e UX
  voice-tone.md           — Tom de voz e linguagem
```

## Tom de Voz

Direto, positivo e esportivo. Ver [voice-tone.md](./voice-tone.md).

## Uso dos Tokens

```ts
import { colors, gradients, radius, shadows, spacing, typography } from '@quadrik/design-tokens'
```

## Referência Visual

Ver o arquivo `design-system-oficial.html` na raiz do repositório para a visualização interativa completa do design system.
