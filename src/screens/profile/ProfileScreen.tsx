import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { fetchUserProfile, fetchUserPosts } from '../../services/userService';
import { PostCard } from '../feed/PostCard';
import { Loader } from '../../components/Loader';

interface ProfileScreenProps {
  navigation: any;
  route?: any;
}

const PAGE_SIZE = 10;

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);

  const userId = route?.params?.userId;

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await fetchUserProfile(userId);
      if (profileData) setProfile(profileData);

      const userPosts = await fetchUserPosts(userId, 1, PAGE_SIZE);
      if (userPosts) {
        setPosts(userPosts);
        setHasMorePosts(userPosts.length === PAGE_SIZE);
        setPage(1);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Unable to load profile data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMorePosts) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const newPosts = await fetchUserPosts(userId, nextPage, PAGE_SIZE);
      if (newPosts && newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage(nextPage);
        setHasMorePosts(newPosts.length === PAGE_SIZE);
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderProfileHeader = () => (
    <View style={styles.headerContainer}>
      {/* Cover Photo */}
      <View style={styles.coverContainer}>
        {profile?.cover_url ? (
          <Image source={{ uri: profile.cover_url }} style={styles.coverImage} />
        ) : (
          <View style={styles.defaultCoverPlaceholder}>
            <Ionicons name="image-outline" size={40} color="#8a8d91" />
          </View>
        )}
      </View>

      <View style={styles.profileHeaderContent}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatarPlaceholder}>
              <Ionicons name="person" size={40} color="#1c2b33" />
            </View>
          )}
        </View>

        {/* Name & Verification */}
        <View style={styles.nameBadgeRow}>
          <Text style={styles.userName}>{profile?.full_name || 'User Profile'}</Text>
          {profile?.is_verified && (
            <Ionicons name="checkmark-circle" size={18} color="#1877f2" style={styles.badgeIcon} />
          )}
        </View>

        <Text style={styles.postCountText}>
          {profile?.posts_count || posts.length} posts
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('CreatePost')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={18} color="#ffffff" style={styles.btnIcon} />
            <Text style={styles.primaryBtnText}>Add post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#050505" style={styles.btnIcon} />
            <Text style={styles.secondaryBtnText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Clean Info Section (Bio & Website only) */}
        {(profile?.bio || profile?.website || profile?.current_city) && (
          <View style={styles.infoCard}>
            {profile?.bio && (
              <View style={styles.infoRow}>
                <Ionicons name="information-circle-outline" size={18} color="#65676b" style={styles.infoIcon} />
                <Text style={styles.infoText} numberOfLines={2}>{profile.bio}</Text>
              </View>
            )}
            {profile?.current_city && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#65676b" style={styles.infoIcon} />
                <Text style={styles.infoText}>Lives in {profile.current_city}</Text>
              </View>
            )}
            {profile?.website && (
              <View style={styles.infoRow}>
                <Ionicons name="link-outline" size={18} color="#65676b" style={styles.infoIcon} />
                <Text style={styles.linkText} numberOfLines={1}>{profile.website}</Text>
              </View>
            )}
          </View>
        )}

        {/* Create Post Shortcut Box */}
        <View style={styles.createPostBox}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.smallAvatar} />
          ) : (
            <View style={styles.defaultSmallAvatarPlaceholder}>
              <Ionicons name="person" size={18} color="#1c2b33" />
            </View>
          )}
          <TouchableOpacity
            style={styles.postInputPlaceholder}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.placeholderText}>What's on your mind?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
            <Ionicons name="images-outline" size={22} color="#45bd62" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title={profile?.full_name || 'Profile'}
          onSearchPress={() => navigation.navigate('GlobalSearch')}
          onMenuPress={() => navigation.navigate('Menu')}
        />
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderProfileHeader()}
          renderItem={({ item }) => <PostCard post={item} onUpdate={loadProfileData} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#1877f2']} />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#1877f2" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={42} color="#ccd0d5" />
              <Text style={styles.emptyText}>No posts shared yet.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  coverContainer: {
    height: 150,
    width: '100%',
    backgroundColor: '#e4e6eb',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  defaultCoverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e4e6eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarWrapper: {
    marginTop: -40,
    alignSelf: 'flex-start',
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    width: 88,
    height: 88,
    overflow: 'hidden',
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  defaultAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e4e6eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050505',
  },
  badgeIcon: {
    marginLeft: 6,
  },
  postCountText: {
    fontSize: 13,
    color: '#65676b',
    marginTop: 1,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#1877f2',
    height: 38,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#e4e6eb',
    height: 38,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  secondaryBtnText: {
    color: '#050505',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnIcon: {
    marginRight: 6,
  },
  infoCard: {
    backgroundColor: '#f7f8fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#050505',
    flex: 1,
  },
  linkText: {
    fontSize: 14,
    color: '#1877f2',
    flex: 1,
  },
  createPostBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  defaultSmallAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e4e6eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postInputPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginRight: 10,
  },
  placeholderText: {
    color: '#65676b',
    fontSize: 14,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#65676b',
    fontSize: 14,
    marginTop: 8,
  },
});
