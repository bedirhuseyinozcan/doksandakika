import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { hapticsService } from '../../../services/hapticsService';
import { Colors } from '../../../theme/colors';
import { Spacing, BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

export type HomeNavTab = 'play' | 'shop' | 'stats' | 'settings';

function getAndroidBottomInset(): number {
  if (Platform.OS !== 'android') return 16;
  const screenHeight = Dimensions.get('screen').height;
  const windowHeight = Dimensions.get('window').height;
  const statusBarHeight = StatusBar.currentHeight || 24;
  const navBarDiff = screenHeight - windowHeight - statusBarHeight;

  return Math.max(48, navBarDiff > 0 ? navBarDiff + 12 : 52);
}

const SAFE_BOTTOM_PADDING = getAndroidBottomInset();

interface IHomeBottomNavProps {
  primaryColor: string;
  activeTab?: HomeNavTab;
  onPressPlay?: () => void;
  onOpenShop: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const HomeBottomNav: React.FC<IHomeBottomNavProps> = React.memo(
  ({
    primaryColor,
    activeTab = 'play',
    onPressPlay,
    onOpenShop,
    onOpenStats,
    onOpenSettings,
  }) => {
    return (
      <View style={styles.outerWrapper}>
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => {
              hapticsService.selection();
              onPressPlay?.();
            }}
          >
            {activeTab === 'play' && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: primaryColor },
                ]}
              />
            )}
            <Text style={styles.navEmoji}>⚽</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'play'
                  ? { color: primaryColor, fontWeight: '800' }
                  : { color: Colors.textMuted },
              ]}
            >
              OYNA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.75}
            onPress={() => {
              hapticsService.light();
              onOpenShop();
            }}
          >
            {activeTab === 'shop' && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: primaryColor },
                ]}
              />
            )}
            <Text style={styles.navEmoji}>🛍️</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'shop'
                  ? { color: primaryColor, fontWeight: '800' }
                  : { color: Colors.textMuted },
              ]}
            >
              KULÜP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.75}
            onPress={() => {
              hapticsService.light();
              onOpenStats();
            }}
          >
            {activeTab === 'stats' && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: primaryColor },
                ]}
              />
            )}
            <Text style={styles.navEmoji}>📊</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'stats'
                  ? { color: primaryColor, fontWeight: '800' }
                  : { color: Colors.textMuted },
              ]}
            >
              KÜNYE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.75}
            onPress={() => {
              hapticsService.light();
              onOpenSettings();
            }}
          >
            {activeTab === 'settings' && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: primaryColor },
                ]}
              />
            )}
            <Text style={styles.navEmoji}>⚙️</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'settings'
                  ? { color: primaryColor, fontWeight: '800' }
                  : { color: Colors.textMuted },
              ]}
            >
              AYARLAR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

HomeBottomNav.displayName = 'HomeBottomNav';

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingTop: 4,
    paddingBottom: SAFE_BOTTOM_PADDING,
    borderTopWidth: Borders.thin,
    borderTopColor: Colors.border,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    borderColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: Spacing.xs,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 2,
    borderRadius: BorderRadius.none,
  },
  navEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  navLabel: {
    ...Typography.statBadge,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
