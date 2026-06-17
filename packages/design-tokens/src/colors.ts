export const colors = {
  // Primary palette
  qRed: '#EF3E3E',
  qOrange: '#F47A32',
  qYellow: '#FFD43B',
  qNavy: '#071B3A',
  qBlue: '#0477BF',

  // Extended palette
  qRedLight: '#F5A8A8',
  qRedDark: '#C72F2F',
  qOrangeLight: '#F9A868',
  qOrangeDark: '#D46426',
  qBlueLight: '#4BA3DB',
  qBlueDark: '#035699',

  // Neutrals
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

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const

export type ColorToken = keyof typeof colors
export type ColorValue = (typeof colors)[ColorToken]

/**
 * Usage guidelines:
 *
 * qRed / qOrange / qYellow  → Primary brand, energy, CTA (use with grad-sun)
 * qNavy / qBlue             → Management areas, trust, data (use with grad-sea)
 * sand / sand2 / sand3      → Page backgrounds, warm neutrals
 * graphite                  → Primary text
 * gray / grayLight          → Secondary text, labels, placeholders
 * grayLighter / grayXLight  → Borders, dividers, surface backgrounds
 * success                   → Confirmed, paid, active states
 * warning                   → Pending, attention required
 * error                     → Cancelled, overdue, error states
 * info                      → Informational notices, links
 */
