import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { fetchComments, addComment } from '../../services/postService';
import { theme } from '../../theme';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');

  const loadComments = async () => {
    const data = await fetchComments(postId);
    if (data) {
      setComments(data);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await addComment(postId, text);
    setText('');
    loadComments();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentAuthor}>{item.profiles?.full_name || 'User'}</Text>
            <Text style={styles.commentText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor={theme.colors.textSecondary}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  commentItem: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: 8,
    marginBottom: theme.spacing.xs,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
  },
  commentText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
  },
  sendButton: {
    marginLeft: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
});
