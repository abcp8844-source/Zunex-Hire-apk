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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchComments, addComment } from '../../services/postService';
import { getCurrentUserProfile } from '../../services/userService';

interface CommentSectionProps {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

// Helper function to format large numbers cleanly (e.g., 1500 -> 1.5k, 1000000 -> 1M)
export const formatNumber = (num: number): string => {
  if (!num || num === 0) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, visible, onClose }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (visible && postId) {
      loadComments();
      fetchUser();
    }
  }, [visible, postId]);

  const loadComments = async () => {
    const data = await fetchComments(postId);
    if (data) {
      setComments(data);
    }
  };

  const fetchUser = async () => {
    const profile = await getCurrentUserProfile();
    if (profile) setCurrentUser(profile);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    await addComment(postId, text);
    setText('');
    loadComments();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.bottomSheetContainer}
        >
          {/* Drag Handle Bar */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={20} color="#65676b" />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
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

              return (
                <View style={styles.commentItem}>
                  <Image
                    source={{ uri: item.profiles?.avatar_url || 'https://via.placeholder.com/150' }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContentWrapper}>
                    <View style={styles.commentBubble}>
                      <View style={styles.authorRow}>
                        <Text style={styles.commentAuthor}>
                          {item.profiles?.full_name || 'User'}
                        </Text>
                        {isMe && <Text style={styles.youBadge}>You</Text>}
                      </View>
                      <Text style={styles.commentText}>{item.content}</Text>
                    </View>
                    
                    <View style={styles.commentActionsRow}>
                      <Text style={styles.actionTime}>Just now</Text>
                      <TouchableOpacity>
                        <Text style={styles.actionReply}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Like / Dislike Icons on Right */}
                  <View style={styles.likeDislikeContainer}>
                    <TouchableOpacity style={styles.iconBtn}>
                      <Ionicons name="thumbs-up-outline" size={15} color="#65676b" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                      <Ionicons name="thumbs-down-outline" size={15} color="#65676b" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          {/* Comment Input Bar */}
          <View style={styles.inputContainer}>
            <Image
              source={{ uri: currentUser?.avatar_url || 'https://via.placeholder.com/150' }}
              style={styles.inputAvatar}
            />
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: '75%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ced0d4',
  },
  closeIcon: {
    position: 'absolute',
    right: 16,
    top: 6,
  },
  listContent: {
    padding: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#65676b',
    fontSize: 14,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#e4e6eb',
  },
  commentContentWrapper: {
    flex: 1,
    marginRight: 8,
  },
  commentBubble: {
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#050505',
  },
  youBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1877f2',
    backgroundColor: 'e7f3ff',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  commentText: {
    fontSize: 14,
    color: '#050505',
  },
  commentActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 12,
    gap: 12,
  },
  actionTime: {
    fontSize: 11,
    color: '#65676b',
  },
  actionReply: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#65676b',
  },
  likeDislikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  iconBtn: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e4e6eb',
    backgroundColor: '#ffffff',
  },
  inputAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: '#e4e6eb',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#050505',
  },
  sendButton: {
    marginLeft: 8,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
