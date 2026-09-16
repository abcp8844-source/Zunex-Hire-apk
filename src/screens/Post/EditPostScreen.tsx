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
  onClose?: () => void;
}

export const PostImageEditor: React.FC<PostImageEditorProps> = ({
  imageUrl,
  onImagePicked,
  onImageDeleted,
  onClose,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const pickImageWithoutCrop = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose || (() => setMenuVisible(false))}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose || (() => setMenuVisible(false))}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (onClose) onClose();
              pickImageWithoutCrop();
            }}
          >
            <Ionicons name="image-outline" size={20} color="#050505" />
            <Text style={styles.menuText}>Change Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (onClose) onClose();
              onImageDeleted();
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#ff3b30" />
            <Text style={[styles.menuText, { color: '#ff3b30' }]}>Delete Photo</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 220,
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
    fontWeight: '500',
  },
});
