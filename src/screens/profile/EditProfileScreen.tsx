import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Loader } from '../../components/Loader';
import { fetchUserProfile, updateUserProfile, uploadMedia } from '../../services/userService';

interface EditProfileScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const COVER_ASPECT_RATIO = 16 / 9;

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('');

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      if (data) {
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
        setWebsite(data.website || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setCurrentCity(data.current_city || '');
        setAvatarUrl(data.avatar_url || null);
        setCoverUrl(data.cover_url || null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async (type: 'avatar' | 'cover') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      if (type === 'avatar') {
        setAvatarUrl(selectedUri);
      } else {
        setCoverUrl(selectedUri);
      }
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      let finalAvatarUrl = avatarUrl;
      let finalCoverUrl = coverUrl;

      if (avatarUrl && !avatarUrl.startsWith('http')) {
        if (typeof uploadMedia === 'function') {
          finalAvatarUrl = await uploadMedia(avatarUrl, 'avatars');
        }
      }

      if (coverUrl && !coverUrl.startsWith('http')) {
        if (typeof uploadMedia === 'function') {
          finalCoverUrl = await uploadMedia(coverUrl, 'covers');
        }
      }

      const updatedProfile = {
        full_name: fullName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        website: website.trim(),
        email: email.trim(),
        phone: phone.trim(),
        current_city: currentCity.trim(),
        avatar_url: finalAvatarUrl,
        cover_url: finalCoverUrl,
      };

      await updateUserProfile(updatedProfile);
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveAll} disabled={saving} style={styles.saveHeaderBtn}>
            {saving ? <Loader /> : <Text style={styles.saveHeaderBtnText}>Save</Text>}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.imagesSection}>
            <TouchableOpacity
              style={styles.coverContainer}
              onPress={() => handlePickImage('cover')}
              activeOpacity={0.9}
            >
              {coverUrl ? (
                <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
              ) : (
                <View style={styles.defaultCoverPlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#8a8d91" />
                </View>
              )}
              <View style={styles.editCoverBadge}>
                <Ionicons name="camera" size={14} color="#ffffff" />
              </View>
            </TouchableOpacity>

            <View style={styles.avatarWrapper}>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => handlePickImage('avatar')}
                activeOpacity={0.9}
              >
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.defaultAvatarPlaceholder}>
                    <Ionicons name="person" size={36} color="#1c2b33" />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editAvatarBadge}
                onPress={() => handlePickImage('avatar')}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={12} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor="#8a8d91"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor="#8a8d91"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Write a short bio..."
                placeholderTextColor="#8a8d91"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current City</Text>
              <TextInput
                style={styles.input}
                value={currentCity}
                onChangeText={setCurrentCity}
                placeholder="Enter current city"
                placeholderTextColor="#8a8d91"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="https://website.com"
                placeholderTextColor="#8a8d91"
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#8a8d91"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#8a8d91"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
  },
  saveHeaderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: '#1877f2',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveHeaderBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imagesSection: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    paddingBottom: 16,
  },
  coverContainer: {
    width: width,
    height: width / COVER_ASPECT_RATIO,
    backgroundColor: '#e4e6eb',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  defaultCoverPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e4e6eb',
  },
  editCoverBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: -35,
    marginLeft: 16,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  defaultAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    backgroundColor: '#e4e6eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1877f2',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e4e6eb',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#65676b',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f0f2f5',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 14,
    color: '#050505',
    borderWidth: 1,
    borderColor: '#e4e6eb',
  },
  bioInput: {
    height: 70,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
});
