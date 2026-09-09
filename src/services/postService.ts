import { supabase } from './authService';

export const fetchFeedPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url), likes(count), comments(count), shares(count)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createPost = async (content: string, imageUrl?: string, groupId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase.from('posts').insert([
    {
      user_id: user.id,
      content: content.trim(),
      image_url: imageUrl || null,
      group_id: groupId || null,
    },
  ]).select();

  if (error) throw error;
  return data;
};

export const toggleLike = async (postId: string, postOwnerId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
  } else {
    await supabase.from('likes').insert([{ post_id: postId, user_id: user.id }]);

    if (postOwnerId && postOwnerId !== user.id) {
      await supabase.from('notifications').insert([
        {
          receiver_id: postOwnerId,
          sender_id: user.id,
          type: 'like',
          content: 'liked your post.',
          reference_id: postId,
        },
      ]);
    }
  }
};

export const fetchComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(full_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addComment = async (postId: string, text: string, postOwnerId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase.from('comments').insert([
    {
      post_id: postId,
      user_id: user.id,
      content: text.trim(),
    },
  ]).select();

  if (error) throw error;

  if (postOwnerId && postOwnerId !== user.id) {
    await supabase.from('notifications').insert([
      {
        receiver_id: postOwnerId,
        sender_id: user.id,
        type: 'comment',
        content: 'commented on your post.',
        reference_id: postId,
      },
    ]);
  }

  return data;
};

export const sharePost = async (postId: string, postOwnerId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { error } = await supabase.from('shares').insert([
    {
      post_id: postId,
      user_id: user.id,
    },
  ]);

  if (error) throw error;

  if (postOwnerId && postOwnerId !== user.id) {
    await supabase.from('notifications').insert([
      {
        receiver_id: postOwnerId,
        sender_id: user.id,
        type: 'share',
        content: 'shared your post.',
        reference_id: postId,
      },
    ]);
  }
};

// Alias for toggleLike (used in PostCard)
export const toggleLikePost = toggleLike;

// Update post
export const updatePost = async (postId: string, updates: any) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .eq('user_id', user.id)
    .select();

  if (error) throw error;
  return data;
};

// Search posts
export const searchPosts = async (query: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url), likes(count), comments(count)')
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
};
