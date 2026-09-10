import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onPress: () => void;
  onLongPress?: () => void;
}

const formatNumber = (num: number): string => {
  if (!num || num === 0) return '';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likeCount,
  onPress,
  onLongPress,
}) => {
  const formattedCount = formatNumber(likeCount);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={20}
        color={isLiked ? theme.colors.notification : theme.colors.textSecondary}
        style={styles.icon}
      />
      <Text style={[styles.text, isLiked && styles.likedText]}>
        {formattedCount ? `Like ${formattedCount}` : 'Like'}
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
