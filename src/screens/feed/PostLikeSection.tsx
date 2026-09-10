import React, { useState } from 'react';
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

  const handleLike = async (reactionType: string = 'like') => {
    setShowReactionPicker(false);
    await toggleLikePost(postId, reactionType);
    onUpdate();
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
        isLiked={isLiked}
        likeCount={totalReactions}
        onPress={() => handleLike(userReaction || 'like')}
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
