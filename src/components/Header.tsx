import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

interface HeaderProps {
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

const CustomTransparentPlane = ({ size = 28, color = "#ff9900" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.5-.1-.9.1-1.2.4l-.6.6c-.3.3-.3.8 0 1.1l5.5 5.5-3.5 3.5-2.2-.7c-.3-.1-.7 0-.9.2l-.4.4c-.2.2-.2.6 0 .8l3.2 3.2c.2.2.6.2.8 0l.4-.4c.2-.2.3-.6.2-.9l-.7-2.2 3.5-3.5 5.5 5.5c.3.3.8.3 1.1 0l.6-.6c.3-.3.5-.7.4-1.2z" />
  </Svg>
);

export const Header: React.FC<HeaderProps> = ({ onSearchPress, onMenuPress }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.logoGroup}>
          <View style={styles.planeBox}>
            <View style={styles.iconWrapper}>
              <CustomTransparentPlane size={28} color="#ff9900" />
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
  iconWrapper: {
    transform: [{ rotate: '-45deg' }],
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
