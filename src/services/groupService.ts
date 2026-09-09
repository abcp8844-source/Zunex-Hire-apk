import { supabase } from './authService';

export const fetchGroups = async () => {
  const { data, error } = await supabase.from('groups').select('*');
  if (error) return [];
  return data;
};

export const fetchGroupDetails = async (groupId: string) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single();

  if (error) return null;
  return data;
};

export const fetchGroupPosts = async (groupId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
};

export const createGroup = async (name: string, description: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const { data, error } = await supabase.from('groups').insert([
    {
      name,
      description,
      admin_id: user.id,
    },
  ]);

  if (error) throw error;
  return data;
};

export const fetchGroupMembers = async (groupId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select('*, profiles(*)')
    .eq('group_id', groupId);

  if (error) return [];
  return data;
};

export const fetchPendingPosts = async (groupId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name)')
    .eq('group_id', groupId)
    .eq('is_approved', false);

  if (error) return [];
  return data;
};

export const approvePost = async (postId: string) => {
  const { error } = await supabase.from('posts').update({ is_approved: true }).eq('id', postId);
  if (error) throw error;
};

export const updateGroupSettings = async (groupId: string, settings: any) => {
  const { error } = await supabase.from('groups').update(settings).eq('id', groupId);
  if (error) throw error;
};

export const fetchScheduledPosts = async (groupId: string) => {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('group_id', groupId);

  if (error) return [];
  return data;
};

export const fetchGroupMedia = async (groupId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('image_url')
    .eq('group_id', groupId)
    .not('image_url', 'is', null);

  if (error) return [];
  return data;
};
