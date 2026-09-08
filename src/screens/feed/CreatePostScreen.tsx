import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../../services/postService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface CreatePostScreenProps {
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content && !image) return;
    setLoading(true);
    await createPost(content, image);
    setLoading(false);
    onPostCreated();
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity onPress={handlePost} disabled={loading}>
            {loading ? <Loader /> : <Text style={[styles.headerButton, styles.postActionText]}>Post</Text>}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          value={content}
          onChangeText={setContent}
        />
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerText}>📷 Add Photo</Text>
        </TouchableOpacity>
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
  postActionText: {
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
  previewImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    backgroundColor: theme.colors.grayLight,
  },
  imagePickerButton: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  imagePickerText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
  },
});
