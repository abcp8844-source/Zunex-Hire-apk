import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LikeButton } from '../../components/LikeButton';
import { toggleLikePost } from '../../services/postService';

interface PostLikeSectionProps {
  postId: string;
  isLiked?: boolean;
  totalReactions: number;
  userReaction?: string;
  onUpdate: () => void;
}

export const PostLikeSection: React.FC<PostLikeSectionProps> = ({
  postId,
  isLiked,
  totalReactions,
  userReaction,
  onUpdate,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localTotalReactions, setLocalTotalReactions] = useState(totalReactions);
  const [localUserReaction, setLocalUserReaction] = useState(userReaction);

  useEffect(() => {
    setLocalIsLiked(isLiked);
    setLocalTotalReactions(totalReactions);
    setLocalUserReaction(userReaction);
  }, [isLiked, totalReactions, userReaction]);

  const handleLike = async (reactionType: string = 'like') => {
    setShowReactionPicker(false);

    const prevIsLiked = localIsLiked;
    const prevTotal = localTotalReactions;
    const prevReaction = localUserReaction;

    if (localIsLiked && localUserReaction === reactionType) {
      setLocalIsLiked(false);
      setLocalTotalReactions(Math.max(0, localTotalReactions - 1));
      setLocalUserReaction(undefined);
    } else {
      const isNew = !localIsLiked;
      setLocalIsLiked(true);
      setLocalTotalReactions(isNew ? localTotalReactions + 1 : localTotalReactions);
      setLocalUserReaction(reactionType);
    }

    try {
      await toggleLikePost(postId, reactionType);
      onUpdate();
    } catch (error) {
      setLocalIsLiked(prevIsLiked);
      setLocalTotalReactions(prevTotal);
      setLocalUserReaction(prevReaction);
    }
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {showReactionPicker && (
        <View style={styles.reactionPickerPopup}>
          <TouchableOpacity onPress={() => handleLike('like')}><Text style={styles.pickerEmoji}>👍</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('love')}><Text style={styles.pickerEmoji}>❤️</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('care')}><Text style={styles.pickerEmoji}>🥰</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('haha')}><Text style={styles.pickerEmoji}>😆</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('wow')}><Text style={styles.pickerEmoji}>😮</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('sad')}><Text style={styles.pickerEmoji}>😢</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('angry')}><Text style={styles.pickerEmoji}>😡</Text></TouchableOpacity>
        </View>
      )}

      <LikeButton
        isLiked={localIsLiked}
        likeCount={localTotalReactions}
        onPress={() => handleLike(localUserReaction || 'like')}
        onLongPress={() => setShowReactionPicker(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
