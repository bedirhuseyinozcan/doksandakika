import { TextStyle, Platform } from 'react-native';

export const FontFamily = {
  heading: Platform.select({
    ios: 'Space Grotesk',
    android: 'sans-serif-medium',
    default: 'system-ui, -apple-system, sans-serif',
  }),
  body: Platform.select({
    ios: 'Inter',
    android: 'sans-serif',
    default: 'system-ui, -apple-system, sans-serif',
  }),
  mono: Platform.select({
    ios: 'IBM Plex Mono',
    android: 'monospace',
    default: 'ui-monospace, monospace',
  }),
};

export const Typography: Record<string, TextStyle> = {
  hero: {
    fontFamily: FontFamily.heading,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 38,
  },
  h1: {
    fontFamily: FontFamily.heading,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  h2: {
    fontFamily: FontFamily.heading,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  h3: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodyBold: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  captionBold: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  statBadge: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  monoMeta: {
    fontFamily: FontFamily.mono,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  monoLarge: {
    fontFamily: FontFamily.mono,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
};
