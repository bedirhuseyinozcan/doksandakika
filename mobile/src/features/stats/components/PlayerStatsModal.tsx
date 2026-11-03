import React, { useMemo, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useGameStore } from '../../../stores/useGameStore';
import { getRankByXp } from '../utils/rankUtils';
import { getCosmeticById } from '../../shop/catalog';
import { ScoutShopModal } from '../../shop/components/ScoutShopModal';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IPlayerStatsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PlayerStatsModal: React.FC<IPlayerStatsModalProps> = React.memo(
  ({ visible, onClose }) => {
    const gamesPlayed = useGameStore((s) => s.gamesPlayed);
    const gamesWon = useGameStore((s) => s.gamesWon);
    const currentStreak = useGameStore((s) => s.currentStreak);
    const maxStreak = useGameStore((s) => s.maxStreak);
    const guessDistribution = useGameStore((s) => s.guessDistribution);
    const xp = useGameStore((s) => s.xp);

    const rankInfo = useMemo(() => getRankByXp(xp), [xp]);
    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    const distValues = Object.values(guessDistribution);
    const maxDist = Math.max(1, ...distValues);

    const [isShopModalVisible, setIsShopModalVisible] = useState(false);
    const equippedCosmeticId = useGameStore((s) => s.equippedCosmeticId);
    const equippedCosmetic = useMemo(() => getCosmeticById(equippedCosmeticId), [equippedCosmeticId]);

    const attemptsList = useMemo(() => {
      const attemptsWithWins = Object.entries(guessDistribution)
        .filter(([_, count]) => (count || 0) > 0)
        .map(([att]) => Number(att));
      const highestAttemptWithWin = attemptsWithWins.length > 0 ? Math.max(...attemptsWithWins) : 8;
      const maxRange = Math.min(12, Math.max(8, highestAttemptWithWin));
      return Array.from({ length: maxRange }, (_, i) => i + 1);
    }, [guessDistribution]);

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.card}
            onPress={(e) => e.stopPropagation?.()}
          >
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>📊 Oyuncu İstatistikleri</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
              <View
                style={[
                  styles.rankModalCard,
                  {
                    borderColor: equippedCosmetic.themeConfig.primaryColor,
                    shadowColor: equippedCosmetic.themeConfig.primaryColor,
                  },
                ]}
              >
                <View style={styles.rankModalHeader}>
                  <View
                    style={[
                      styles.avatarBox,
                      {
                        borderColor: equippedCosmetic.themeConfig.primaryColor,
                        shadowColor: equippedCosmetic.themeConfig.primaryColor,
                      },
                    ]}
                  >
                    <Text style={styles.avatarEmojiText}>{equippedCosmetic.avatarEmoji}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.rankBadgeRow}>
                      <Text style={styles.rankModalTitle}>{rankInfo.title}</Text>
                      <View
                        style={[
                          styles.titlePill,
                          { backgroundColor: equippedCosmetic.themeGlowColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.titlePillText,
                            { color: equippedCosmetic.themeConfig.primaryColor },
                          ]}
                        >
                          {equippedCosmetic.titleBadge}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.rankModalSubtitle}>
                      {xp} Toplam XP •{' '}
                      {rankInfo.tier === 4
                        ? 'En Yüksek Seviye'
                        : `Sonraki Rütbeye ${rankInfo.xpNeededForNext} XP`}
                    </Text>
                  </View>
                  <Text style={[styles.rankModalPercent, { color: equippedCosmetic.themeConfig.primaryColor }]}>
                    %{rankInfo.currentProgressInTier}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statsAtmospherePill,
                    {
                      borderColor: equippedCosmetic.themeConfig.cardBorder,
                      backgroundColor: equippedCosmetic.themeConfig.accentGlow,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statsAtmosphereText,
                      { color: equippedCosmetic.themeConfig.primaryColor },
                    ]}
                  >
                    {equippedCosmetic.themeConfig.teamBadgeEmojis}{' '}
                    {equippedCosmetic.themeConfig.stadiumName}
                  </Text>
                  <Text style={styles.statsChantText}>
                    {equippedCosmetic.themeConfig.anthemChant}
                  </Text>
                </View>

                <View style={styles.rankProgressBarBg}>
                  <View
                    style={[
                      styles.rankProgressBarFill,
                      {
                        width: `${rankInfo.currentProgressInTier}%`,
                        backgroundColor: equippedCosmetic.themeConfig.primaryColor,
                      },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.shopShortcutBtn,
                    { borderColor: equippedCosmetic.themeConfig.primaryColor },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setIsShopModalVisible(true)}
                >
                  <Text
                    style={[
                      styles.shopShortcutBtnText,
                      { color: equippedCosmetic.themeConfig.primaryColor },
                    ]}
                  >
                    🛍️ Scout & Taraftar Dükkanı • Tema & Çerçeve Değiştir
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 4 KPI Cards */}
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiNumber}>{gamesPlayed}</Text>
                  <Text style={styles.kpiLabel}>Oynanan</Text>
                </View>

                <View style={styles.kpiCard}>
                  <Text style={styles.kpiNumber}>%{winRate}</Text>
                  <Text style={styles.kpiLabel}>Kazanma</Text>
                </View>

                <View style={styles.kpiCard}>
                  <Text style={[styles.kpiNumber, styles.fireText]}>🔥 {currentStreak}</Text>
                  <Text style={styles.kpiLabel}>Güncel Seri</Text>
                </View>

                <View style={styles.kpiCard}>
                  <Text style={[styles.kpiNumber, styles.starText]}>⭐ {maxStreak}</Text>
                  <Text style={styles.kpiLabel}>En İyi Seri</Text>
                </View>
              </View>

              {/* Streak Info Banner */}
              <View style={styles.streakBanner}>
                <Text style={styles.streakBannerEmoji}>🎁</Text>
                <View style={styles.streakBannerCol}>
                  <Text style={styles.streakBannerTitle}>Seri Ödülleri</Text>
                  <Text style={styles.streakBannerText}>
                    3 günlük seride +50🪙, 7 günlük seride +150🪙 ekstra ödül kazanırsınız!
                  </Text>
                </View>
              </View>

              {/* Guess Distribution */}
              <View style={styles.distSection}>
                <Text style={styles.distTitle}>Tahmin Dağılımı</Text>
                {attemptsList.map((attempt) => {
                  const count = guessDistribution[attempt] || 0;
                  const percentWidth = Math.max(10, Math.round((count / maxDist) * 100));

                  return (
                    <View key={attempt} style={styles.distRow}>
                      <Text style={styles.distNumber}>{attempt}</Text>
                      <View style={styles.distBarBg}>
                        <View
                          style={[
                            styles.distBarFill,
                            { width: `${percentWidth}%` },
                            count > 0 && styles.distBarFillActive,
                          ]}
                        >
                          <Text style={styles.distCountText}>{count}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.actionBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.actionBtnText}>Kapat</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>

        <ScoutShopModal
          visible={isShopModalVisible}
          onClose={() => setIsShopModalVisible(false)}
        />
      </Modal>
    );
  }
);

