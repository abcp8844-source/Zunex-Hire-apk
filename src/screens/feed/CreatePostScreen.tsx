import { Loader } from '../../components/Loader';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { createPost } from '../../services/postService';
import { getCurrentUserProfile } from '../../services/userService';

interface CreatePostScreenProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const screenWidth = Dimensions.get('window').width;

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onClose, onPostCreated }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [audience, setAudience] = useState<'public' | 'friends' | 'private'>('public');

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

  const handleFinalPost = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    try {
      await createPost(content, image, audience);
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
        {step === 1 && (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={26} color="#050505" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Post</Text>
              <TouchableOpacity
                style={[styles.nextBtn, (!content.trim() && !image) && styles.disabledBtn]}
                disabled={!content.trim() && !image}
                onPress={() => setStep(2)}
                activeOpacity={0.7}
              >
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <View style={styles.userInfoRow}>
                <Image
                  source={{ uri: currentUser?.avatar_url || 'https://via.placeholder.com/150' }}
                  style={styles.userAvatar}
                />
                <View>
                  <Text style={styles.userName}>{currentUser?.full_name || 'Zunexhire User'}</Text>
                  <TouchableOpacity style={styles.audienceSelector} onPress={() => setStep(2)} activeOpacity={0.7}>
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
                  <Image
                    source={{ uri: image }}
                    style={[styles.previewImage, { aspectRatio: imageAspectRatio }]}
                    resizeMode="contain"
                  />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage} activeOpacity={0.8}>
                    <Ionicons name="trash-outline" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <View style={styles.bottomBar}>
              <TouchableOpacity onPress={pickImage} style={styles.mediaOption} activeOpacity={0.7}>
                <Ionicons name="images" size={24} color="#45bd62" />
                <Text style={styles.mediaOptionText}>Photo / Video</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={24} color="#050505" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Post Audience</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionHeader}>Who can see your post?</Text>

              <TouchableOpacity style={styles.audienceOption} onPress={() => setAudience('public')} activeOpacity={0.7}>
                <Ionicons name="globe-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Public</Text>
                  <Text style={styles.optionSub}>Anyone on or off Zunexhire</Text>
                </View>
                {audience === 'public' && <Ionicons name="checkmark" size={22} color="#1877f2" />}
              </TouchableOpacity>

              <TouchableOpacity style={styles.audienceOption} onPress={() => setAudience('friends')} activeOpacity={0.7}>
                <Ionicons name="people-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Friends</Text>
                  <Text style={styles.optionSub}>Your friends on Zunexhire</Text>
                </View>
                {audience === 'friends' && <Ionicons name="checkmark" size={22} color="#1877f2" />}
              </TouchableOpacity>

              <TouchableOpacity style={styles.audienceOption} onPress={() => setAudience('private')} activeOpacity={0.7}>
                <Ionicons name="lock-closed-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Only me</Text>
                  <Text style={styles.optionSub}>Only you can see this post</Text>
                </View>
                {audience === 'private' && <Ionicons name="checkmark" size={22} color="#1877f2" />}
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.finalPostContainer}>
              <TouchableOpacity style={styles.finalPostBtn} onPress={handleFinalPost} disabled={loading} activeOpacity={0.8}>
                {loading ? <Loader /> : <Text style={styles.finalPostBtnText}>Post Now</Text>}
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
  imageContainer: {
    position: 'relative',
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f2f5',
    width: '100%',
  },
  previewImage: {
    width: '100%',
    backgroundColor: '#000000',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
    marginBottom: 16,
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
