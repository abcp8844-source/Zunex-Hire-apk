import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { supabase } from '../../services/postService';

interface PostLikeSectionProps {
  postId: string;
  isLiked?: boolean;
  totalReactions: number;
  userReaction?: string;
  onUpdate?: () => void;
}

const EMOJI_MAP: { [key: string]: { emoji: string; label: string } } = {
  like: { emoji: '👍', label: 'Like' },
  love: { emoji: '❤️', label: 'Love' },
  care: { emoji: '🥰', label: 'Care' },
  haha: { emoji: '😆', label: 'Haha' },
  wow: { emoji: '😮', label: 'Wow' },
  sad: { emoji: '😢', label: 'Sad' },
  angry: { emoji: '😡', label: 'Angry' },
};

export const PostLikeSection: React.FC<PostLikeSectionProps> = ({
  postId,
  isLiked = false,
  totalReactions = 0,
  userReaction,
  onUpdate,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
  const [localIsLiked, setLocalIsLiked] = useState<boolean>(Boolean(isLiked));
  const [localTotalReactions, setLocalTotalReactions] = useState<number>(
    Math.max(0, Number(totalReactions) || 0)
  );
  const [localUserReaction, setLocalUserReaction] = useState<string | undefined>(
    userReaction || (isLiked ? 'like' : undefined)
  );

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const initialStateRef = useRef<{ isLiked: boolean; reactionType: string | undefined }>({
    isLiked: Boolean(isLiked),
    reactionType: userReaction || (isLiked ? 'like' : undefined),
  });

  useEffect(() => {
    setLocalIsLiked(Boolean(isLiked));
    setLocalTotalReactions(Math.max(0, Number(totalReactions) || 0));
    setLocalUserReaction(userReaction || (isLiked ? 'like' : undefined));
    initialStateRef.current = {
      isLiked: Boolean(isLiked),
      reactionType: userReaction || (isLiked ? 'like' : undefined),
    };
  }, [isLiked, totalReactions, userReaction]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const syncWithDatabase = async (finalIsLiked: boolean, reactionType: string | undefined) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (finalIsLiked && reactionType) {
        await supabase
          .from('post_reactions')
          .upsert(
            {
              post_id: postId,
              user_id: user.id,
              reaction_type: reactionType,
            },
            { onConflict: 'post_id,user_id' }
          );
      } else {
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      }
    } catch (error) {
      // Silent error handler
    }
  };

  const handleLikeToggle = (selectedReaction: string = 'like') => {
    setShowReactionPicker(false);

    let nextIsLiked = true;
    let nextReaction: string | undefined = selectedReaction;

    if (localIsLiked && localUserReaction === selectedReaction) {
      nextIsLiked = false;
      nextReaction = undefined;
    }

    const countDelta = nextIsLiked ? (localIsLiked ? 0 : 1) : -1;
    const nextCount = Math.max(0, localTotalReactions + countDelta);

    setLocalIsLiked(nextIsLiked);
    setLocalTotalReactions(nextCount);
    setLocalUserReaction(nextReaction);

    if (onUpdate) {
      onUpdate();
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const initial = initialStateRef.current;
      if (initial.isLiked === nextIsLiked && initial.reactionType === nextReaction) {
        return;
      }

      syncWithDatabase(nextIsLiked, nextReaction);
      initialStateRef.current = { isLiked: nextIsLiked, reactionType: nextReaction };
    }, 6000);
  };

  const currentEmojiObj = localUserReaction ? EMOJI_MAP[localUserReaction] : null;

  return (
    <View style={styles.container}>
      {showReactionPicker && (
        <Modal transparent animationType="fade" visible={showReactionPicker}>
          <TouchableWithoutFeedback onPress={() => setShowReactionPicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.reactionPickerPopup}>
                {Object.keys(EMOJI_MAP).map((key) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => handleLikeToggle(key)}
                    activeOpacity={0.7}
                    style={styles.emojiItem}
                  >
                    <Text style={styles.pickerEmoji}>{EMOJI_MAP[key].emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleLikeToggle(localUserReaction || 'like')}
        onLongPress={() => setShowReactionPicker(true)}
        delayLongPress={200}
        activeOpacity={0.7}
      >
        {localIsLiked && currentEmojiObj ? (
          <Text style={styles.selectedEmoji}>{currentEmojiObj.emoji}</Text>
        ) : (
          <Text style={styles.defaultThumb}>👍</Text>
        )}
        <Text style={styles.actionCountText}>{localTotalReactions}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  defaultThumb: {
    fontSize: 20,
  },
  selectedEmoji: {
    fontSize: 20,
  },
  actionCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65676b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionPickerPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 35,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  emojiItem: {
    padding: 2,
  },
  pickerEmoji: {
    fontSize: 28,
  },
});
