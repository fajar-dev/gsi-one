const sharedRoleColors = {
  gradientStart: '#002239',
  gradientEnd: '#087454',
  accent: '#087454',
  forest: '#2E7D32',
  teal: '#00796B',
  accentLight: '#E8F5E9',
  tealLight: '#E0F2F1',
} as const;
export const roleColors = {
  admin: sharedRoleColors,
  marketing: sharedRoleColors,
  engineer: sharedRoleColors,
  client: sharedRoleColors,
} as const;

export const neutral = {
  900: '#212121',
  800: '#424242',
  700: '#616161',
  600: '#757575',
  500: '#667085',
  400: '#BDBDBD',
  300: '#E0E0E0',
  200: '#EEEEEE',
  100: '#F5F5F5',
  50: '#FAFAFA',
} as const;

export const surface = {
  primary: '#FFFFFF',
  secondary: '#F5F8F7',
  screen: '#F8F9FA',
  card: '#FFFFFF',
} as const;

export const overlay = {
  white20: 'rgba(255, 255, 255, 0.2)',
  white30: 'rgba(255, 255, 255, 0.3)',
  white40: 'rgba(255, 255, 255, 0.4)',
  white85: 'rgba(255, 255, 255, 0.85)',
  black06: 'rgba(0, 0, 0, 0.06)',
  black35: 'rgba(0, 0, 0, 0.35)',
  black48: 'rgba(0, 0, 0, 0.48)',
} as const;

export const colors = {
  primary: '#2E6B7D',
  primaryDark: '#2E5F6F',
  primaryLight: '#76b7c9',

  secondary: '#B94F16',
  secondaryDark: '#D45E1F',
  secondaryLight: '#FF9E6B',

  accent: '#2E7D32',
  accentDark: '#3D8B2E',
  accentLight: '#7DD46E',

  white: '#FFFFFF',
  black: '#000000',
  grey: '#667085',
  greyLight: '#F5F5F5',
  greyDark: '#424242',

  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',

  textPrimary: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',

  border: '#E0E0E0',
  borderLight: '#F0F0F0',

  success: '#2E7D32',
  warning: '#9A5B00',
  error: '#B42318',
  info: '#175CD3',
};
