export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  harrisGreen: string;
  harrisGreenLight: string;
  harrisGreenDark: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  charcoal: string;
  charcoalDark: string;
  charcoalLight: string;
  cream: string;
  white: string;
  slate: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface HarrisTheme {
  colors: ThemeColors;
  fontFamily: {
    sans: string;
    display: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  shadows: {
    card: string;
    cardHover: string;
    drawer: string;
    modal: string;
    luxury: string;
  };
  transitions: {
    base: string;
    slow: string;
  };
}

export const harrisTheme: HarrisTheme = {
  colors: {
    primary: '#006A56', // Official Harris Green
    primaryLight: '#008269',
    primaryDark: '#004F40',
    harrisGreen: '#006A56',
    harrisGreenLight: '#008269',
    harrisGreenDark: '#004F40',
    accent: '#D97E26', // Official Harris Warm Amber
    accentLight: '#E9933F',
    accentDark: '#B86419',
    gold: '#D97E26',
    goldLight: '#E9933F',
    goldDark: '#B86419',
    charcoal: '#002921',
    charcoalDark: '#001E18',
    charcoalLight: '#003D32',
    cream: '#FDFBF7',
    white: '#FFFFFF',
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  fontFamily: {
    sans: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    card: '0 4px 15px rgba(0, 106, 86, 0.07)',
    cardHover: '0 14px 30px rgba(0, 106, 86, 0.14)',
    drawer: '0 -4px 30px rgba(0, 0, 0, 0.18)',
    modal: '0 25px 50px -12px rgba(0, 106, 86, 0.35)',
    luxury: '0 20px 40px -15px rgba(0, 106, 86, 0.22)',
  },
  transitions: {
    base: '200ms ease-in-out',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

declare module 'styled-components' {
  export interface DefaultTheme extends HarrisTheme {}
}
