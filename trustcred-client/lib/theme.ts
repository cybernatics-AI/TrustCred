/**
 * TrustCred Theme Configuration
 * 
 * This file contains the theme configuration for the TrustCred application.
 * It includes color palettes, gradients, and utility functions for consistent theming.
 */

export const trustCredTheme = {
  colors: {
    // Primary brand colors
    trustBlue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    
    // Security and success colors
    securityGreen: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Lemon-lime accent colors
    lemonLime: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#365314',
      900: '#1a2e05',
    },
    
    // Professional neutral colors
    professionalGray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Warning colors
    warningAmber: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
    },
    
    // Error/danger colors
    dangerRed: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    secondary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    hero: 'linear-gradient(135deg, #84cc16 0%, #22c55e 50%, #2563eb 100%)',
    heroLight: 'linear-gradient(135deg, #a3e635 0%, #4ade80 50%, #ffffff 100%)',
    lemon: 'linear-gradient(135deg, #ecfccb 0%, #a3e635 50%, #84cc16 100%)',
    lemonDark: 'linear-gradient(135deg, #4d7c0f 0%, #84cc16 50%, #a3e635 100%)',
    greenWhite: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #86efac 100%)',
    limeToBlue: 'linear-gradient(135deg, #a3e635 0%, #84cc16 25%, #22c55e 75%, #2563eb 100%)',
    card: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    cardDark: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
    hover: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    hoverDark: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    accent: 'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)',
    accentDark: 'linear-gradient(135deg, #365314 0%, #4d7c0f 100%)',
  },
  
  shadows: {
    trust: '0 10px 25px -5px rgba(37, 99, 235, 0.2), 0 8px 10px -6px rgba(37, 99, 235, 0.1)',
    trustDark: '0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)',
  },
  
  // Semantic color mappings
  semantic: {
    light: {
      background: '#f8fafc',
      foreground: '#0f172a',
      card: '#ffffff',
      cardForeground: '#0f172a',
      primary: '#2563eb',
      primaryForeground: '#ffffff',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      accent: '#22c55e',
      accentForeground: '#ffffff',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#60a5fa',
    },
    dark: {
      background: '#0f172a',
      foreground: '#f8fafc',
      card: '#1e293b',
      cardForeground: '#f8fafc',
      primary: '#3b82f6',
      primaryForeground: '#0f172a',
      secondary: '#1e293b',
      secondaryForeground: '#f8fafc',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      accent: '#4ade80',
      accentForeground: '#0f172a',
      destructive: '#f87171',
      destructiveForeground: '#0f172a',
      border: '#334155',
      input: '#334155',
      ring: '#93c5fd',
    },
  },
  
  // Status colors for different credential states
  status: {
    verified: {
      light: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
      dark: { bg: 'rgba(20, 83, 45, 0.3)', text: '#86efac', border: 'rgba(22, 163, 74, 0.3)' },
    },
    pending: {
      light: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
      dark: { bg: 'rgba(146, 64, 14, 0.3)', text: '#fcd34d', border: 'rgba(217, 119, 6, 0.3)' },
    },
    revoked: {
      light: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
      dark: { bg: 'rgba(153, 27, 27, 0.3)', text: '#fca5a5', border: 'rgba(220, 38, 38, 0.3)' },
    },
    expired: {
      light: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
      dark: { bg: 'rgba(55, 65, 81, 0.3)', text: '#d1d5db', border: 'rgba(107, 114, 128, 0.3)' },
    },
  },
  
  // Typography scale
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
  
  // Spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Border radius scale
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
} as const;

// Utility functions for working with the theme
export const getStatusColor = (status: keyof typeof trustCredTheme.status, isDark = false) => {
  return trustCredTheme.status[status][isDark ? 'dark' : 'light'];
};

export const getGradient = (type: keyof typeof trustCredTheme.gradients) => {
  return trustCredTheme.gradients[type];
};

export const getSemanticColor = (color: keyof typeof trustCredTheme.semantic.light, isDark = false) => {
  return trustCredTheme.semantic[isDark ? 'dark' : 'light'][color];
};

// CSS custom property helpers
export const getCSSVariable = (variable: string) => `var(--${variable})`;

// Tailwind class name helpers
export const getStatusClasses = (status: keyof typeof trustCredTheme.status) => {
  return `status-${status}`;
};

export type TrustCredTheme = typeof trustCredTheme;
export type StatusType = keyof typeof trustCredTheme.status;
export type GradientType = keyof typeof trustCredTheme.gradients;
