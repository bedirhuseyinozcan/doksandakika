import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { useGameStore } from '../../stores/useGameStore';
import { getCosmeticById } from '../../features/shop/catalog';

interface IGameNavbarProps {
  title: string;
  isReplay?: boolean;
  attemptsLeft: number;
  maxAttempts: number;
  onBack: () => void;
  onOpenMap?: () => void;
  showMapButton?: boolean;
}

export const GameNavbar: React.FC<IGameNavbarProps> = React.memo(
  ({
    title,
    isReplay = false,
    attemptsLeft,
    maxAttempts,
    onBack,
    onOpenMap,
    showMapButton = false,
  }) => {
    const equippedCosmeticId = useGameStore((s) => s.equippedCosmeticId);
    const equippedCosmetic = useMemo(
      () => getCosmeticById(equippedCosmeticId),
      [equippedCosmeticId]
    );
    const theme = equippedCosmetic.themeConfig;

    return (
      <View style={[styles.navbar, { borderBottomColor: theme.cardBorder || Colors.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 20 }}
        >
          <Text style={[styles.backBtnText, { color: theme.primaryColor || Colors.accentPrimary }]}>
            ‹ GERİ
          </Text>
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>{title}</Text>
          {isReplay ? (
            <View style={styles.replayBadge}>
              <Text style={styles.replayBadgeText}>TEKRAR</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.navRightRow}>
          {showMapButton && onOpenMap ? (
            <TouchableOpacity
              onPress={onOpenMap}
              style={styles.mapHeaderBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
            >
              <Text style={styles.mapHeaderBtnText}>HARİTA</Text>
            </TouchableOpacity>
          ) : null}

          {/* Theme Avatar Badge */}
          <View
            style={[
              styles.navAvatarBadge,
              {
                borderColor: theme.primaryColor,
                backgroundColor: theme.accentGlow || Colors.surfaceLight,
              },
            ]}
          >
            <Text style={styles.navAvatarText}>{equippedCosmetic.avatarEmoji}</Text>
          </View>

          <View
            style={[
              styles.attemptsBadge,
              {
                borderColor: theme.primaryColor,
                backgroundColor: theme.accentGlow || Colors.surfaceLight,
              },
            ]}
          >
            <Text style={[styles.attemptsText, { color: theme.primaryColor }]}>
              {attemptsLeft}/{maxAttempts}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

GameNavbar.displayName = 'GameNavbar';

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + Spacing.xs : Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: Borders.thin,
    borderBottomColor: Colors.border,
    minHeight: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 54 : 54,
  },
  backBtn: {
    minHeight: 44,
    minWidth: 54,
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
  },
  backBtnText: {
    ...Typography.bodyBold,
    fontFamily: Typography.statBadge.fontFamily,
    fontSize: 12,
    letterSpacing: 0.8,
  },
  navTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  navTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  replayBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.warning,
  },
  replayBadgeText: {
    ...Typography.statBadge,
    fontSize: 9,
    color: Colors.warning,
  },
  navRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  mapHeaderBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    minHeight: 32,
    justifyContent: 'center',
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  mapHeaderBtnText: {
    ...Typography.statBadge,
    fontSize: 10,
    color: Colors.textPrimary,
  },
  navAvatarBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navAvatarText: {
    fontSize: 14,
  },
  attemptsBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  attemptsText: {
    ...Typography.monoMeta,
    fontWeight: '800',
    fontSize: 11,
  },
});
