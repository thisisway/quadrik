export const gradients = {
  /**
   * Primary brand gradient — energy, main CTAs, hero sections, player-facing highlights
   * Direction: 135deg | Red → Orange → Yellow
   */
  sun: 'linear-gradient(135deg, #EF3E3E 0%, #F47A32 48%, #FFD43B 100%)',

  /**
   * Management / trust gradient — admin areas, data panels, institutional sections
   * Direction: 135deg | Navy → Blue
   */
  sea: 'linear-gradient(135deg, #071B3A 0%, #0477BF 100%)',

  /**
   * Vertical warm gradient — cards, overlays, bottom-to-top energy feel
   * Direction: 180deg | Orange → Red
   */
  sunset: 'linear-gradient(180deg, #F47A32 0%, #EF3E3E 100%)',

  /**
   * Vertical cool gradient — management panels, info sections
   * Direction: 180deg | Blue → Navy
   */
  sky: 'linear-gradient(180deg, #0477BF 0%, #071B3A 100%)',
} as const

export type GradientToken = keyof typeof gradients
export type GradientValue = (typeof gradients)[GradientToken]
