import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ILevelMapNavbarProps {
  coins: number;
  xp: number;
  onBack: () => void;
}

export const LevelMapNavbar: React.FC<ILevelMapNavbarProps> = React.memo(
  ({ coins, xp, onBack }) => {
    const { primaryColor } = useActiveTheme();

    return (
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 20 }}
        >
          <Text style={[styles.backBtnText, { color: primaryColor }]}>‹ ANA MENÜ</Text>
        </TouchableOpacity>

        <View style={styles.navCurrency}>
          <View style={styles.coinBadge}>
            <Text style={[styles.coinText, { color: primaryColor }]}>🪙 {coins}</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>⚡ {xp} XP</Text>
          </View>
        </View>
      </View>
    );
  }
);

LevelMapNavbar.displayName = 'LevelMapNavbar';

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
    minWidth: 80,
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
  },
  backBtnText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 12,
    letterSpacing: 0.8,
  },
  navCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  coinBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  coinText: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    fontWeight: '700',
    fontSize: 11,
  },
  xpBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  xpText: {
    ...Typography.monoMeta,
    color: Colors.info,
    fontWeight: '700',
    fontSize: 11,
  },
});
