/**
 * CORPORATE DESIGN SYSTEM — INDUSTRIAL SWISS DESIGN LANGUAGE
 * Monochromatic Foundation + Doksan Dakika Volt Green Accent (#C7FB07)
 */

export const CorporateColors = {
  // Permanent Corporate Identity
  primaryBlack: '#090909',
  pureWhite: '#FFFFFF',
  lightGray: '#F0F0F0',
  neutralGray: '#777777',

  // Project-Specific Primary Accent (Doksan Dakika Volt Green: #C7FB07)
  accentPrimary: '#C7FB07',
  accentHover: '#D4FC33',
  accentPressed: '#AEE400',
  accentMuted: 'rgba(199, 251, 7, 0.12)',
  accentBorder: 'rgba(199, 251, 7, 0.35)',

  // Dark Theme Surfaces
  background: '#090909',
  surface: '#121212',
  surfaceElevated: '#171717',
  surfaceLight: '#1E1E1E',
  surfaceHighlight: '#262626',

  // Borders (1px / 2px geometric definition)
  border: '#242424',
  borderLight: '#333333',
  borderHighlight: '#C7FB07',
  borderSubtle: '#1A1A1A',

  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#F0F0F0',
  textMuted: '#777777',
  textInverse: '#090909',

  // Functional Semantic Status Colors
  success: '#C7FB07',
  warning: '#EAB308',
  danger: '#EF4444',
  info: '#3478F6',

  // Game Matching Status
  matchCorrect: '#C7FB07',
  matchWrong: '#EF4444',
  matchPartial: '#EAB308',
};

// Backward-compatible alias for existing imports
export const Colors = {
  ...CorporateColors,
  primary: CorporateColors.accentPrimary,
  primaryDark: CorporateColors.accentPressed,
  secondary: '#3478F6',
  accent: CorporateColors.accentPrimary,
};
