import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface ShareButtonProps {
  shareCount: number;
  onPress?: () => void;
  shareMessage?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ shareCount, onPress, shareMessage }) => {
  const handlePress = async () => {
    if (onPress) {
      onPress();
      return;
    }

    try {
      await Share.share({
        message: shareMessage || 'Check out this post on Zunexhire',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
      <Ionicons name="arrow-redo-outline" size={18} color={theme.colors.textSecondary} style={styles.icon} />
      <Text style={styles.text}>
        Share {shareCount > 0 ? `(${shareCount})` : ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
