import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserProfile, fetchUserPosts } from '../../services/userService';
import { PostCard } from '../feed/PostCard';
import { theme } from '../../theme';

interface ProfileScreenProps {
  navigation: any;
  route?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const userId = route?.params?.userId;

  const loadProfileData = async () => {
    const profileData = await fetchUserProfile(userId);
    if (profileData) setProfile(profileData);
    const userPosts = await fetchUserPosts(userId);
    if (userPosts) setPosts(userPosts);
  };

  useEffect(() => {
    loadProfileData();
  }, [userId]);

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
                source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>{profile?.full_name}</Text>
            <Text style={styles.bio}>{profile?.bio || 'No bio available'}</Text>
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('PersonalDetails')}
              >
                <Text style={styles.secondaryButtonText}>About</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.navLinksRow}>
              <TouchableOpacity onPress={() => navigation.navigate('FriendsList')}>
                <Text style={styles.navLinkText}>Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ProfilePhotos')}>
                <Text style={styles.navLinkText}>Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('FriendRequests')}>
                <Text style={styles.navLinkText}>Requests</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => <PostCard post={item} onUpdate={loadProfileData} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.grayLight,
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
    backgroundColor: theme.colors.primary,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.grayLight,
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
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  navLinkText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.md,
  },
});
