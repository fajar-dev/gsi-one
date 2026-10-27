import { colors, roleColors } from './colors';

/** Shared semantic values; screen-specific illustrations keep their own colors. */
export const palette = { ...colors, brand: roleColors.client.accent } as const;
export const layout = { webMaxWidth: 480 } as const;
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
} as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
export const buttonMetrics = {
  paddingVertical: 10,
  compactPaddingVertical: 8,
  compactMinSize: 36,
  compactHitSlop: 4,
} as const;
export const touchTarget = { minSize: 44 } as const;
export const typography = {
  caption: 12,
  body: 14,
  bodyLarge: 16,
  title: 20,
  heading: 24,
} as const;
