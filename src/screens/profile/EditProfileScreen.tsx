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
  ActivityIndicator,
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
  const [savingField, setSavingField] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<any>({});

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
        setInitialData(data);
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
    } catch (error: any) {
      Alert.alert('Load Error', error.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickAndUploadImage = async (type: 'avatar' | 'cover') => {
    try {
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
        const fieldKey = type === 'avatar' ? 'avatar_url' : 'cover_url';
        
        setSavingField(fieldKey);

        const folderName = type === 'avatar' ? 'avatars' : 'covers';
        const uploadedPublicUrl = await uploadMedia(selectedUri, folderName);

        if (!uploadedPublicUrl) {
          throw new Error('Image upload failed. Server returned empty URL.');
        }

        await updateUserProfile({ [fieldKey]: uploadedPublicUrl });

        if (type === 'avatar') {
          setAvatarUrl(uploadedPublicUrl);
          setInitialData((prev: any) => ({ ...prev, avatar_url: uploadedPublicUrl }));
        } else {
          setCoverUrl(uploadedPublicUrl);
          setInitialData((prev: any) => ({ ...prev, cover_url: uploadedPublicUrl }));
        }

        Alert.alert('Success', `${type === 'avatar' ? 'Avatar' : 'Cover'} image uploaded successfully.`);
      }
    } catch (error: any) {
      Alert.alert('Upload Failed', `Image upload error: ${error.message || 'Invalid image format or network issue.'}`);
    } finally {
      setSavingField(null);
    }
  };

  const handleSaveSingleField = async (fieldKey: string, value: string) => {
    try {
      setSavingField(fieldKey);
      const cleanValue = value.trim();

      await updateUserProfile({ [fieldKey]: cleanValue });

      setInitialData((prev: any) => ({ ...prev, [fieldKey]: cleanValue }));
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error: any) {
      Alert.alert('Save Error', `Failed to update ${fieldKey}: ${error.message || 'Unknown error.'}`);
    } finally {
      setSavingField(null);
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
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.imagesSection}>
            <TouchableOpacity
              style={styles.coverContainer}
              onPress={() => handlePickAndUploadImage('cover')}
              activeOpacity={0.9}
              disabled={savingField === 'cover_url'}
            >
              {coverUrl ? (
                <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
              ) : (
                <View style={styles.defaultCoverPlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#8a8d91" />
                </View>
              )}
              <View style={styles.editCoverBadge}>
                {savingField === 'cover_url' ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="camera" size={14} color="#ffffff" />
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.avatarWrapper}>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => handlePickAndUploadImage('avatar')}
                activeOpacity={0.9}
                disabled={savingField === 'avatar_url'}
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
                onPress={() => handlePickAndUploadImage('avatar')}
                activeOpacity={0.8}
                disabled={savingField === 'avatar_url'}
              >
                {savingField === 'avatar_url' ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="camera" size={12} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formCard}>
            <FieldRow
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              isChanged={fullName !== (initialData.full_name || '')}
              isSaving={savingField === 'full_name'}
              onSave={() => handleSaveSingleField('full_name', fullName)}
            />

            <FieldRow
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              autoCapitalize="none"
              isChanged={username !== (initialData.username || '')}
              isSaving={savingField === 'username'}
              onSave={() => handleSaveSingleField('username', username)}
            />

            <FieldRow
              label="Bio"
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio..."
              multiline
              isChanged={bio !== (initialData.bio || '')}
              isSaving={savingField === 'bio'}
              onSave={() => handleSaveSingleField('bio', bio)}
            />

            <FieldRow
              label="Current City"
              value={currentCity}
              onChangeText={setCurrentCity}
              placeholder="Enter current city"
              isChanged={currentCity !== (initialData.current_city || '')}
              isSaving={savingField === 'current_city'}
              onSave={() => handleSaveSingleField('current_city', currentCity)}
            />

            <FieldRow
              label="Website"
              value={website}
              onChangeText={setWebsite}
              placeholder="https://website.com"
              autoCapitalize="none"
              keyboardType="url"
              isChanged={website !== (initialData.website || '')}
              isSaving={savingField === 'website'}
              onSave={() => handleSaveSingleField('website', website)}
            />

            <FieldRow
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              autoCapitalize="none"
              keyboardType="email-address"
              isChanged={email !== (initialData.email || '')}
              isSaving={savingField === 'email'}
              onSave={() => handleSaveSingleField('email', email)}
            />

            <FieldRow
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              isChanged={phone !== (initialData.phone || '')}
              isSaving={savingField === 'phone'}
              onSave={() => handleSaveSingleField('phone', phone)}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

interface FieldRowProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isChanged: boolean;
  isSaving: boolean;
  onSave: () => void;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: any;
}

const FieldRow: React.FC<FieldRowProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  isChanged,
  isSaving,
  onSave,
  multiline = false,
  autoCapitalize,
  keyboardType,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRowContainer}>
        <TextInput
          style={[styles.input, multiline && styles.bioInput, isChanged && styles.inputActive]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8a8d91"
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
        />
        {isChanged && (
          <TouchableOpacity
            style={styles.fieldSaveBtn}
            onPress={onSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.fieldSaveBtnText}>Save</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
    width: 26,
    height: 26,
    borderRadius: 13,
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
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#65676b',
    marginBottom: 4,
  },
  inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 14,
    color: '#050505',
    borderWidth: 1,
    borderColor: '#e4e6eb',
  },
  inputActive: {
    borderColor: '#1877f2',
    backgroundColor: '#ffffff',
  },
  bioInput: {
    height: 70,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  fieldSaveBtn: {
    marginLeft: 8,
    backgroundColor: '#1877f2',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 55,
  },
  fieldSaveBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
