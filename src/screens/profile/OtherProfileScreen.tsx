import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Loader } from '../../components/Loader';
import { Header } from '../../components/Header';
import { fetchUserProfile, fetchUserPosts } from '../../services/userService';
import { PostCard } from '../feed/PostCard';

interface OtherProfileScreenProps {
  navigation: any;
  route: any;
}

const PAGE_SIZE = 10;
const { width } = Dimensions.get('window');
const COVER_ASPECT_RATIO = 16 / 9;

export const OtherProfileScreen: React.FC<OtherProfileScreenProps> = ({ navigation, route }) => {
  const targetUserId = route?.params?.userId;

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);

  const [friendStatus, setFriendStatus] = useState<'none' | 'pending'>('none');
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const loadProfileData = useCallback(async () => {
    if (!targetUserId) {
      Alert.alert('Error', 'User id missing.');
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      const profileData = await fetchUserProfile(targetUserId);
      if (profileData) {
        setProfile(profileData);
        setFriendStatus(profileData.friend_status === 'pending' ? 'pending' : 'none');
      }

      const userPosts = await fetchUserPosts(targetUserId, 1, PAGE_SIZE);
      if (userPosts) {
        setPosts(userPosts);
        setHasMorePosts(userPosts.length === PAGE_SIZE);
        setPage(1);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to load profile.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [targetUserId, navigation]);

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
      const newPosts = await fetchUserPosts(targetUserId, nextPage, PAGE_SIZE);
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

  const handleToggleFriendRequest = async () => {
    try {
      setActionLoading(true);
      setFriendStatus((prev) => (prev === 'none' ? 'pending' : 'none'));
    } catch (error) {
      Alert.alert('Error', 'Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const renderProfileHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.coverContainer}>
        {profile?.cover_url ? (
          <Image source={{ uri: profile.cover_url }} style={styles.coverImage} resizeMode="cover" />
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
              <Ionicons name="person" size={40} color="#1c2b33" />
            </View>
          )}
        </View>

        <View style={styles.nameBadgeRow}>
          <Text style={styles.userName}>{profile?.full_name || 'User Profile'}</Text>
          {profile?.is_verified && (
            <Ionicons name="checkmark-circle" size={18} color="#1877f2" style={styles.badgeIcon} />
          )}
        </View>

        <Text style={styles.postCountText}>
          {profile?.posts_count || posts.length} posts
        </Text>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              friendStatus === 'pending' && styles.pendingBtn,
            ]}
            onPress={handleToggleFriendRequest}
            disabled={actionLoading}
            activeOpacity={0.8}
          >
            {actionLoading ? (
              <Loader />
            ) : (
              <>
                <Ionicons
                  name={friendStatus === 'none' ? 'person-add-outline' : 'close-circle-outline'}
                  size={18}
                  color={friendStatus === 'pending' ? '#050505' : '#ffffff'}
                  style={styles.btnIcon}
                />
                <Text
                  style={[
                    styles.primaryBtnText,
                    friendStatus === 'pending' && styles.pendingBtnText,
                  ]}
                >
                  {friendStatus === 'none' ? 'Add Friend' : 'Cancel Request'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

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
                <Loader />
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
    width: width,
    height: width / COVER_ASPECT_RATIO,
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
    marginTop: -44,
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
    borderRadius: 44,
  },
  defaultAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
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
  },
  pendingBtn: {
    backgroundColor: '#e4e6eb',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pendingBtnText: {
    color: '#050505',
  },
  btnIcon: {
    marginRight: 6,
  },
  infoCard: {
    backgroundColor: '#f7f8fa',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
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
