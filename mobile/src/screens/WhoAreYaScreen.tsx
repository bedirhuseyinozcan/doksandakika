import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useWhoAreYaGame } from '../features/whoAreYa/hooks/useWhoAreYaGame';
import { BlurredImageHero } from '../features/whoAreYa/components/BlurredImageHero';
import { GuessHistoryList } from '../features/whoAreYa/components/GuessHistoryList';
import { OfflinePlayerSearchModal } from '../features/search/components/OfflinePlayerSearchModal';
import { WhoAreYaWinModal } from '../features/whoAreYa/components/WhoAreYaWinModal';
import { useInterstitialAd } from '../features/monetization/hooks/useInterstitialAd';
import { HintWithAdButton } from '../features/monetization/components/HintWithAdButton';
import { DailyHeaderCard } from '../features/daily/components/DailyHeaderCard';
import { DailyCompletedBanner } from '../features/daily/components/DailyCompletedBanner';
import { GameNavbar } from '../components/common/GameNavbar';
import { useChallengeDataLoader } from '../hooks/useChallengeDataLoader';
import { searchEngine } from '../services/searchEngine';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, Borders } from '../theme/spacing';
import { Typography } from '../theme/typography';

interface IWhoAreYaScreenProps {
  isDaily?: boolean;
  initialLevel?: number;
  isReplay?: boolean;
  onBack: () => void;
  onOpenMap?: () => void;
}

