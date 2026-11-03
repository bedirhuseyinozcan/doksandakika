import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDailyCountdown } from '../hooks/useDailyCountdown';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IDailyHeaderCardProps {
  title: string;
  leagueLabel: string;
  isCompleted: boolean;
}

export const DailyHeaderCard = React.memo<IDailyHeaderCardProps>(
  ({ title, leagueLabel, isCompleted }) => {
    const { primaryColor } = useActiveTheme();
    const { formattedCountdown } = useDailyCountdown();

    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={[styles.badge, { borderColor: primaryColor }]}>
            <Text style={[styles.badgeText, { color: primaryColor }]}>{leagueLabel.toUpperCase()}</Text>
          </View>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>⏳ {formattedCountdown}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, isCompleted && [styles.completedText, { color: primaryColor }]]}>
            {isCompleted ? '✓ BUGÜNÜN GÖREVİ TAMAMLANDI' : '🔥 GÜNLÜK SERİNİ SÜRDÜRMEK İÇİN ÇÖZ'}
          </Text>
        </View>
      </View>
    );
  }
);

DailyHeaderCard.displayName = 'DailyHeaderCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  badge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.borderLight,
  },
  badgeText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 9.5,
    letterSpacing: 0.8,
  },
  timerBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  timerText: {
    ...Typography.monoMeta,
    color: Colors.warning,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  statusRow: {
    marginTop: Spacing.xs,
  },
  statusText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 9.5,
  },
  completedText: {
    color: Colors.accentPrimary,
  },
});
