import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface LoaderProps {
  text?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  const moveAnim = useRef(new Animated.Value(-120)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const smokeOpacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const flightLoop = Animated.loop(
      Animated.timing(moveAnim, {
        toValue: screenWidth + 120,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 2,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    const smokeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(smokeOpacityAnim, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(smokeOpacityAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    flightLoop.start();
    floatLoop.start();
    smokeLoop.start();

    return () => {
      flightLoop.stop();
      floatLoop.stop();
      smokeLoop.stop();
    };
  }, [moveAnim, floatAnim, smokeOpacityAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.trackBox}>
        <Animated.View
          style={[
            styles.airplaneWrapper,
            {
              transform: [
                { translateX: moveAnim },
                { translateY: floatAnim },
              ],
            },
          ]}
        >
          <Animated.View style={[styles.smokeContainer, { opacity: smokeOpacityAnim }]}>
            <View style={styles.smokeParticleLarge} />
            <View style={styles.smokeParticleMedium} />
            <View style={styles.smokeParticleSmall} />
            <View style={styles.smokeLine} />
          </Animated.View>

          <View style={styles.planeIconContainer}>
            <Ionicons name="airplane" size={56} color="#1877f2" />
            <View style={styles.engineGlow} />
          </View>
        </Animated.View>
      </View>

      {text ? <Text style={styles.loadingText}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  trackBox: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  airplaneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smokeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -12,
  },
  smokeLine: {
    width: 35,
    height: 2,
    backgroundColor: '#00d2ff',
    borderRadius: 1,
    opacity: 0.5,
  },
  smokeParticleSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
    marginRight: -2,
  },
  smokeParticleMedium: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    marginRight: -3,
  },
  smokeParticleLarge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    marginRight: -4,
  },
  planeIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  engineGlow: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#38bdf8',
    opacity: 0.8,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: theme?.colors?.primary || '#1877f2',
  },
});
