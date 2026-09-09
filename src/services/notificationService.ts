import { supabase } from './authService';

export const fetchNotifications = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*, sender:sender_id(full_name, avatar_url)')
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const sendNotification = async (
  receiverId: string, 
  type: 'like' | 'comment' | 'friend_request' | 'group_invite' | 'post_approval', 
  content: string, 
  referenceId?: string
) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user || user.id === receiverId) return;

  const { error } = await supabase.from('notifications').insert([
    {
      receiver_id: receiverId,
      sender_id: user.id,
      type,
      content,
      reference_id: referenceId || null,
      is_read: false,
    },
  ]);

  if (error) throw error;
};
