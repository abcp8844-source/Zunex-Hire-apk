import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchPress, onMenuPress }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.leftGroup}>
          <View style={styles.planeBox}>
            <Ionicons name="airplane" size={20} color="#ff9900" />
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.brandTitle}>
              Zunex<Text style={styles.brandAccent}>Hire</Text>
            </Text>
            <Text style={styles.brandSubtitle}>
              GLOBAL JOB VISA <Text style={styles.subtitleAccent}>& TRAVEL GUIDES</Text>
            </Text>
          </View>
        </View>

        <View style={styles.actionGroup}>
          {onSearchPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onSearchPress} activeOpacity={0.8}>
              <Ionicons name="search-outline" size={20} color="#0000ff" />
            </TouchableOpacity>
          )}
          {onMenuPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onMenuPress} activeOpacity={0.8}>
              <Ionicons name="menu-outline" size={22} color="#0000ff" />
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
    borderBottomColor: 'rgba(0, 0, 255, 0.05)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    zIndex: 50,
  },
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planeBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0000ff',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '6deg' }],
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  titleWrapper: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: '#0000ff',
    letterSpacing: -1,
  },
  brandAccent: {
    color: '#ff9900',
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#0000ff',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  subtitleAccent: {
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
