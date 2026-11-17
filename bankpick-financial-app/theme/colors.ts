export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  tabBar: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  border: string;
  inputBg: string;
  iconBg: string;
  success: string;
  danger: string;
  warning: string;
  cardDarkBg: string;
  cardAccentBg: string;
}

export const LightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F4F4F4',
  card: '#FFFFFF',
  tabBar: '#F8F9FB',
  text: '#1E1E2D',
  textSecondary: '#7E848D',
  textMuted: '#A2A2A7',
  primary: '#0066FF',
  primaryLight: '#EBF3FF',
  border: '#ECEEF2',
  inputBg: '#F4F4F6',
  iconBg: '#F4F4F6',
  success: '#10B981',
  danger: '#EB5757',
  warning: '#F59E0B',
  cardDarkBg: '#25253D',
  cardAccentBg: '#1B243B',
};

export const DarkColors: ThemeColors = {
  background: '#161622',
  surface: '#1E1E2D',
  card: '#1E1E2D',
  tabBar: '#27273A',
  text: '#FFFFFF',
  textSecondary: '#A2A2A7',
  textMuted: '#7E848D',
  primary: '#0066FF',
  primaryLight: '#1D2B4A',
  border: '#2A2A3C',
  inputBg: '#1E1E2D',
  iconBg: '#1E1E2D',
  success: '#10B981',
  danger: '#EB5757',
  warning: '#F59E0B',
  cardDarkBg: '#25253D',
  cardAccentBg: '#1E2538',
};

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  round: 999,
};
