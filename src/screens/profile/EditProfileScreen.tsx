import { Loader } from '../../components/Loader';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserProfile, updateUserProfile } from '../../services/userService';

interface EditProfileScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const COVER_ASPECT_RATIO = 16 / 9;

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Profile Form States
  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');

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
        setAvatarUrl(data.avatar_url || '');
        setCoverUrl(data.cover_url || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const updatedProfile = {
        full_name: fullName,
        username: username,
        bio: bio,
        website: website,
        email: email,
        phone: phone,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveAll} disabled={saving} style={styles.saveHeaderBtn}>
            {saving ? (
              <Loader />
            ) : (
              <Text style={styles.saveHeaderBtnText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Images Section */}
          <View style={styles.imagesSection}>
            {/* Cover Photo - 16:9 Aspect Ratio */}
            <View style={styles.coverContainer}>
              {coverUrl ? (
                <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="cover" />
              ) : (
                <View style={styles.defaultCoverPlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#8a8d91" />
                </View>
              )}
              <TouchableOpacity style={styles.editCoverBadge} activeOpacity={0.8}>
                <Ionicons name="camera" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Profile Photo - Round WhatsApp Style */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.defaultAvatarPlaceholder}>
                    <Ionicons name="person" size={36} color="#1c2b33" />
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.editAvatarBadge} activeOpacity={0.8}>
                <Ionicons name="camera" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Inputs */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
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
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="https://yourwebsite.com"
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
              <Text style={styles.label}>Phone Number (Optional)</Text>
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
  },
  saveHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1877f2',
    borderRadius: 6,
  },
  saveHeaderBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imagesSection: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    paddingBottom: 20,
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
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: -40,
    marginLeft: 16,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  defaultAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#e4e6eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1877f2',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e4e6eb',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#65676b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
    color: '#050505',
    borderWidth: 1,
    borderColor: '#e4e6eb',
  },
  bioInput: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
});
