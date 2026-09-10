import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile, supabase } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface EditProfileScreenProps {
  navigation: any;
  route?: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation, route }) => {
  const profile = route?.params?.profile || {};

  const [avatar, setAvatar] = useState<string | null>(profile?.avatar_url || null);
  const [cover, setCover] = useState<string | null>(profile?.cover_url || null);
  const [bio, setBio] = useState<string>(profile?.bio || '');
  const [dob, setDob] = useState<string>(profile?.dob || '');
  const [gender, setGender] = useState<string>(profile?.gender || '');
  const [website, setWebsite] = useState<string>(profile?.website || '');
  const [phone, setPhone] = useState<string>(profile?.phone || '');

  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('intro');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const pickImage = async (type: 'avatar' | 'cover') => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // Profile picture = 1:1, Cover photo = 16:9 (Banner style)
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (type === 'avatar') {
          setAvatar(result.assets[0].uri);
        } else {
          setCover(result.assets[0].uri);
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to pick image. Please try again.');
    }
  };

  const uploadFileAsync = async (uri: string, folder: string) => {
    if (!uri || !uri.startsWith('file://')) return uri;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('profiles').upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true,
      });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.log(`Background Upload Error (${folder}):`, error);
      return uri;
    }
  };

  const handleSave = async () => {
    setLoading(true);

    // Initial Save & Go Back Immediately (Optimistic UI)
    try {
      const initialProfileData = {
        avatar_url: avatar,
        cover_url: cover,
        bio: bio.trim(),
        dob: dob.trim(),
        gender: gender.trim(),
        website: website.trim(),
        phone: phone.trim(),
      };

      // Instantly save text fields and local image URIs
      await updateProfile(initialProfileData);

      // Navigate back straight away without making user wait
      navigation.goBack();

      // Background Async Processing for Heavy Media Uploads
      setTimeout(async () => {
        try {
          let finalAvatarUrl = avatar;
          let finalCoverUrl = cover;

          if (avatar && avatar.startsWith('file://')) {
            finalAvatarUrl = await uploadFileAsync(avatar, 'avatars');
          }

          if (cover && cover.startsWith('file://')) {
            finalCoverUrl = await uploadFileAsync(cover, 'covers');
          }

          // Quiet background sync once media is uploaded
          if (finalAvatarUrl !== avatar || finalCoverUrl !== cover) {
            await updateProfile({
              ...initialProfileData,
              avatar_url: finalAvatarUrl,
              cover_url: finalCoverUrl,
            });
          }
        } catch (bgError) {
          console.log('Background sync process error:', bgError);
        }
      }, 100);

    } catch (error: any) {
      Alert.alert('Save Failed', error.message || 'Unable to update profile.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text || '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading} activeOpacity={0.7}>
          {loading ? <Loader /> : <Text style={styles.saveText}>Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mediaContainer}>
          <View style={styles.coverBox}>
            <Image
              source={{ uri: cover || 'https://via.placeholder.com/800x450' }}
              style={styles.coverImage}
            />
            <TouchableOpacity style={styles.coverCameraButton} onPress={() => pickImage('cover')}>
              <Ionicons name="camera" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatar || 'https://via.placeholder.com/150' }}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.avatarCameraButton} onPress={() => pickImage('avatar')}>
              <Ionicons name="camera" size={14} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('intro')}>
          <Text style={styles.accordionTitle}>Intro</Text>
          <Ionicons name={expandedSection === 'intro' ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
        </TouchableOpacity>

        {expandedSection === 'intro' && (
          <View style={styles.accordionBody}>
            <Text style={styles.inputLabel}>Bio / About you</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Describe yourself..."
              placeholderTextColor="#9ca3af"
              multiline
            />
          </View>
        )}

        <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('personal')}>
          <Text style={styles.accordionTitle}>Personal details</Text>
          <Ionicons name={expandedSection === 'personal' ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
        </TouchableOpacity>

        {expandedSection === 'personal' && (
          <View style={styles.accordionBody}>
            <View style={styles.rowItem}>
              <Ionicons name="gift-outline" size={20} color="#65676b" />
              <TextInput
                style={styles.inlineInput}
                value={dob}
                onChangeText={setDob}
                placeholder="Date of birth (e.g. 5 July 1998)"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.rowItem}>
              <Ionicons name="transgender-outline" size={20} color="#65676b" />
              <TextInput
                style={styles.inlineInput}
                value={gender}
                onChangeText={setGender}
                placeholder="Gender (e.g. Male, Female)"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('links')}>
          <Text style={styles.accordionTitle}>Links</Text>
          <Ionicons name={expandedSection === 'links' ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
        </TouchableOpacity>

        {expandedSection === 'links' && (
          <View style={styles.accordionBody}>
            <View style={styles.rowItem}>
              <Ionicons name="link-outline" size={20} color="#65676b" />
              <TextInput
                style={styles.inlineInput}
                value={website}
                onChangeText={setWebsite}
                placeholder="Website URL"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('contact')}>
          <Text style={styles.accordionTitle}>Contact info</Text>
          <Ionicons name={expandedSection === 'contact' ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
        </TouchableOpacity>

        {expandedSection === 'contact' && (
          <View style={styles.accordionBody}>
            <View style={styles.rowItem}>
              <Ionicons name="call-outline" size={20} color="#65676b" />
              <TextInput
                style={styles.inlineInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
  },
  saveText: {
    fontSize: 16,
    color: '#1877f2',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  mediaContainer: {
    marginBottom: 20,
  },
  coverBox: {
    width: '100%',
    height: 140,
    backgroundColor: '#e4e6eb',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverCameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -30,
    left: 20,
  },
  avatarImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: '#e4e6eb',
  },
  avatarCameraButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 15,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#050505',
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    color: '#65676b',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e4e6eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#050505',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  inlineInput: {
    flex: 1,
    fontSize: 15,
    color: '#050505',
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    paddingVertical: 6,
  },
});
