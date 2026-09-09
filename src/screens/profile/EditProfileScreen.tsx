import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile, supabase } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface EditProfileScreenProps {
  navigation: any;
  route?: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation, route }) => {
  const [fullName, setFullName] = useState(route?.params?.currentName || '');
  const [bio, setBio] = useState(route?.params?.currentBio || '');
  const [avatar, setAvatar] = useState(route?.params?.currentAvatar || null);
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = avatar;

      if (avatar && avatar.startsWith('file://')) {
        const response = await fetch(avatar);
        const blob = await response.blob();
        const fileExt = avatar.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, blob);

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        avatarUrl = publicURLData.publicUrl;
      }

      await updateProfile({
        full_name: fullName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl,
      });

      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Unable to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading} activeOpacity={0.7}>
          {loading ? <Loader /> : <Text style={[styles.headerButton, styles.saveText]}>Save</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar} activeOpacity={0.8}>
          <Image 
            source={{ uri: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' }} 
            style={styles.avatar} 
          />
          <View style={styles.cameraIconBadge}>
            <Ionicons name="camera" size={16} color="#ffffff" />
          </View>
          <Text style={styles.changePhotoText}>Edit Profile Picture</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          style={styles.input} 
          value={fullName} 
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput 
          style={[styles.input, styles.bioInput]} 
          value={bio} 
          onChangeText={setBio} 
          multiline
          placeholder="Write something about yourself..."
          placeholderTextColor="#9ca3af"
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card || '#ffffff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e5e7eb',
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
  saveText: {
    color: theme.colors.primary || '#1e293b',
    fontWeight: 'bold',
  },
  form: {
    padding: theme.spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.grayLight || '#f3f4f6',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 35,
    right: '38%',
    backgroundColor: theme.colors.primary || '#1e293b',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  changePhotoText: {
    color: theme.colors.primary || '#1e293b',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
    marginTop: 4,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    backgroundColor: '#fdfdfd',
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
});
