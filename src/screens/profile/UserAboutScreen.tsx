import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserProfile } from '../../services/userService';
import { theme } from '../../theme';

interface UserAboutScreenProps {
  navigation: any;
}

export const UserAboutScreen: React.FC<UserAboutScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile().then((data) => setProfile(data));
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="About"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.content}>
        <Text style={styles.label}>Overview</Text>
        <Text style={styles.value}>{profile?.bio || 'No bio provided'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
});
