import { supabase } from './authService';

export { supabase };

export const fetchGroups = async (page: number = 0, limit: number = 20) => {
  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const fetchGroupDetails = async (groupId: string) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*, profiles:admin_id(full_name, avatar_url)')
    .eq('id', groupId)
    .single();

  if (error) return null;
  return data;
};

export const fetchGroupPosts = async (groupId: string, page: number = 0, limit: number = 10) => {
  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url), likes(count), comments(count)')
    .eq('group_id', groupId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const createGroup = async (name: string, description: string, privacy: string = 'public') => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('groups')
    .insert([
      {
        name: name.trim(),
        description: description.trim(),
        privacy,
        admin_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  if (data) {
    await supabase.from('group_members').insert([
      {
        group_id: data.id,
        user_id: user.id,
        role: 'admin',
        status: 'approved',
      },
    ]);
  }

  return data;
};

export const joinGroup = async (groupId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('group_members')
    .insert([
      {
        group_id: groupId,
        user_id: user.id,
        role: 'member',
        status: 'approved',
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

export const leaveGroup = async (groupId: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id);

  if (error) throw error;
  return true;
};

export const fetchGroupMembers = async (groupId: string, page: number = 0, limit: number = 20) => {
  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('group_members')
    .select('*, profiles(id, full_name, avatar_url, bio)')
    .eq('group_id', groupId)
    .eq('status', 'approved')
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const fetchPendingPosts = async (groupId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('group_id', groupId)
    .eq('is_approved', false)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
};

export const approvePost = async (postId: string) => {
  const { error } = await supabase
    .from('posts')
    .update({ is_approved: true })
    .eq('id', postId);

  if (error) throw error;
};

export const fetchGroupPendingRequests = async (groupId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select('*, profiles(id, full_name, avatar_url)')
    .eq('group_id', groupId)
    .eq('status', 'pending');

  if (error) return [];
  return data || [];
};

export const approveGroupMember = async (requestId: string) => {
  const { error } = await supabase
    .from('group_members')
    .update({ status: 'approved' })
    .eq('id', requestId);

  if (error) throw error;
};

export const updateGroupSettings = async (groupId: string, settings: any) => {
  const { error } = await supabase
    .from('groups')
    .update(settings)
    .eq('id', groupId);

  if (error) throw error;
};

export const fetchScheduledPosts = async (groupId: string) => {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('group_id', groupId)
    .order('scheduled_for', { ascending: true });

  if (error) return [];
  return data || [];
};

export const fetchGroupMedia = async (groupId: string, page: number = 0, limit: number = 20) => {
  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('posts')
    .select('id, image_url, created_at')
    .eq('group_id', groupId)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const fetchUserGroups = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('group_members')
    .select('groups(*)')
    .eq('user_id', user.id)
    .eq('status', 'approved');

  if (error) return [];
  return data?.map((item: any) => item.groups).filter(Boolean) || [];
};

export const fetchExploreGroups = async (page: number = 0, limit: number = 20) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const start = page * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) return [];
  return data || [];
};

export const searchGroups = async (query: string, limit: number = 20) => {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit);

  if (error) return [];
  return data || [];
};
