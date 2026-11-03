import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { IBingoTile } from '../types';
import { ClubLogo } from '../../../components/common/ClubLogo';
import { Colors } from '../../../theme/colors';
import { BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IBingoCellProps {
  tile: IBingoTile;
  isWrongFlash: boolean;
  onPress: (index: number) => void;
  disabled?: boolean;
}

export const BingoCell: React.FC<IBingoCellProps> = React.memo(
  ({ tile, isWrongFlash, onPress, disabled = false }) => {
    const { index, emoji, title, subtitle, isMatched, matchedPlayer } = tile;

    return (
      <TouchableOpacity
        style={[
          styles.cell,
          isMatched && styles.matchedCell,
          isWrongFlash && styles.wrongFlashCell,
        ]}
        activeOpacity={0.7}
        onPress={() => onPress(index)}
        disabled={disabled || isMatched}
      >
        {isMatched && matchedPlayer ? (
          <View style={styles.matchedContent}>
            <View style={styles.matchedBadgeRow}>
              <Text style={styles.checkIcon}>✓</Text>
              <ClubLogo
                logoUrl={matchedPlayer.logoUrl || matchedPlayer.logo}
                clubName={matchedPlayer.club}
                size={16}
                fallbackEmoji=""
              />
            </View>
            <Text style={styles.matchedPlayerName} numberOfLines={2}>
              {matchedPlayer.name}
            </Text>
            <Text style={styles.matchedTileTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
        ) : (
          <View style={styles.unmatchedContent}>
            {tile.type === 'club' ? (
              <ClubLogo
                logoUrl={tile.logoUrl}
                clubName={tile.value}
                size={20}
                fallbackEmoji={emoji}
              />
            ) : (
              <Text style={styles.tileEmoji}>{emoji}</Text>
            )}
            <Text style={styles.tileTitle} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.tileSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

BingoCell.displayName = 'BingoCell';

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
  matchedCell: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.success,
  },
  wrongFlashCell: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.danger,
    borderWidth: Borders.thick,
  },
  unmatchedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tileEmoji: {
    fontSize: 13,
    marginBottom: 1,
  },
  tileTitle: {
    ...Typography.statBadge,
    color: Colors.textPrimary,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 11,
  },
  tileSubtitle: {
    ...Typography.monoMeta,
    color: Colors.textMuted,
    fontSize: 7.5,
    textAlign: 'center',
    marginTop: 1,
  },
  matchedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  matchedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginBottom: 2,
  },
  checkIcon: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '900',
    marginBottom: 1,
  },
  matchedPlayerName: {
    ...Typography.bodyBold,
    color: Colors.success,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 11,
  },
  matchedTileTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 7.5,
    textAlign: 'center',
  },
});
