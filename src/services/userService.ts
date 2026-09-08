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

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const updateProfile = async (updates: any) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    update(updates)
    .eq('id', user.id);

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

  await supabase
    .from('blocked_users')
    .delete()
    .eq('user_id', user.id)
    .eq('blocked_id', blockedId);
};
