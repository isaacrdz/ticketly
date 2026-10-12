import { useColorScheme } from 'react-native';

// Icon colors must be passed as props, so they mirror the tokens in src/global.css.
const THEME_COLORS = {
  light: {
    foreground: '#14171f',
    muted: '#6b6a66',
    inverse: '#fefdfb',
    brand: '#2f7653',
    onBrand: '#ffffff',
    onPro: '#f2f1ed',
    background: '#f7f6f2',
    border: '#e8e5dc',
    green: '#1c5a3a',
    amber: '#8a5a0b',
    blue: '#2b4a85',
    violet: '#5a3f9a',
    slate: '#3a4256',
    red: '#a23a2c',
  },
  dark: {
    foreground: '#f2f1ed',
    muted: '#9a9993',
    inverse: '#14171f',
    brand: '#3f9d72',
    onBrand: '#ffffff',
    onPro: '#f2f1ed',
    background: '#0e1014',
    border: '#2a2d36',
    green: '#7fd4a6',
    amber: '#f0c36a',
    blue: '#8fb3f0',
    violet: '#b9a3ef',
    slate: '#aab2c6',
    red: '#f09a8d',
  },
};

export function useThemeColors() {
  const scheme = useColorScheme();
  return THEME_COLORS[scheme === 'dark' ? 'dark' : 'light'];
}
