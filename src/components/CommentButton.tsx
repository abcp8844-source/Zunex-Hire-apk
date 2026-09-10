import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface CommentButtonProps {
  commentCount: number;
  onPress: () => void;
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

export const CommentButton: React.FC<CommentButtonProps> = ({ commentCount, onPress }) => {
  const formattedCount = formatNumber(commentCount);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} style={styles.icon} />
      <Text style={styles.text}>
        {formattedCount ? `Comment ${formattedCount}` : 'Comment'}
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
});
