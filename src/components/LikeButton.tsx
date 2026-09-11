import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  userReaction?: string;
  onPress: () => void;
  onSelectReaction: (reactionId: string) => void;
}

const FB_REACTIONS = [
  { id: 'like', label: 'Like', icon: 'https://raw.githubusercontent.com/facebook/react-native/main/packages/rn-tester/js/assets/like.png' },
  { id: 'love', label: 'Love', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02a.png' },
  { id: 'care', label: 'Care', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02e.png' },
  { id: 'haha', label: 'Haha', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02b.png' },
  { id: 'wow', label: 'Wow', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02c.png' },
  { id: 'sad', label: 'Sad', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02d.png' },
  { id: 'angry', label: 'Angry', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02f.png' },
];

const formatNumber = (num: number): string => {
  if (!num || num === 0) return '';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likeCount,
  userReaction,
  onPress,
  onSelectReaction,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const formattedCount = formatNumber(likeCount);

  const getReactionMeta = () => {
    if (!isLiked) return { label: 'Like', icon: null, color: theme.colors.textSecondary };
    const current = FB_REACTIONS.find((r) => r.id === userReaction) || FB_REACTIONS[0];
    return {
      label: current.label,
      icon: current.icon,
      color: current.id === 'like' ? '#1877f2' : theme.colors.notification,
    };
  };

  const meta = getReactionMeta();

  return (
    <View style={styles.container}>
      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.reactionPickerPopup}>
              {FB_REACTIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setShowPicker(false);
                    onSelectReaction(item.id);
                  }}
                  style={styles.emojiBtn}
                >
                  <Image source={{ uri: item.icon }} style={styles.reactionIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onLongPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        {meta.icon ? (
          <Image source={{ uri: meta.icon }} style={styles.inlineIcon} />
        ) : (
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? meta.color : theme.colors.textSecondary}
            style={styles.ionicIcon}
          />
        )}
        <Text style={[styles.text, isLiked && { color: meta.color }]}>
          {formattedCount ? `${meta.label} ${formattedCount}` : meta.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ionicIcon: {
    marginRight: 6,
  },
  inlineIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
    borderRadius: 11,
  },
  text: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionPickerPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 40,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  emojiBtn: {
    padding: 4,
  },
  reactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});
