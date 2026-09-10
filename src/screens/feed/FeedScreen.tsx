import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Header } from '../../components/Header';
import { PostCard } from './PostCard';
import { CreatePostScreen } from './CreatePostScreen';
import { fetchFeedPosts } from '../../services/postService';
import { getCurrentUserProfile } from '../../services/userService';
import { Ionicons } from '@expo/vector-icons';

interface FeedScreenProps {
  navigation: any;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchFeedPosts();
      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchFeedPosts();
      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

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
    loadPosts();
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      <View style={styles.createPostBar}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')}
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
          <ActivityIndicator size="large" color="#003399" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} onUpdate={loadPosts} navigation={navigation} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#003399']} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {isCreatingPost && (
        <CreatePostScreen
          onClose={() => setIsCreatingPost(false)}
          onPostCreated={() => {
            setIsCreatingPost(false);
            loadPosts();
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
  listContainer: {
    paddingBottom: 16,
  },
});
