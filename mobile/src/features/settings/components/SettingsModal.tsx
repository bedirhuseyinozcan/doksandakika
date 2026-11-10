import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Vibrate,
  RefreshCw,
  BookOpen,
  ScanFace,
  Route,
  Shield,
  Flame,
  Grid3x3,
  LayoutGrid,
} from 'lucide-react-native';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { hapticsService } from '../../../services/hapticsService';
import { searchEngine } from '../../../services/searchEngine';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ISettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<ISettingsModalProps> = React.memo(
  ({ visible, onClose }) => {
    const { primaryColor, onPrimaryTextColor } = useActiveTheme();
    const soundEnabled = useSettingsStore((s) => s.soundEnabled);
    const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
    const toggleSound = useSettingsStore((s) => s.toggleSound);
    const toggleHaptics = useSettingsStore((s) => s.toggleHaptics);

    const [syncStatus, setSyncStatus] = useState<string | null>(null);

    const handleSyncDatabase = useCallback(async () => {
      hapticsService.selection();
      setSyncStatus('Veritabanı kontrol ediliyor...');
      try {
        await searchEngine.syncSearchIndexIfNeeded();
        hapticsService.success();
        setSyncStatus('✅ 2026-27 Kadroları & 500 Efsane Güncel!');
      } catch {
        setSyncStatus('⚡ Çevrimdışı (Offline) Paket Aktif');
      }
      setTimeout(() => setSyncStatus(null), 3000);
    }, []);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
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
            <View style={styles.headerRow}>
              <View style={styles.headerTitleWrap}>
                <Settings size={15} color={primaryColor} strokeWidth={2.4} />
                <Text style={styles.headerTitle}>AYARLAR & OYUN REHBERİ</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <X size={20} color={Colors.textMuted} strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
            >
              {/* Ses & Titreşim Kontrolleri */}
              <Text style={[styles.sectionTitle, { color: primaryColor }]}>Tercihler</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingIconBox}>
                  {soundEnabled ? (
                    <Volume2 size={18} color={primaryColor} strokeWidth={2.2} />
                  ) : (
                    <VolumeX size={18} color={Colors.textMuted} strokeWidth={2.2} />
                  )}
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Stadyum & Oyun Sesleri</Text>
                  <Text style={styles.settingSub}>
                    Doğru/yanlış tahmin ve zafer ses efektleri
                  </Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={() => {
                    toggleSound();
                    hapticsService.light();
                  }}
                  trackColor={{ false: Colors.surfaceLight, true: primaryColor }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingIconBox}>
                  <Vibrate
                    size={18}
                    color={hapticsEnabled ? primaryColor : Colors.textMuted}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Dokunsal Titreşim (Haptics)</Text>
                  <Text style={styles.settingSub}>
                    Tahminlerde ve butonlarda titreşim geri bildirimi
                  </Text>
                </View>
                <Switch
                  value={hapticsEnabled}
                  onValueChange={toggleHaptics}
                  trackColor={{ false: Colors.surfaceLight, true: primaryColor }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Veritabanı Senkronizasyonu */}
              <TouchableOpacity
                style={[styles.syncBtn, { borderColor: primaryColor }]}
                activeOpacity={0.8}
                onPress={handleSyncDatabase}
              >
                <RefreshCw size={14} color={primaryColor} strokeWidth={2.4} />
                <Text style={[styles.syncBtnText, { color: primaryColor }]}>
                  OYUNCU VERİTABANINI SENKRONİZE ET
                </Text>
              </TouchableOpacity>
              {syncStatus ? (
                <Text style={styles.syncStatusText}>{syncStatus}</Text>
              ) : null}

              {/* Nasıl Oynanır? */}
              <View style={styles.sectionHeaderRow}>
                <BookOpen size={13} color={primaryColor} strokeWidth={2.4} />
                <Text style={[styles.sectionTitle, { color: primaryColor, marginBottom: 0 }]}>
                  Oyun Modları Rehberi
                </Text>
              </View>

              <View style={styles.guideBox}>
                <View style={styles.guideRow}>
                  <View style={styles.guideIconWrap}>
                    <ScanFace size={15} color={primaryColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.guideItem}>
                    <Text style={styles.guideBold}>Kim Bu Yıldız?: </Text>
                    Bulanık fotoğraftan ve renkli ipucu kutularından (Yeşil = Tam Eşleşme) yıldızı 8 denemede bul.
                  </Text>
                </View>

                <View style={styles.guideRow}>
                  <View style={styles.guideIconWrap}>
                    <Route size={15} color={primaryColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.guideItem}>
                    <Text style={styles.guideBold}>Transfer Rotası: </Text>
                    Kronolojik kulüp geçmişini takip et. Her 3 seviyede bir Efsane İkon sorulur!
                  </Text>
                </View>

                <View style={styles.guideRow}>
                  <View style={styles.guideIconWrap}>
                    <Shield size={15} color={primaryColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.guideItem}>
                    <Text style={styles.guideBold}>Arma Avcısı: </Text>
                    Bulanık kulüp armasından takımı tahmin et.
                  </Text>
                </View>

                <View style={styles.guideRow}>
                  <View style={styles.guideIconWrap}>
                    <Flame size={15} color={primaryColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.guideItem}>
                    <Text style={styles.guideBold}>Sıcak Temas: </Text>
                    Tahmin ettiğin oyuncunun hedefe yakınlık sırasına (#1 en sıcak) göre yıldızı bul.
                  </Text>
                </View>

                <View style={styles.guideRow}>
                  <View style={styles.guideIconWrap}>
                    <Grid3x3 size={15} color={primaryColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.guideItem}>
                    <Text style={styles.guideBold}>Tiki-Taka (3x3): </Text>
                    Satır ve sütun kesişimlerine uyan oyuncuları yerleştir. Serbest arama ile çoklu kombo yapabilirsin!
                  </Text>
                </View>

                <View style={styles.guideRow}>
                  <View style={styles.guideIconWrap}>
                    <LayoutGrid size={15} color={primaryColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.guideItem}>
                    <Text style={styles.guideBold}>Futbol Bingo (4x4): </Text>
                    42 kişilik desteden sırayla gelen oyuncuları 16 kriter kutusuna yerleştir. Yanlış kutu -2 deste cezası verir!
                  </Text>
                </View>
              </View>

              <Text style={styles.versionText}>
                Doksan Dakika Futbol Oyun Portalı v1.0.0 • 2026-27 Sezonu
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: primaryColor }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.doneBtnText, { color: onPrimaryTextColor }]}>Tamam</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }
);

SettingsModal.displayName = 'SettingsModal';

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
    maxHeight: '86%',
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
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  closeBtn: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingBottom: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 10,
    marginBottom: Spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    marginBottom: Spacing.xs + 2,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  settingIconBox: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sharp,
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  settingLabel: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  settingSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  syncBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.accentPrimary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  syncBtnText: {
    ...Typography.statBadge,
    color: Colors.accentPrimary,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  syncStatusText: {
    ...Typography.statBadge,
    color: Colors.success,
    textAlign: 'center',
    marginTop: 6,
    fontSize: 10,
  },
  guideBox: {
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    gap: 10,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  guideIconWrap: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sharp,
    backgroundColor: Colors.surface,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  guideItem: {
    flex: 1,
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
    fontSize: 11.5,
  },
  guideBold: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  versionText: {
    ...Typography.monoMeta,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontSize: 10,
  },
  doneBtn: {
    backgroundColor: Colors.accentPrimary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  doneBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 12,
    letterSpacing: 0.8,
  },
});
