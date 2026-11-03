import React, { useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useOfflinePlayerSearch } from '../hooks/useOfflinePlayerSearch';
import { PlayerSearchItem } from './PlayerSearchItem';
import { ILightPlayer } from '../../../services/searchEngine';
import { hapticsService } from '../../../services/hapticsService';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

interface IOfflinePlayerSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlayer: (player: ILightPlayer) => void;
  includeLegends?: boolean;
}

export const OfflinePlayerSearchModal: React.FC<IOfflinePlayerSearchModalProps> = React.memo(
  ({ visible, onClose, onSelectPlayer, includeLegends = false }) => {
    const { primaryColor } = useActiveTheme();
    const { query, results, handleQueryChange, clearSearch } =
      useOfflinePlayerSearch(includeLegends);

    const handleSelect = useCallback(
      (player: ILightPlayer) => {
        hapticsService.selection();
        clearSearch();
        onSelectPlayer(player);
        onClose();
      },
      [clearSearch, onSelectPlayer, onClose]
    );

    const handleClose = useCallback(() => {
      clearSearch();
      onClose();
    }, [clearSearch, onClose]);

    const renderItem = useCallback(
      ({ item }: { item: ILightPlayer }) => (
        <PlayerSearchItem player={item} onSelect={handleSelect} />
      ),
      [handleSelect]
    );

    const keyExtractor = useCallback((item: ILightPlayer) => item.id, []);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.topPeekArea} />
          </TouchableWithoutFeedback>

          <View style={[styles.sheet, { borderTopColor: primaryColor }]}>
            <View style={styles.dragHandle} />

            <View style={styles.header}>
              <Text style={styles.title}>
                🔍 Oyuncu Ara{includeLegends ? ' • 👑 Efsaneler Dahil' : ''}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Örn: Mauro Icardi, Bellingham, Ronaldo..."
                placeholderTextColor={Colors.textMuted}
                value={query}
                onChangeText={handleQueryChange}
                autoFocus
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>Temizle</Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={5}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {query.trim().length >= 2
                      ? 'Eşleşen oyuncu bulunamadı.'
                      : 'Yukarıdaki görsele bakarak en az 2 harf yazın...'}
                  </Text>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

OfflinePlayerSearchModal.displayName = 'OfflinePlayerSearchModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 9, 0.65)',
    justifyContent: 'flex-end',
  },
  topPeekArea: {
    flex: 1,
  },
  sheet: {
    height: '55%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.none,
    borderTopRightRadius: BorderRadius.none,
    borderTopWidth: Borders.thick,
    borderTopColor: Colors.accentPrimary,
  },
  dragHandle: {
    width: 32,
    height: 2,
    borderRadius: BorderRadius.none,
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: Borders.thin,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.statBadge,
    fontSize: 12,
    color: Colors.textPrimary,
    letterSpacing: 0.6,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: Typography.body.fontFamily,
  },
  clearBtn: {
    marginLeft: Spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearBtnText: {
    color: Colors.accentPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
  },
});
