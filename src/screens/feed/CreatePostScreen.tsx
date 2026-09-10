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

interface CreatePostScreenProps {
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onClose, onPostCreated }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [audience, setAudience] = useState<'public' | 'friends' | 'private'>('public');

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getCurrentUserProfile();
      if (profile) setCurrentUser(profile);
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleFinalPost = async () => {
    if (!content && !image) return;
    setLoading(true);
    try {
      await createPost(content, image, audience);
      setLoading(false);
      onPostCreated();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View style={styles.container}>
        {step === 1 ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={26} color="#050505" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Post</Text>
              <TouchableOpacity
                style={[styles.nextBtn, (!content && !image) && styles.disabledBtn]}
                disabled={!content && !image}
                onPress={() => setStep(2)}
              >
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.body}>
              <View style={styles.userInfoRow}>
                <Image
                  source={{ uri: currentUser?.avatar_url || 'https://via.placeholder.com/150' }}
                  style={styles.userAvatar}
                />
                <View>
                  <Text style={styles.userName}>{currentUser?.full_name || 'User'}</Text>
                  <TouchableOpacity style={styles.audienceSelector} onPress={() => setStep(2)}>
                    <Ionicons name="globe-outline" size={12} color="#65676b" />
                    <Text style={styles.audienceText}>{audience.toUpperCase()}</Text>
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
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <View style={styles.imageOverlayControls}>
                    <TouchableOpacity style={styles.overlayBtn} onPress={pickImage}>
                      <Ionicons name="pencil" size={18} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.overlayBtn} onPress={removeImage}>
                      <Ionicons name="trash-outline" size={18} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.bottomBar}>
              <TouchableOpacity onPress={pickImage} style={styles.mediaOption}>
                <Ionicons name="images" size={24} color="#45bd62" />
                <Text style={styles.mediaOptionText}>Photo/video</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={24} color="#050505" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Post Settings</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.body}>
              <View style={styles.previewBox}>
                <Text style={styles.previewContent}>{content || 'Image Post'}</Text>
              </View>

              <Text style={styles.sectionHeader}>Post Audience</Text>

              <TouchableOpacity
                style={styles.audienceOption}
                onPress={() => setAudience('public')}
              >
                <Ionicons name="globe-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Public</Text>
                  <Text style={styles.optionSub}>Anyone on or off Facebook</Text>
                </View>
                {audience === 'public' && <Ionicons name="checkmark" size={22} color="#1877f2" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.audienceOption}
                onPress={() => setAudience('friends')}
              >
                <Ionicons name="people-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Friends</Text>
                  <Text style={styles.optionSub}>Your friends on app</Text>
                </View>
                {audience === 'friends' && <Ionicons name="checkmark" size={22} color="#1877f2" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.audienceOption}
                onPress={() => setAudience('private')}
              >
                <Ionicons name="lock-closed-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Only me</Text>
                  <Text style={styles.optionSub}>Only you can see this post</Text>
                </View>
                {audience === 'private' && <Ionicons name="checkmark" size={22} color="#1877f2" />}
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.finalPostContainer}>
              <TouchableOpacity
                style={styles.finalPostBtn}
                onPress={handleFinalPost}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.finalPostBtnText}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
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
  nextBtn: {
    backgroundColor: '#1877f2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  disabledBtn: {
    backgroundColor: '#e4e6eb',
  },
  nextBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
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
    fontSize: 18,
    color: '#050505',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 12,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  imageOverlayControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  overlayBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 20,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#e4e6eb',
    padding: 12,
  },
  mediaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mediaOptionText: {
    fontSize: 15,
    color: '#050505',
    fontWeight: '500',
  },
  previewBox: {
    backgroundColor: '#f0f2f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  previewContent: {
    fontSize: 14,
    color: '#65676b',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
    marginBottom: 12,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#050505',
  },
  optionSub: {
    fontSize: 12,
    color: '#65676b',
  },
  finalPostContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e4e6eb',
  },
  finalPostBtn: {
    backgroundColor: '#1877f2',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  finalPostBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
