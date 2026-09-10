import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
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
    let isMounted = true;

    const loadDetails = async () => {
      try {
        const data = await fetchPersonalDetails();
        if (isMounted && data) {
          setDetails(data);
        }
      } catch (error: any) {
        if (isMounted) {
          Alert.alert('Error', 'Unable to load personal details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Account Information</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{details?.full_name || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{details?.email || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Member Since</Text>
              <Text style={styles.value}>
                {details?.created_at
                  ? new Date(details.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: theme.spacing.md || 16,
  },
  card: {
    backgroundColor: theme.colors.card || '#ffffff',
    borderRadius: 12,
    padding: theme.spacing.md || 16,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
    elevation: 1,
  },
  sectionHeader: {
    fontSize: theme.typography.fontSizes.md || 16,
    fontWeight: 'bold',
    color: theme.colors.text || '#111827',
    marginBottom: 16,
  },
  fieldGroup: {
    paddingVertical: 8,
  },
  label: {
    fontSize: theme.typography.fontSizes.xs || 12,
    color: theme.colors.textSecondary || '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: theme.typography.fontSizes.md || 15,
    color: theme.colors.text || '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border || '#f3f4f6',
    marginVertical: 4,
  },
});
