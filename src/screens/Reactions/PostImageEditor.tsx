import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface PostImageEditorProps {
  imageUrl: string;
  onImagePicked: (uri: string) => void;
  onImageDeleted: () => void;
}

export const PostImageEditor: React.FC<PostImageEditorProps> = ({
  imageUrl,
  onImagePicked,
  onImageDeleted,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const pickImageWithoutCrop = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImagePicked(result.assets[0].uri);
    }
  };

  const handleEditOption = () => {
    setMenuVisible(true);
  };

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.postImagePreview}
            resizeMode="contain"
          />
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onImageDeleted}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#ff3b30" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditOption}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#050505" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.pickButton}
          onPress={pickImageWithoutCrop}
          activeOpacity={0.7}
        >
          <Ionicons name="image-outline" size={24} color="#1877f2" />
          <Text style={styles.pickButtonText}>Add Photo</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                pickImageWithoutCrop();
              }}
            >
              <Ionicons name="image-outline" size={20} color="#050505" />
              <Text style={styles.menuText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  imageContainer: {
    width: '100%',
  },
  postImagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#f0f2f5',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  deleteText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '600',
  },
  editText: {
    color: '#050505',
    fontSize: 14,
    fontWeight: '600',
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1877f2',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 60,
    gap: 8,
    backgroundColor: '#f7f8fa',
  },
  pickButtonText: {
    color: '#1877f2',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 200,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  menuText: {
    fontSize: 15,
    color: '#050505',
  },
});
