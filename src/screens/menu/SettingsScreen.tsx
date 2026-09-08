import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { theme } from '../../theme';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Push Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
});
