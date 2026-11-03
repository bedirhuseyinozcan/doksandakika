import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRewardedAd } from '../hooks/useRewardedAd';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IHintWithAdButtonProps {
  hintTitle: string;
  onHintUnlocked: () => void;
  isUnlocked?: boolean;
  unlockedText?: string;
  coinCost?: number; 
}

export const HintWithAdButton = React.memo<IHintWithAdButtonProps>(
  ({ hintTitle, onHintUnlocked, isUnlocked = false, unlockedText }) => {
    const { primaryColor } = useActiveTheme();
    const { showRewardedAd, isLoading } = useRewardedAd();

    const handleUnlockWithAd = useCallback(() => {
      if (isUnlocked) return;
      showRewardedAd(hintTitle, onHintUnlocked);
    }, [isUnlocked, showRewardedAd, hintTitle, onHintUnlocked]);

    if (isUnlocked) {
      return (
        <View style={[styles.container, styles.unlockedContainer, { borderColor: primaryColor }]}>
          <Text style={[styles.unlockedText, { color: primaryColor }]}>💡 {unlockedText || hintTitle}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.adBtn, { borderColor: primaryColor }]}
          activeOpacity={0.8}
          onPress={handleUnlockWithAd}
          disabled={isLoading}
        >
          <Text style={[styles.adBtnText, { color: primaryColor }]}>
            🎬 REKLAM İZLE & İPUCUNU AÇ {isLoading ? '...' : ''}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

HintWithAdButton.displayName = 'HintWithAdButton';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.xs,
  },
  adBtn: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
    borderWidth: Borders.thin,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adBtnText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  unlockedContainer: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.accentPrimary,
    borderWidth: Borders.thin,
    borderRadius: BorderRadius.sharp,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  unlockedText: {
    ...Typography.bodyBold,
    color: Colors.accentPrimary,
    fontSize: 12,
    textAlign: 'center',
  },
});
