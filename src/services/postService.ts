import { supabase } from './authService';

export const fetchFeedPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url), likes(count), comments(count)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
};

export const createPost = async (content: string, imageUrl?: string, groupId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const { data, error } = await supabase.from('posts').insert([
    {
      user_id: user.id,
      content,
      image_url: imageUrl || null,
      group_id: groupId || null,
    },
  ]);

  if (error) throw error;
  return data;
};

export const toggleLike = async (postId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  // چیک کریں کہ کیا پہلے سے لائک ہے یا نہیں
  const { data: existing } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
  } else {
    await supabase.from('likes').insert([{ post_id: postId, user_id: user.id }]);
  }
};

export const fetchComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(full_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return data;
};

export const addComment = async (postId: string, text: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const { data, error } = await supabase.from('comments').insert([
    {
      post_id: postId,
      user_id: user.id,
      content: text,
    },
  ]);

  if (error) throw error;
  return data;
};

export const sharePost = async (postId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  await supabase.from('shares').insert([
    {
      post_id: postId,
      user_id: user.id,
    },
  ]);
};
