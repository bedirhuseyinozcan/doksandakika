import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ILevelReplayModalProps {
  levelNumber: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LevelReplayModal: React.FC<ILevelReplayModalProps> = React.memo(
  ({ levelNumber, onConfirm, onCancel }) => {
    return (
      <Modal
        visible={levelNumber !== null}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🔁</Text>
            <Text style={styles.modalTitle}>SEVİYE ZATEN TAMAMLANDI</Text>
            <Text style={styles.modalSubtitle}>
              Seviye {levelNumber}'i daha önce başarıyla tamamladınız. Tekrar oynamak istiyor
              musunuz?
            </Text>

            <View style={styles.modalNoticeBox}>
              <Text style={styles.modalNoticeText}>
                ⚠️ Not: Bu seviye daha önce geçildiği için tekrar tamamlandığında yeni altın ödülü
                verilmeyecektir.
              </Text>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={onCancel} activeOpacity={0.8}>
                <Text style={styles.modalCancelBtnText}>VAZGEÇ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={onConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmBtnText}>TEKRAR OYNA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

LevelReplayModal.displayName = 'LevelReplayModal';

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
  modalNoticeBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sharp,
    padding: Spacing.sm,
    borderWidth: Borders.thin,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.lg,
  },
  modalNoticeText: {
    ...Typography.caption,
    color: Colors.warning,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  modalCancelBtnText: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 11,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: Colors.accentPrimary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sharp,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    ...Typography.statBadge,
    color: '#090909',
    fontSize: 11,
    letterSpacing: 0.6,
  },
});
