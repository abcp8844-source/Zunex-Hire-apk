import { supabase } from './authService';

export { supabase };

export const fetchUserProfile = async (userId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetId)
    .single();

  if (error) throw error;
  return data;
};

export const getCurrentUserProfile = async () => {
  return await fetchUserProfile();
};

export const updateProfile = async (updates: any) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const searchUsers = async (query: string, limit: number = 20) => {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio')
    .ilike('full_name', `%${query}%`)
    .limit(limit);

  if (error) return [];
  return data || [];
};

export const searchGroups = async (query: string, limit: number = 20) => {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('groups')
    .select('id, name, avatar_url, description, privacy')
    .ilike('name', `%${query}%`)
    .limit(limit);

  if (error) return [];
  return data || [];
};

export const fetchFriendsList = async (userId?: string, page: number = 0, limit: number = 20) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return [];

  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('friends')
    .select('*, profiles:friend_id(id, full_name, avatar_url, bio)')
    .eq('user_id', targetId)
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const fetchFriendRequests = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('friend_requests')
    .select('*, profiles:sender_id(id, full_name, avatar_url)')
    .eq('receiver_id', user.id);

  if (error) return [];
  return data || [];
};

export const fetchNonFriends = async (page: number = 0, limit: number = 20) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio')
    .neq('id', user.id)
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const getFriendshipStatus = async (targetUserId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user || user.id === targetUserId) return 'self';

  const { data: friendData } = await supabase
    .from('friends')
    .select('id')
    .eq('user_id', user.id)
    .eq('friend_id', targetUserId)
    .maybeSingle();

  if (friendData) return 'friends';

  const { data: requestSent } = await supabase
    .from('friend_requests')
    .select('id')
    .eq('sender_id', user.id)
    .eq('receiver_id', targetUserId)
    .maybeSingle();

  if (requestSent) return 'sent';

  const { data: requestReceived } = await supabase
    .from('friend_requests')
    .select('id')
    .eq('sender_id', targetUserId)
    .eq('receiver_id', user.id)
    .maybeSingle();

  if (requestReceived) return 'received';

  return 'none';
};

export const sendFriendRequest = async (receiverId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('friend_requests')
    .insert([
      {
        sender_id: user.id,
        receiver_id: receiverId,
      },
    ])
    .select();

  if (error) throw error;

  await supabase.from('notifications').insert([
    {
      receiver_id: receiverId,
      sender_id: user.id,
      type: 'friend_request',
      content: 'sent you a friend request.',
      reference_id: user.id,
    },
  ]);

  return data;
};

export const acceptFriendRequest = async (requestId: string, senderId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  await supabase.from('friend_requests').delete().eq('id', requestId);

  await supabase.from('friends').insert([
    { user_id: user.id, friend_id: senderId },
    { user_id: senderId, friend_id: user.id },
  ]);

  await supabase.from('notifications').insert([
    {
      receiver_id: senderId,
      sender_id: user.id,
      type: 'friend_accept',
      content: 'accepted your friend request.',
      reference_id: user.id,
    },
  ]);
};

export const fetchUserPosts = async (userId?: string, page: number = 0, limit: number = 10) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return [];

  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url), likes(count), comments(count)')
    .eq('user_id', targetId)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const fetchUserPhotos = async (userId?: string, page: number = 0, limit: number = 20) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return [];

  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('id, image_url, created_at, content')
    .eq('user_id', targetId)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const fetchActivityLog = async (page: number = 0, limit: number = 20) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const fetchBlockedUsers = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('blocked_users')
    .select('*, profiles:blocked_id(id, full_name, avatar_url)')
    .eq('user_id', user.id);

  if (error) return [];
  return data || [];
};

export const unblockUser = async (blockedId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('user_id', user.id)
    .eq('blocked_id', blockedId);

  if (error) throw error;
};
