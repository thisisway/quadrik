/**
 * Spacing tokens — 4px base unit
 *
 * Used for: padding, margin, gap, width, height, inset values.
 * Prefer named tokens over raw px values in components.
 */
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const

export type SpacingToken = keyof typeof spacing
export type SpacingValue = (typeof spacing)[SpacingToken]

/**
 * Component-level spacing guidelines:
 *
 * Card padding (desktop):    32px (spacing[8])
 * Card padding (mobile):     20px (spacing[5])
 * Section gap (desktop):     48px (spacing[12])
 * Section gap (mobile):      24px (spacing[6])
 * Inline element gap:        8-12px (spacing[2-3])
 * Form field gap:            16px (spacing[4])
 * Navigation item padding:   12-16px (spacing[3-4])
 * Page horizontal padding:   24px (spacing[6])
 * Max content width:         1280px
 */
