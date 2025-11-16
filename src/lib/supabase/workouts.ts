import { supabase } from './client';
import type { WorkoutSession } from '@/types';

/**
 * Workout Session CRUD Operations
 */

export const createWorkoutSession = async (
  session: Omit<
    WorkoutSession,
    'id' | 'user_id' | 'created_at' | 'updated_at'
  >
): Promise<WorkoutSession> => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      ...session,
      user_id: authData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWorkoutSession = async (
  sessionId: string
): Promise<WorkoutSession> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
};

export const getWorkoutHistory = async (
  limit: number = 50
): Promise<WorkoutSession[]> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getWorkoutsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<WorkoutSession[]> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getWorkoutsByType = async (
  workoutType: 'A' | 'B',
  limit: number = 20
): Promise<WorkoutSession[]> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('workout_type', workoutType)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const updateWorkoutSession = async (
  sessionId: string,
  updates: Partial<WorkoutSession>
): Promise<WorkoutSession> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteWorkoutSession = async (
  sessionId: string
): Promise<void> => {
  const { error } = await supabase
    .from('workout_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
};

export const completeWorkoutSession = async (
  sessionId: string,
  duration?: number
): Promise<WorkoutSession> => {
  return updateWorkoutSession(sessionId, {
    completed: true,
    duration,
  });
};

// Get workouts this week
export const getWorkoutsThisWeek = async (): Promise<WorkoutSession[]> => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  return getWorkoutsByDateRange(
    startOfWeek.toISOString().split('T')[0],
    endOfWeek.toISOString().split('T')[0]
  );
};

// Count workouts in date range
export const countWorkouts = async (
  startDate: string,
  endDate: string
): Promise<number> => {
  const { count, error } = await supabase
    .from('workout_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return count || 0;
};
