import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { fetchPersonalDetails } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface PersonalDetailsScreenProps {
  navigation: any;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ navigation }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await fetchPersonalDetails();
        if (data) setDetails(data);
      } catch (error: any) {
        Alert.alert('Error', 'Unable to load personal details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Personal Details"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{details?.email || 'N/A'}</Text>

          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{details?.full_name || 'N/A'}</Text>

          <Text style={styles.label}>Joined Date</Text>
          <Text style={styles.value}>
            {details?.created_at ? new Date(details.created_at).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#f9fafb',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: theme.colors.card || '#ffffff',
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
  },
  label: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
});
