import { supabase } from './authService';

export const fetchFeedPosts = async (page: number = 0, limit: number = 10) => {
  const user = (await supabase.auth.getUser()).data.user;
  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(full_name, avatar_url),
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
      .select('post_id, like, love, care, haha, wow, sad, angry')
      .eq('user_id', user.id)
      .in('post_id', postIds);

    const userReactionMap = new Map();
    userLikes?.forEach((l) => {
      let rType = 'like';
      if (l.love) rType = 'love';
      else if (l.care) rType = 'care';
      else if (l.haha) rType = 'haha';
      else if (l.wow) rType = 'wow';
      else if (l.sad) rType = 'sad';
      else if (l.angry) rType = 'angry';
      else if (l.like) rType = 'like';

      userReactionMap.set(l.post_id, { isLiked: true, reactionType: rType });
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

export const createPost = async (content: string, imageUrl?: string, groupId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: user.id,
        content: content.trim(),
        image_url: imageUrl || null,
        group_id: groupId || null,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

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

  const { error } = await supabase
    .from('likes')
    .upsert(reactionPayload, { onConflict: 'post_id,user_id' });

  if (error) throw error;

  if (postOwnerId && postOwnerId !== user.id) {
    await supabase.from('notifications').insert([
      {
        receiver_id: postOwnerId,
        sender_id: user.id,
        type: 'like',
        content: `reacted ${reactionType} to your post.`,
        reference_id: postId,
      },
    ]);
  }
};

export const toggleLikePost = toggleLike;

export const fetchComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(full_name, avatar_url)')
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
        content: text.trim(),
      },
    ])
    .select();

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
    .select('*, profiles(full_name, avatar_url), likes(count), comments(count)')
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
};
