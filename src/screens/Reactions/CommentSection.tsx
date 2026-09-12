import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchComments, addComment } from '../../services/postService';
import { getCurrentUserProfile } from '../../services/userService';

interface CommentSectionProps {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

export const formatCommentTime = (dateString: string): string => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, visible, onClose }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useEffect(() => {
    if (visible && postId) {
      loadComments();
      fetchUser();
    }
  }, [visible, postId]);

  const loadComments = async () => {
    const data = await fetchComments(postId);
    if (data) setComments(data);
  };

  const fetchUser = async () => {
    const profile = await getCurrentUserProfile();
    if (profile) setCurrentUser(profile);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    const finalContent = replyingTo ? `@${replyingTo.authorName} ${text}` : text;

    await addComment(postId, finalContent);
    setText('');
    setReplyingTo(null);
    loadComments();
  };

  const handleCommentReaction = (commentId: string, reactionType: 'like' | 'dislike') => {
    setComments((prev) =>
      prev.map((item) => {
        if (item.id === commentId) {
          const currentReaction = item.userReaction;
          let likes = item.likes_count || 0;
          let dislikes = item.dislikes_count || 0;
          let newReaction: 'like' | 'dislike' | undefined = reactionType;

          if (currentReaction === reactionType) {
            newReaction = undefined;
            if (reactionType === 'like') likes = Math.max(0, likes - 1);
            if (reactionType === 'dislike') dislikes = Math.max(0, dislikes - 1);
          } else {
            if (currentReaction === 'like') likes = Math.max(0, likes - 1);
            if (currentReaction === 'dislike') dislikes = Math.max(0, dislikes - 1);

            if (reactionType === 'like') likes += 1;
            if (reactionType === 'dislike') dislikes += 1;
          }

          return { ...item, likes_count: likes, dislikes_count: dislikes, userReaction: newReaction };
        }
        return item;
      })
    );

    setTimeout(() => {
      try {
        
      } catch (error) {
        
      }
    }, 0);
  };

  const handleDeleteComment = () => {
    setShowOptionsModal(false);
    if (!selectedComment) return;

    Alert.alert('Delete Comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
          setSelectedComment(null);
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.bottomSheetContainer}
        >
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={20} color="#65676b" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No comments yet</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isMe = currentUser && (item.user_id === currentUser.id || item.profiles?.id === currentUser.id);
              const authorName = item.profiles?.full_name || 'User';

              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onLongPress={() => {
                    if (isMe) {
                      setSelectedComment(item);
                      setShowOptionsModal(true);
                    }
                  }}
                >
                  <View style={styles.commentItem}>
                    <Image
                      source={{ uri: item.profiles?.avatar_url || 'https://via.placeholder.com/150' }}
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentContentWrapper}>
                      <View style={styles.commentBubble}>
                        <View style={styles.authorRow}>
                          <Text style={styles.commentAuthor}>{authorName}</Text>
                          {isMe && <Text style={styles.youBadge}>You</Text>}
                        </View>
                        <Text style={styles.commentText}>{item.content}</Text>
                      </View>
                      
                      <View style={styles.commentActionsRow}>
                        <Text style={styles.actionTime}>{formatCommentTime(item.created_at)}</Text>
                        <TouchableOpacity onPress={() => setReplyingTo({ id: item.id, authorName })}>
                          <Text style={styles.actionReply}>Reply</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.likeDislikeContainer}>
                      <TouchableOpacity 
                        style={styles.iconBtn} 
                        onPress={() => handleCommentReaction(item.id, 'like')}
                      >
                        <Ionicons 
                          name={item.userReaction === 'like' ? "thumbs-up" : "thumbs-up-outline"} 
                          size={14} 
                          color={item.userReaction === 'like' ? "#1877f2" : "#65676b"} 
                        />
                        {item.likes_count > 0 && <Text style={styles.countText}>{item.likes_count}</Text>}
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.iconBtn} 
                        onPress={() => handleCommentReaction(item.id, 'dislike')}
                      >
                        <Ionicons 
                          name={item.userReaction === 'dislike' ? "thumbs-down" : "thumbs-down-outline"} 
                          size={14} 
                          color={item.userReaction === 'dislike' ? "#fa3e3e" : "#65676b"} 
                        />
                        {item.dislikes_count > 0 && <Text style={styles.countText}>{item.dislikes_count}</Text>}
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {replyingTo && (
            <View style={styles.replyingBar}>
              <Text style={styles.replyingText}>Replying to <Text style={{fontWeight: 'bold'}}>{replyingTo.authorName}</Text></Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={18} color="#65676b" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Image
              source={{ uri: currentUser?.avatar_url || 'https://via.placeholder.com/150' }}
              style={styles.inputAvatar}
            />
            <TextInput
              style={styles.input}
              placeholder={replyingTo ? `Reply to ${replyingTo.authorName}...` : "Write a comment..."}
              placeholderTextColor="#65676b"
              value={text}
              onChangeText={setText}
            />
            {text.trim().length > 0 && (
              <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.8}>
                <Ionicons name="send" size={18} color="#1877f2" />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>

      <Modal visible={showOptionsModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowOptionsModal(false)}>
          <View style={styles.optionsContainer}>
            <View style={styles.modalIndicator} />
            <TouchableOpacity style={styles.optionRow} onPress={handleDeleteComment}>
              <Ionicons name="trash-outline" size={20} color="#fa3e3e" />
              <Text style={[styles.optionTitle, { color: '#fa3e3e' }]}>Delete Comment</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  bottomSheetContainer: { height: '75%', backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
  dragHandleContainer: { alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#ced0d4' },
  closeIcon: { position: 'absolute', right: 16, top: 6 },
  listContent: { padding: 12 },
  emptyContainer: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: '#65676b', fontSize: 14 },
  commentItem: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8, backgroundColor: '#e4e6eb' },
  commentContentWrapper: { flex: 1, marginRight: 8 },
  commentBubble: { backgroundColor: '#f0f2f5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  commentAuthor: { fontWeight: 'bold', fontSize: 13, color: '#050505' },
  youBadge: { fontSize: 11, fontWeight: '600', color: '#1877f2', backgroundColor: '#e7f3ff', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, overflow: 'hidden' },
  commentText: { fontSize: 14, color: '#050505' },
  commentActionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 12, gap: 12 },
  actionTime: { fontSize: 11, color: '#64748b' },
  actionReply: { fontSize: 11, fontWeight: 'bold', color: '#1877f2' },
  likeDislikeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, padding: 4 },
  countText: { fontSize: 10, color: '#65676b', fontWeight: '600' },
  replyingBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f2f5', paddingHorizontal: 16, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#e4e6eb' },
  replyingText: { fontSize: 12, color: '#65676b' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#e4e6eb', backgroundColor: '#fff' },
  inputAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8, backgroundColor: '#e4e6eb' },
  input: { flex: 1, backgroundColor: '#f0f2f5', height: 38, borderRadius: 19, paddingHorizontal: 14, fontSize: 14, color: '#050505' },
  sendButton: { marginLeft: 8, padding: 6, justifyContent: 'center', alignItems: 'center' },
  optionsContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12 },
  modalIndicator: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', alignSelf: 'center', marginBottom: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#f8fafc', gap: 14 },
  optionTitle: { fontSize: 16, color: '#0f172a', fontWeight: '600' },
});
