import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onPress: () => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ isLiked, likeCount, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Ionicons 
        name={isLiked ? "heart" : "heart-outline"} 
        size={20} 
        color={isLiked ? theme.colors.notification : theme.colors.textSecondary} 
        style={styles.icon}
      />
      <Text style={[styles.text, isLiked && styles.likedText]}>
        Like {likeCount > 0 ? `(${likeCount})` : ''}
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
    fontWeight: '600',
  },
  likedText: {
    color: theme.colors.notification,
    fontWeight: '700',
  },
});
