import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { fetchUserProfile, updateUserProfile } from '../../services/userService';
import { Loader } from '../../components/Loader';

interface EditProfileScreenProps {
  navigation: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>({});
  
  // Modal states for editing dynamic fields
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
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text || '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover & Profile Images Section */}
        <View style={styles.imagesSection}>
          <View style={styles.coverContainer}>
            <Image
              source={{ uri: profile?.cover_url || 'https://via.placeholder.com/800x400' }}
              style={styles.coverImage}
            />
            <TouchableOpacity style={styles.cameraIconCover}>
              <Ionicons name="camera" size={18} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.cameraIconAvatar}>
              <Ionicons name="camera" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Intro Accordion Group */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Intro</Text>
          <Ionicons name="chevron-up" size={20} color={theme.colors.textSecondary || '#65676b'} />
        </View>

        <TouchableOpacity 
          style={styles.itemRow} 
          onPress={() => handleEditPress('bio', profile?.bio)}
        >
          <Ionicons name="hand-left-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>{profile?.bio || 'About you'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <Ionicons name="pin-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>Pinned details</Text>
        </TouchableOpacity>

        {/* Personal Details Accordion Group */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal details</Text>
          <Ionicons name="chevron-up" size={20} color={theme.colors.textSecondary || '#65676b'} />
        </View>

        <TouchableOpacity 
          style={styles.itemRow} 
          onPress={() => handleEditPress('current_city', profile?.current_city)}
        >
          <Ionicons name="location-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>{profile?.current_city || 'Current city or town'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemRow} 
          onPress={() => handleEditPress('home_town', profile?.home_town)}
        >
          <Ionicons name="home-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>{profile?.home_town || 'Home town'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemRowWithEdit}
          onPress={() => handleEditPress('dob', profile?.dob)}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="cake-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
            <Text style={styles.itemText}>{profile?.dob || 'Add Birthday'}</Text>
          </View>
          <Ionicons name="pencil" size={18} color={theme.colors.textSecondary || '#65676b'} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemRow} 
          onPress={() => handleEditPress('relationship_status', profile?.relationship_status)}
        >
          <Ionicons name="heart-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>{profile?.relationship_status || 'Relationship status'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <Ionicons name="people-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>Family</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemRowWithEdit}
          onPress={() => handleEditPress('gender', profile?.gender)}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="male-female-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
            <Text style={styles.itemText}>{profile?.gender || 'Gender'}</Text>
          </View>
          <Ionicons name="pencil" size={18} color={theme.colors.textSecondary || '#65676b'} />
        </TouchableOpacity>

        {/* Hobbies Section */}
        <TouchableOpacity style={styles.sectionHeader}>
          <View style={styles.rowLeft}>
            <Ionicons name="shapes-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
            <Text style={styles.sectionTitle}>Hobbies</Text>
          </View>
        </TouchableOpacity>

        {/* Interests Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Ionicons name="chevron-up" size={20} color={theme.colors.textSecondary || '#65676b'} />
        </View>

        <TouchableOpacity style={styles.itemRow}>
          <Ionicons name="musical-notes-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>Music</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <Ionicons name="tv-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>TV programmes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <Ionicons name="film-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>Films</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRow}>
          <Ionicons name="game-controller-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>Games</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemRowWithEdit}
          onPress={() => handleEditPress('sports', profile?.sports)}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="shirt-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
            <View>
              <Text style={styles.itemText}>Sports teams and athletes</Text>
              {profile?.sports ? <Text style={styles.subText}>{profile.sports}</Text> : null}
            </View>
          </View>
          <Ionicons name="pencil" size={18} color={theme.colors.textSecondary || '#65676b'} />
        </TouchableOpacity>

        {/* Links Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Links</Text>
          <Ionicons name="chevron-up" size={20} color={theme.colors.textSecondary || '#65676b'} />
        </View>

        <TouchableOpacity 
          style={styles.itemRowWithEdit}
          onPress={() => handleEditPress('website', profile?.website)}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="link-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
            <View>
              <Text style={styles.itemText}>Links</Text>
              {profile?.website ? <Text style={styles.subText}>{profile.website}</Text> : null}
            </View>
          </View>
          <Ionicons name="pencil" size={18} color={theme.colors.textSecondary || '#65676b'} />
        </TouchableOpacity>

        {/* Contact Info Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact info</Text>
          <Ionicons name="chevron-up" size={20} color={theme.colors.textSecondary || '#65676b'} />
        </View>

        <TouchableOpacity style={styles.itemRow}>
          <Ionicons name="at-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>Social media</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemRowWithEdit}
          onPress={() => handleEditPress('phone', profile?.phone)}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="call-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
            <View>
              <Text style={styles.itemText}>{profile?.phone || 'Add phone number'}</Text>
            </View>
          </View>
          <Ionicons name="pencil" size={18} color={theme.colors.textSecondary || '#65676b'} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemRow}
          onPress={() => handleEditPress('email', profile?.email)}
        >
          <Ionicons name="mail-outline" size={22} color={theme.colors.text || '#000'} style={styles.itemIcon} />
          <Text style={styles.itemText}>{profile?.email || 'Add email address'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Generic Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update {editingField.replace('_', ' ')}</Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter details..."
              placeholderTextColor="#999"
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
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    paddingBottom: 40,
  },
  imagesSection: {
    marginBottom: 20,
  },
  coverContainer: {
    height: 160,
    backgroundColor: '#ccc',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  cameraIconCover: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#e4e6eb',
    padding: 8,
    borderRadius: 20,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    position: 'relative',
    marginTop: -50,
    marginLeft: 20,
    width: 100,
    height: 100,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  cameraIconAvatar: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#e4e6eb',
    padding: 6,
    borderRadius: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemRowWithEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemText: {
    fontSize: 15,
    color: '#050505',
  },
  subText: {
    fontSize: 13,
    color: '#65676b',
    marginTop: 2,
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
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 20,
    color: '#000',
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
