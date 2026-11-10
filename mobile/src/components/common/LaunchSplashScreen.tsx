import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  StatusBar,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius, Borders } from '../../theme/spacing';

interface ILaunchSplashScreenProps {
  isReady: boolean;
  onFinish: () => void;
}

export const LaunchSplashScreen: React.FC<ILaunchSplashScreenProps> = React.memo(
  ({ isReady, onFinish }) => {
    // Logo scale & opacity
    const logoScale = useRef(new Animated.Value(0.65)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;

    // Tactical pitch center-circle pulse rings
    const ring1Scale = useRef(new Animated.Value(0.5)).current;
    const ring1Opacity = useRef(new Animated.Value(0)).current;
    const ring2Scale = useRef(new Animated.Value(0.5)).current;
    const ring2Opacity = useRef(new Animated.Value(0)).current;

    // Title & subtitle entrance
    const textTranslateY = useRef(new Animated.Value(18)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    // Progress bar sweep (0 -> 1 scaleX)
    const progressScaleX = useRef(new Animated.Value(0)).current;

    // Overall screen fade-out & subtle zoom
    const containerOpacity = useRef(new Animated.Value(1)).current;
    const containerScale = useRef(new Animated.Value(1)).current;

    const minTimeElapsedRef = useRef(false);
    const isReadyRef = useRef(isReady);
    const hasTriggeredExitRef = useRef(false);

    const triggerExitIfReady = () => {
      if (hasTriggeredExitRef.current) return;
      if (!minTimeElapsedRef.current || !isReadyRef.current) return;

      hasTriggeredExitRef.current = true;

      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(containerScale, {
          toValue: 1.06,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    };

    useEffect(() => {
      isReadyRef.current = isReady;
      triggerExitIfReady();
    }, [isReady]);

    useEffect(() => {
      // 1. Logo spring entrance + text slide-up + progress bar fill
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(180),
          Animated.parallel([
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 420,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(textTranslateY, {
              toValue: 0,
              duration: 420,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(progressScaleX, {
          toValue: 1,
          duration: 1350,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Concentric stadium radar pulse rings
      const createRingPulse = (scaleVal: Animated.Value, opacityVal: Animated.Value, delayMs: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delayMs),
            Animated.parallel([
              Animated.timing(scaleVal, {
                toValue: 2.15,
                duration: 1400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(opacityVal, {
                  toValue: 0.45,
                  duration: 250,
                  useNativeDriver: true,
                }),
                Animated.timing(opacityVal, {
                  toValue: 0,
                  duration: 1150,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }),
              ]),
            ]),
            Animated.timing(scaleVal, {
              toValue: 0.5,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );

      const pulse1 = createRingPulse(ring1Scale, ring1Opacity, 80);
      const pulse2 = createRingPulse(ring2Scale, ring2Opacity, 520);
      pulse1.start();
      pulse2.start();

      const timer = setTimeout(() => {
        minTimeElapsedRef.current = true;
        triggerExitIfReady();
      }, 1450);

      return () => {
        clearTimeout(timer);
        pulse1.stop();
        pulse2.stop();
      };
    }, []);

    return (
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: containerOpacity,
            transform: [{ scale: containerScale }],
          },
        ]}
        pointerEvents="auto"
      >
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

        {/* Top Volt Accent Line */}
        <View style={styles.topAccentBar} />

        <View style={styles.centerContent}>
          {/* Radar / Pitch Center Circle Pulse Rings */}
          <View style={styles.logoStage}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: ring1Opacity,
                  transform: [{ scale: ring1Scale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.pulseRing,
                styles.pulseRingSecondary,
                {
                  opacity: ring2Opacity,
                  transform: [{ scale: ring2Scale }],
                },
              ]}
            />

            {/* Logo Badge Frame */}
            <Animated.View
              style={[
                styles.logoBadge,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              <Image
                source={require('../../assets/doksandakika.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Brand Title & Match Clock */}
          <Animated.View
            style={[
              styles.textBlock,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>DOKSAN DAKİKA</Text>
              <View style={styles.liveDot} />
            </View>
            <Text style={styles.brandSubtitle}>FUTBOL TRIVIA ARENASI</Text>

            {/* Kick-off Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.matchClockRow}>
                <Text style={styles.matchClockLabel}>BAŞLAMA VURUŞU</Text>
                <Text style={styles.matchClockValue}>90&apos;+</Text>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      transform: [{ scaleX: progressScaleX }],
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Borders.thick,
    backgroundColor: Colors.accentPrimary,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoStage: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.accentPrimary,
  },
  pulseRingSecondary: {
    borderWidth: 1.5,
    borderColor: Colors.accentHover,
  },
  logoBadge: {
    width: 118,
    height: 118,
    borderRadius: 28,
    backgroundColor: '#090C10',
    borderWidth: 2,
    borderColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  logoImage: {
    width: 88,
    height: 88,
  },
  textBlock: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  liveDot: {
    width: 9,
    height: 9,
    borderRadius: BorderRadius.sharp,
    backgroundColor: Colors.accentPrimary,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 3,
    marginBottom: 28,
  },
  progressSection: {
    width: 210,
  },
  matchClockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  matchClockLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.4,
  },
  matchClockValue: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.accentPrimary,
    letterSpacing: 1,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sharp,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.accentPrimary,
  },
});
