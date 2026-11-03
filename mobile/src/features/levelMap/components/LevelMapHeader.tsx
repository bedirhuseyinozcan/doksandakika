import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';
import { TOTAL_LEVELS } from '../hooks/useLevelMap';

interface ILevelMapHeaderProps {
  gameEmoji: string;
  gameTitle: string;
  leagueLabel: string;
  completedCount: number;
  progressPercent: number;
}

export const LevelMapHeader: React.FC<ILevelMapHeaderProps> = React.memo(
  ({ gameEmoji, gameTitle, leagueLabel, completedCount, progressPercent }) => {
    const { primaryColor } = useActiveTheme();

    return (
      <View style={styles.headerCard}>
        <View style={styles.titleRow}>
          <View style={[styles.emojiBox, { borderColor: primaryColor }]}>
            <Text style={styles.titleEmoji}>{gameEmoji}</Text>
          </View>
          <View style={styles.titleCol}>
            <Text style={styles.gameTitle}>{gameTitle}</Text>
            <Text style={styles.leagueText}>{leagueLabel.toUpperCase()} • SEVİYE HARİTASI</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>İLERLEME DURUMU</Text>
            <Text style={[styles.progressVal, { color: primaryColor }]}>
              {completedCount} / {TOTAL_LEVELS} SEVİYE (%{progressPercent})
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%`, backgroundColor: primaryColor },
              ]}
            />
          </View>
        </View>
      </View>
    );
  }
);

LevelMapHeader.displayName = 'LevelMapHeader';

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sharp,
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  titleEmoji: {
    fontSize: 24,
  },
  titleCol: {
    flex: 1,
  },
  gameTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  leagueText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  progressContainer: {
    marginTop: Spacing.xs,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 10,
  },
  progressVal: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    fontWeight: '700',
    fontSize: 11,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: BorderRadius.none,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentPrimary,
    borderRadius: BorderRadius.none,
  },
});
