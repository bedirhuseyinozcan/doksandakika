import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ITicTacToeCellState } from '../types';
import { ClubLogo } from '../../../components/common/ClubLogo';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { Colors } from '../../../theme/colors';
import { BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface ITicTacToeCellProps {
  cell: ITicTacToeCellState;
  isSelected: boolean;
  onPress: (cellIndex: number) => void;
  disabled?: boolean;
}

export const TicTacToeCell: React.FC<ITicTacToeCellProps> = React.memo(
  ({ cell, isSelected, onPress, disabled = false }) => {
    const { primaryColor } = useActiveTheme();
    const { cellIndex, isFilled, guessedPlayer } = cell;

    return (
      <TouchableOpacity
        style={[
          styles.cell,
          isSelected && [styles.selectedCell, { borderColor: primaryColor }],
          isFilled && [styles.filledCell, { borderColor: primaryColor }],
        ]}
        activeOpacity={0.75}
        onPress={() => onPress(cellIndex)}
        disabled={disabled || isFilled}
      >
        {isFilled && guessedPlayer ? (
          <View style={styles.filledContent}>
            <View style={styles.filledBadgeRow}>
              <Text style={[styles.checkIcon, { color: primaryColor }]}>✓</Text>
              <ClubLogo
                logoUrl={guessedPlayer.logoUrl || guessedPlayer.logo}
                clubName={guessedPlayer.club}
                size={16}
                fallbackEmoji=""
              />
            </View>
            <Text style={styles.playerName} numberOfLines={2}>
              {guessedPlayer.name}
            </Text>
            <Text style={styles.playerClub} numberOfLines={1}>
              {guessedPlayer.club}
            </Text>
            {cell.rarityLabel && (
              <View style={styles.rarityBadge}>
                <Text style={styles.rarityText}>{cell.rarityLabel}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyContent}>
            <Text style={[styles.plusIcon, isSelected && [styles.selectedPlus, { color: primaryColor }]]}>
              {isSelected ? '🎯' : '+'}
            </Text>
            <Text style={[styles.cellSubtext, isSelected && { color: primaryColor }]}>
              {isSelected ? 'SEÇİLDİ' : 'DOLDUR'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

TicTacToeCell.displayName = 'TicTacToeCell';

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  selectedCell: {
    borderColor: Colors.accentPrimary,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: Borders.thick,
  },
  filledCell: {
    borderColor: Colors.success,
    backgroundColor: Colors.surfaceLight,
  },
  filledContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  filledBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 2,
  },
  rarityBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: BorderRadius.sharp,
    marginTop: 2,
    borderWidth: Borders.thin,
    borderColor: Colors.warning,
  },
  rarityText: {
    ...Typography.monoMeta,
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.warning,
  },
  checkIcon: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '900',
    marginBottom: 1,
  },
  playerName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
  },
  playerClub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 8.5,
    textAlign: 'center',
    marginTop: 1,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  selectedPlus: {
    color: Colors.accentPrimary,
  },
  cellSubtext: {
    ...Typography.statBadge,
    color: Colors.textMuted,
    fontSize: 8.5,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
