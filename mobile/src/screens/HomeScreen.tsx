import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { GameModeType } from '../api/dailyApi';
import { useGameStore } from '../stores/useGameStore';
import { useSettingsStore, LeagueMode } from '../stores/useSettingsStore';
import { getRankByXp } from '../features/stats/utils/rankUtils';
import { getAuthoritativeUtcDate } from '../services/authoritativeTime';
import { PlayerStatsModal } from '../features/stats/components/PlayerStatsModal';
import { ScoutShopModal } from '../features/shop/components/ScoutShopModal';
import { CosmeticVectorIcon, TeamCrestBadgeIcon } from '../features/shop/components/CosmeticVectorIcon';
import { getCosmeticById } from '../features/shop/catalog';
import { SettingsModal } from '../features/settings/components/SettingsModal';
import { HomeGameCard } from '../features/home/components/HomeGameCard';
import { HomeBottomNav, HomeNavTab } from '../features/home/components/HomeBottomNav';
import {
  ScanFace,
  Route,
  Shield,
  Flame,
  Grid3x3,
  LayoutGrid,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, Borders } from '../theme/spacing';
import { Typography } from '../theme/typography';

export type AppScreenType =
  | 'home'
  | 'whoAreYa'
  | 'careerPath'
  | 'clubLogo'
  | 'contextinho'
  | 'ticTacToe'
  | 'footballBingo'
  | 'levelMap';

interface IHomeScreenProps {
  onNavigate: (screen: AppScreenType, isDaily?: boolean, mode?: GameModeType) => void;
}

