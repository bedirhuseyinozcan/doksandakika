import React, { useState, useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useGameStore } from '../../../stores/useGameStore';
import { hapticsService } from '../../../services/hapticsService';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';
import { COSMETIC_CATALOG, getCosmeticById } from '../catalog';
import { ICosmeticItem, CosmeticCategory } from '../types';
import { useRewardedAd } from '../../monetization/hooks/useRewardedAd';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

interface IScoutShopModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ScoutShopModal: React.FC<IScoutShopModalProps> = React.memo(({ visible, onClose }) => {
  const { primaryColor, onPrimaryTextColor } = useActiveTheme();
  const coins = useGameStore((s) => s.coins);
  const unlockedCosmetics = useGameStore((s) => s.unlockedCosmetics);
  const equippedCosmeticId = useGameStore((s) => s.equippedCosmeticId);
  const unlockCosmetic = useGameStore((s) => s.unlockCosmetic);
  const equipCosmetic = useGameStore((s) => s.equipCosmetic);
  const addCoins = useGameStore((s) => s.addCoins);

  const { showRewardedAd, isLoading: isAdLoading } = useRewardedAd();

  const [activeTab, setActiveTab] = useState<CosmeticCategory>('fan_bundle');
  const [previewId, setPreviewId] = useState<string>(equippedCosmeticId);

  // In-modal dialog state (replaces Alert.alert for 100% Web & Mobile reliability)
  const [confirmItem, setConfirmItem] = useState<ICosmeticItem | null>(null);
  const [insufficientItem, setInsufficientItem] = useState<ICosmeticItem | null>(null);
  const [bonusSuccessMsg, setBonusSuccessMsg] = useState<string | null>(null);

  // Sync preview with equipped item when modal opens
  React.useEffect(() => {
    if (visible) {
      setPreviewId(equippedCosmeticId);
      setConfirmItem(null);
      setInsufficientItem(null);
      setBonusSuccessMsg(null);
    }
  }, [visible, equippedCosmeticId]);

  const previewItem = useMemo(() => {
    return getCosmeticById(previewId);
  }, [previewId]);

  const isPreviewUnlocked = useMemo(() => {
    return (
      unlockedCosmetics.includes(previewItem.id) || previewItem.id === 'avatar_default'
    );
  }, [unlockedCosmetics, previewItem.id]);

  const isPreviewEquipped = useMemo(() => {
    return equippedCosmeticId === previewItem.id;
  }, [equippedCosmeticId, previewItem.id]);

  const filteredItems = useMemo(() => {
    return COSMETIC_CATALOG.filter((c) => c.category === activeTab);
  }, [activeTab]);

  const handleAction = useCallback(
    (item: ICosmeticItem) => {
      const isUnlocked = unlockedCosmetics.includes(item.id) || item.id === 'avatar_default';
      const isEquipped = equippedCosmeticId === item.id;

      if (isEquipped) {
        hapticsService.light();
        return;
      }

      if (isUnlocked) {
        hapticsService.selection();
        equipCosmetic(item.id);
        setPreviewId(item.id);
        return;
      }

      if (coins < item.cost) {
        hapticsService.warning();
        setPreviewId(item.id);
        setInsufficientItem(item);
        return;
      }

      hapticsService.selection();
      setPreviewId(item.id);
      setConfirmItem(item);
    },
    [coins, unlockedCosmetics, equippedCosmeticId, equipCosmetic]
  );

  const confirmPurchase = useCallback(() => {
    if (!confirmItem) return;
    const success = unlockCosmetic(confirmItem.id, confirmItem.cost);
    if (success) {
      hapticsService.success();
      setPreviewId(confirmItem.id);
    } else {
      hapticsService.error();
    }
    setConfirmItem(null);
  }, [confirmItem, unlockCosmetic]);

  const handleWatchAdForCoins = useCallback(() => {
    showRewardedAd('100 Altın Ödülü', () => {
      addCoins(100);
      hapticsService.success();
      setBonusSuccessMsg('+100 Altın Hesabına Eklendi! 🪙');
      setTimeout(() => setBonusSuccessMsg(null), 2500);
      setInsufficientItem(null);
    });
  }, [showRewardedAd, addCoins]);

  const handleClaimFreeCoins = useCallback(() => {
    addCoins(500);
    hapticsService.success();
    setBonusSuccessMsg('+500 Altın Hesabına Eklendi! 🪙');
    setTimeout(() => setBonusSuccessMsg(null), 2500);
    setInsufficientItem(null);
  }, [addCoins]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.card, { borderTopWidth: Borders.thick, borderTopColor: primaryColor }]}
          onPress={(e) => e.stopPropagation?.()}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleCol}>
              <Text style={styles.headerTitle}>🛍️ Kulüp & Scout Mağazası</Text>
              <Text style={styles.headerSubtitle}>Kozmetik Çerçeveler & Setler</Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.balanceBadge}>
                <Text style={[styles.balanceText, { color: primaryColor }]}>🪙 {coins}</Text>
              </View>

              <TouchableOpacity
                style={[styles.addCoinsHeaderBtn, { borderColor: primaryColor }]}
                activeOpacity={0.8}
                disabled={isAdLoading}
                onPress={__DEV__ ? handleClaimFreeCoins : handleWatchAdForCoins}
              >
                <Text style={[styles.addCoinsHeaderText, { color: primaryColor }]}>
                  {__DEV__ ? '+500 ⚙️' : '+ 🎬 Altın'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Bar pinned under header */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'fan_bundle' && [styles.activeTabButton, { backgroundColor: primaryColor }],
              ]}
              onPress={() => {
                hapticsService.light();
                setActiveTab('fan_bundle');
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'fan_bundle' && [styles.activeTabButtonText, { color: onPrimaryTextColor }],
                ]}
              >
                🏟️ Taraftar Paketleri
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'scout' && [styles.activeTabButton, { backgroundColor: primaryColor }],
              ]}
              onPress={() => {
                hapticsService.light();
                setActiveTab('scout');
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'scout' && [styles.activeTabButtonText, { color: onPrimaryTextColor }],
                ]}
              >
                🎭 Scout Rozetleri
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content: Preview Showcase + All Catalog Items */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollList}
            showsVerticalScrollIndicator={false}
          >
            {bonusSuccessMsg ? (
              <View style={[styles.bonusBanner, { borderColor: primaryColor }]}>
                <Text style={[styles.bonusBannerText, { color: primaryColor }]}>🎉 {bonusSuccessMsg}</Text>
              </View>
            ) : null}

            <View style={[styles.showcaseCard, { borderColor: previewItem.frameBorderColor }]}>
              <View style={styles.showcaseTopRow}>
                <View
                  style={[
                    styles.showcaseAvatarCircle,
                    {
                      borderColor: previewItem.frameBorderColor,
                      shadowColor: previewItem.frameBorderColor,
                    },
                  ]}
                >
                  <Text style={styles.showcaseAvatarEmoji}>{previewItem.avatarEmoji}</Text>
                </View>

                <View style={styles.showcaseInfo}>
                  <View style={styles.showcaseBadgeRow}>
                    <View
                      style={[
                        styles.titlePill,
                        { backgroundColor: previewItem.themeGlowColor },
                      ]}
                    >
                      <Text style={styles.titlePillText}>{previewItem.titleBadge}</Text>
                    </View>
                    {previewItem.badgeText ? (
                      <Text style={styles.badgeLabelText}>{previewItem.badgeText}</Text>
                    ) : null}
                  </View>

                  <Text style={styles.showcaseTitle}>{previewItem.name}</Text>
                  <Text style={styles.showcaseDesc} numberOfLines={2}>
                    {previewItem.description}
                  </Text>

                  <View style={styles.showcaseThemeDetails}>
                    <Text style={[styles.showcaseStadiumText, { color: previewItem.themeConfig.primaryColor }]}>
                      {previewItem.themeConfig.teamBadgeEmojis} {previewItem.themeConfig.stadiumName}
                    </Text>
                    <Text style={styles.showcaseChantText} numberOfLines={1}>
                      {previewItem.themeConfig.anthemChant}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.showcaseActionRow}>
                {isPreviewEquipped ? (
                  <View style={[styles.showcaseBtn, styles.showcaseEquippedBtn, { borderColor: primaryColor }]}>
                    <Text style={[styles.showcaseEquippedBtnText, { color: primaryColor }]}>✓ Profilinde Kuşanıldı (Aktif)</Text>
                  </View>
                ) : isPreviewUnlocked ? (
                  <TouchableOpacity
                    style={[styles.showcaseBtn, styles.showcaseEquipBtn, { backgroundColor: primaryColor }]}
                    activeOpacity={0.8}
                    onPress={() => {
                      hapticsService.selection();
                      equipCosmetic(previewItem.id);
                    }}
                  >
                    <Text style={[styles.showcaseEquipBtnText, { color: onPrimaryTextColor }]}>🛡️ Kuşan & Profilde Göster</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.showcaseBtn,
                      coins >= previewItem.cost
                        ? styles.showcaseBuyBtn
                        : styles.showcaseLockedBtn,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleAction(previewItem)}
                  >
                    <Text
                      style={
                        coins >= previewItem.cost
                          ? styles.showcaseBuyBtnText
                          : styles.showcaseLockedBtnText
                      }
                    >
                      {coins >= previewItem.cost
                        ? `🪙 ${previewItem.cost} Altın ile Satın Al & Kuşan`
                        : `🪙 ${previewItem.cost} Altın (Yetersiz Altın — Dokun)`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <Text style={[styles.listSectionTitle, { color: primaryColor }]}>
              {activeTab === 'fan_bundle' ? 'TÜM TARAFTAR PAKETLERİ' : 'TÜM SCOUT ROZETLERİ'}
            </Text>

            {filteredItems.map((item) => {
              const isUnlocked =
                unlockedCosmetics.includes(item.id) || item.id === 'avatar_default';
              const isEquipped = equippedCosmeticId === item.id;
              const isPreviewed = previewId === item.id;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    isPreviewed && styles.previewedItemCard,
                    { borderLeftColor: item.frameBorderColor },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.itemCardContent}
                    activeOpacity={0.7}
                    onPress={() => {
                      setPreviewId(item.id);
                      hapticsService.light();
                    }}
                  >
                    <View
                      style={[
                        styles.itemAvatarBox,
                        {
                          borderColor: item.frameBorderColor,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                      ]}
                    >
                      <Text style={styles.itemEmoji}>{item.avatarEmoji}</Text>
                    </View>

                    <View style={styles.itemInfoCol}>
                      <View style={styles.itemNameRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.badgeText ? (
                          <View style={styles.itemMiniBadge}>
                            <Text style={styles.itemMiniBadgeText}>{item.badgeText}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={[styles.itemSubtitle, { color: item.frameBorderColor || primaryColor }]}>
                        {item.subtitle}
                      </Text>
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      isEquipped && [styles.equippedBtn, { borderColor: primaryColor }],
                      !isEquipped && isUnlocked && [styles.equipBtn, { borderColor: primaryColor }],
                      !isUnlocked && coins >= item.cost && styles.buyBtn,
                      !isUnlocked && coins < item.cost && styles.lockedBtn,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleAction(item)}
                  >
                    {isEquipped ? (
                      <Text style={[styles.equippedBtnText, { color: primaryColor }]}>✓ Aktif</Text>
                    ) : isUnlocked ? (
                      <Text style={[styles.equipBtnText, { color: primaryColor }]}>Kullan</Text>
                    ) : (
                      <Text style={styles.buyBtnText}>🪙 {item.cost}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          {confirmItem ? (
            <View style={styles.dialogOverlay}>
              <View style={[styles.dialogCard, { borderColor: confirmItem.frameBorderColor }]}>
                <View
                  style={[
                    styles.dialogAvatarCircle,
                    {
                      borderColor: confirmItem.frameBorderColor,
                      shadowColor: confirmItem.frameBorderColor,
                    },
                  ]}
                >
                  <Text style={styles.dialogAvatarEmoji}>{confirmItem.avatarEmoji}</Text>
                </View>

                <Text style={styles.dialogTitle}>Satın Alma Onayı</Text>
                <Text style={[styles.dialogItemName, { color: primaryColor }]}>{confirmItem.name}</Text>
                <Text style={styles.dialogDesc}>{confirmItem.description}</Text>

                <View style={styles.dialogCostBox}>
                  <Text style={styles.dialogCostLabel}>Paket Ücreti:</Text>
                  <Text style={styles.dialogCostValue}>🪙 {confirmItem.cost} Altın</Text>
                </View>

                <View style={styles.dialogBalanceRow}>
                  <Text style={styles.dialogBalanceText}>
                    Mevcut: {coins} 🪙  ➔  Kalan: {coins - confirmItem.cost} 🪙
                  </Text>
                </View>

                <View style={styles.dialogBtnRow}>
                  <TouchableOpacity
                    style={styles.dialogCancelBtn}
                    activeOpacity={0.8}
                    onPress={() => setConfirmItem(null)}
                  >
                    <Text style={styles.dialogCancelBtnText}>Vazgeç</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.dialogConfirmBtn, { backgroundColor: primaryColor }]}
                    activeOpacity={0.8}
                    onPress={confirmPurchase}
                  >
                    <Text style={[styles.dialogConfirmBtnText, { color: onPrimaryTextColor }]}>🔥 Satın Al & Kuşan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}

          {insufficientItem ? (
            <View style={styles.dialogOverlay}>
              <View style={[styles.dialogCard, { borderColor: Colors.warning }]}>
                <Text style={styles.dialogWarningIcon}>🪙</Text>
                <Text style={styles.dialogTitle}>Yetersiz Altın</Text>
                <Text style={styles.dialogItemName}>{insufficientItem.name}</Text>
                <Text style={styles.dialogDesc}>
                  Bu paketi açmak için {insufficientItem.cost} altına ihtiyacınız var. Mevcut bakiyeniz: {coins} 🪙.
                </Text>

                <View style={styles.dialogBtnCol}>
                  <TouchableOpacity
                    style={[styles.dialogAdBtn, { backgroundColor: primaryColor }]}
                    activeOpacity={0.8}
                    disabled={isAdLoading}
                    onPress={handleWatchAdForCoins}
                  >
                    <Text style={[styles.dialogAdBtnText, { color: onPrimaryTextColor }]}>🎬 Reklam İzle (+100 Altın Kazan)</Text>
                  </TouchableOpacity>

                  {__DEV__ && (
                    <TouchableOpacity
                      style={styles.dialogFreeBtn}
                      activeOpacity={0.8}
                      onPress={handleClaimFreeCoins}
                    >
                      <Text style={styles.dialogFreeBtnText}>⚙️ [DEV] +500 Test Altını Al</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.dialogCancelBtnFull}
                    activeOpacity={0.8}
                    onPress={() => setInsufficientItem(null)}
                  >
                    <Text style={styles.dialogCancelBtnText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

ScoutShopModal.displayName = 'ScoutShopModal';

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
    height: '86%',
    maxHeight: '86%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderBottomWidth: Borders.thin,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  headerTitleCol: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  headerTitle: {
    ...Typography.statBadge,
    fontSize: 12,
    color: Colors.textPrimary,
    letterSpacing: 0.6,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9.5,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  balanceBadge: {
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sharp,
  },
  balanceText: {
    ...Typography.monoMeta,
    color: Colors.accentPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  addCoinsHeaderBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.accentPrimary,
    paddingVertical: 3,
    paddingHorizontal: Spacing.xs + 3,
    borderRadius: BorderRadius.sharp,
  },
  addCoinsHeaderText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 10,
  },
  closeBtn: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 22,
    color: Colors.textMuted,
    fontWeight: '700',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  bonusBanner: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.success,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sharp,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  bonusBannerText: {
    ...Typography.statBadge,
    color: Colors.success,
    fontSize: 11,
  },
  showcaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.sm + 4,
    borderWidth: Borders.thin,
    marginBottom: Spacing.sm,
  },
  showcaseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showcaseAvatarCircle: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.sharp,
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thick,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  showcaseAvatarEmoji: {
    fontSize: 26,
  },
  showcaseInfo: {
    flex: 1,
  },
  showcaseBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  titlePill: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs + 2,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  titlePillText: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  badgeLabelText: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 9,
  },
  showcaseTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  showcaseDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  showcaseThemeDetails: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: Borders.thin,
    borderTopColor: Colors.border,
  },
  showcaseStadiumText: {
    ...Typography.statBadge,
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  showcaseChantText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  showcaseActionRow: {
    marginTop: Spacing.xs + 4,
    borderTopWidth: Borders.thin,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs + 4,
  },
  showcaseBtn: {
    width: '100%',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showcaseEquippedBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.success,
  },
  showcaseEquippedBtnText: {
    ...Typography.statBadge,
    color: Colors.success,
    fontSize: 11,
  },
  showcaseEquipBtn: {
    backgroundColor: Colors.accentPrimary,
  },
  showcaseEquipBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 11,
    fontWeight: '800',
  },
  showcaseBuyBtn: {
    backgroundColor: Colors.warning,
  },
  showcaseBuyBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 11,
    fontWeight: '800',
  },
  showcaseLockedBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  showcaseLockedBtnText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 11,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: 2,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.sharp,
  },
  activeTabButton: {
    backgroundColor: Colors.accentPrimary,
  },
  tabButtonText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  activeTabButtonText: {
    color: '#090909',
    fontWeight: '800',
  },
  listSectionTitle: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    letterSpacing: 0.8,
    fontSize: 10,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  scrollList: {
    paddingBottom: Spacing.xxl,
    gap: Spacing.xs + 2,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.sm,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    borderLeftWidth: Borders.thick + 1,
  },
  previewedItemCard: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.borderLight,
  },
  itemCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemInfoCol: {
    flex: 1,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  itemName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  itemMiniBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.warning,
  },
  itemMiniBadgeText: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 8,
  },
  itemSubtitle: {
    ...Typography.caption,
    color: Colors.accentPrimary,
    fontSize: 10,
    marginTop: 1,
  },
  itemDescription: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  equippedBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.success,
  },
  equippedBtnText: {
    ...Typography.statBadge,
    color: Colors.success,
    fontSize: 10,
  },
  equipBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.accentPrimary,
  },
  equipBtnText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 10,
  },
  buyBtn: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.warning,
  },
  buyBtnText: {
    ...Typography.statBadge,
    color: Colors.warning,
    fontSize: 10,
  },
  lockedBtn: {
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.borderSubtle,
  },

  // In-modal dialog styles
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 9, 9, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    zIndex: 100,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.md,
    borderWidth: Borders.thick,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  dialogWarningIcon: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  dialogAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sharp,
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thick,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  dialogAvatarEmoji: {
    fontSize: 30,
  },
  dialogTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dialogItemName: {
    ...Typography.bodyBold,
    color: Colors.accentPrimary,
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  dialogDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  dialogCostBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.warning,
    borderRadius: BorderRadius.sharp,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  dialogCostLabel: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 10,
  },
  dialogCostValue: {
    ...Typography.monoMeta,
    color: Colors.warning,
    fontSize: 13,
    fontWeight: '800',
  },
  dialogBalanceRow: {
    marginBottom: Spacing.md,
  },
  dialogBalanceText: {
    ...Typography.monoMeta,
    color: Colors.textMuted,
    fontSize: 11,
  },
  dialogBtnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.sm,
  },
  dialogCancelBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  dialogCancelBtnText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 11,
  },
  dialogConfirmBtn: {
    flex: 1.4,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
  },
  dialogConfirmBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 11,
    fontWeight: '800',
  },
  dialogBtnCol: {
    width: '100%',
    gap: Spacing.sm,
  },
  dialogAdBtn: {
    width: '100%',
    backgroundColor: Colors.accentPrimary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
  },
  dialogAdBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 11,
    fontWeight: '800',
  },
  dialogFreeBtn: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderWidth: Borders.thin,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
  },
  dialogFreeBtnText: {
    ...Typography.statBadge,
    color: Colors.success,
    fontSize: 11,
  },
  dialogCancelBtnFull: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
});
