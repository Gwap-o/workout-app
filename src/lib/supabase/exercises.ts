import { supabase } from './client';
import type { ExerciseLog } from '@/types';

/**
 * Exercise Log CRUD Operations
 */

export const createExerciseLog = async (
  log: Omit<ExerciseLog, 'id' | 'user_id' | 'created_at'>
): Promise<ExerciseLog> => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert({
      ...log,
      user_id: authData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getExerciseLog = async (logId: string): Promise<ExerciseLog> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('id', logId)
    .single();

  if (error) throw error;
  return data;
};

export const getExerciseLogsBySession = async (
  sessionId: string
): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getExerciseHistory = async (
  exerciseName: string,
  limit: number = 10
): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('exercise_name', exerciseName)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getRecentExerciseLogs = async (
  exerciseName: string,
  count: number = 3
): Promise<ExerciseLog[]> => {
  return getExerciseHistory(exerciseName, count);
};

export const getLastExerciseLog = async (
  exerciseName: string
): Promise<ExerciseLog | null> => {
  const logs = await getExerciseHistory(exerciseName, 1);
  return logs[0] || null;
};

export const updateExerciseLog = async (
  logId: string,
  updates: Partial<ExerciseLog>
): Promise<ExerciseLog> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExerciseLog = async (logId: string): Promise<void> => {
  const { error } = await supabase
    .from('exercise_logs')
    .delete()
    .eq('id', logId);

  if (error) throw error;
};

// Get all exercise logs for a date range
export const getExerciseLogsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get all unique exercises logged by user
export const getUniqueExercises = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('exercise_name')
    .order('exercise_name', { ascending: true });

  if (error) throw error;

  const uniqueNames = [
    ...new Set(data?.map((log) => log.exercise_name) || []),
  ];
  return uniqueNames;
};

// Get exercise logs for specific muscle group
export const getExerciseLogsByMuscleGroup = async (
  muscleGroup: string,
  limit: number = 50
): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('muscle_group', muscleGroup)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

// Batch create exercise logs (for a full workout)
export const createExerciseLogs = async (
  logs: Omit<ExerciseLog, 'id' | 'user_id' | 'created_at'>[]
): Promise<ExerciseLog[]> => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error('Not authenticated');

  const logsWithUserId = logs.map((log) => ({
    ...log,
    user_id: authData.user.id,
  }));

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(logsWithUserId)
    .select();

  if (error) throw error;
  return data || [];
};
