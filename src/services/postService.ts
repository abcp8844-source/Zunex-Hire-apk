import { supabase } from './authService';
import { uploadMedia } from './userService';

export const fetchFeedPosts = async (page: number = 0, limit: number = 10) => {
  const user = (await supabase.auth.getUser()).data.user;
  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles!user_id(full_name, avatar_url),
      likes(count),
      comments(count),
      shares(count)
    `)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw error;
  if (!data) return [];

  if (user) {
    const postIds = data.map((p) => p.id);
    
    const { data: userLikes } = await supabase
      .from('likes')
      .select('post_id, reaction_type')
      .eq('user_id', user.id)
      .in('post_id', postIds);

    const userReactionMap = new Map();
    userLikes?.forEach((l) => {
      userReactionMap.set(l.post_id, { isLiked: true, reactionType: l.reaction_type || 'like' });
    });

    return data.map((post) => {
      const userReaction = userReactionMap.get(post.id);
      return {
        ...post,
        likes_count: post.likes?.[0]?.count || 0,
        comments_count: post.comments?.[0]?.count || 0,
        shares_count: post.shares?.[0]?.count || 0,
        is_liked: userReaction ? userReaction.isLiked : false,
        user_reaction: userReaction ? userReaction.reactionType : undefined,
      };
    });
  }

  return data.map((post) => ({
    ...post,
    likes_count: post.likes?.[0]?.count || 0,
    comments_count: post.comments?.[0]?.count || 0,
    shares_count: post.shares?.[0]?.count || 0,
    is_liked: false,
    user_reaction: undefined,
  }));
};

export const createPost = async (content: string, imageUri?: string, groupId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  let imageUrl: string | null = null;

  if (imageUri) {
    imageUrl = await uploadMedia(imageUri, 'posts');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: user.id,
        content: content.trim(),
        image_url: imageUrl,
        media_url: imageUrl,
        group_id: groupId || null,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

export const updatePost = async (postId: string, updates: Record<string, any>, newImageUri?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const finalUpdates = { ...updates };

  if (newImageUri) {
    const uploadedUrl = await uploadMedia(newImageUri, 'posts');
    finalUpdates.image_url = uploadedUrl;
    finalUpdates.media_url = uploadedUrl;
  }

  const { data, error } = await supabase
    .from('posts')
    .update(finalUpdates)
    .eq('id', postId)
    .eq('user_id', user.id)
    .select();

  if (error) throw error;
  return data;
};

export const deletePost = async (postId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id);

  if (error) throw error;
  return true;
};

export const toggleLike = async (postId: string, reactionType: string = 'like', postOwnerId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { error } = await supabase
    .from('likes')
    .upsert(
      {
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      },
      { onConflict: 'post_id,user_id' }
    );

  if (error) throw error;

  if (postOwnerId && postOwnerId !== user.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    await supabase.from('notifications').insert([
      {
        receiver_id: postOwnerId,
        sender_id: user.id,
        reference_id: postId,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
      },
    ]);
  }
};

export const fetchComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles!user_id(full_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addComment = async (postId: string, text: string, postOwnerId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        user_id: user.id,
        comment: text.trim(),
      },
    ])
    .select();

  if (error) throw error;

  if (postOwnerId && postOwnerId !== user.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    await supabase.from('notifications').insert([
      {
        receiver_id: postOwnerId,
        sender_id: user.id,
        reference_id: postId,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
      },
    ]);
  }

  return data;
};

export const sharePost = async (postId: string, postOwnerId?: string) => {
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    await supabase.from('notifications').insert([
      {
        receiver_id: postOwnerId,
        sender_id: user.id,
        reference_id: postId,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
      },
    ]);
  }
};

export const savePost = async (postId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { error } = await supabase.from('saved_posts').insert([
    {
      user_id: user.id,
      post_id: postId,
    },
  ]);

  if (error) throw error;
  return true;
};

export const reportPost = async (postId: string, reason: string = 'Inappropriate content') => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { error } = await supabase.from('reports').insert([
    {
      reporter_id: user.id,
      post_id: postId,
      reason,
    },
  ]);

  if (error) throw error;
  return true;
};

export const searchPosts = async (query: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles!user_id(full_name, avatar_url), likes(count), comments(count)')
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
};
