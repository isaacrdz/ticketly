// Icon colors must be passed as props, so they mirror the tokens in src/global.css.
const THEME_COLORS = {
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
};

export function useThemeColors() {
  return THEME_COLORS;
}
