import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { FB_REACTIONS } from '../constants/reactions';
import { supabase } from '../services/postService';

interface LikeButtonProps {
  postId: string;
  isLiked?: boolean;
  totalReactions?: number;
  userReaction?: string;
  onUpdate?: () => void;
}

const formatNumber = (num: number): string => {
  if (!num || num === 0) return '';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  isLiked = false,
  totalReactions = 0,
  userReaction,
  onUpdate,
}) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [localIsLiked, setLocalIsLiked] = useState<boolean>(Boolean(isLiked));
  const [localCount, setLocalCount] = useState<number>(Math.max(0, Number(totalReactions) || 0));
  const [localUserReaction, setLocalUserReaction] = useState<string | undefined>(userReaction);

  const activeRequestController = useRef<AbortController | null>(null);

  useEffect(() => {
    setLocalIsLiked(Boolean(isLiked));
    setLocalCount(Math.max(0, Number(totalReactions) || 0));
    setLocalUserReaction(userReaction);
  }, [isLiked, totalReactions, userReaction]);

  const syncWithDatabase = async (finalIsLiked: boolean, reactionType: string) => {
    if (activeRequestController.current) {
      activeRequestController.current.abort();
    }
    activeRequestController.current = new AbortController();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (finalIsLiked) {
        const reactionPayload = {
          post_id: postId,
          user_id: user.id,
          like: reactionType === 'like',
          love: reactionType === 'love',
          care: reactionType === 'care',
          haha: reactionType === 'haha',
          wow: reactionType === 'wow',
          sad: reactionType === 'sad',
          angry: reactionType === 'angry',
        };

        await supabase
          .from('likes')
          .upsert(reactionPayload, { onConflict: 'post_id,user_id' });
      } else {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      }

      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error syncing reaction:', error);
      }
    }
  };

  const handleToggleReaction = (selectedReactionKey: string = 'like') => {
    let nextIsLiked = true;
    let nextReaction: string | undefined = selectedReactionKey;

    if (!localIsLiked) {
      nextIsLiked = true;
      nextReaction = selectedReactionKey;
    } else if (localUserReaction === selectedReactionKey) {
      nextIsLiked = false;
      nextReaction = undefined;
    } else {
      nextIsLiked = true;
      nextReaction = selectedReactionKey;
    }

    const countDelta = !localIsLiked && nextIsLiked ? 1 : (localIsLiked && !nextIsLiked ? -1 : 0);
    const nextCount = Math.max(0, localCount + countDelta);

    setLocalIsLiked(nextIsLiked);
    setLocalCount(nextCount);
    setLocalUserReaction(nextReaction);

    syncWithDatabase(nextIsLiked, nextReaction || 'like');
  };

  const reactionsArray = Object.keys(FB_REACTIONS).map((key) => ({
    id: key,
    ...FB_REACTIONS[key],
  }));

  const currentMeta = localIsLiked && localUserReaction && FB_REACTIONS[localUserReaction]
    ? FB_REACTIONS[localUserReaction]
    : null;

  const formattedCountStr = formatNumber(localCount);

  return (
    <View style={styles.container}>
      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.reactionPickerPopup}>
              {reactionsArray.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setShowPicker(false);
                    handleToggleReaction(item.id);
                  }}
                  style={styles.emojiBtn}
                  activeOpacity={0.7}
                >
                  {item.icon ? (
                    <Image source={{ uri: item.icon }} style={styles.popupReactionIcon} />
                  ) : (
                    <Text style={styles.reactionEmojiText}>{item.emoji}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleToggleReaction(localUserReaction || 'like')}
        onLongPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        {localIsLiked && currentMeta ? (
          currentMeta.icon ? (
            <Image source={{ uri: currentMeta.icon }} style={styles.inlineIcon} />
          ) : (
            <Text style={styles.inlineEmoji}>{currentMeta.emoji}</Text>
          )
        ) : (
          <Ionicons
            name="thumbs-up-outline"
            size={20}
            color={theme.colors?.textSecondary || '#65676b'}
            style={styles.ionicIcon}
          />
        )}
        <Text style={[styles.text, localIsLiked && (currentMeta?.color ? { color: currentMeta.color } : styles.likedText)]}>
          {currentMeta ? currentMeta.label : 'Like'} {formattedCountStr ? `(${formattedCountStr})` : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: theme.spacing?.sm || 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ionicIcon: {
    marginRight: 6,
  },
  inlineIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  inlineEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  text: {
    fontSize: theme.typography?.fontSizes?.sm || 13,
    color: theme.colors?.textSecondary || '#65676b',
    fontWeight: '600',
  },
  likedText: {
    color: '#1877f2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionPickerPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  emojiBtn: {
    padding: 3,
  },
  popupReactionIcon: {
    width: 32,
    height: 32,
  },
  reactionEmojiText: {
    fontSize: 28,
  },
});
