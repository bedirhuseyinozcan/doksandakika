import React, { useState, useMemo, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IBlurredImageHeroProps {
  imageUrl?: string;
  hasServerBlur?: boolean;
  currentAttempt: number;
  maxAttempts: number;
  isSolved?: boolean;
  isGameOver?: boolean;
  solvedPlayerName?: string;
}

export const BlurredImageHero = React.memo<IBlurredImageHeroProps>(
  ({
    imageUrl,
    hasServerBlur = false,
    currentAttempt,
    maxAttempts,
    isSolved = false,
    isGameOver = false,
    solvedPlayerName,
  }) => {
    const { primaryColor, onPrimaryTextColor } = useActiveTheme();
    const [imageError, setImageError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      setIsLoaded(false);
      setImageError(false);
    }, [imageUrl]);

    const blurRadius = useMemo(() => {
      if (isSolved || isGameOver) return 0;
      if (hasServerBlur) return 0;
      const remaining = Math.max(0, maxAttempts - currentAttempt - 1);
      return Math.round((remaining / Math.max(1, maxAttempts - 1)) * 26);
    }, [isSolved, isGameOver, hasServerBlur, currentAttempt, maxAttempts]);

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {!isLoaded && !imageError && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="small" color={primaryColor} />
            </View>
          )}

          {imageUrl && !imageError ? (
            <Image
              key={imageUrl}
              source={{
                uri: imageUrl,
                headers: {
                  'User-Agent':
                    'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                  Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                  Referer: 'https://www.transfermarkt.com/',
                },
              }}
              style={[
                styles.image,
                Platform.OS === 'web' && blurRadius > 0
                  ? ({
                      filter: `blur(${blurRadius}px)`,
                      transform: [{ scale: 1.12 }],
                      transition: 'filter 0.4s ease, transform 0.4s ease',
                    } as any)
                  : undefined,
              ]}
              blurRadius={Platform.OS !== 'web' ? blurRadius : undefined}
              resizeMode="cover"
              onLoad={() => setIsLoaded(true)}
              onLoadEnd={() => setIsLoaded(true)}
              onError={(e) => {
                console.warn('BlurredImageHero image load failed for:', imageUrl, e?.nativeEvent);
                setImageError(true);
              }}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderIcon}>👤</Text>
              <Text style={styles.placeholderText}>GİZEMLİ YILDIZ</Text>
            </View>
          )}

          <View
            style={[
              styles.levelBadge,
              isSolved && [styles.levelBadgeSolved, { backgroundColor: primaryColor, borderColor: primaryColor }],
            ]}
          >
            <Text
              style={[
                styles.levelBadgeText,
                { color: primaryColor },
                isSolved && [styles.levelBadgeTextSolved, { color: onPrimaryTextColor }],
              ]}
            >
              {isSolved
                ? '✓ BİLDİNİZ! • %100'
                : isGameOver
                ? '✕ OYUN BİTTİ'
                : `NETLİK: ${Math.min(currentAttempt + 1, maxAttempts)}/${maxAttempts}`}
            </Text>
          </View>
        </View>

        <Text style={[styles.subtext, isSolved && [styles.subtextSolved, { color: primaryColor }]]}>
          {isSolved && solvedPlayerName
            ? `TEBRİKLER! BİLDİNİZ: ${solvedPlayerName.toUpperCase()}`
            : isGameOver && solvedPlayerName
            ? `HEDEF OYUNCU: ${solvedPlayerName.toUpperCase()}`
            : 'HER YANLIŞ TAHMİNDE GÖRSEL BİR KADEME NETLEŞİR'}
        </Text>
      </View>
    );
  }
);

BlurredImageHero.displayName = 'BlurredImageHero';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
  imageContainer: {
    width: 190,
    height: 190,
    borderRadius: BorderRadius.sharp,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceLight,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  spinnerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 50,
    opacity: 0.5,
  },
  placeholderText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  levelBadge: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    zIndex: 2,
  },
  levelBadgeSolved: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  levelBadgeTextSolved: {
    color: '#090909',
    fontWeight: '800',
  },
  subtextSolved: {
    color: Colors.accentPrimary,
    fontWeight: '700',
  },
  levelBadgeText: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    fontWeight: '800',
    fontSize: 9.5,
  },
  subtext: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontSize: 9.5,
    letterSpacing: 0.6,
  },
});
