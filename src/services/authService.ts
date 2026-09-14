import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const signInUser = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: pass.trim(),
  });
  
  if (error) {
    throw new Error('Invalid email or password. Please try again.');
  }
  return data;
};

export const signUpUser = async (email: string, pass: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: pass.trim(),
    options: {
      data: { full_name: fullName.trim() },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('This email address is already in use.');
    }
    throw new Error('Unable to create account. Please check your details.');
  }
  return data;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim());
  if (error) {
    throw new Error('Unable to send password reset instructions. Please try again later.');
  }
  return data;
};

export const uploadToCloudinary = async (fileUri: string, folder: string) => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables missing in authService');
  }

  const cleanUri = fileUri.split('?')[0];
  const extension = cleanUri.split('.').pop()?.toLowerCase() || 'jpg';
  
  let mimeType = 'image/jpeg';
  if (extension === 'png') mimeType = 'image/png';
  else if (extension === 'webp') mimeType = 'image/webp';
  else if (extension === 'gif') mimeType = 'image/gif';

  const formData = new FormData();

  formData.append('file', {
    uri: fileUri,
    type: mimeType,
    name: `upload_${Date.now()}.${extension === 'tmp' ? 'jpg' : extension}`,
  } as any);

  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

    return data.secure_url;
  } catch (err: any) {
    throw new Error(err.message || 'Network request failed for image upload');
  }
};
