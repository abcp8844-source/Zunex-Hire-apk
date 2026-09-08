import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LikeButton } from '../../components/LikeButton';
import { CommentButton } from '../../components/CommentButton';
import { ShareButton } from '../../components/ShareButton';
import { CommentSection } from './CommentSection';
import { toggleLikePost, sharePost } from '../../services/postService';
import { theme } from '../../theme';

interface PostCardProps {
  post: any;
  onUpdate: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    await toggleLikePost(post.id);
    onUpdate();
  };

  const handleShare = async () => {
    await sharePost(post.id);
    onUpdate();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.author}>{post.profiles?.full_name || 'User'}</Text>
        <Text style={styles.time}>{new Date(post.created_at).toLocaleDateString()}</Text>
      </View>
      {post.content ? <Text style={styles.content}>{post.content}</Text> : null}
      {post.image_url ? (
        <Image source={{ uri: post.image_url }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={styles.actionsBar}>
        <LikeButton
          isLiked={post.is_liked}
          likeCount={post.likes_count || 0}
          onPress={handleLike}
        />
        <CommentButton
          commentCount={post.comments_count || 0}
          onPress={() => setShowComments(!showComments)}
        />
        <ShareButton
          shareCount={post.shares_count || 0}
          onPress={handleShare}
        />
      </View>
      {showComments && <CommentSection postId={post.id} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    marginVertical: theme.spacing.xs,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  author: {
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  time: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  image: {
    width: '100vw' as any,
    height: 300,
    backgroundColor: theme.colors.grayLight,
  },
  actionsBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
});
