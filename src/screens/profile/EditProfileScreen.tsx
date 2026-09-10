import { Loader } from '../../components/Loader';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { fetchUserProfile, updateUserProfile } from '../../services/userService';

interface EditProfileScreenProps {
  navigation: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>({});
  
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = (fieldKey: string, currentValue: string) => {
    setEditingField(fieldKey);
    setInputValue(currentValue || '');
    setModalVisible(true);
  };

  const handleSaveField = async () => {
    try {
      setSaving(true);
      const updatedData = { ...profile, [editingField]: inputValue };
      await updateUserProfile(updatedData);
      setProfile(updatedData);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update field.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Cover & Profile Header */}
          <View style={styles.imagesSection}>
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: profile?.cover_url || 'https://via.placeholder.com/800x400' }}
                style={styles.coverImage}
              />
            </View>
            <View style={styles.profileInfoRow}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{profile?.full_name || 'User Profile'}</Text>
                <Text style={styles.profileSubText}>Public profile info</Text>
              </View>
            </View>
          </View>

          {/* Section: Bio */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About You</Text>
          </View>

          <TouchableOpacity 
            style={styles.itemRow} 
            onPress={() => handleEditPress('bio', profile?.bio)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name="information" size={18} color="#1877f2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemLabel}>Bio</Text>
                <Text style={styles.itemValue}>{profile?.bio || 'Add a short bio'}</Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="create-outline" size={16} color="#1877f2" />
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          {/* Section: Contact & Links */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact & Links</Text>
          </View>

          <TouchableOpacity 
            style={styles.itemRow}
            onPress={() => handleEditPress('website', profile?.website)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name="link" size={18} color="#1877f2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemLabel}>Website</Text>
                <Text style={styles.itemValue}>{profile?.website || 'Add website link'}</Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="create-outline" size={16} color="#1877f2" />
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.itemRow}
            onPress={() => handleEditPress('email', profile?.email)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name="mail" size={18} color="#1877f2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemLabel}>Email</Text>
                <Text style={styles.itemValue}>{profile?.email || 'Add email address'}</Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="create-outline" size={16} color="#1877f2" />
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.itemRow}
            onPress={() => handleEditPress('phone', profile?.phone)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name="call" size={18} color="#1877f2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemLabel}>Phone</Text>
                <Text style={styles.itemValue}>{profile?.phone || 'Add phone number'}</Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="create-outline" size={16} color="#1877f2" />
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          {/* Section: Personal Details */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          <TouchableOpacity 
            style={styles.itemRow} 
            onPress={() => handleEditPress('current_city', profile?.current_city)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name="location" size={18} color="#1877f2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemLabel}>Current City</Text>
                <Text style={styles.itemValue}>{profile?.current_city || 'Add current city'}</Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="create-outline" size={16} color="#1877f2" />
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.itemRow} 
            onPress={() => handleEditPress('dob', profile?.dob)}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconWrapper}>
                <Ionicons name="calendar" size={18} color="#1877f2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemLabel}>Birthday</Text>
                <Text style={styles.itemValue}>{profile?.dob || 'Add birthday'}</Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="create-outline" size={16} color="#1877f2" />
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Edit Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Update Information</Text>
              <TextInput
                style={styles.modalInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Enter details..."
                placeholderTextColor="#999"
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveBtn} 
                  onPress={handleSaveField}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader />
                  ) : (
                    <Text style={styles.saveBtnText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  scrollContent: {
    paddingBottom: 30,
  },
  imagesSection: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    paddingBottom: 16,
  },
  coverContainer: {
    height: 140,
    backgroundColor: '#e4e6eb',
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -30,
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
  },
  nameContainer: {
    marginLeft: 12,
    marginTop: 25,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
  },
  profileSubText: {
    fontSize: 12,
    color: '#65676b',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#65676b',
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e7f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#65676b',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 15,
    color: '#050505',
    marginTop: 1,
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1877f2',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#050505',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccd0d5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#f5f6f7',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelBtnText: {
    color: '#65676b',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#1877f2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
