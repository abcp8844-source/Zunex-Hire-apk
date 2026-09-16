import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

interface MediaViewerScreenProps {
  imageUrl: string;
  onClose: () => void;
}

export const MediaViewerScreen: React.FC<MediaViewerScreenProps> = ({ imageUrl, onClose }) => {
  const optimizedUri = getOptimizedImageUrl(imageUrl, 1200) || imageUrl;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose} 
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={24} color={theme.colors?.white || '#ffffff'} />
      </TouchableOpacity>
      <Image source={{ uri: optimizedUri }} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: theme.spacing?.sm || 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
