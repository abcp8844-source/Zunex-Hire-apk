import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { createPost } from '../../services/postService';
import { getCurrentUserProfile } from '../../services/userService';
import { PostImageEditor } from './PostImageEditor';

interface CreatePostScreenProps {
  onClose: () => void;
  onPostCreated: () => void;
}

type AudienceType = 'public' | 'friends' | 'private';

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [visibility, setVisibility] = useState<AudienceType>('public');
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (isMounted && profile) setCurrentUser(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);
      
      if (selectedAsset.width && selectedAsset.height) {
        setImageAspectRatio(selectedAsset.width / selectedAsset.height);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageAspectRatio(1);
  };

  const handleSelectAudience = (selected: AudienceType) => {
    setVisibility(selected);
    setShowAudienceModal(false);
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    try {
      await createPost(content, image || undefined, visibility);
      setLoading(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={26} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity
            style={[styles.postBtn, (!content.trim() && !image) && styles.disabledBtn]}
            disabled={(!content.trim() && !image) || loading}
            onPress={handleCreatePost}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.postBtnText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.userInfoRow}>
            <Image
              source={{ uri: currentUser?.avatar_url || 'https://via.placeholder.com/150' }}
              style={styles.userAvatar}
            />
            <View>
              <Text style={styles.userName}>{currentUser?.full_name || 'User'}</Text>
              
              <TouchableOpacity
                style={styles.audienceSelector}
                onPress={() => setShowAudienceModal(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    visibility === 'public'
                      ? 'globe-outline'
                      : visibility === 'friends'
                      ? 'people-outline'
                      : 'lock-closed-outline'
                  }
                  size={12}
                  color="#65676b"
                />
                <Text style={styles.audienceText}>{visibility.toUpperCase()}</Text>
                <Ionicons name="caret-down" size={12} color="#65676b" />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor="#65676b"
            multiline
            value={content}
            onChangeText={setContent}
          />

          {image && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={[styles.previewImage, { aspectRatio: imageAspectRatio }]}
                resizeMode="contain"
              />
              
              <View style={styles.imageActionOverlay}>
                <TouchableOpacity
                  style={styles.actionIconButton}
                  onPress={() => setShowImageEditor(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="ellipsis-horizontal" size={18} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconButton}
                  onPress={removeImage}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={pickImage} style={styles.mediaOption} activeOpacity={0.7}>
            <Ionicons name="images" size={24} color="#45bd62" />
            <Text style={styles.mediaOptionText}>Photo / Video</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showAudienceModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAudienceModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowAudienceModal(false)}
          >
            <View style={styles.popupContainer}>
              <Text style={styles.popupTitle}>Select Audience</Text>
              
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleSelectAudience('public')}
              >
                <Ionicons name="globe-outline" size={20} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Public</Text>
                  <Text style={styles.optionSub}>Anyone on or off platform</Text>
                </View>
                {visibility === 'public' && <Ionicons name="checkmark" size={20} color="#1877f2" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleSelectAudience('friends')}
              >
                <Ionicons name="people-outline" size={20} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Friends</Text>
                  <Text style={styles.optionSub}>Your friends only</Text>
                </View>
                {visibility === 'friends' && <Ionicons name="checkmark" size={20} color="#1877f2" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleSelectAudience('private')}
              >
                <Ionicons name="lock-closed-outline" size={20} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Only me</Text>
                  <Text style={styles.optionSub}>Only you can see this post</Text>
                </View>
                {visibility === 'private' && <Ionicons name="checkmark" size={20} color="#1877f2" />}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {showImageEditor && image && (
          <PostImageEditor
            imageUrl={image}
            onImagePicked={(uri) => {
              setImage(uri);
              setShowImageEditor(false);
            }}
            onImageDeleted={() => {
              removeImage();
              setShowImageEditor(false);
            }}
            onClose={() => setShowImageEditor(false)}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingTop: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#050505' },
  postBtn: {
    backgroundColor: '#1877f2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: '#e4e6eb' },
  postBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  body: { flex: 1, padding: 16 },
  userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 10, backgroundColor: '#e4e6eb' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#050505' },
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
    alignSelf: 'flex-start',
  },
  audienceText: { fontSize: 11, color: '#65676b', fontWeight: '600' },
  input: { fontSize: 16, color: '#050505', minHeight: 100, textAlignVertical: 'top' },
  imageContainer: {
    position: 'relative',
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f2f5',
    width: '100%',
  },
  previewImage: { width: '100%', backgroundColor: '#000000' },
  imageActionOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionIconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: { borderTopWidth: 1, borderTopColor: '#e4e6eb', padding: 12 },
  mediaOption: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mediaOptionText: { fontSize: 15, color: '#050505', fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 12,
    padding: 16,
  },
  popupTitle: { fontSize: 16, fontWeight: 'bold', color: '#050505', marginBottom: 12 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f2f5',
  },
  optionTextContainer: { flex: 1, marginLeft: 12 },
  optionTitle: { fontSize: 15, fontWeight: '600', color: '#050505' },
  optionSub: { fontSize: 12, color: '#65676b' },
});
