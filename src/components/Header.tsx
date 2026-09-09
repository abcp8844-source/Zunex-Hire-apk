import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface HeaderProps {
  onSearchPress?: () => void;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchPress, onMenuPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconBox}>
          <Ionicons name="airplane" size={18} color={theme.colors.accent || '#fff'} />
        </View>
        <Text style={styles.brandText}>
          Zunex<Text style={styles.brandSubText}>Hire</Text>
        </Text>
      </View>

      <View style={styles.actions}>
        {onSearchPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onSearchPress} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        {onMenuPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onMenuPress} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: theme.colors.card || '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary || '#0000ff',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '6deg' }],
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: theme.colors.primary || '#0000ff',
    letterSpacing: -0.5,
  },
  brandSubText: {
    color: theme.colors.accent || '#ff9900',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 38,
    height: 38,
    backgroundColor: theme.colors.background || '#f3f4f6',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
  },
});
