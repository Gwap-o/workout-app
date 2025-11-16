import { useState, useEffect } from 'react';
import type { WorkoutSession } from '@/types';
import {
  getWorkoutHistory,
  getWorkoutSession,
  getWorkoutsThisWeek,
  createWorkoutSession as createWorkout,
  updateWorkoutSession,
  deleteWorkoutSession,
} from '@/lib/supabase/workouts';

export const useWorkouts = (limit?: number) => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkoutHistory(limit);
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch workouts')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [limit]);

  const createWorkoutSession = async (
    session: Omit<
      WorkoutSession,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => {
    try {
      const newSession = await createWorkout(session);
      setWorkouts((prev) => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create workout');
    }
  };

  const updateWorkout = async (
    sessionId: string,
    updates: Partial<WorkoutSession>
  ) => {
    try {
      const updated = await updateWorkoutSession(sessionId, updates);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === sessionId ? updated : w))
      );
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update workout');
    }
  };

  const deleteWorkout = async (sessionId: string) => {
    try {
      await deleteWorkoutSession(sessionId);
      setWorkouts((prev) => prev.filter((w) => w.id !== sessionId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete workout');
    }
  };

  return {
    workouts,
    loading,
    error,
    refetch: fetchWorkouts,
    createWorkoutSession,
    updateWorkout,
    deleteWorkout,
  };
};

export const useWorkoutSession = (sessionId: string | null) => {
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setWorkout(null);
      setLoading(false);
      return;
    }

    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const data = await getWorkoutSession(sessionId);
        setWorkout(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch workout')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [sessionId]);

  return { workout, loading, error };
};

export const useWorkoutsThisWeek = () => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkoutsThisWeek();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch this week's workouts")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return { workouts, loading, error, refetch: fetchWorkouts };
};
