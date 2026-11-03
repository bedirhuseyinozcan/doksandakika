import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ILevelItem } from '../types';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ILevelGridCardProps {
  item: ILevelItem;
  onPress: (levelNumber: number) => void;
}

export const LevelGridCard: React.FC<ILevelGridCardProps> = React.memo(({ item, onPress }) => {
  const { primaryColor } = useActiveTheme();
  const { levelNumber, status } = item;
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  const handlePress = useCallback(() => {
    onPress(levelNumber);
  }, [onPress, levelNumber]);

  return (
    <TouchableOpacity
      style={[
        styles.levelCard,
        isCompleted && [styles.completedCard, { borderColor: primaryColor }],
        isCurrent && [styles.currentCard, { borderColor: primaryColor }],
        isLocked && styles.lockedCard,
      ]}
      activeOpacity={isLocked ? 0.9 : 0.7}
      onPress={handlePress}
    >
      <View style={styles.cardHeader}>
        {isCompleted ? (
          <View style={styles.completedBadge}>
            <Text style={[styles.completedIcon, { color: primaryColor }]}>✓</Text>
          </View>
        ) : isCurrent ? (
          <View style={styles.currentBadge}>
            <Text style={[styles.currentIcon, { color: primaryColor }]}>★</Text>
          </View>
        ) : (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedIcon}>🔒</Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.levelNumber,
          isCompleted && [styles.completedNumber, { color: primaryColor }],
          isCurrent && [styles.currentNumber, { color: primaryColor }],
          isLocked && styles.lockedNumber,
        ]}
      >
        {levelNumber}
      </Text>

      <Text
        style={[
          styles.levelStatusText,
          isCompleted && [styles.completedStatusText, { color: primaryColor }],
          isCurrent && [styles.currentStatusText, { color: primaryColor }],
          isLocked && styles.lockedStatusText,
        ]}
      >
        {isCompleted ? 'GEÇİLDİ' : isCurrent ? 'AKTİF' : 'KİLİTLİ'}
      </Text>
    </TouchableOpacity>
  );
});

LevelGridCard.displayName = 'LevelGridCard';

const styles = StyleSheet.create({
  levelCard: {
    width: '23%',
    aspectRatio: 0.9,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  completedCard: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.success,
  },
  currentCard: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.accentPrimary,
    borderWidth: Borders.thick,
  },
  lockedCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderSubtle,
    opacity: 0.45,
  },
  cardHeader: {
    marginBottom: 2,
  },
  completedBadge: {},
  completedIcon: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '900',
  },
  currentBadge: {},
  currentIcon: {
    fontSize: 12,
    color: Colors.accentPrimary,
  },
  lockedBadge: {},
  lockedIcon: {
    fontSize: 11,
  },
  levelNumber: {
    ...Typography.monoLarge,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  completedNumber: {
    color: Colors.success,
  },
  currentNumber: {
    color: Colors.accentPrimary,
  },
  lockedNumber: {
    color: Colors.textMuted,
  },
  levelStatusText: {
    ...Typography.statBadge,
    fontSize: 8.5,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  completedStatusText: {
    color: Colors.success,
  },
  currentStatusText: {
    color: Colors.accentPrimary,
  },
  lockedStatusText: {
    color: Colors.textMuted,
  },
});
