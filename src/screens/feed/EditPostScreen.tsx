import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updatePost } from '../../services/postService';

interface EditPostScreenProps {
  post: any;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditPostScreen: React.FC<EditPostScreenProps> = ({
  post,
  onClose,
  onUpdated,
}) => {
  const [content, setContent] = useState(post?.content || '');
  const [audience, setAudience] = useState<'public' | 'friends' | 'private'>(
    post?.audience || 'public'
  );
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await updatePost(post.id, content, audience);
      setLoading(false);
      onUpdated();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const toggleAudience = () => {
    if (audience === 'public') setAudience('friends');
    else if (audience === 'friends') setAudience('private');
    else setAudience('public');
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={26} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Post</Text>
          <TouchableOpacity onPress={handleUpdate} disabled={loading} activeOpacity={0.7}>
            {loading ? (
              <ActivityIndicator size="small" color="#1877f2" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.userInfoRow}>
            <Image
              source={{
                uri: post?.profiles?.avatar_url || post?.user?.avatar_url || 'https://via.placeholder.com/150',
              }}
              style={styles.userAvatar}
            />
            <View>
              <Text style={styles.userName}>
                {post?.profiles?.full_name || post?.user?.full_name || 'User'}
              </Text>
              <TouchableOpacity
                style={styles.audienceSelector}
                onPress={toggleAudience}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    audience === 'public'
                      ? 'globe-outline'
                      : audience === 'friends'
                      ? 'people-outline'
                      : 'lock-closed-outline'
                  }
                  size={12}
                  color="#65676b"
                />
                <Text style={styles.audienceText}>{audience.toUpperCase()}</Text>
                <Ionicons name="caret-down" size={12} color="#65676b" />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.input}
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="Edit your post..."
            placeholderTextColor="#65676b"
          />

          {post?.image_url ? (
            <Image
              source={{ uri: post.image_url }}
              style={styles.postImagePreview}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#050505',
  },
  saveText: {
    color: '#1877f2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#e4e6eb',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  audienceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced0d4',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    gap: 4,
  },
  audienceText: {
    fontSize: 11,
    color: '#65676b',
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    color: '#050505',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  postImagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#f0f2f5',
  },
});
