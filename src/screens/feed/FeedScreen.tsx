import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Header } from '../../../components/Header';
import { PostCard } from './PostCard';
import { CreatePostScreen } from './CreatePostScreen';
import { fetchFeedPosts } from '../../services/postService';
import { theme } from '../../theme';

interface FeedScreenProps {
  navigation: any;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchFeedPosts();
    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Zunexhire"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.createPostBar}>
        <TouchableOpacity
          style={styles.createPostInput}
          onPress={() => setIsCreatingPost(true)}
        >
          <Text style={styles.createPostText}>What's on your mind?</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} onUpdate={loadPosts} />}
        refreshing={loading}
        onRefresh={loadPosts}
      />
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
    backgroundColor: theme.colors.background,
  },
  createPostBar: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  createPostInput: {
    backgroundColor: theme.colors.background,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  createPostText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.md,
  },
});
