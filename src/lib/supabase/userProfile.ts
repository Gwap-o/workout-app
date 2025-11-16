import { supabase } from './client';
import type { UserProfile } from '@/types';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found
      return null;
    }
    throw error;
  }

  return data;
};

export const createUserProfile = async (
  profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
