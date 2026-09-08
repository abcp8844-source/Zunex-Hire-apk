import { supabase } from '../../services/authService';

export const handleLogout = async (navigation: any) => {
  try {
    await supabase.auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
