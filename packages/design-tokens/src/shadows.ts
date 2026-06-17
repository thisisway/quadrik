/**
 * Shadow tokens — all shadows use navy (#071B3A) as the shadow color
 * to maintain brand consistency and warmth.
 *
 * xs  → Subtle depth: inputs, table rows, inline elements
 * sm  → Cards at rest, list items
 * md  → Cards on hover, modals, drawers
 * lg  → Featured panels, hero cards
 * xl  → Overlays, floating menus, top-level modals
 */
export const shadows = {
  xs: '0 2px 4px rgba(7, 27, 58, 0.06)',
  sm: '0 4px 12px rgba(7, 27, 58, 0.08)',
  md: '0 12px 30px rgba(7, 27, 58, 0.12)',
  lg: '0 18px 50px rgba(7, 27, 58, 0.15)',
  xl: '0 28px 60px rgba(7, 27, 58, 0.20)',
} as const

export type ShadowToken = keyof typeof shadows
export type ShadowValue = (typeof shadows)[ShadowToken]
