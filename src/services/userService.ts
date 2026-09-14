import { supabase, uploadToCloudinary } from './authService';

export { supabase };

export const fetchUserProfile = async (userId?: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  const targetId = userId || user?.id;
  if (!targetId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', targetId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getCurrentUserProfile = async () => {
  return await fetchUserProfile();
};

export const updateProfile = async (updates: Record<string, any>) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ user_id: user.id, ...updates }, { onConflict: 'user_id' })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (updates: Record<string, any>) => {
  return await updateProfile(updates);
};

export const searchUsers = async (query: string, limit: number = 20) => {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, full_name, username, avatar_url, bio')
    .ilike('full_name', `%${query}%`)
    .limit(limit);

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
    .select('user_id, full_name, username, avatar_url, bio')
    .neq('user_id', user.id)
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const uploadMedia = async (fileUri: string, folder: string) => {
  return await uploadToCloudinary(fileUri, folder);
};
