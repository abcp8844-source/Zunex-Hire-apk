import { supabase } from './authService';

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

export const searchUsers = async (query: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('full_name', `%${query}%`);

  if (error) return [];
  return data;
};

export const searchPosts = async (query: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url)')
    .ilike('content', `%${query}%`);

  if (error) return [];
  return data;
};

export const searchGroups = async (query: string) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .ilike('name', `%${query}%`);

  if (error) return [];
  return data;
};

export const fetchFriendsList = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('friends')
    .select('*, profiles:friend_id(*)')
    .eq('user_id', user.id);

  if (error) return [];
  return data;
};

export const fetchFriendRequests = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('friend_requests')
    .select('*, profiles:sender_id(*)')
    .eq('receiver_id', user.id);

  if (error) return [];
  return data;
};

export const fetchActivityLog = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
};

export const fetchBlockedUsers = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('blocked_users')
    .select('*, profiles:blocked_id(*)')
    .eq('user_id', user.id);

  if (error) return [];
  return data;
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

// Fetch user's posts
export const fetchUserPosts = async (userId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return [];

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url), likes(count), comments(count)')
    .eq('user_id', targetId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
};

// Fetch users who are not already friends
export const fetchNonFriends = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id);

  if (error) return [];
  return data || [];
};

// Send friend request
export const sendFriendRequest = async (receiverId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('friend_requests')
    .insert([{
      sender_id: user.id,
      receiver_id: receiverId,
    }])
    .select();

  if (error) throw error;

  // Send notification
  await supabase.from('notifications').insert([{
    receiver_id: receiverId,
    sender_id: user.id,
    type: 'friend_request',
    content: 'sent you a friend request.',
    reference_id: receiverId,
  }]);

  return data;
};

// Accept friend request
export const acceptFriendRequest = async (requestId: string, senderId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  await supabase
    .from('friend_requests')
    .delete()
    .eq('id', requestId);

  await supabase
    .from('friends')
    .insert([{
      user_id: user.id,
      friend_id: senderId,
    }]);

  // Send notification
  await supabase.from('notifications').insert([{
    receiver_id: senderId,
    sender_id: user.id,
    type: 'friend_accept',
    content: 'accepted your friend request.',
    reference_id: user.id,
  }]);
};

// Fetch user photos
export const fetchUserPhotos = async (userId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return [];

  const { data, error } = await supabase
    .from('posts')
    .select('id, image_url, created_at, content')
    .eq('user_id', targetId)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
};

// Fetch personal details
export const fetchPersonalDetails = async (userId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetId)
    .single();

  if (error) return null;
  return data;
};

// Export supabase for use in components
export { supabase } from './authService';
