import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { theme } from '../../theme';

interface MediaViewerScreenProps {
  imageUrl: string;
  onClose: () => void;
}

export const MediaViewerScreen: React.FC<MediaViewerScreenProps> = ({ imageUrl, onClose }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
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
    padding: theme.spacing.sm || 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: theme.colors?.white || '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
