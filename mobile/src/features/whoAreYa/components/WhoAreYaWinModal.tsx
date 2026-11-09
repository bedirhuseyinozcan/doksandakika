import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';
import { IWhoAreYaGuess } from '../types';
import { shareService } from '../../../services/shareService';
import { useGameStore } from '../../../stores/useGameStore';
import { useRewardedAd } from '../../monetization/hooks/useRewardedAd';
import { hapticsService } from '../../../services/hapticsService';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { soundService } from '../../../services/soundService';
import { searchEngine } from '../../../services/searchEngine';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

interface IWhoAreYaWinModalProps {
  visible: boolean;
  status: 'won' | 'lost';
  playerName: string;
  playerClub: string;
  finalImageUrl?: string;
  rewardCoins?: number;
  attemptsUsed: number;
  maxAttempts: number;
  guesses?: IWhoAreYaGuess[];
  customShareGrid?: string[];
  leagueLabel?: string;
  isDaily?: boolean;
  onNextLevel?: () => void;
  onOpenMap?: () => void;
  onClose: () => void;
  onRevive?: () => void;
}

interface IModalDisplayData {
  status: 'won' | 'lost';
  playerName: string;
  playerClub: string;
  finalImageUrl?: string;
  rewardCoins: number;
  attemptsUsed: number;
  maxAttempts: number;
  guesses: IWhoAreYaGuess[];
  customShareGrid?: string[];
  leagueLabel?: string;
  isDaily: boolean;
}

