import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface LoaderProps {
  text?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  const moveAnim = useRef(new Animated.Value(-140)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const smokeOpacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const flightLoop = Animated.loop(
      Animated.timing(moveAnim, {
        toValue: screenWidth + 140,
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
            <Ionicons name="airplane" size={64} color="#002244" />
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
    height: 80,
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
    width: 40,
    height: 3,
    backgroundColor: '#1B365D',
    borderRadius: 1.5,
    opacity: 0.6,
  },
  smokeParticleSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(27, 54, 93, 0.5)',
    marginRight: -2,
  },
  smokeParticleMedium: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: 'rgba(27, 54, 93, 0.35)',
    marginRight: -3,
  },
  smokeParticleLarge: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'rgba(27, 54, 93, 0.2)',
    marginRight: -4,
  },
  planeIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  engineGlow: {
    position: 'absolute',
    bottom: 20,
    left: 22,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1B365D',
    opacity: 0.9,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#002244',
  },
});
