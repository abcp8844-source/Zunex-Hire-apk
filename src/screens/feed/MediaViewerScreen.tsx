import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../theme';

interface MediaViewerScreenProps {
  imageUrl: string;
  onClose: () => void;
}

export const MediaViewerScreen: React.FC<MediaViewerScreenProps> = ({ imageUrl, onClose }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
    padding: theme.spacing.sm,
  },
  closeText: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
