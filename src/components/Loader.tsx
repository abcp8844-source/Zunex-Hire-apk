import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoaderProps {
  text?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  const moveAnim = useRef(new Animated.Value(-260)).current;
  const planeBounce = useRef(new Animated.Value(0)).current;
  const bannerWave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const moveAnimation = Animated.loop(
      Animated.timing(moveAnim, {
        toValue: screenWidth + 260,
        duration: 5500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(planeBounce, {
          toValue: -6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(planeBounce, {
          toValue: 5,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(planeBounce, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    const waveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bannerWave, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(bannerWave, {
          toValue: -1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bannerWave, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ])
    );

    moveAnimation.start();
    bounceAnimation.start();
    waveAnimation.start();

    return () => {
      moveAnimation.stop();
      bounceAnimation.stop();
      waveAnimation.stop();
    };
  }, []);

  const bannerRotate = bannerWave.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const bannerY = bannerWave.interpolate({
    inputRange: [-1, 1],
    outputRange: [-3, 3],
  });

  return (
    <View style={styles.container}>
      <View style={styles.trackBox}>
        <Animated.View
          style={[
            styles.flightGroup,
            {
              transform: [
                { translateX: moveAnim },
                { translateY: planeBounce },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.bannerContainer,
              {
                transform: [
                  { rotate: bannerRotate },
                  { translateY: bannerY },
                ],
              },
            ]}
          >
            <View style={styles.bannerBox}>
              <Ionicons name="sparkles" size={14} color="#fbbf24" />
              <Text style={styles.bannerBrand}>ZUNEXHIRE</Text>
              <View style={styles.divider} />
              <Text style={styles.bannerText}>
                {text || 'HOLD ON, PREPARING FLIGHT... 🚀'}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.ropeContainer}>
            <View style={styles.ropeLine} />
            <View style={styles.ropeLine} />
          </View>

          <View style={styles.planeWrapper}>
            <Ionicons name="airplane" size={48} color="#0f172a" />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(241, 245, 249, 0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  trackBox: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerBox: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  bannerBrand: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: '#334155',
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ropeContainer: {
    width: 18,
    height: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  ropeLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#94a3b8',
  },
  planeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
