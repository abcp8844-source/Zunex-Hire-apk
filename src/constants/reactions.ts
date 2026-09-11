export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface ReactionItem {
  label: string;
  iconUrl: string;
  fallbackEmoji: string;
}

export const REACTIONS: Record<ReactionType, ReactionItem> = {
  like: {
    label: 'Like',
    iconUrl: 'https://raw.githubusercontent.com/facebook/facebook-android-sdk/main/facebook/src/main/res/drawable-hdpi/com_facebook_button_like_icon_selected.png',
    fallbackEmoji: '👍',
  },
  love: {
    label: 'Love',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2764.png',
    fallbackEmoji: '❤️',
  },
  care: {
    label: 'Care',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f970.png',
    fallbackEmoji: '🥰',
  },
  haha: {
    label: 'Haha',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f606.png',
    fallbackEmoji: '😆',
  },
  wow: {
    label: 'Wow',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f62e.png',
    fallbackEmoji: '😮',
  },
  sad: {
    label: 'Sad',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f622.png',
    fallbackEmoji: '😢',
  },
  angry: {
    label: 'Angry',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f621.png',
    fallbackEmoji: '😡',
  },
};
