import { Loader } from '../../components/Loader';
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { interpolate } from 'react-native-reanimated';
import { Header } from '../../components/Header';
import { PostCard } from './PostCard';
import { CreatePostScreen } from './CreatePostScreen';
import { fetchFeedPosts } from '../../services/postService';
import { getCurrentUserProfile } from '../../services/userService';
import { Ionicons } from '@expo/vector-icons';

interface FeedScreenProps {
  navigation: any;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PAGE_SIZE = 10;

export const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (pageNumber: number = 0, isRefresh: boolean = false) => {
    if (loading || loadingMore) return;

    if (isRefresh) {
      setRefreshing(true);
    } else if (pageNumber === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await fetchFeedPosts(pageNumber, PAGE_SIZE);
      if (data && data.length > 0) {
        setPosts((prevPosts) => (isRefresh || pageNumber === 0 ? data : [...prevPosts, ...data]));
        setHasMore(data.length === PAGE_SIZE);
        setPage(pageNumber);
      } else {
        if (isRefresh || pageNumber === 0) setPosts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setHasMore(true);
    loadPosts(0, true);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading && !refreshing) {
      loadPosts(page + 1);
    }
  };

  const loadProfile = async () => {
    try {
      const userProfile = await getCurrentUserProfile();
      if (userProfile) {
        setCurrentUser(userProfile);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPosts(0);
    loadProfile();
  }, []);

  const render3DPostItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.cardWrapper}>
        <PostCard
          post={item}
          currentUserId={currentUser?.id || ''}
          onUpdate={() => loadPosts(0, true)}
          navigation={navigation}
        />
      </View>
    ),
    [currentUser?.id, navigation]
  );

  return (
    <View style={styles.container}>
      <Header
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      <View style={styles.createPostBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile', { userId: currentUser?.id })}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: currentUser?.avatar_url || 'https://via.placeholder.com/150',
            }}
            style={styles.userAvatar}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createPostInput}
          onPress={() => setIsCreatingPost(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.createPostText}>What's on your mind?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaIconBtn}
          onPress={() => setIsCreatingPost(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="images" size={24} color="#45bd62" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing && posts.length === 0 ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <View style={styles.carouselWrapper}>
          <Carousel
            loop={false}
            vertical={true}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT * 0.72}
            data={posts}
            scrollAnimationDuration={600}
            onSnapToItem={(index) => {
              if (index >= posts.length - 2 && hasMore) {
                handleLoadMore();
              }
            }}
            customAnimation={(value: number) => {
              'worklet';
              const translateY = interpolate(
                value,
                [-1, 0, 1],
                [-SCREEN_HEIGHT * 0.38, 0, SCREEN_HEIGHT * 0.38]
              );
              const scale = interpolate(value, [-1, 0, 1], [0.82, 1, 0.82]);
              const opacity = interpolate(value, [-1, 0, 1], [0.35, 1, 0.35]);
              const rotateX = `${interpolate(value, [-1, 0, 1], [48, 0, -48])}deg`;

              return {
                transform: [{ translateY }, { scale }, { rotateX }],
                opacity,
              };
            }}
            renderItem={render3DPostItem}
          />
        </View>
      )}

      {isCreatingPost && (
        <CreatePostScreen
          onClose={() => setIsCreatingPost(false)}
          onPostCreated={() => {
            setIsCreatingPost(false);
            loadPosts(0, true);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9ccd1',
  },
  createPostBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e4e6eb',
  },
  createPostInput: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ced0d4',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  createPostText: {
    color: '#65676b',
    fontSize: 15,
  },
  mediaIconBtn: {
    padding: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: SCREEN_WIDTH * 0.94,
    height: SCREEN_HEIGHT * 0.68,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
