import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchPersonalDetails } from '../../services/userService';
import { theme } from '../../theme';

interface PersonalDetailsScreenProps {
  navigation: any;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ navigation }) => {
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    fetchPersonalDetails().then((data) => setDetails(data));
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Personal Details"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.content}>
        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.value}>{details?.email || 'N/A'}</Text>
        <Text style={styles.label}>Joined Date</Text>
        <Text style={styles.value}>{details?.created_at ? new Date(details.created_at).toLocaleDateString() : 'N/A'}</Text>
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
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
});
