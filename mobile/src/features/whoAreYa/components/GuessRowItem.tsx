import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IWhoAreYaGuess } from '../types';
import { AnimatedAttributeTile } from './AnimatedAttributeTile';
import { ClubLogo } from '../../../components/common/ClubLogo';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IGuessRowItemProps {
  guess: IWhoAreYaGuess;
  index: number;
}

export const GuessRowItem = React.memo<IGuessRowItemProps>(({ guess, index }) => {
  const { player, comparison } = guess;

  const getAgeIndicator = (status: 'correct' | 'higher' | 'lower') => {
    if (status === 'correct') return '';
    if (status === 'higher') return ' ⬆';
    return ' ⬇';
  };

  const ageText = player.age ? `${player.age}${getAgeIndicator(comparison.age)}` : '-';

  return (
    <View style={styles.container}>
      <View style={styles.nameHeader}>
        <Text style={styles.indexText}>#{index + 1}</Text>
        <ClubLogo
          logoUrl={player.logoUrl || player.logo}
          clubName={player.club}
          size={18}
          fallbackEmoji="🛡️"
        />
        <Text style={styles.nameText} numberOfLines={1}>
          {player.name}
        </Text>
      </View>

      <View style={styles.tilesGrid}>
        <AnimatedAttributeTile
          label="KULÜP"
          value={player.club}
          status={comparison.club}
          delay={0}
        />
        <AnimatedAttributeTile
          label="LİG"
          value={player.league}
          status={comparison.league}
          delay={60}
        />
        <AnimatedAttributeTile
          label="UYRUK"
          value={player.nationality}
          status={comparison.nationality}
          delay={120}
        />
        <AnimatedAttributeTile
          label="MEVKİ"
          value={player.position}
          status={comparison.position}
          delay={180}
        />
        <AnimatedAttributeTile
          label="YAŞ"
          value={ageText}
          status={comparison.age}
          delay={240}
        />
      </View>
    </View>
  );
});

GuessRowItem.displayName = 'GuessRowItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.sm,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.md,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  indexText: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    fontWeight: '800',
    marginRight: Spacing.xs,
    fontSize: 11,
  },
  nameText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  tilesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
