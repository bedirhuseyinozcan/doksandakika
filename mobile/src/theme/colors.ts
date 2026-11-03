/**
 * CORPORATE DESIGN SYSTEM — INDUSTRIAL SWISS DESIGN LANGUAGE
 * Monochromatic Foundation + Project-Specific Accent (#00D084)
 */

export const CorporateColors = {
  // Permanent Corporate Identity
  primaryBlack: '#090909',
  pureWhite: '#FFFFFF',
  lightGray: '#F0F0F0',
  neutralGray: '#777777',

  // Project-Specific Primary Accent (Mandatory User Selection: #00D084)
  accentPrimary: '#00D084',
  accentHover: '#00E592',
  accentPressed: '#00B371',
  accentMuted: 'rgba(0, 208, 132, 0.12)',
  accentBorder: 'rgba(0, 208, 132, 0.35)',

  // Dark Theme Surfaces
  background: '#090909',
  surface: '#121212',
  surfaceElevated: '#171717',
  surfaceLight: '#1E1E1E',
  surfaceHighlight: '#262626',

  // Borders (1px / 2px geometric definition)
  border: '#242424',
  borderLight: '#333333',
  borderHighlight: '#00D084',
  borderSubtle: '#1A1A1A',

  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#F0F0F0',
  textMuted: '#777777',
  textInverse: '#090909',

  // Functional Semantic Status Colors
  success: '#00D084',
  warning: '#EAB308',
  danger: '#EF4444',
  info: '#3478F6',

  // Game Matching Status
  matchCorrect: '#00D084',
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
