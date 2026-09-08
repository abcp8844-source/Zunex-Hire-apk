import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../components/Header';
import { handleLogout } from './LogoutHandler';
import { theme } from '../../theme';

interface MenuScreenProps {
  navigation: any;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Menu"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => {}}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileText}>View Your Profile</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.menuText}>⚙️ Settings & Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ActivityLog')}
          >
            <Text style={styles.menuText}>📜 Activity Log</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('BlockedUsers')}
          >
            <Text style={styles.menuText}>🚫 Blocked Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <Text style={styles.menuText}>❓ Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout(navigation)}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.md,
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  profileText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.notification,
    fontWeight: 'bold',
  },
});
