import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

interface HeaderProps {
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

const ExactOriginalPlane = ({ size = 26, color = '#ff9900' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </Svg>
);

export const Header: React.FC<HeaderProps> = ({ onSearchPress, onMenuPress }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.logoGroup}>
          <View style={styles.planeBox}>
            <View style={styles.planeWrapper}>
              <ExactOriginalPlane size={26} color="#ff9900" />
            </View>
          </View>
          <Text style={styles.brandTitle}>
            Zunex<Text style={styles.brandAccent}>Hire</Text>
          </Text>
        </View>

        <View style={styles.actionGroup}>
          {onSearchPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onSearchPress} activeOpacity={0.8}>
              <Ionicons name="search-outline" size={20} color="#003399" />
            </TouchableOpacity>
          )}
          {onMenuPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onMenuPress} activeOpacity={0.8}>
              <Ionicons name="menu-outline" size={22} color="#003399" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 51, 153, 0.08)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    zIndex: 50,
  },
  container: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planeBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#003399',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    transform: [{ rotate: '6deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  planeWrapper: {
    transform: [{ rotate: '45deg' }],
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: '#003399',
    letterSpacing: -1,
  },
  brandAccent: {
    color: '#ff9900',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
