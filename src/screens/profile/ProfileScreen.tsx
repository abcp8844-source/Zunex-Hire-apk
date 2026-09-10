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
            <View style={styles.coverWrapper}>
              <Image
                source={{ uri: profile?.cover_url || 'https://via.placeholder.com/800x300' }}
                style={styles.coverImage}
              />
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }}
                  style={styles.avatar}
                />
                {profile?.note ? (
                  <View style={styles.noteBubble}>
                    <Text style={styles.noteText} numberOfLines={1}>{profile.note}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
                {profile?.is_verified ? <Text style={styles.verifiedBadge}>✓</Text> : null}
              </View>
              
              <Text style={styles.postCount}>{posts.length} posts</Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('CreateStory')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>+ Add to story</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('EditProfile', { profile })}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>✏️ Edit profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabRow}>
              <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
                <Text style={[styles.tabText, styles.activeTabText]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ProfilePhotos', { userId: profile?.id })}>
                <Text style={styles.tabText}>Photos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
              {profile?.dob ? (
                <View style={styles.detailBlock}>
                  <View style={styles.detailHeader}>
                    <Text style={styles.detailTitle}>Personal details</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('PersonalDetails')}>
                      <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.detailValue}>🎂 {profile.dob}</Text>
                </View>
              ) : null}

              {profile?.interests && profile.interests.length > 0 ? (
                <View style={styles.detailBlock}>
                  <View style={styles.detailHeader}>
                    <Text style={styles.detailTitle}>Interests</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                      <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.detailValue}>
                    {Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests}
                  </Text>
                </View>
              ) : null}

              {profile?.links && profile.links.length > 0 ? (
                <View style={styles.detailBlock}>
                  <View style={styles.detailHeader}>
                    <Text style={styles.detailTitle}>Links</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                      <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                  </View>
                  {profile.links.map((link: string, idx: number) => (
                    <Text key={idx} style={[styles.detailValue, styles.linkText]}>🔗 {link}</Text>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.friendsSection}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>Friends</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FriendsList', { userId: profile?.id })}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.createPostBox}>
              <Image source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }} style={styles.smallAvatar} />
              <TouchableOpacity style={styles.inputPlaceholder} onPress={() => navigation.navigate('CreatePost')}>
                <Text style={styles.placeholderText}>What's on your mind?</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => <PostCard post={item} currentUserId={profile?.id} onUpdate={loadProfileData} navigation={navigation} />}
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
    backgroundColor: theme.colors.background || '#f0f2f5',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: theme.colors.card || '#ffffff',
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  coverWrapper: {
    width: '100%',
    height: 160,
    backgroundColor: '#e4e6eb',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -40,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#e4e6eb',
  },
  noteBubble: {
    position: 'absolute',
    top: -15,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e6eb',
    elevation: 2,
  },
  noteText: {
    fontSize: 11,
    color: theme.colors.text,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  verifiedBadge: {
    backgroundColor: '#1877f2',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    borderRadius: 9,
    width: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: 18,
    marginLeft: 6,
    overflow: 'hidden',
  },
  postCount: {
    fontSize: 13,
    color: theme.colors.textSecondary || '#65676b',
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1877f2',
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e4e6eb',
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#050505',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#1877f2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65676b',
  },
  activeTabText: {
    color: '#1877f2',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  detailBlock: {
    marginBottom: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  detailValue: {
    fontSize: 14,
    color: '#050505',
    marginTop: 4,
  },
  linkText: {
    color: '#1877f2',
  },
  editIcon: {
    fontSize: 14,
  },
  friendsSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  seeAllText: {
    color: '#1877f2',
    fontSize: 14,
    fontWeight: '600',
  },
  createPostBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e4e6eb',
    marginTop: 8,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  inputPlaceholder: {
    flex: 1,
  },
  placeholderText: {
    fontSize: 15,
    color: '#65676b',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
});
