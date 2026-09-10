import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import { LikeButton } from '../../components/LikeButton';
import { supabase } from '../../services/supabase';

interface PostLikeSectionProps {
  postId: string;
  isLiked?: boolean;
  totalReactions: number;
  userReaction?: string;
  onUpdate?: () => void;
}

const FB_REACTIONS = [
  { id: 'like', label: 'Like', color: '#1877f2', icon: 'https://raw.githubusercontent.com/facebook/react-native/main/packages/rn-tester/js/assets/like.png' },
  { id: 'love', label: 'Love', color: '#f33e58', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02a.png' },
  { id: 'care', label: 'Care', color: '#f7b125', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02e.png' },
  { id: 'haha', label: 'Haha', color: '#f7b125', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02b.png' },
  { id: 'wow', label: 'Wow', color: '#f7b125', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02c.png' },
  { id: 'sad', label: 'Sad', color: '#f7b125', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02d.png' },
  { id: 'angry', label: 'Angry', color: '#e9710f', icon: 'https://images.rawpixel.com/image_png_800/2022/10/rm378-02f.png' },
];

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

    const wasLikedBefore = localIsLiked;
    const willBeLikedNow = nextIsLiked;

    let countChange = 0;
    if (!wasLikedBefore && willBeLikedNow) countChange = 1;
    else if (wasLikedBefore && !willBeLikedNow) countChange = -1;

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
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Modal visible={showReactionPicker} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowReactionPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.reactionPickerPopup}>
              {FB_REACTIONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleLikeToggle(item.id)}
                  style={styles.emojiBtn}
                >
                  <Image source={{ uri: item.icon }} style={styles.reactionIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionPickerPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 35,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emojiBtn: {
    padding: 4,
  },
  reactionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
});
