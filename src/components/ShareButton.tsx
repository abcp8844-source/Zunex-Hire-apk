import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface ShareButtonProps {
  shareCount?: number;
  onPress?: () => void;
  shareMessage?: string;
  shareUrl?: string;
}

const formatNumber = (num: number): string => {
  if (!num || num === 0) return '';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  shareCount = 0, 
  onPress, 
  shareMessage,
  shareUrl 
}) => {
  const handlePress = async () => {
    if (onPress) {
      onPress();
      return;
    }

    try {
      const result = await Share.share({
        message: shareMessage || 'Check out this post on Zunexhire',
        url: shareUrl,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error: any) {
      console.error('Error sharing post:', error.message);
    }
  };

  const formattedCount = formatNumber(shareCount);

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
      <Ionicons 
        name="arrow-redo-outline" 
        size={20} 
        color={theme.colors?.textSecondary || '#65676b'} 
        style={styles.icon} 
      />
      <Text style={styles.text}>
        {formattedCount ? `Share (${formattedCount})` : 'Share'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: theme.spacing?.sm || 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: theme.typography?.fontSizes?.sm || 13,
    color: theme.colors?.textSecondary || '#65676b',
    fontWeight: '600',
  },
});
