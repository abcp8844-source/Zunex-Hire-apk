import React, { useState, useEffect, memo } from 'react';
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

import { CommentSection } from '../Reactions/CommentSection';
import { ReactionsModal } from '../Reactions/ReactionsModal';
import { EditPostScreen } from '../Post/EditPostScreen';
import { MediaViewerScreen } from './MediaViewerScreen';

import { deletePost, savePost, reportPost } from '../../services/postService';
import { FB_REACTIONS } from '../../constants/reactions';

interface PostCardProps {
  post: any;
  currentUserId: string;
  onUpdate: () => void;
  navigation?: any;
}

const PostCardComponent: React.FC<PostCardProps> = ({ post, currentUserId, onUpdate, navigation }) => {
  const [showComments, setShowComments] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const [localReactionsCount, setLocalReactionsCount] = useState<number>(Number(post?.likes_count) || 0);
  const [localIsLiked, setLocalIsLiked] = useState<boolean>(Boolean(post?.is_liked));
  const [localUserReaction, setLocalUserReaction] = useState<string | undefined>(post?.user_reaction);

  useEffect(() => {
    setLocalReactionsCount(Number(post?.likes_count) || 0);
    setLocalIsLiked(Boolean(post?.is_liked));
    setLocalUserReaction(post?.user_reaction);
  }, [post?.likes_count, post?.is_liked, post?.user_reaction]);

  const isOwner = post?.user_id === currentUserId;

  const handleProfilePress = () => {
    if (!navigation || !post?.user_id) return;
    if (post.user_id === currentUserId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('OtherProfile', { userId: post.user_id });
    }
  };

  const handleSave = async () => {
    setShowOptionsModal(false);
    if (post?.id) {
      await savePost(post.id);
      Alert.alert('Saved', 'Post saved to your collection.');
    }
  };

  const handleReport = async () => {
    setShowOptionsModal(false);
    if (post?.id) {
      await reportPost(post.id);
      Alert.alert('Reported', 'Thank you for reporting. We will review this post.');
    }
  };

  const handleDelete = async () => {
    setShowOptionsModal(false);
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (post?.id) {
            await deletePost(post.id);
            onUpdate();
          }
        },
      },
    ]);
  };

  const handleLocalReactionChange = (selectedEmoji?: string) => {
    if (selectedEmoji) {
      if (!localIsLiked) {
        setLocalReactionsCount((prev) => prev + 1);
      }
      setLocalIsLiked(true);
      setLocalUserReaction(selectedEmoji);
    } else {
      setLocalReactionsCount((prev) => Math.max(0, prev - 1));
      setLocalIsLiked(false);
      setLocalUserReaction(undefined);
    }
  };

  const totalComments = Number(post?.comments_count) || 0;
  const totalShares = Number(post?.shares_count) || 0;
  const topReactions = Array.isArray(post?.reaction_summary) ? post.reaction_summary : [];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} activeOpacity={0.7} onPress={handleProfilePress}>
          <Image
            source={{ uri: post?.profiles?.avatar_url || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.author} numberOfLines={1}>
              {post?.profiles?.full_name || 'User'}
            </Text>
            <View style={styles.timeRow}>
              <Text style={styles.time}>
                {post?.created_at ? new Date(post.created_at).toLocaleDateString() : ''}
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Ionicons
                name={post?.audience === 'friends' ? 'people-outline' : 'globe-outline'}
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

      {post?.content ? <Text style={styles.content}>{post.content}</Text> : null}

      {post?.image_url ? (
        <TouchableOpacity onPress={() => setSelectedMedia(post.image_url)} activeOpacity={0.95}>
          <Image source={{ uri: post.image_url }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      ) : null}

      <View style={styles.reactionsOverviewBar}>
        <TouchableOpacity
          style={styles.invisibleTriggerButton}
          onPress={() => setShowReactionsModal(true)}
          activeOpacity={0.7}
        >
          {localReactionsCount > 0 ? (
            <>
              <View style={styles.stackedIconsContainer}>
                {topReactions.length > 0 ? (
                  topReactions.slice(0, 3).map((item: any, index: number) => {
                    const reactionDef = FB_REACTIONS[item?.type];
                    return (
                      <View 
                        key={index} 
                        style={[
                          styles.miniReactionBadge, 
                          { zIndex: 3 - index, marginLeft: index > 0 ? -6 : 0 }
                        ]}
                      >
                        {reactionDef?.icon ? (
                          <Image source={{ uri: reactionDef.icon }} style={styles.miniEmojiImage} />
                        ) : null}
                      </View>
                    );
                  })
                ) : localUserReaction && FB_REACTIONS[localUserReaction] ? (
                  <View style={styles.miniReactionBadge}>
                    <Image source={{ uri: FB_REACTIONS[localUserReaction].icon }} style={styles.miniEmojiImage} />
                  </View>
                ) : null}
              </View>
              <Text style={styles.reactionCountText}>{localReactionsCount}</Text>
            </>
          ) : (
            <Text style={styles.noReactionsText}>0</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.actionsBar}>
        <View style={styles.actionItem}>
          <LikeButton
            postId={post?.id}
            isLiked={localIsLiked}
            totalReactions={localReactionsCount}
            userReaction={localUserReaction}
            onUpdate={handleLocalReactionChange}
          />
        </View>

        <View style={styles.actionItem}>
          <CommentButton 
            count={totalComments}
            onPress={() => setShowComments(!showComments)}
          />
        </View>

        <View style={styles.actionItem}>
          <ShareButton 
            shareCount={totalShares}
            shareMessage={post?.content}
            shareUrl={post?.image_url}
            onPress={onUpdate}
          />
        </View>
      </View>

      {showComments && post?.id && (
        <CommentSection 
          postId={post.id} 
          visible={showComments} 
          onClose={() => setShowComments(false)} 
        />
      )}

      {showReactionsModal && post?.id && (
        <ReactionsModal
          visible={showReactionsModal}
          postId={post.id}
          totalReactions={localReactionsCount}
          onClose={() => setShowReactionsModal(false)}
          navigation={navigation}
        />
      )}

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
  },
  headerTextContainer: { flex: 1 },
  author: { fontWeight: '700', fontSize: 15, color: '#0f172a' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  time: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  dotSeparator: { color: '#94a3b8', fontSize: 10 },
  optionsButton: { padding: 6, borderRadius: 20, backgroundColor: '#f8fafc' },
  content: { paddingHorizontal: 14, paddingBottom: 12, fontSize: 15, color: '#1e293b', lineHeight: 22 },
  image: { width: '100%', height: 340, backgroundColor: '#f1f5f9' },
  reactionsOverviewBar: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  invisibleTriggerButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stackedIconsContainer: { flexDirection: 'row', alignItems: 'center' },
  miniReactionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e4e6eb',
    overflow: 'hidden',
  },
  miniEmojiImage: { width: 14, height: 14, borderRadius: 7 },
  reactionCountText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  noReactionsText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionItem: { flex: 1, alignItems: 'center' },
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
  optionTitle: { fontSize: 16, color: '#0f172a', fontWeight: '600' },
  optionSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
});
