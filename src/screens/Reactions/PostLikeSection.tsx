import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
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
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  const handleLikeToggle = (selectedReaction: string = 'like') => {
    let nextIsLiked = !localIsLiked;
    let nextReaction: string | undefined = selectedReaction;

    if (!localIsLiked) {
      nextIsLiked = true;
      nextReaction = selectedReaction;
    } else if (localUserReaction === selectedReaction) {
      nextIsLiked = false;
      nextReaction = undefined;
    } else {
      nextIsLiked = true;
      nextReaction = selectedReaction;
    }

    const countChange = (!localIsLiked && nextIsLiked) ? 1 : ((localIsLiked && !nextIsLiked) ? -1 : 0);
    const nextCount = Math.max(0, localTotalReactions + countChange);

    setLocalIsLiked(nextIsLiked);
    setLocalTotalReactions(nextCount);
    setLocalUserReaction(nextReaction);

    pendingStateRef.current = {
      isLiked: nextIsLiked,
      reactionType: nextReaction || 'like',
    };

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      syncWithDatabase(
        pendingStateRef.current.isLiked,
        pendingStateRef.current.reactionType
      );
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <LikeButton
        isLiked={localIsLiked}
        likeCount={localTotalReactions}
        userReaction={localUserReaction}
        onPress={() => handleLikeToggle(localUserReaction || 'like')}
        onSelectReaction={(reactionId) => handleLikeToggle(reactionId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
