import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ILevelLockedModalProps {
  lockedLevel: number | null;
  unlockedLevel: number;
  onDismiss: () => void;
}

export const LevelLockedModal: React.FC<ILevelLockedModalProps> = React.memo(
  ({ lockedLevel, unlockedLevel, onDismiss }) => {
    const { primaryColor, onPrimaryTextColor } = useActiveTheme();

    return (
      <Modal
        visible={lockedLevel !== null}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderTopWidth: Borders.thick, borderTopColor: primaryColor }]}>
            <Text style={styles.modalEmoji}>🔒</Text>
            <Text style={styles.modalTitle}>SEVİYE HENÜZ KİLİTLİ</Text>
            <Text style={styles.modalSubtitle}>
              Seviye {lockedLevel}'e geçebilmek için lütfen önce Seviye {unlockedLevel}'i
              tamamlayınız.
            </Text>

            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: primaryColor }]}
              onPress={onDismiss}
              activeOpacity={0.8}
            >
              <Text style={[styles.confirmBtnText, { color: onPrimaryTextColor }]}>ANLADIM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

LevelLockedModal.displayName = 'LevelLockedModal';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 9, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  modalEmoji: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 13,
    letterSpacing: 0.6,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  confirmBtn: {
    width: '100%',
    marginTop: Spacing.md,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
  },
  confirmBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 12,
    letterSpacing: 0.8,
  },
});