export const WhoAreYaWinModal: React.FC<IWhoAreYaWinModalProps> = React.memo(
  ({
    visible,
    status,
    playerName,
    playerClub,
    finalImageUrl,
    rewardCoins = 30,
    attemptsUsed,
    maxAttempts,
    guesses = [],
    customShareGrid,
    leagueLabel,
    isDaily = false,
    onNextLevel,
    onOpenMap,
    onClose,
    onRevive,
  }) => {
    const { primaryColor, onPrimaryTextColor } = useActiveTheme();
    const [frozenData, setFrozenData] = useState<IModalDisplayData | null>(null);

    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const [hasShared, setHasShared] = useState(false);
    const [isDoubled, setIsDoubled] = useState(false);

    const coins = useGameStore((s) => s.coins);
    const currentStreak = useGameStore((s) => s.currentStreak);
    const spendCoins = useGameStore((s) => s.spendCoins);
    const addCoins = useGameStore((s) => s.addCoins);
    const addXp = useGameStore((s) => s.addXp);

    const { showRewardedAd, isLoading: isAdLoading } = useRewardedAd();

    useEffect(() => {
      if (visible) {
        if (status === 'won') {
          soundService.playWinFanfare();
        }
        setFrozenData({
          status,
          playerName,
          playerClub,
          finalImageUrl,
          rewardCoins,
          attemptsUsed,
          maxAttempts,
          guesses,
          customShareGrid,
          leagueLabel,
          isDaily,
        });
        setHasShared(false);
        setIsDoubled(false);
        scaleAnim.setValue(0.85);
        opacityAnim.setValue(0);
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 7,
            tension: 55,
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
        ]).start();
      } else {
        
        const timer = setTimeout(() => {
          setFrozenData(null);
        }, 350);
        return () => clearTimeout(timer);
      }
    }, [visible]);

    const activeData: IModalDisplayData = frozenData ?? {
      status,
      playerName,
      playerClub,
      finalImageUrl,
      rewardCoins,
      attemptsUsed,
      maxAttempts,
      guesses,
      customShareGrid,
      leagueLabel,
      isDaily,
    };

    const isWon = activeData.status === 'won';
    const displayName = activeData.playerName;
    const displayClub = activeData.playerClub;

    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      setImageError(false);
    }, [visible, activeData.finalImageUrl, displayName]);

    const displayImage = useMemo(() => {
      if (activeData.finalImageUrl && typeof activeData.finalImageUrl === 'string' && activeData.finalImageUrl.startsWith('http')) {
        return activeData.finalImageUrl;
      }
      return searchEngine.getPlayerPhoto(displayName);
    }, [activeData.finalImageUrl, displayName]);

    const displayAttemptsUsed = activeData.attemptsUsed;
    const displayMaxAttempts = activeData.maxAttempts;
    const displayRewardCoins = activeData.rewardCoins;
    const displayIsDaily = activeData.isDaily;
    const displayGuesses = activeData.guesses;
    const displayCustomShareGrid = activeData.customShareGrid;
    const displayLeagueLabel = activeData.leagueLabel;

    const handleShare = useCallback(async () => {
      hapticsService.selection();
      let success = false;
      if (displayGuesses && displayGuesses.length > 0) {
        success = await shareService.shareWhoAreYa({
          isWon,
          attemptsUsed: displayAttemptsUsed,
          maxAttempts: displayMaxAttempts,
          currentStreak,
          guesses: displayGuesses,
          leagueLabel: displayLeagueLabel,
        });
      } else {
        success = await shareService.shareGeneral({
          gameTitle: displayName,
          isWon,
          attemptsUsed: displayAttemptsUsed,
          maxAttempts: displayMaxAttempts,
          currentStreak,
          customGrid: displayCustomShareGrid,
        });
      }
      if (success) {
        setHasShared(true);
      }
    }, [
      isWon,
      displayAttemptsUsed,
      displayMaxAttempts,
      currentStreak,
      displayGuesses,
      displayCustomShareGrid,
      displayLeagueLabel,
      displayName,
    ]);

    const handleReviveWithCoins = useCallback(() => {
      if (!onRevive) return;
      const success = spendCoins(150);
      if (success) {
        hapticsService.success();
        onRevive();
      } else {
        Alert.alert(
          '🪙 Yetersiz Altın',
          `Serinizi kurtarmak için 150 altına ihtiyacınız var (Mevcut: ${coins} 🪙).\n\nÜcretsiz devam etmek için reklam izleyebilirsiniz!`,
          [
            { text: 'Vazgeç', style: 'cancel' },
            {
              text: '🎬 Reklam İzle & Devam Et',
              onPress: () => {
                showRewardedAd('Serini Kurtar (+2 Hak)', () => {
                  hapticsService.success();
                  onRevive();
                });
              },
            },
          ]
        );
      }
    }, [onRevive, spendCoins, coins, showRewardedAd]);

    const handleReviveWithAd = useCallback(() => {
      if (!onRevive) return;
      showRewardedAd('Serini Kurtar (+2 Hak)', () => {
        hapticsService.success();
        onRevive();
      });
    }, [onRevive, showRewardedAd]);

    const handleDoubleRewardWithAd = useCallback(() => {
      if (isDoubled) return;
      showRewardedAd('2x Ödül Katlama', () => {
        hapticsService.success();
        addCoins(40);
        addXp(80);
        setIsDoubled(true);
      });
    }, [isDoubled, showRewardedAd, addCoins, addXp]);

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.card,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
                borderTopWidth: Borders.thick,
                borderTopColor: primaryColor,
              },
            ]}
          >
            <Text style={styles.titleIcon}>{isWon ? '🏆' : '💔'}</Text>
            <Text style={styles.title}>{isWon ? 'TEBRİKLER!' : 'MAALESEF BİLEMEDİNİZ'}</Text>

            {displayImage && !imageError ? (
              <Image
                source={{
                  uri: displayImage,
                  headers: {
                    'User-Agent':
                      'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                    Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    Referer: 'https://www.transfermarkt.com/',
                  },
                }}
                style={styles.image}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.imageFallback}>
                <Text style={styles.imageFallbackEmoji}>👤</Text>
              </View>
            )}

            <Text style={styles.playerName}>{displayName}</Text>
            <Text style={styles.clubName}>{displayClub}</Text>

            <View style={styles.statsBox}>
              <Text style={styles.statsText}>
                {isWon
                  ? `${displayAttemptsUsed}/${displayMaxAttempts} tahminde bildiniz!`
                  : `Tüm haklarınızı (${displayMaxAttempts}/${displayMaxAttempts}) kullandınız.`}
              </Text>
              {isWon && (
                <Text style={styles.rewardText}>
                  {displayRewardCoins > 0 ? `+${displayRewardCoins} Altın Kazandınız 🪙` : '⭐ Seviye Tekrarı (Ödül Yok)'}
                </Text>
              )}
            </View>

            {!isWon && onRevive && (
              <View style={styles.reviveCard}>
                <Text style={styles.reviveTitle}>🔥 Serini Kurtar! (+2 Ekstra Hak)</Text>
                <Text style={styles.reviveSub}>
                  Oyun bitmesin, serin yanmasın! Reklam izleyerek veya 150 altın harcayarak devam et.
                </Text>
                <View style={styles.reviveBtnRow}>
                  <TouchableOpacity
                    style={[styles.reviveBtn, styles.reviveCoinBtn]}
                    activeOpacity={0.8}
                    onPress={handleReviveWithCoins}
                  >
                    <Text style={styles.reviveCoinText}>🪙 150 Altın</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.reviveBtn, styles.reviveAdBtn]}
                    activeOpacity={0.8}
                    onPress={handleReviveWithAd}
                    disabled={isAdLoading}
                  >
                    <Text style={styles.reviveAdText}>🎬 Reklam İzle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isWon && displayIsDaily && (
              <TouchableOpacity
                style={[styles.doubleRewardBtn, isDoubled && [styles.doubleRewardDone, { borderColor: primaryColor }]]}
                activeOpacity={0.8}
                onPress={handleDoubleRewardWithAd}
                disabled={isDoubled || isAdLoading}
              >
                <Text style={[styles.doubleRewardText, { color: primaryColor }]}>
                  {isDoubled
                    ? '🎉 2x Ödül Hesabına Eklendi! (+40🪙, +80XP)'
                    : '🎬 Reklam İzle & Ödülü 2x Katla (+40🪙, +80XP)'}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8} onPress={handleShare}>
                <Text style={styles.shareBtnText}>
                  {hasShared ? '✅ Paylaşıldı / Kopyalandı!' : '📲 Sonucu Paylaş (Spoiler Yok)'}
                </Text>
              </TouchableOpacity>

              {onNextLevel && isWon ? (
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: primaryColor }]}
                  onPress={onNextLevel}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.primaryBtnText, { color: onPrimaryTextColor }]}>Sonraki Seviye ⏩</Text>
                </TouchableOpacity>
              ) : null}

              {onOpenMap ? (
                <TouchableOpacity style={styles.mapBtn} onPress={onOpenMap} activeOpacity={0.8}>
                  <Text style={styles.mapBtnText}>🗺️ Harita</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity style={styles.secondaryBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.secondaryBtnText}>KAPAT</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

WhoAreYaWinModal.displayName = 'WhoAreYaWinModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 9, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  titleIcon: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thick,
    borderColor: Colors.accentPrimary,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
  },
  imageFallback: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thick,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallbackEmoji: {
    fontSize: 40,
  },
  playerName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  clubName: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  statsBox: {
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  statsText: {
    ...Typography.monoMeta,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
    fontSize: 12,
  },
  rewardText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  reviveCard: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.danger,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  reviveTitle: {
    ...Typography.statBadge,
    color: Colors.danger,
    fontSize: 11,
    marginBottom: 2,
  },
  reviveSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  reviveBtnRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    width: '100%',
  },
  reviveBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Borders.thin,
  },
  reviveCoinBtn: {
    backgroundColor: Colors.surface,
    borderColor: Colors.warning,
  },
  reviveCoinText: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 11,
  },
  reviveAdBtn: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentPrimary,
  },
  reviveAdText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 11,
  },
  doubleRewardBtn: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.borderLight,
    paddingVertical: 9,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  doubleRewardDone: {
    borderColor: Colors.success,
  },
  doubleRewardText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  buttonRow: {
    width: '100%',
    gap: Spacing.xs + 2,
  },
  shareBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    width: '100%',
  },
  shareBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  primaryBtn: {
    backgroundColor: Colors.accentPrimary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    width: '100%',
  },
  primaryBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  mapBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    width: '100%',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  mapBtnText: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 11,
  },
  secondaryBtn: {
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    width: '100%',
    borderWidth: Borders.thin,
    borderColor: Colors.danger,
    marginTop: 2,
  },
  secondaryBtnText: {
    ...Typography.statBadge,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
