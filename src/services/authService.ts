import { createClient } from '@supabase/supabase-js';

// اپنی سپ بیس پروجیکٹ کی کریڈینشلز یہاں درج کریں
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signInUser = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) throw error;
  return data;
};

export const signUpUser = async (email: string, pass: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
  return data;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
};
