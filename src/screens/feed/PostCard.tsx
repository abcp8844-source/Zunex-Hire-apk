import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LikeButton } from '../../components/LikeButton';
import { CommentButton } from '../../components/CommentButton';
import { ShareButton } from '../../components/ShareButton';
import { CommentSection } from './CommentSection';
import { EditPostScreen } from './EditPostScreen';
import { MediaViewerScreen } from './MediaViewerScreen';
import { toggleLikePost, sharePost, deletePost, savePost, reportPost } from '../../services/postService';

interface PostCardProps {
  post: any;
  currentUserId: string;
  onUpdate: () => void;
  navigation?: any;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onUpdate, navigation }) => {
  const [showComments, setShowComments] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const isOwner = post.user_id === currentUserId;

  const handleLike = async () => {
    await toggleLikePost(post.id);
    onUpdate();
  };

  const handleShare = async () => {
    await sharePost(post.id);
    onUpdate();
  };

  const handleSave = async () => {
    setShowOptionsModal(false);
    await savePost(post.id);
    Alert.alert('Saved', 'Post saved to your collection.');
  };

  const handleReport = async () => {
    setShowOptionsModal(false);
    Alert.alert('Reported', 'Thank you for reporting. We will review this post.');
    await reportPost(post.id);
  };

  const handleDelete = async () => {
    setShowOptionsModal(false);
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePost(post.id);
          onUpdate();
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation?.navigate('Profile', { userId: post.user_id })}
        >
          <Image
            source={{
              uri: post.profiles?.avatar_url || 'https://via.placeholder.com/150',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.author}>{post.profiles?.full_name || 'User'}</Text>
            <View style={styles.timeRow}>
              <Text style={styles.time}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Ionicons
                name={post.audience === 'friends' ? 'people-outline' : 'globe-outline'}
                size={12}
                color="#65676b"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowOptionsModal(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676b" />
        </TouchableOpacity>
      </View>

      {post.content ? <Text style={styles.content}>{post.content}</Text> : null}

      {post.image_url ? (
        <TouchableOpacity onPress={() => setSelectedMedia(post.image_url)} activeOpacity={0.9}>
          <Image source={{ uri: post.image_url }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
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

      <Modal visible={showOptionsModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionRow} onPress={handleSave}>
              <Ionicons name="bookmark-outline" size={22} color="#050505" />
              <View>
                <Text style={styles.optionTitle}>Save Post</Text>
                <Text style={styles.optionSub}>Add this to your saved items collection</Text>
              </View>
            </TouchableOpacity>

            {isOwner ? (
              <>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setShowOptionsModal(false);
                    setIsEditing(true);
                  }}
                >
                  <Ionicons name="create-outline" size={22} color="#050505" />
                  <Text style={styles.optionTitle}>Edit Post</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow} onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={22} color="#fa3e3e" />
                  <Text style={[styles.optionTitle, { color: '#fa3e3e' }]}>Delete Post</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.optionRow} onPress={handleReport}>
                <Ionicons name="warning-outline" size={22} color="#fa3e3e" />
                <View>
                  <Text style={[styles.optionTitle, { color: '#fa3e3e' }]}>Report Post</Text>
                  <Text style={styles.optionSub}>We're concerned about this post</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {isEditing && (
        <EditPostScreen
          post={post}
          onClose={() => setIsEditing(false)}
          onUpdated={() => {
            setIsEditing(false);
            onUpdate();
          }}
        />
      )}

      {selectedMedia && (
        <Modal visible={true} transparent={false}>
          <MediaViewerScreen
            imageUrl={selectedMedia}
            onClose={() => setSelectedMedia(null)}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e4e6eb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#e4e6eb',
  },
  author: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#050505',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: '#65676b',
  },
  dotSeparator: {
    color: '#65676b',
    fontSize: 10,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#050505',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f2f5',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e4e6eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: '#050505',
    fontWeight: '500',
  },
  optionSub: {
    fontSize: 12,
    color: '#65676b',
  },
});