export const HomeScreen: React.FC<IHomeScreenProps> = React.memo(({ onNavigate }) => {
  const coins = useGameStore((s) => s.coins);
  const currentStreak = useGameStore((s) => s.currentStreak);
  const completedDailyDates = useGameStore((s) => s.completedDailyDates);
  const authoritativeDate = useGameStore((s) => s.authoritativeDate);
  const isDailyCompleted = useGameStore((s) => s.isDailyCompleted);
  const xp = useGameStore((s) => s.xp);

  const selectedLeagueMode = useSettingsStore((s) => s.selectedLeagueMode);
  const setLeagueMode = useSettingsStore((s) => s.setLeagueMode);

  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isShopModalVisible, setIsShopModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const activeTab: HomeNavTab = useMemo(() => {
    if (isShopModalVisible) return 'shop';
    if (isStatsModalVisible) return 'stats';
    if (isSettingsModalVisible) return 'settings';
    return 'play';
  }, [isShopModalVisible, isStatsModalVisible, isSettingsModalVisible]);

  const handlePressPlay = useCallback(() => {
    setIsShopModalVisible(false);
    setIsStatsModalVisible(false);
    setIsSettingsModalVisible(false);
  }, []);

  const handleOpenShop = useCallback(() => {
    setIsStatsModalVisible(false);
    setIsSettingsModalVisible(false);
    setIsShopModalVisible(true);
  }, []);

  const handleOpenStats = useCallback(() => {
    setIsShopModalVisible(false);
    setIsSettingsModalVisible(false);
    setIsStatsModalVisible(true);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsShopModalVisible(false);
    setIsStatsModalVisible(false);
    setIsSettingsModalVisible(true);
  }, []);

  const equippedCosmeticId = useGameStore((s) => s.equippedCosmeticId);
  const equippedCosmetic = useMemo(
    () => getCosmeticById(equippedCosmeticId),
    [equippedCosmeticId]
  );

  const theme = equippedCosmetic.themeConfig;
  const isSuperLig = selectedLeagueMode === 'super_lig';

  const isLightPrimary =
    theme.primaryColor === '#FBBF24' ||
    theme.primaryColor === '#FFFFFF' ||
    theme.primaryColor === '#F4F4F5' ||
    theme.primaryColor === '#EAB308' ||
    theme.primaryColor === '#00D084' ||
    theme.primaryColor === '#C7FB07';

  const rankInfo = useMemo(() => getRankByXp(xp), [xp]);
  const todayDate = authoritativeDate || getAuthoritativeUtcDate();
  const isWhoAreYaDailyCompleted =
    completedDailyDates.includes(`${todayDate}_whoAreYa_${selectedLeagueMode}`) ||
    isDailyCompleted(`${todayDate}_whoAreYa_${selectedLeagueMode}`);
  const isCareerDailyCompleted =
    completedDailyDates.includes(`${todayDate}_careerPath_${selectedLeagueMode}`) ||
    isDailyCompleted(`${todayDate}_careerPath_${selectedLeagueMode}`);
  const isClubLogoDailyCompleted =
    completedDailyDates.includes(`${todayDate}_clubLogo_${selectedLeagueMode}`) ||
    isDailyCompleted(`${todayDate}_clubLogo_${selectedLeagueMode}`);
  const isContextinhoDailyCompleted =
    completedDailyDates.includes(`${todayDate}_contextinho_${selectedLeagueMode}`) ||
    isDailyCompleted(`${todayDate}_contextinho_${selectedLeagueMode}`);
  const isTicTacToeDailyCompleted =
    completedDailyDates.includes(`${todayDate}_ticTacToe_${selectedLeagueMode}`) ||
    isDailyCompleted(`${todayDate}_ticTacToe_${selectedLeagueMode}`);
  const isBingoDailyCompleted =
    completedDailyDates.includes(`${todayDate}_footballBingo_${selectedLeagueMode}`) ||
    isDailyCompleted(`${todayDate}_footballBingo_${selectedLeagueMode}`);

  const handleSelectMode = useCallback(
    (mode: LeagueMode) => {
      setLeagueMode(mode);
    },
    [setLeagueMode]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Industrial Architectural Top Edge Accent */}
      <View
        style={[styles.topAccentBar, { backgroundColor: theme.primaryColor }]}
        pointerEvents="none"
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.brandCol}>
            <View style={styles.brandTitleRow}>
              <Image
                source={require('../assets/doksandakika.png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.brandTitleMain}>DOKSAN DAKİKA</Text>
              <View style={[styles.brandDot, { backgroundColor: theme.primaryColor }]} />
            </View>
            <Text style={styles.brandSubtitle}>ENDÜSTRİYEL FUTBOL TRIVIA SİSTEMİ</Text>
          </View>

          <View style={styles.currencyRow}>
            <TouchableOpacity
              style={[styles.currencyBadge, styles.streakBadge]}
              activeOpacity={0.8}
              onPress={() => setIsStatsModalVisible(true)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={styles.streakText}>🔥 {currentStreak}</Text>
            </TouchableOpacity>

            <View style={styles.currencyBadge}>
              <Text style={[styles.currencyText, { color: theme.primaryColor }]}>🪙 {coins}</Text>
            </View>
          </View>
        </View>

        {/* Hero Scout & Fan Card */}
        <TouchableOpacity
          style={[
            styles.heroScoutCard,
            {
              borderColor: theme.cardBorder || Colors.border,
              borderLeftColor: theme.primaryColor,
            },
          ]}
          activeOpacity={0.88}
          onPress={() => setIsStatsModalVisible(true)}
        >
          <View style={styles.heroScoutHeader}>
            <View
              style={[
                styles.heroAvatarSquare,
                {
                  borderColor: theme.primaryColor,
                  backgroundColor: theme.accentGlow || Colors.surfaceLight,
                },
              ]}
            >
              <CosmeticVectorIcon cosmeticId={equippedCosmetic.id} size={26} />
            </View>

            <View style={styles.heroScoutInfoCol}>
              <View style={styles.heroScoutTitleRow}>
                <Text style={styles.heroScoutRankTitle} numberOfLines={1}>
                  {rankInfo.title}
                </Text>
                <View
                  style={[
                    styles.heroCosmeticBadge,
                    {
                      borderColor: theme.primaryColor,
                      backgroundColor: theme.accentGlow || Colors.surfaceLight,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    },
                  ]}
                >
                  <TeamCrestBadgeIcon
                    primaryColor={theme.primaryColor}
                    secondaryColor={theme.secondaryColor}
                    size={11}
                  />
                  <Text style={[styles.heroCosmeticBadgeText, { color: theme.primaryColor }]}>
                    {equippedCosmetic.titleBadge}
                  </Text>
                </View>
              </View>

              <View style={styles.heroScoutMetaRow}>
                <Text style={styles.heroStadiumText}>
                  {theme.stadiumName}
                </Text>
                <Text style={styles.heroMetaDot}>|</Text>
                <Text style={styles.heroXpText}>
                  {rankInfo.tier === 4
                    ? 'MAKSİMUM RÜTBE'
                    : `${rankInfo.xpNeededForNext} XP KALDI`}
                </Text>
              </View>
            </View>

            <View style={styles.heroProgressCol}>
              <Text style={[styles.heroProgressPercent, { color: theme.primaryColor }]}>
                %{rankInfo.currentProgressInTier}
              </Text>
              <Text style={styles.heroStatsHint}>DETAY ➔</Text>
            </View>
          </View>

          {/* Precision Industrial Progress Line */}
          <View style={styles.heroProgressBarBg}>
            <View
              style={[
                styles.heroProgressBarFill,
                {
                  width: `${rankInfo.currentProgressInTier}%`,
                  backgroundColor: theme.primaryColor,
                },
              ]}
            />
          </View>

          {/* Fan Atmosphere Banner */}
          <View style={[styles.heroAtmosphereStrip, { borderColor: theme.cardBorder || Colors.border }]}>
            <View style={[styles.pulseSquare, { backgroundColor: theme.primaryColor }]} />
            <Text style={styles.heroChantText} numberOfLines={1}>
              {theme.anthemChant}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Mode Switcher Container */}
        <View style={styles.modeSwitcherContainer}>
          <Text style={styles.sectionTitle}>LİG KAPSAMI</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                isSuperLig && { backgroundColor: theme.primaryColor },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelectMode('super_lig')}
            >
              <Text
                style={[
                  styles.tabText,
                  isSuperLig && {
                    color: isLightPrimary ? '#090909' : '#FFFFFF',
                    fontWeight: '800',
                  },
                ]}
              >
                🇹🇷 SÜPER LİG
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                !isSuperLig && { backgroundColor: theme.primaryColor },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelectMode('global')}
            >
              <Text
                style={[
                  styles.tabText,
                  !isSuperLig && {
                    color: isLightPrimary ? '#090909' : '#FFFFFF',
                    fontWeight: '800',
                  },
                ]}
              >
                🌍 5 BÜYÜK LİG (GLOBAL)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Game Mode Cards */}
        <HomeGameCard
          icon={<ScanFace size={22} color={theme.primaryColor} strokeWidth={2.2} />}
          title="Kim Bu Yıldız?"
          subtitle="Bulanık fotoğraftan ve ipuçlarından futbolcuyu tahmin et"
          dailyBtnText={isWhoAreYaDailyCompleted ? '✓ GÜNÜN SORUSU' : '📅 GÜNÜN SORUSU'}
          themePrimaryColor={theme.primaryColor}
          themeBorderColor={theme.cardBorder}
          onPressDaily={() => onNavigate('whoAreYa', true, 'whoAreYa')}
          onPressCareer={() => onNavigate('levelMap', false, 'whoAreYa')}
        />

        <HomeGameCard
          icon={<Route size={22} color={theme.primaryColor} strokeWidth={2.2} />}
          title="Transfer Rotası"
          subtitle="Kariyerinde oynadığı kulüpleri takip ederek yıldızı bul"
          dailyBtnText={isCareerDailyCompleted ? '✓ GÜNÜN SORUSU' : '📅 GÜNÜN SORUSU'}
          themePrimaryColor={theme.primaryColor}
          themeBorderColor={theme.cardBorder}
          onPressDaily={() => onNavigate('careerPath', true, 'careerPath')}
          onPressCareer={() => onNavigate('levelMap', false, 'careerPath')}
        />

        <HomeGameCard
          icon={<Shield size={22} color={theme.primaryColor} strokeWidth={2.2} />}
          title="Arma Avcısı"
          subtitle="Gizlenmiş ve netleştirilen kulüp armasından takımı bul"
          dailyBtnText={isClubLogoDailyCompleted ? '✓ GÜNÜN SORUSU' : '📅 GÜNÜN SORUSU'}
          themePrimaryColor={theme.primaryColor}
          themeBorderColor={theme.cardBorder}
          onPressDaily={() => onNavigate('clubLogo', true, 'clubLogo')}
          onPressCareer={() => onNavigate('levelMap', false, 'clubLogo')}
        />

        <HomeGameCard
          icon={<Flame size={22} color={theme.primaryColor} strokeWidth={2.2} />}
          title="Sıcak Temas"
          subtitle="Sıcak-soğuk benzerlik sinyalleriyle #1 numaralı yıldızı bul"
          dailyBtnText={isContextinhoDailyCompleted ? '✓ GÜNÜN SORUSU' : '📅 GÜNÜN SORUSU'}
          themePrimaryColor={theme.primaryColor}
          themeBorderColor={theme.cardBorder}
          onPressDaily={() => onNavigate('contextinho', true, 'contextinho')}
          onPressCareer={() => onNavigate('levelMap', false, 'contextinho')}
        />

        <HomeGameCard
          icon={<Grid3x3 size={22} color={theme.primaryColor} strokeWidth={2.2} />}
          title="Tiki-Taka (3x3)"
          subtitle="Kriter kesişimlerine (Kulüp × Mevki/Uyruk) uyan futbolcuları bul"
          dailyBtnText={isTicTacToeDailyCompleted ? '✓ GÜNÜN SORUSU' : '📅 GÜNÜN SORUSU'}
          themePrimaryColor={theme.primaryColor}
          themeBorderColor={theme.cardBorder}
          onPressDaily={() => onNavigate('ticTacToe', true, 'ticTacToe')}
          onPressCareer={() => onNavigate('levelMap', false, 'ticTacToe')}
        />

        <HomeGameCard
          icon={<LayoutGrid size={22} color={theme.primaryColor} strokeWidth={2.2} />}
          title="Futbol Bingo (4x4)"
          subtitle="42 kişilik desteden gelen futbolcuları doğru kriterlere yerleştir"
          dailyBtnText={isBingoDailyCompleted ? '✓ GÜNÜN SORUSU' : '📅 GÜNÜN SORUSU'}
          themePrimaryColor={theme.primaryColor}
          themeBorderColor={theme.cardBorder}
          onPressDaily={() => onNavigate('footballBingo', true, 'footballBingo')}
          onPressCareer={() => onNavigate('levelMap', false, 'footballBingo')}
        />
      </ScrollView>

      {/* Industrial Bottom Navigation */}
      <HomeBottomNav
        primaryColor={theme.primaryColor}
        activeTab={activeTab}
        onPressPlay={handlePressPlay}
        onOpenShop={handleOpenShop}
        onOpenStats={handleOpenStats}
        onOpenSettings={handleOpenSettings}
      />

      <PlayerStatsModal
        visible={isStatsModalVisible}
        onClose={() => setIsStatsModalVisible(false)}
      />

      <ScoutShopModal
        visible={isShopModalVisible}
        onClose={() => setIsShopModalVisible(false)}
      />

      <SettingsModal
        visible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
      />
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  },
  topAccentBar: {
    height: Borders.thick,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingTop: Spacing.xs,
  },
  brandCol: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.sharp,
  },
  brandTitleMain: {
    ...Typography.hero,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.textPrimary,
    letterSpacing: 1.2,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.none,
  },
  brandSubtitle: {
    ...Typography.statBadge,
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 1.2,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  streakBadge: {
    borderColor: Colors.warning,
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
  },
  streakText: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 11,
  },
  currencyText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 11,
  },
  heroScoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.sm + 4,
    borderWidth: Borders.thin,
    borderLeftWidth: Borders.thick + 1,
    marginBottom: Spacing.md,
  },
  heroScoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  heroAvatarSquare: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarEmoji: {
    fontSize: 18,
  },
  heroScoutInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  heroScoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  heroScoutRankTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 13,
    letterSpacing: -0.2,
  },
  heroCosmeticBadge: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
  },
  heroCosmeticBadgeText: {
    ...Typography.statBadge,
    fontSize: 8.5,
    letterSpacing: 0.4,
  },
  heroScoutMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  heroStadiumText: {
    ...Typography.monoMeta,
    color: Colors.textSecondary,
    fontSize: 9.5,
  },
  heroMetaDot: {
    ...Typography.monoMeta,
    color: Colors.borderLight,
    fontSize: 9,
  },
  heroXpText: {
    ...Typography.monoMeta,
    color: Colors.textMuted,
    fontSize: 9.5,
  },
  heroProgressCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  heroProgressPercent: {
    ...Typography.monoLarge,
    fontSize: 15,
  },
  heroStatsHint: {
    ...Typography.statBadge,
    fontSize: 8.5,
    color: Colors.textMuted,
    marginTop: 2,
  },
  heroProgressBarBg: {
    height: 3,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: BorderRadius.none,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 8,
  },
  heroProgressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.none,
  },
  heroAtmosphereStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    gap: 6,
  },
  pulseSquare: {
    width: 5,
    height: 5,
    borderRadius: BorderRadius.none,
  },
  heroChantText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
    flex: 1,
  },
  modeSwitcherContainer: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    marginBottom: Spacing.xs + 2,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: 2,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    minHeight: 38,
    justifyContent: 'center',
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.sharp,
  },
  tabText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.6,
  },
});
