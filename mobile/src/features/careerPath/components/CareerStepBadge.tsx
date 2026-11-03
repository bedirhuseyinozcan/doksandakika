import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ICareerStepItem } from '../types';
import { ClubLogo } from '../../../components/common/ClubLogo';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ICareerStepBadgeProps {
  step: ICareerStepItem;
  isLast: boolean;
  stepIndex: number;
}

export const CareerStepBadge = React.memo<ICareerStepBadgeProps>(
  ({ step, isLast, stepIndex }) => {
    const { primaryColor } = useActiveTheme();
    let yearRange = '';
    if (step.startYear && step.endYear) {
      yearRange = `${step.startYear} - ${step.endYear}`;
    } else if (isLast) {
      yearRange = step.startYear ? `${step.startYear} - Günümüz` : 'Günümüz';
    } else if (step.startYear) {
      yearRange = `${step.startYear}`;
    }

    return (
      <View style={styles.stepContainer}>
        {/* Step Marker */}
        <View style={styles.markerCol}>
          <View style={[styles.dot, isLast && [styles.currentDot, { borderColor: primaryColor }]]}>
            <Text style={[styles.stepNum, isLast && [styles.currentStepNum, { color: primaryColor }]]}>
              {stepIndex + 1}
            </Text>
          </View>
          {!isLast && <View style={styles.line} />}
        </View>

        {/* Club Details Box */}
        <View style={styles.contentBox}>
          <View style={styles.clubTitleRow}>
            <ClubLogo
              logoUrl={step.clubLogoUrl}
              clubName={step.clubName}
              size={20}
              fallbackEmoji="🛡️"
            />
            <Text style={styles.clubName} numberOfLines={1}>
              {step.clubName}
            </Text>
          </View>
          {yearRange ? (
            <Text style={[styles.yearText, { color: primaryColor }]}>{yearRange}</Text>
          ) : null}
          {step.apps != null && step.apps > 0 ? (
            <Text style={styles.statsText}>
              {step.apps} maç • {step.goals ?? 0} gol
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
);

CareerStepBadge.displayName = 'CareerStepBadge';

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs + 2,
  },
  markerCol: {
    alignItems: 'center',
    width: 28,
    marginRight: Spacing.sm,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sharp,
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: {
    borderColor: Colors.accentPrimary,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: Borders.thick,
  },
  stepNum: {
    ...Typography.monoMeta,
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  currentStepNum: {
    color: Colors.accentPrimary,
  },
  line: {
    width: 1,
    flex: 1,
    minHeight: 28,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  contentBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  clubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: 2,
  },
  clubName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  yearText: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    marginTop: 2,
    fontSize: 10.5,
  },
  statsText: {
    ...Typography.monoMeta,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 10,
  },
});
