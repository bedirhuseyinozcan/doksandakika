import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ILightPlayer, searchEngine } from '../../../services/searchEngine';
import { useFeedbackAnimation } from '../../../hooks/useFeedbackAnimation';
import { PlayerAvatar } from '../../../components/common/PlayerAvatar';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IBingoCurrentPlayerCardProps {
  player: ILightPlayer | null;
  playersLeftInDeck: number;
  totalDeckSize: number;
  matchedCount: number;
  totalTilesCount: number;
  feedbackBanner: {
    type: 'success' | 'penalty' | 'skip';
    message: string;
  } | null;
  onSkip: () => void;
  disabled?: boolean;
}

export const BingoCurrentPlayerCard: React.FC<IBingoCurrentPlayerCardProps> = React.memo(
  ({
    player,
    playersLeftInDeck,
    totalDeckSize,
    matchedCount,
    totalTilesCount,
    feedbackBanner,
    onSkip,
    disabled = false,
  }) => {
    const { animatedStyle, triggerShake, triggerPulse } = useFeedbackAnimation();

    useEffect(() => {
      if (!feedbackBanner) return;
      if (feedbackBanner.type === 'penalty') {
        triggerShake();
      } else if (feedbackBanner.type === 'success') {
        triggerPulse();
      }
    }, [feedbackBanner, triggerShake, triggerPulse]);

    return (
      <View style={styles.cardWrapper}>
        <View style={styles.topStatsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillText}>
              DESTE: <Text style={styles.statPillHighlight}>{playersLeftInDeck}/{totalDeckSize}</Text>
            </Text>
          </View>

          <View style={[styles.statPill, styles.matchedPill]}>
            <Text style={styles.statPillText}>
              BİNGO: <Text style={styles.matchedHighlight}>{matchedCount}/{totalTilesCount}</Text>
            </Text>
          </View>
        </View>

        {feedbackBanner && (
          <View
            style={[
              styles.feedbackBox,
              feedbackBanner.type === 'success' && styles.feedbackSuccess,
              feedbackBanner.type === 'penalty' && styles.feedbackPenalty,
              feedbackBanner.type === 'skip' && styles.feedbackSkip,
            ]}
          >
            <Text
              style={[
                styles.feedbackText,
                feedbackBanner.type === 'success' && styles.feedbackSuccessText,
                feedbackBanner.type === 'penalty' && styles.feedbackPenaltyText,
                feedbackBanner.type === 'skip' && styles.feedbackSkipText,
              ]}
              numberOfLines={2}
            >
              {feedbackBanner.message}
            </Text>
          </View>
        )}

        {player ? (
          <Animated.View style={[styles.playerCard, player.isLegend && styles.legendCard, animatedStyle]}>
            <View style={styles.playerMainRow}>
              <PlayerAvatar
                key={player.id}
                imageUrl={searchEngine.getPlayerPhoto(player)}
                name={player.name}
                isLegend={player.isLegend}
                size={46}
                style={{ marginRight: Spacing.sm }}
              />

              <View style={styles.playerInfoCol}>
                <Text style={styles.playerName} numberOfLines={1}>
                  {player.name}
                </Text>
                {player.isLegend ? (
                  <Text style={styles.legendBadge}>👑 EFSANE FUTBOLCU</Text>
                ) : (
                  <Text style={styles.playerInstruction}>
                    Doğru bingo kutusuna dokun veya pas geç
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.skipBtn}
                onPress={onSkip}
                activeOpacity={0.75}
                disabled={disabled}
              >
                <Text style={styles.skipBtnText}>PAS GEÇ</Text>
                <Text style={styles.skipSub}>-1 Hak</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.deckEmptyBox}>
            <Text style={styles.deckEmptyText}>Destedeki tüm oyuncular tamamlandı!</Text>
          </View>
        )}
      </View>
    );
  }
);

BingoCurrentPlayerCard.displayName = 'BingoCurrentPlayerCard';

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  topStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  statPill: {
    backgroundColor: Colors.surface,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  matchedPill: {
    borderColor: Colors.accentPrimary,
  },
  statPillText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  statPillHighlight: {
    ...Typography.monoMeta,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  matchedHighlight: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    fontWeight: '800',
  },
  feedbackBox: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sharp,
    marginBottom: Spacing.xs,
    borderWidth: Borders.thin,
  },
  feedbackSuccess: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.success,
  },
  feedbackPenalty: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.danger,
  },
  feedbackSkip: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
  },
  feedbackText: {
    ...Typography.statBadge,
    textAlign: 'center',
    fontSize: 10.5,
  },
  feedbackSuccessText: {
    color: Colors.success,
  },
  feedbackPenaltyText: {
    color: Colors.danger,
  },
  feedbackSkipText: {
    color: Colors.accentPrimary,
  },
  playerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.sm,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  playerMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendCard: {
    borderColor: Colors.warning,
    borderWidth: Borders.thick,
  },
  legendBadge: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 10,
    marginTop: 1,
  },
  playerInfoCol: {
    flex: 1,
  },
  playerName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  playerInstruction: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10.5,
    marginTop: 2,
  },
  skipBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    minHeight: 38,
    minWidth: 64,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  skipBtnText: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 10,
  },
  skipSub: {
    ...Typography.monoMeta,
    color: Colors.danger,
    fontSize: 9,
    marginTop: 1,
  },
  deckEmptyBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  deckEmptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
