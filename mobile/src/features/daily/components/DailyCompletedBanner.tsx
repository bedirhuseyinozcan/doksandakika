import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useDailyCountdown } from '../hooks/useDailyCountdown';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IDailyCompletedBannerProps {
  status: 'won' | 'lost';
  attemptsUsed: number;
  maxAttempts: number;
  onOpenResultModal: () => void;
}

export const DailyCompletedBanner: React.FC<IDailyCompletedBannerProps> = React.memo(
  ({ status, attemptsUsed, maxAttempts, onOpenResultModal }) => {
    const { formattedCountdown } = useDailyCountdown();
    const isWon = status === 'won';

    return (
      <View style={styles.container}>
        <View style={styles.contentRow}>
          <Text style={styles.emoji}>{isWon ? '🏆' : '🔒'}</Text>
          <View style={styles.textCol}>
            <Text style={styles.title}>
              {isWon ? 'GÜNLÜK MEYDAN OKUMA TAMAMLANDI' : 'HAKLARINIZ DOLDU'}
            </Text>
            <Text style={styles.subtitle}>
              {isWon
                ? `${attemptsUsed}/${maxAttempts} denemede başarıyla tamamlandı.`
                : 'Doğru futbolcu tespit edilemedi.'}
            </Text>
            <Text style={styles.timerText}>⏳ YENİ SORUYA KALAN: {formattedCountdown}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.resultBtn}
          activeOpacity={0.8}
          onPress={onOpenResultModal}
        >
          <Text style={styles.resultBtnText}>SONUÇ KARTINI GÖRÜNTÜLE ➔</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

DailyCompletedBanner.displayName = 'DailyCompletedBanner';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: Borders.thin,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    paddingBottom: Platform.OS === 'android' ? 44 : Spacing.md,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  textCol: {
    flex: 1,
  },
  title: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 11,
  },
  timerText: {
    ...Typography.monoMeta,
    color: Colors.warning,
    fontWeight: '700',
    marginTop: 3,
    fontSize: 10,
  },
  resultBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  resultBtnText: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 11,
    letterSpacing: 0.6,
  },
});
