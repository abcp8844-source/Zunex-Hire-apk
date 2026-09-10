import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pickerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLocalIsLiked(isLiked);
    setLocalTotalReactions(totalReactions);
    setLocalUserReaction(userReaction);
  }, [isLiked, totalReactions, userReaction]);

  useEffect(() => {
    if (showReactionPicker) {
      Animated.spring(pickerAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(pickerAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [showReactionPicker]);

  const handleLike = async (reactionType: string = 'like') => {
    setShowReactionPicker(false);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

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

  const getReactionEmoji = (type?: string) => {
    switch (type) {
      case 'love': return '❤️';
      case 'care': return '🥰';
      case 'haha': return '😆';
      case 'wow': return '😮';
      case 'sad': return '😢';
      case 'angry': return '😡';
      default: return '👍';
    }
  };

  return (
    <View style={styles.mainContainer}>
      {showReactionPicker && (
        <Animated.View
          style={[
            styles.reactionPickerPopup,
            {
              opacity: pickerAnim,
              transform: [
                { scale: pickerAnim },
                {
                  translateY: pickerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={() => handleLike('like')}><Text style={styles.pickerEmoji}>👍</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('love')}><Text style={styles.pickerEmoji}>❤️</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('care')}><Text style={styles.pickerEmoji}>🥰</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('haha')}><Text style={styles.pickerEmoji}>😆</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('wow')}><Text style={styles.pickerEmoji}>😮</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('sad')}><Text style={styles.pickerEmoji}>😢</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleLike('angry')}><Text style={styles.pickerEmoji}>😡</Text></TouchableOpacity>
        </Animated.View>
      )}

      {localTotalReactions > 0 && (
        <View style={styles.topReactionInfoRow}>
          <Animated.View style={[styles.reactionIconsOverlap, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.miniEmoji}>👍</Text>
            {localTotalReactions > 1 && (
              <Text style={[styles.miniEmoji, styles.offsetEmoji]}>
                {localUserReaction && localUserReaction !== 'like' ? getReactionEmoji(localUserReaction) : '❤️'}
              </Text>
            )}
          </Animated.View>
          <Text style={styles.reactionCountNumber}>{localTotalReactions}</Text>
        </View>
      )}

      <View style={styles.bottomButtonRow}>
        <LikeButton
          isLiked={localIsLiked}
          likeCount={0}
          onPress={() => handleLike(localUserReaction || 'like')}
          onLongPress={() => setShowReactionPicker(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
    paddingVertical: 4,
  },
  topReactionInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  bottomButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionPickerPopup: {
    position: 'absolute',
    bottom: 55,
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
  reactionIconsOverlap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniEmoji: {
    fontSize: 14,
  },
  offsetEmoji: {
    marginLeft: -6,
  },
  reactionCountNumber: {
    fontSize: 13,
    color: '#65676b',
    marginLeft: 6,
    fontWeight: '500',
  },
});
