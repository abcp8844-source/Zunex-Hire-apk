import React, { useState, memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommentButton } from '../../components/CommentButton';
import { ShareButton } from '../../components/ShareButton';
import { PostLikeSection } from './PostLikeSection';
import { CommentSection } from './CommentSection';
import { EditPostScreen } from './EditPostScreen';
import { MediaViewerScreen } from './MediaViewerScreen';
import { sharePost, deletePost, savePost, reportPost } from '../../services/postService';

interface PostCardProps {
  post: any;
  currentUserId: string;
  onUpdate: () => void;
  navigation?: any;
}

const PostCardComponent: React.FC<PostCardProps> = ({ post, currentUserId, onUpdate, navigation }) => {
  const [showComments, setShowComments] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const isOwner = post.user_id === currentUserId;

  const handleProfilePress = () => {
    if (navigation) {
      navigation.navigate('Profile', { userId: post.user_id });
    }
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
    await reportPost(post.id);
    Alert.alert('Reported', 'Thank you for reporting. We will review this post.');
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

  const totalReactions = post.likes_count || 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          activeOpacity={0.7}
          onPress={handleProfilePress}
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
                color="#899197"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionsButton} 
          onPress={() => setShowOptionsModal(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676b" />
        </TouchableOpacity>
      </View>

      {post.content ? <Text style={styles.content}>{post.content}</Text> : null}

      {post.image_url ? (
        <TouchableOpacity onPress={() => setSelectedMedia(post.image_url)} activeOpacity={0.95}>
          <Image 
            source={{ uri: post.image_url }} 
            style={styles.image} 
            resizeMode="cover" 
          />
        </TouchableOpacity>
      ) : null}

      {(totalReactions > 0 || post.comments_count > 0) && (
        <View style={styles.countsBar}>
          <View style={styles.likesCountGroup}>
            <View style={styles.miniReactionIcon}>
              <Ionicons name="thumbs-up" size={10} color="#ffffff" />
            </View>
            <Text style={styles.countsText}>{totalReactions}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowComments(!showComments)}>
            <Text style={styles.countsText}>{post.comments_count || 0} comments</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actionsBar}>
        <PostLikeSection
          postId={post.id}
          isLiked={post.is_liked}
          totalReactions={totalReactions}
          userReaction={post.user_reaction}
          onUpdate={onUpdate}
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

      {showComments && <CommentSection postId={post.id} visible={showComments} onClose={() => setShowComments(false)} />}

      <Modal visible={showOptionsModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsContainer}>
            <View style={styles.modalIndicator} />
            <TouchableOpacity style={styles.optionRow} onPress={handleSave}>
              <Ionicons name="bookmark-outline" size={22} color="#1877f2" />
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
                  <Ionicons name="create-outline" size={22} color="#1877f2" />
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

export const PostCard = memo(PostCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    backgroundColor: '#e4e6eb',
    borderWidth: 1.5,
    borderColor: '#1877f2',
  },
  author: {
    fontWeight: '700',
    fontSize: 15,
    color: '#0f172a',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  dotSeparator: {
    color: '#94a3b8',
    fontSize: 10,
  },
  optionsButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 340,
    backgroundColor: '#f1f5f9',
  },
  countsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  likesCountGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniReactionIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1877f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countsText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    alignSelf: 'center',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    gap: 14,
  },
  optionTitle: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  optionSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