PlayerStatsModal.displayName = 'PlayerStatsModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 9, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.lg,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: Borders.thin,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.statBadge,
    fontSize: 13,
    color: Colors.textPrimary,
    letterSpacing: 0.6,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  closeText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  scroll: {
    paddingBottom: Spacing.md,
  },
  rankModalCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  rankModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thick,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  avatarEmojiText: {
    fontSize: 22,
  },
  rankBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rankModalTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  titlePill: {
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  titlePillText: {
    ...Typography.statBadge,
    fontSize: 9,
    letterSpacing: 0.4,
  },
  statsAtmospherePill: {
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statsAtmosphereText: {
    ...Typography.statBadge,
    fontSize: 10,
    marginBottom: 2,
  },
  statsChantText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  shopShortcutBtn: {
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.warning,
    borderRadius: BorderRadius.sharp,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  shopShortcutBtnText: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 10,
  },
  rankModalSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  rankModalPercent: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  rankProgressBarBg: {
    height: 3,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: BorderRadius.none,
    overflow: 'hidden',
  },
  rankProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentPrimary,
    borderRadius: BorderRadius.none,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  kpiNumber: {
    ...Typography.monoLarge,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  fireText: {
    color: Colors.warning,
  },
  starText: {
    color: Colors.accentPrimary,
  },
  kpiLabel: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    marginTop: 4,
    fontSize: 10,
  },
  streakBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    borderWidth: Borders.thin,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  streakBannerEmoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  streakBannerCol: {
    flex: 1,
  },
  streakBannerTitle: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 11,
  },
  streakBannerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 11,
  },
  distSection: {
    marginBottom: Spacing.sm,
  },
  distTitle: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontSize: 11,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  distNumber: {
    width: 20,
    ...Typography.monoMeta,
    color: Colors.textMuted,
    fontWeight: '700',
    fontSize: 11,
  },
  distBarBg: {
    flex: 1,
    height: 20,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.none,
    overflow: 'hidden',
  },
  distBarFill: {
    height: '100%',
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
    borderRadius: BorderRadius.none,
  },
  distBarFillActive: {
    backgroundColor: Colors.accentPrimary,
  },
  distCountText: {
    ...Typography.monoMeta,
    fontSize: 10,
    fontWeight: '800',
    color: '#090909',
  },
  actionBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
  },
  actionBtnText: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
