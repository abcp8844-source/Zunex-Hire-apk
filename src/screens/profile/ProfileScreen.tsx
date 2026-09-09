import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserProfile, fetchUserPosts } from '../../services/userService';
import { PostCard } from '../feed/PostCard';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface ProfileScreenProps {
  navigation: any;
  route?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = route?.params?.userId;

  const loadProfileData = useCallback(async () => {
    try {
      const profileData = await fetchUserProfile(userId);
      if (profileData) setProfile(profileData);
      
      const userPosts = await fetchUserPosts(userId);
      if (userPosts) setPosts(userPosts);
    } catch (error: any) {
      Alert.alert('Error', 'Unable to load profile data.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Profile"
          onSearchPress={() => navigation.navigate('GlobalSearch')}
          onMenuPress={() => navigation.navigate('Menu')}
        />
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={profile?.full_name || 'Profile'}
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profile?.avatar_url }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>{profile?.full_name}</Text>
            <Text style={styles.bio}>{profile?.bio || 'No bio available'}</Text>
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('EditProfile', {
                  currentName: profile?.full_name,
                  currentBio: profile?.bio,
                  currentAvatar: profile?.avatar_url,
                })}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('PersonalDetails')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>About</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.navLinksRow}>
              <TouchableOpacity onPress={() => navigation.navigate('FriendsList')} activeOpacity={0.7}>
                <Text style={styles.navLinkText}>Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ProfilePhotos')} activeOpacity={0.7}>
                <Text style={styles.navLinkText}>Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('FriendRequests')} activeOpacity={0.7}>
                <Text style={styles.navLinkText}>Requests</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => <PostCard post={item} onUpdate={loadProfileData} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts shared yet.</Text>
          </View>
        }
      />
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
  headerContainer: {
    backgroundColor: theme.colors.card || '#ffffff',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e5e7eb',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary || '#1e293b',
    backgroundColor: theme.colors.grayLight || '#f3f4f6',
  },
  name: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  bio: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: theme.colors.primary || '#1e293b',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.grayLight || '#f3f4f6',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
  navLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || '#e5e7eb',
    paddingTop: theme.spacing.md,
  },
  navLinkText: {
    color: theme.colors.primary || '#1e293b',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.md,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.md,
  },
});