export const WhoAreYaScreen: React.FC<IWhoAreYaScreenProps> = React.memo(
  ({ isDaily = false, initialLevel, isReplay = false, onBack, onOpenMap }) => {
    const {
      isLoading,
      challengeData,
      currentLevel,
      isCurrentReplay,
      dailyKey,
      alreadyCompleted,
      selectedLeagueMode,
      goToNextLevel,
    } = useChallengeDataLoader({
      gameMode: 'whoAreYa',
      isDaily,
      initialLevel,
      isReplay,
    });

    const { showInterstitialIfDue } = useInterstitialAd();
    const [hintUnlocked, setHintUnlocked] = useState(false);
    const [isResultModalVisible, setIsResultModalVisible] = useState(false);

    const targetPlayerId = challengeData?.targetPlayerId ?? 'tmid_382528';
    const blurImages = challengeData?.blurImages ?? [];

    const targetPlayerInfo = useMemo(
      () => searchEngine.getPlayerById(targetPlayerId),
      [targetPlayerId]
    );

    const dynamicHintText = useMemo(() => {
      if (targetPlayerInfo) {
        return `İpucu Açıldı: Mevki ${targetPlayerInfo.position} • Yaş ${targetPlayerInfo.age ?? '?'} • ${targetPlayerInfo.nationality}`;
      }
      if (challengeData?.hints && challengeData.hints.length > 0) {
        return `İpucu Açıldı: ${challengeData.hints[0]}`;
      }
      return `İpucu Açıldı: Kulüp — ${challengeData?.playerClub || 'Bilinmiyor'}`;
    }, [targetPlayerInfo, challengeData]);

    const {
      guesses,
      gameStatus,
      currentBlurImageUrl,
      isSearchModalVisible,
      attemptsLeft,
      maxAttempts,
      canRevive,
      openSearch,
      closeSearch,
      submitGuess,
      resetGame,
      reviveGame,
      finalizeLoss,
    } = useWhoAreYaGame({
      targetPlayerId,
      targetPlayerName: challengeData?.playerName,
      blurImages,
      isDaily,
      isReplay: isCurrentReplay,
      dailyKey,
      leagueModeKey: selectedLeagueMode,
    });

    useEffect(() => {
      if (gameStatus !== 'playing') {
        setIsResultModalVisible(true);
      }
    }, [gameStatus]);

    if (isLoading) {
      return (
        <SafeAreaView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yıldız hazırlanıyor...</Text>
        </SafeAreaView>
      );
    }

    const navTitle = isDaily ? 'Günün Sorusu' : `Seviye ${currentLevel}`;

    return (
      <SafeAreaView style={styles.safeArea}>
        <GameNavbar
          title={navTitle}
          isReplay={isCurrentReplay && !isDaily}
          attemptsLeft={attemptsLeft}
          maxAttempts={maxAttempts}
          onBack={onBack}
          onOpenMap={onOpenMap}
          showMapButton={!isDaily}
        />

        {isDaily && (
          <DailyHeaderCard
            title="Kim Bu Yıldız?"
            leagueLabel={selectedLeagueMode === 'super_lig' ? 'Süper Lig' : 'Global 5 Lig'}
            isCompleted={alreadyCompleted}
          />
        )}

        <BlurredImageHero
          imageUrl={
            gameStatus !== 'playing'
              ? challengeData?.imageUrl || blurImages[blurImages.length - 1]
              : currentBlurImageUrl || challengeData?.imageUrl
          }
          hasServerBlur={gameStatus === 'playing' && Boolean(currentBlurImageUrl)}
          currentAttempt={gameStatus !== 'playing' ? maxAttempts : guesses.length}
          maxAttempts={maxAttempts}
          isSolved={gameStatus === 'won'}
          isGameOver={gameStatus !== 'playing'}
          solvedPlayerName={challengeData?.playerName}
        />

        <View style={styles.hintContainer}>
          <HintWithAdButton
            hintTitle="Mevki ve Yaş İpucu"
            isUnlocked={hintUnlocked}
            unlockedText={dynamicHintText}
            onHintUnlocked={() => setHintUnlocked(true)}
          />
        </View>

        <View style={styles.historyContainer}>
          <GuessHistoryList guesses={guesses} />
        </View>

        {gameStatus === 'playing' ? (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.guessBtn}
              activeOpacity={0.7}
              onPress={openSearch}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.guessBtnText}>🔍 Futbolcu Tahmin Et</Text>
            </TouchableOpacity>
          </View>
        ) : isDaily ? (
          <DailyCompletedBanner
            status={gameStatus}
            attemptsUsed={guesses.length}
            maxAttempts={maxAttempts}
            onOpenResultModal={() => setIsResultModalVisible(true)}
          />
        ) : (
          <View style={styles.solvedActionBanner}>
            <View>
              <Text style={styles.solvedActionTitle}>
                {gameStatus === 'won' ? '✓ BİLDİNİZ!' : '🏁 OYUN BİTTİ'}
              </Text>
              <Text style={styles.solvedActionSubtitle}>
                {challengeData?.playerName} • {guesses.length}/{maxAttempts} Deneme
              </Text>
            </View>
            <TouchableOpacity
              style={styles.reopenModalBtn}
              onPress={() => setIsResultModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.reopenModalBtnText}>📊 Sonuç Ekranı</Text>
            </TouchableOpacity>
          </View>
        )}

        <OfflinePlayerSearchModal
          visible={isSearchModalVisible}
          onClose={closeSearch}
          onSelectPlayer={submitGuess}
        />

        <WhoAreYaWinModal
          visible={isResultModalVisible}
          status={gameStatus === 'lost' ? 'lost' : 'won'}
          playerName={challengeData?.playerName || targetPlayerInfo?.name || 'Yıldız Futbolcu'}
          playerClub={challengeData?.playerClub || targetPlayerInfo?.club || 'Süper Lig'}
          finalImageUrl={challengeData?.imageUrl || blurImages[blurImages.length - 1]}
          rewardCoins={isCurrentReplay ? 0 : isDaily ? 30 : 20}
          attemptsUsed={guesses.length}
          maxAttempts={maxAttempts}
          guesses={guesses}
          leagueLabel={selectedLeagueMode === 'super_lig' ? 'Süper Lig' : 'Global 5 Lig'}
          isDaily={isDaily}
          onRevive={
            canRevive
              ? () => {
                  setIsResultModalVisible(false);
                  reviveGame();
                }
              : undefined
          }
          onOpenMap={!isDaily ? onOpenMap : undefined}
          onNextLevel={() => {
            setIsResultModalVisible(false);
            setHintUnlocked(false);
            if (isDaily) {
              onBack();
            } else {
              showInterstitialIfDue(currentLevel, () => {
                resetGame();
                goToNextLevel();
              });
            }
          }}
          onClose={() => {
            setIsResultModalVisible(false);
            if (gameStatus === 'lost') {
              finalizeLoss();
            }
          }}
        />
      </SafeAreaView>
    );
  }
);

WhoAreYaScreen.displayName = 'WhoAreYaScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  hintContainer: {
    paddingHorizontal: Spacing.md,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
  },
  bottomBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'android' ? 44 : Spacing.md,
    borderTopWidth: Borders.thin,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  guessBtn: {
    backgroundColor: Colors.accentPrimary,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 4 : 0,
  },
  guessBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 13,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  solvedActionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginHorizontal: Spacing.md,
    marginBottom: Platform.OS === 'android' ? 44 : Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sharp,
  },
  solvedActionTitle: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  solvedActionSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  reopenModalBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.borderLight,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sharp,
  },
  reopenModalBtnText: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 11,
  },
});
