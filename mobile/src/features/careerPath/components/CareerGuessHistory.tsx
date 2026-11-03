import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ICareerPathGuess } from '../types';
import { ClubLogo } from '../../../components/common/ClubLogo';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ICareerGuessRowProps {
  guess: ICareerPathGuess;
}

const CareerGuessRow: React.FC<ICareerGuessRowProps> = React.memo(({ guess }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 0],
  });

  return (
    <Animated.View
      style={[
        styles.guessRow,
        guess.isCorrect ? styles.correctRow : styles.wrongRow,
        {
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.guessRowContent}>
        <Text style={styles.statusEmoji}>{guess.isCorrect ? '✓' : '✕'}</Text>
        <ClubLogo clubName={guess.club} size={16} fallbackEmoji="🛡️" />
        <Text style={styles.guessName} numberOfLines={1}>
          {guess.playerName} ({guess.club})
        </Text>
      </View>
    </Animated.View>
  );
});

CareerGuessRow.displayName = 'CareerGuessRow';

interface ICareerGuessHistoryProps {
  guesses: ICareerPathGuess[];
}

export const CareerGuessHistory: React.FC<ICareerGuessHistoryProps> = React.memo(({ guesses }) => {
  if (guesses.length === 0) return null;

  return (
    <View style={styles.guessHistory}>
      <Text style={styles.historyTitle}>YAPILAN TAHMİNLER</Text>
      {guesses.map((g, idx) => (
        <CareerGuessRow key={`${g.playerId}_${idx}`} guess={g} />
      ))}
    </View>
  );
});

CareerGuessHistory.displayName = 'CareerGuessHistory';

const styles = StyleSheet.create({
  guessHistory: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  historyTitle: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  guessRow: {
    paddingVertical: Spacing.xs + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sharp,
    marginBottom: Spacing.xs,
    borderWidth: Borders.thin,
  },
  correctRow: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.success,
  },
  wrongRow: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  guessRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  statusEmoji: {
    ...Typography.statBadge,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  guessName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 13,
    flex: 1,
  },
});
