import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';
import { BorderRadius, Borders } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

interface IAnimatedAttributeTileProps {
  label: string;
  value: string;
  status: 'correct' | 'wrong' | 'higher' | 'lower';
  delay?: number;
}

export const AnimatedAttributeTile: React.FC<IAnimatedAttributeTileProps> = React.memo(
  ({ label, value, status, delay = 0 }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 250,
        delay,
        useNativeDriver: true,
      }).start();
    }, [anim, delay]);

    const scale = anim.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0.85, 1.03, 1],
    });

    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 0],
    });

    const opacity = anim;

    const bgColor = status === 'correct' ? Colors.matchCorrect : Colors.surfaceLight;
    const textColor = status === 'correct' ? '#090909' : Colors.textPrimary;
    const labelColor = status === 'correct' ? '#090909' : Colors.textMuted;
    const borderColor = status === 'correct' ? Colors.matchCorrect : Colors.border;

    return (
      <Animated.View
        style={[
          styles.tile,
          {
            backgroundColor: bgColor,
            borderColor,
            opacity,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <Text style={[styles.tileLabel, { color: labelColor }]}>{label}</Text>
        <Text style={[styles.tileValue, { color: textColor }]} numberOfLines={1}>
          {value}
        </Text>
      </Animated.View>
    );
  }
);

AnimatedAttributeTile.displayName = 'AnimatedAttributeTile';

const styles = StyleSheet.create({
  tile: {
    width: '19%',
    aspectRatio: 0.92,
    borderRadius: BorderRadius.sharp,
    borderWidth: Borders.thin,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  tileLabel: {
    ...Typography.statBadge,
    fontSize: 8.5,
    marginBottom: 2,
    letterSpacing: 0.4,
  },
  tileValue: {
    ...Typography.statBadge,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});
