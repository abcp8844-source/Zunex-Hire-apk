import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { updatePost } from '../../services/postService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface EditPostScreenProps {
  post: any;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditPostScreen: React.FC<EditPostScreenProps> = ({ post, onClose, onUpdated }) => {
  const [content, setContent] = useState(post.content || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await updatePost(post.id, content);
    setLoading(false);
    onUpdated();
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Post</Text>
          <TouchableOpacity onPress={handleUpdate} disabled={loading}>
            {loading ? <Loader /> : <Text style={[styles.headerButton, styles.saveText]}>Save</Text>}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          multiline
          value={content}
          onChangeText={setContent}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerButton: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  saveText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  input: {
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
