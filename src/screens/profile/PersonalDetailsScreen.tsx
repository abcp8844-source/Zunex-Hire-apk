import { Loader } from '../../components/Loader';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { fetchPersonalDetails } from '../../services/userService';
import { theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface PersonalDetailsScreenProps {
  navigation: any;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ navigation }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchPersonalDetails()
      .then((data) => {
        if (isMounted) setDetails(data);
      })
      .catch(() => {
        if (isMounted) Alert.alert('Error', 'Personal details load nahi ho sake.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

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
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.fieldRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary || '#65676b'} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{details?.full_name || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary || '#65676b'} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.value}>{details?.email || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary || '#65676b'} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.label}>Joined Date</Text>
                <Text style={styles.value}>
                  {details?.created_at ? new Date(details.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="pencil-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.editButtonText}>Edit Profile Details</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#f0f2f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.card || '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e4e6eb',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text || '#050505',
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fieldContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary || '#65676b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    color: theme.colors.text || '#050505',
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border || '#e4e6eb',
    marginVertical: 12,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#1877f2',
    height: 44,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
