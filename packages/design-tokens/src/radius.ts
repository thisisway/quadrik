/**
 * Border radius tokens (values in px)
 *
 * xs   → Small interactive elements: checkboxes, small badges
 * sm   → Inputs, table rows, compact cards
 * md   → Standard cards, modals, popovers
 * lg   → Large cards, panels, agenda blocks
 * xl   → Hero cards, featured panels, app containers
 * full → Pills, avatars, circular elements
 */
export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  full: 999,
} as const

export type RadiusToken = keyof typeof radius
export type RadiusValue = (typeof radius)[RadiusToken]
