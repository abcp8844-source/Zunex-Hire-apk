import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface LoaderProps {
  text?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  const moveAnim = useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(moveAnim, {
        toValue: screenWidth + 40,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [moveAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.trackBox}>
        <Animated.View style={{ transform: [{ translateX: moveAnim }] }}>
          <Ionicons name="airplane" size={28} color="#1e3a8a" />
        </Animated.View>
      </View>
      {text ? <Text style={styles.loadingText}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  trackBox: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#1e3a8a',
  },
});
