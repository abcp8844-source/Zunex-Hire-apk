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
        <View style={styles.avatarWrapper}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatarPlaceholder}>
              <Ionicons name="person" size={50} color="#1c2b33" />
            </View>
          )}
        </View>

        <View style={styles.nameBadgeRow}>
          <Text style={styles.userName}>{profile?.full_name || 'Zunexhire User'}</Text>
          {profile?.is_verified && (
            <Ionicons name="checkmark-circle" size={20} color="#1877f2" style={styles.badgeIcon} />
          )}
        </View>

        <Text style={styles.postCountText}>
          {profile?.posts_count || posts.length} posts
        </Text>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('CreatePost')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={18} color="#ffffff" style={styles.btnIcon} />
            <Text style={styles.primaryBtnText}>Add post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() =>
              navigation.navigate('EditProfile', {
                currentName: profile?.full_name,
                currentBio: profile?.bio,
                currentAvatar: profile?.avatar_url,
              })
            }
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#050505" style={styles.btnIcon} />
            <Text style={styles.secondaryBtnText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterTabsRow}>
          <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
            <Text style={styles.filterTabActiveText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterTab}
            onPress={() => navigation.navigate('ProfilePhotos', { userId })}
          >
            <Text style={styles.filterTabText}>Photos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal details</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PersonalDetails')}>
              <Ionicons name="pencil-outline" size={18} color="#65676b" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cake-outline" size={20} color="#050505" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {profile?.dob || 'Not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PersonalDetails')}>
              <Ionicons name="pencil-outline" size={18} color="#65676b" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subCategoryTitle}>Sports teams and athletes</Text>
          <View style={styles.linkRow}>
            <Ionicons name="shirt-outline" size={18} color="#65676b" style={styles.infoIcon} />
            <Text style={styles.linkText}>{profile?.sports_link || 'zunexhire.com'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Links</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PersonalDetails')}>
              <Ionicons name="pencil-outline" size={18} color="#65676b" />
            </TouchableOpacity>
          </View>
          <View style={styles.linkRow}>
            <Ionicons name="link-outline" size={18} color="#65676b" style={styles.infoIcon} />
            <Text style={styles.linkText}>{profile?.website || 'zunexhire.com'}</Text>
          </View>
        </View>

        <View style={styles.friendsHeaderRow}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FriendsList', { userId })}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.createPostBox}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.smallAvatar} />
          ) : (
            <View style={styles.defaultSmallAvatarPlaceholder}>
              <Ionicons name="person" size={20} color="#1c2b33" />
            </View>
          )}
          <TouchableOpacity
            style={styles.postInputPlaceholder}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.placeholderText}>What's on your mind?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
            <Ionicons name="images-outline" size={24} color="#45bd62" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
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
  },
  coverContainer: {
    height: 180,
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
    paddingBottom: 12,
  },
  avatarWrapper: {
    marginTop: -50,
    alignSelf: 'flex-start',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  defaultAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e4e6eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#050505',
  },
  badgeIcon: {
    marginLeft: 6,
  },
  postCountText: {
    fontSize: 14,
    color: '#65676b',
    marginTop: 2,
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
    borderRadius: 6,
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
    borderRadius: 6,
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
  filterTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    paddingBottom: 8,
    marginBottom: 12,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e4e6eb',
  },
  filterTabActive: {
    backgroundColor: '#e7f3ff',
  },
  filterTabActiveText: {
    color: '#1877f2',
    fontWeight: 'bold',
  },
  filterTabText: {
    color: '#050505',
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#050505',
  },
  subCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#050505',
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#1877f2',
  },
  friendsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  seeAllText: {
    color: '#1877f2',
    fontSize: 14,
    fontWeight: '600',
  },
  createPostBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e4e6eb',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  defaultSmallAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingHorizontal: 12,
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
