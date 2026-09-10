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
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { createPost } from '../../services/postService';
import { getCurrentUserProfile } from '../../services/userService';
import { STICKERS_LIST } from '../../emojis';

interface CreatePostScreenProps {
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onClose, onPostCreated }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [audience, setAudience] = useState<'public' | 'friends' | 'private'>('public');
  const [activeEditorTool, setActiveEditorTool] = useState<string | null>(null);
  
  // Editor States
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [imageText, setImageText] = useState('');
  const [tempImageText, setTempImageText] = useState('');

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
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
    setActiveEditorTool(null);
    setSelectedStickers([]);
    setImageText('');
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

  const addStickerToImage = (sticker: string) => {
    setSelectedStickers((prev) => [...prev, sticker]);
  };

  const saveEditorChanges = () => {
    setImageText(tempImageText);
    setStep(1);
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View style={styles.container}>
        {step === 1 && (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={26} color="#050505" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>New post</Text>
              <TouchableOpacity
                style={[styles.nextBtn, (!content && !image) && styles.disabledBtn]}
                disabled={!content && !image}
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
                  <Text style={styles.userName}>{currentUser?.full_name || 'User'}</Text>
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
                <View style={styles.imageWrapperContainer}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />
                    
                    {selectedStickers.map((st, index) => (
                      <Text key={index} style={styles.floatingSticker}>{st}</Text>
                    ))}

                    {imageText ? (
                      <Text style={styles.floatingTextPreview}>{imageText}</Text>
                    ) : null}

                    <View style={styles.imageTopControls}>
                      <TouchableOpacity style={styles.topControlBtn} onPress={pickImage} activeOpacity={0.8}>
                        <Ionicons name="add" size={18} color="#ffffff" />
                        <Text style={styles.topControlText}>Add media</Text>
                      </TouchableOpacity>

                      <View style={styles.topIconGroup}>
                        <TouchableOpacity style={styles.iconCircleBtn} onPress={() => setStep(3)} activeOpacity={0.8}>
                          <Ionicons name="ellipsis-horizontal" size={18} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconCircleBtn} onPress={() => setStep(3)} activeOpacity={0.8}>
                          <Ionicons name="pencil" size={18} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconCircleBtn} onPress={removeImage} activeOpacity={0.8}>
                          <Ionicons name="trash-outline" size={18} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.bottomBar}>
              <TouchableOpacity onPress={pickImage} style={styles.mediaOption} activeOpacity={0.7}>
                <Ionicons name="images" size={24} color="#45bd62" />
                <Text style={styles.mediaOptionText}>Photo/video</Text>
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
              <Text style={styles.headerTitle}>Post Settings</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <View style={styles.previewBox}>
                <Text style={styles.previewContent}>{content || 'Image Post'}</Text>
              </View>

              <Text style={styles.sectionHeader}>Post Audience</Text>

              <TouchableOpacity style={styles.audienceOption} onPress={() => setAudience('public')} activeOpacity={0.7}>
                <Ionicons name="globe-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Public</Text>
                  <Text style={styles.optionSub}>Anyone on or off app</Text>
                </View>
                {audience === 'public' && <Ionicons name="checkmark" size={22} color="#1877f2" />}
              </TouchableOpacity>

              <TouchableOpacity style={styles.audienceOption} onPress={() => setAudience('friends')} activeOpacity={0.7}>
                <Ionicons name="people-outline" size={24} color="#1877f2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Friends</Text>
                  <Text style={styles.optionSub}>Your friends on app</Text>
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
                {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.finalPostBtnText}>Post</Text>}
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 3 && (
          <View style={styles.editorContainer}>
            <View style={styles.editorTopBar}>
              <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7}>
                <Ionicons name="close" size={26} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editorMusicPill} activeOpacity={0.8}>
                <Ionicons name="musical-notes" size={16} color="#ffffff" />
                <Text style={styles.editorMusicText}>Add music</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.editorCanvas}>
              {image && (
                <Image source={{ uri: image }} style={styles.editorPreviewImage} resizeMode="contain" />
              )}
              {selectedStickers.map((st, index) => (
                <Text key={index} style={styles.floatingStickerEditor}>{st}</Text>
              ))}
              {tempImageText ? (
                <Text style={styles.floatingTextEditor}>{tempImageText}</Text>
              ) : null}
            </View>

            {activeEditorTool === 'stickers' && (
              <View style={styles.toolDrawer}>
                <Text style={styles.drawerTitle}>Choose Emoji / Sticker</Text>
                <FlatList
                  data={STICKERS_LIST}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.stickerChip} onPress={() => addStickerToImage(item)}>
                      <Text style={styles.stickerEmoji}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {activeEditorTool === 'text' && (
              <View style={styles.toolDrawer}>
                <Text style={styles.drawerTitle}>Add Text on Image</Text>
                <TextInput
                  style={styles.editorTextInput}
                  placeholder="Type something..."
                  placeholderTextColor="#aaa"
                  value={tempImageText}
                  onChangeText={setTempImageText}
                />
              </View>
            )}

            <View style={styles.editorBottomBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomToolsScroll}>
                <TouchableOpacity style={styles.toolItem} onPress={pickImage} activeOpacity={0.7}>
                  <Ionicons name="crop" size={20} color="#ffffff" />
                  <Text style={styles.toolText}>Crop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolItem} onPress={() => setActiveEditorTool('stickers')} activeOpacity={0.7}>
                  <Ionicons name="happy-outline" size={20} color="#ffffff" />
                  <Text style={styles.toolText}>Stickers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolItem} onPress={() => setActiveEditorTool('text')} activeOpacity={0.7}>
                  <Ionicons name="text-outline" size={20} color="#ffffff" />
                  <Text style={styles.toolText}>Text</Text>
                </TouchableOpacity>
              </ScrollView>

              <TouchableOpacity style={styles.editorCheckBtn} onPress={saveEditorChanges} activeOpacity={0.8}>
                <Ionicons name="checkmark" size={22} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: 18,
    color: '#050505',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageWrapperContainer: {
    marginTop: 12,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#000000',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 360,
  },
  floatingSticker: {
    position: 'absolute',
    fontSize: 40,
    alignSelf: 'center',
  },
  floatingTextPreview: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageTopControls: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topControlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  topControlText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  topIconGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircleBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 34,
    height: 34,
    borderRadius: 17,
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
  editorContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  editorTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 60,
  },
  editorMusicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  editorMusicText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  editorCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  editorPreviewImage: {
    width: '100%',
    height: '100%',
  },
  floatingStickerEditor: {
    position: 'absolute',
    fontSize: 50,
    alignSelf: 'center',
  },
  floatingTextEditor: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toolDrawer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  drawerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  stickerChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stickerEmoji: {
    fontSize: 22,
  },
  editorTextInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  editorBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  bottomToolsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toolItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  toolText: {
    color: '#ffffff',
    fontSize: 11,
    marginTop: 4,
  },
  editorCheckBtn: {
    backgroundColor: '#ffffff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
