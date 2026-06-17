export const fontFamily = {
  primary: "'Goldplay', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
} as const

export const fontSize = {
  display: '48px',
  h1: '40px',
  h2: '32px',
  h3: '24px',
  h4: '20px',
  body: '16px',
  bodyRegular: '15px',
  small: '14px',
  label: '12px',
} as const

export const fontWeight = {
  display: 900,
  h1: 900,
  h2: 900,
  h3: 800,
  h4: 800,
  body: 700,
  bodyRegular: 600,
  small: 600,
  label: 700,
} as const

export const letterSpacing = {
  display: '-0.06em',
  heading: '-0.03em',
  label: '0.12em',  // uppercase labels
  normal: '0',
} as const

export const lineHeight = {
  tight: '1',
  snug: '1.2',
  normal: '1.6',
} as const

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} as const

/**
 * Type scale reference:
 *
 * Display Bold: 48px / 900 / -0.06em  → Hero headlines, splash screens
 * Heading 1:   40px / 900 / -0.03em  → Page titles
 * Heading 2:   32px / 900 / -0.03em  → Section titles
 * Heading 3:   24px / 800 / -0.03em  → Card headers, sub-sections
 * Heading 4:   20px / 800 / normal   → List item titles
 * Body Text:   16px / 700 / normal   → Primary body copy (semi-bold feel)
 * Body Regular:15px / 600 / normal   → Supporting body copy
 * Small Text:  14px / 600 / normal   → Metadata, timestamps, secondary info
 * Label:       12px / 700 / 0.12em  → Uppercase labels, status badges
 */
