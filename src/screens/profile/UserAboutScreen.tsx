import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserProfile } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface UserAboutScreenProps {
  navigation: any;
}

export const UserAboutScreen: React.FC<UserAboutScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await fetchUserProfile();
        if (data) setProfile(data);
      } catch (error: any) {
        Alert.alert('Error', 'Unable to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="About"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>

            <View style={styles.row}>
              <Ionicons name="person-outline" size={20} color={theme.colors.primary || '#1e293b'} style={styles.icon} />
              <View>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{profile?.full_name || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.primary || '#1e293b'} style={styles.icon} />
              <View>
                <Text style={styles.label}>Bio</Text>
                <Text style={styles.value}>{profile?.bio || 'No bio provided'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="briefcase-outline" size={20} color={theme.colors.primary || '#1e293b'} style={styles.icon} />
              <View>
                <Text style={styles.label}>Work</Text>
                <Text style={styles.value}>{profile?.work || 'No workplace added'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="school-outline" size={20} color={theme.colors.primary || '#1e293b'} style={styles.icon} />
              <View>
                <Text style={styles.label}>Education</Text>
                <Text style={styles.value}>{profile?.education || 'No education added'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary || '#1e293b'} style={styles.icon} />
              <View>
                <Text style={styles.label}>Current City</Text>
                <Text style={styles.value}>{profile?.city || 'No city added'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="heart-outline" size={20} color={theme.colors.primary || '#1e293b'} style={styles.icon} />
              <View>
                <Text style={styles.label}>Relationship Status</Text>
                <Text style={styles.value}>{profile?.relationship || 'Not specified'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary || '#1e293b'} style={styles.icon} />
              <View>
                <Text style={styles.label}>Joined Date</Text>
                <Text style={styles.value}>
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
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
  scrollContainer: {
    padding: theme.spacing.md,
  },
  section: {
    backgroundColor: theme.colors.card || '#ffffff',
    borderRadius: 8,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e5e7eb',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    fontWeight: '500',
    marginTop: 2,
  },
});
