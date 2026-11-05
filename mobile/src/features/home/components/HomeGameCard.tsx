import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IHomeGameCardProps {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  dailyBtnText?: string;
  careerBtnText?: string;
  themePrimaryColor?: string;
  themeBorderColor?: string;
  onPressDaily: () => void;
  onPressCareer: () => void;
}

export const HomeGameCard: React.FC<IHomeGameCardProps> = React.memo(
  ({
    emoji,
    icon,
    title,
    subtitle,
    dailyBtnText = 'GÜNÜN SORUSU',
    careerBtnText = 'SEVİYELER & KARİYER',
    themePrimaryColor,
    themeBorderColor,
    onPressDaily,
    onPressCareer,
  }) => {
    const isLightPrimary =
      themePrimaryColor === '#FBBF24' ||
      themePrimaryColor === '#FFFFFF' ||
      themePrimaryColor === '#F4F4F5' ||
      themePrimaryColor === '#EAB308' ||
      themePrimaryColor === '#00D084' ||
      themePrimaryColor === '#C7FB07';

    const careerTextColor = isLightPrimary ? '#090909' : '#FFFFFF';
    const activeAccent = themePrimaryColor || Colors.accentPrimary;

    return (
      <View
        style={[
          styles.gameCard,
          themeBorderColor
            ? {
                borderColor: themeBorderColor,
                borderLeftWidth: Borders.thick + 1,
                borderLeftColor: activeAccent,
              }
            : null,
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconBox,
              themeBorderColor ? { borderColor: themeBorderColor } : null,
            ]}
          >
            {icon ? (
              icon
            ) : (
              <Text style={styles.cardEmoji}>{emoji}</Text>
            )}
          </View>
          <View style={styles.cardTitleCol}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[
              styles.gameActionBtn,
              styles.dailyBtn,
              themeBorderColor ? { borderColor: themeBorderColor } : null,
            ]}
            activeOpacity={0.8}
            onPress={onPressDaily}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <Text
              style={[
                styles.dailyBtnText,
                { color: activeAccent },
              ]}
            >
              {dailyBtnText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.gameActionBtn,
              styles.careerBtn,
              { backgroundColor: activeAccent },
            ]}
            activeOpacity={0.8}
            onPress={onPressCareer}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <Text style={[styles.careerBtnText, { color: careerTextColor }]}>
              {careerBtnText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

HomeGameCard.displayName = 'HomeGameCard';

const styles = StyleSheet.create({
  gameCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBox: {
    width: 46,
    height: 46,
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTitleCol: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  gameActionBtn: {
    flex: 1,
    minHeight: 44,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  dailyBtnText: {
    ...Typography.statBadge,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  careerBtn: {
    backgroundColor: Colors.accentPrimary,
    borderWidth: Borders.thin,
    borderColor: 'transparent',
  },
  careerBtnText: {
    ...Typography.statBadge,
    fontSize: 11,
    letterSpacing: 0.6,
    fontWeight: '800',
  },
});
