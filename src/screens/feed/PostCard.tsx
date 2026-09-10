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
  FlatList,
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

const { width } = Dimensions.get('window');

const PostCardComponent: React.FC<PostCardProps> = ({ post, currentUserId, onUpdate, navigation }) => {
  const [showComments, setShowComments] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // States for Reactions Feature
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReactionsListModal, setShowReactionsListModal] = useState(false);
  const [selectedReactionFilter, setSelectedReactionFilter] = useState('all');

  const isOwner = post.user_id === currentUserId;

  // Handle selecting a reaction (e.g., 'like', 'love', 'haha', etc.)
  const handleLike = async (reactionType: string = 'like') => {
    setShowReactionPicker(false);
    await toggleLikePost(post.id, reactionType);
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

  // Helper mapping for database reaction codes to Emojis
  const getReactionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'love': return '❤️';
      case 'care': return '🥰';
      case 'haha': return '😆';
      case 'wow': return '😮';
      case 'sad': return '😢';
      case 'angry': return '😡';
      default: return '👍'; // 'like'
    }
  };

  // Real reaction counts from backend object (e.g., post.reaction_counts = {like: 10, love: 5})
  const reactionCounts = post.reaction_counts || {};
  const totalReactions = Object.values(reactionCounts).reduce((a: any, b: any) => a + b, 0) || post.likes_count || 0;

  // Filtered reactions list based on user selection in modal
  const allReactionsUsers = post.reactions_users || [];
  const filteredReactionsUsers = selectedReactionFilter === 'all' 
    ? allReactionsUsers 
    : allReactionsUsers.filter((item: any) => item.type === selectedReactionFilter);

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          activeOpacity={0.7}
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

        <TouchableOpacity 
          style={styles.optionsButton} 
          onPress={() => setShowOptionsModal(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676b" />
        </TouchableOpacity>
      </View>

      {/* Content Text */}
      {post.content ? <Text style={styles.content}>{post.content}</Text> : null}

      {/* Post Image with No-Crop */}
      {post.image_url ? (
        <TouchableOpacity onPress={() => setSelectedMedia(post.image_url)} activeOpacity={0.95}>
          <Image 
            source={{ uri: post.image_url }} 
            style={styles.image} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      ) : null}

      {/* Reactions Count & Comments Summary bar */}
      {(totalReactions > 0 || post.comments_count > 0) && (
        <View style={styles.countsBar}>
          <TouchableOpacity 
            style={styles.likesCountGroup} 
            onPress={() => setShowReactionsListModal(true)}
          >
            <Text style={styles.reactionEmojisIndicator}>
              {Object.keys(reactionCounts).slice(0, 2).map(type => getReactionIcon(type)).join(' ')}
            </Text>
            <Text style={styles.countsText}>{totalReactions}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(!showComments)}>
            <Text style={styles.countsText}>{post.comments_count || 0} comments</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions Bar */}
      <View style={styles.actionsBar}>
        <View style={{ flex: 1, position: 'relative' }}>
          {/* Floating Facebook Reaction Picker Popup */}
          {showReactionPicker && (
            <View style={styles.reactionPickerPopup}>
              <TouchableOpacity onPress={() => handleLike('like')}><Text style={styles.pickerEmoji}>👍</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike('love')}><Text style={styles.pickerEmoji}>❤️</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike('care')}><Text style={styles.pickerEmoji}>🥰</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike('haha')}><Text style={styles.pickerEmoji}>😆</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike('wow')}><Text style={styles.pickerEmoji}>😮</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike('sad')}><Text style={styles.pickerEmoji}>😢</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike('angry')}><Text style={styles.pickerEmoji}>😡</Text></TouchableOpacity>
            </View>
          )}

          <LikeButton
            isLiked={post.is_liked}
            likeCount={totalReactions}
            onPress={() => handleLike(post.user_reaction || 'like')}
            onLongPress={() => setShowReactionPicker(true)}
          />
        </View>

        <CommentButton
          commentCount={post.comments_count || 0}
          onPress={() => setShowComments(!showComments)}
        />
        <ShareButton
          shareCount={post.shares_count || 0}
          onPress={handleShare}
        />
      </View>

      {/* Comments Section */}
      {showComments && <CommentSection postId={post.id} visible={showComments} onClose={() => setShowComments(false)} />}

      {/* Reactions List Modal (Real Backend Data) */}
      <Modal visible={showReactionsListModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.reactionsModalContainer}>
            <View style={styles.reactionsModalHeader}>
              <TouchableOpacity onPress={() => setShowReactionsListModal(false)}>
                <Ionicons name="arrow-back" size={24} color="#050505" />
              </TouchableOpacity>
              <Text style={styles.reactionsModalTitle}>Reactions</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Dynamic Reaction Tabs based on real data */}
            <View style={styles.reactionTabsRow}>
              <TouchableOpacity 
                style={[styles.reactionTab, selectedReactionFilter === 'all' && styles.activeReactionTab]}
                onPress={() => setSelectedReactionFilter('all')}
              >
                <Text style={[styles.reactionTabText, selectedReactionFilter === 'all' && styles.activeReactionTabText]}>
                  All {totalReactions}
                </Text>
              </TouchableOpacity>

              {Object.entries(reactionCounts).map(([type, count]: [string, any]) => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.reactionTab, selectedReactionFilter === type && styles.activeReactionTab]}
                  onPress={() => setSelectedReactionFilter(type)}
                >
                  <Text style={[styles.reactionTabText, selectedReactionFilter === type && styles.activeReactionTabText]}>
                    {getReactionIcon(type)} {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Real Users List */}
            <FlatList
              data={filteredReactionsUsers}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({ item }) => (
                <View style={styles.reactionUserRow}>
                  <View style={{ position: 'relative' }}>
                    <Image source={{ uri: item.avatar || 'https://via.placeholder.com/150' }} style={styles.reactionUserAvatar} />
                    <Text style={styles.smallBadgeEmoji}>{getReactionIcon(item.type)}</Text>
                  </View>
                  <Text style={styles.reactionUserName}>{item.name || 'User'}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
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

      {/* Edit Post Modal */}
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

      {/* Media Viewer Modal */}
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
    flex: 1,
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
  optionsButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#050505',
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: '#f0f2f5',
  },
  countsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  likesCountGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionEmojisIndicator: {
    fontSize: 12,
  },
  countsText: {
    fontSize: 13,
    color: '#65676b',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e4e6eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  reactionPickerPopup: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
  pickerEmoji: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  reactionsModalContainer: {
    height: '80%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
  },
  reactionsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  reactionsModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  reactionTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  reactionTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f2f5',
  },
  activeReactionTab: {
    backgroundColor: '#e7f3ff',
  },
  reactionTabText: {
    fontSize: 13,
    color: '#65676b',
    fontWeight: '600',
  },
  activeReactionTabText: {
    color: '#1877f2',
  },
  reactionUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  reactionUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e4e6eb',
  },
  smallBadgeEmoji: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 14,
  },
  reactionUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#050505',
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
