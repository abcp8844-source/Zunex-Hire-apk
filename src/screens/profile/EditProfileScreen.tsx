import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

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
    setLoading(true);
    await updateUserProfile({ fullName, bio, avatar });
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? <Loader /> : <Text style={[styles.headerButton, styles.saveText]}>Save</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar}>
          <Image source={{ uri: avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
          <Text style={styles.changePhotoText}>Change Profile Picture</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        <Text style={styles.label}>Bio</Text>
        <TextInput style={styles.input} value={bio} onChangeText={setBio} multiline />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  form: {
    padding: theme.spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.grayLight,
  },
  changePhotoText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
});
