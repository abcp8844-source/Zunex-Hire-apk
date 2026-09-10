import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LikeButton } from '../../components/LikeButton';
import { supabase } from '../../services/postService';

interface PostLikeSectionProps {
  postId: string;
  isLiked?: boolean;
  totalReactions: number;
  userReaction?: string;
  onUpdate?: () => void;
}

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
  const [localUserReaction, setLocalUserReaction] = useState<string | undefined>(userReaction);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<{ isLiked: boolean; reactionType: string }>({
    isLiked: Boolean(isLiked),
    reactionType: userReaction || 'like',
  });

  useEffect(() => {
    setLocalIsLiked(Boolean(isLiked));
    setLocalTotalReactions(Math.max(0, Number(totalReactions) || 0));
    setLocalUserReaction(userReaction);
    pendingStateRef.current = {
      isLiked: Boolean(isLiked),
      reactionType: userReaction || 'like',
    };
  }, [isLiked, totalReactions, userReaction]);

  const syncWithDatabase = async (finalIsLiked: boolean, reactionType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (finalIsLiked) {
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

      if (onUpdate) {
        onUpdate();
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

    pendingStateRef.current = {
      isLiked: nextIsLiked,
      reactionType: selectedReaction,
    };

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      syncWithDatabase(
        pendingStateRef.current.isLiked,
        pendingStateRef.current.reactionType
      );
    }, 6000);
  };

  return (
    <View style={styles.container}>
      {showReactionPicker && (
        <View style={styles.reactionPickerPopup}>
          <TouchableOpacity onPress={() => handleLikeToggle('like')}>
            <Text style={styles.pickerEmoji}>👍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLikeToggle('love')}>
            <Text style={styles.pickerEmoji}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLikeToggle('care')}>
            <Text style={styles.pickerEmoji}>🥰</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLikeToggle('haha')}>
            <Text style={styles.pickerEmoji}>😆</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLikeToggle('wow')}>
            <Text style={styles.pickerEmoji}>😮</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLikeToggle('sad')}>
            <Text style={styles.pickerEmoji}>😢</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLikeToggle('angry')}>
            <Text style={styles.pickerEmoji}>😡</Text>
          </TouchableOpacity>
        </View>
      )}

      <LikeButton
        isLiked={localIsLiked}
        likeCount={localTotalReactions}
        onPress={() => handleLikeToggle(localUserReaction || 'like')}
        onLongPress={() => setShowReactionPicker(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  reactionPickerPopup: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
  pickerEmoji: {
    fontSize: 24,
  },
});
