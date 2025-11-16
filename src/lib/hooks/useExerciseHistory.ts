import { useState, useEffect } from 'react';
import type { ExerciseLog, ExpectedPerformance } from '@/types';
import {
  getExerciseHistory,
  getLastExerciseLog,
  getExerciseLogsBySession,
} from '@/lib/supabase/exercises';
import { calculateNextWorkout } from '@/lib/progression/calculator';
import { detectPlateau } from '@/lib/progression/plateau';

export const useExerciseHistory = (
  exerciseName: string,
  limit: number = 10
) => {
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getExerciseHistory(exerciseName, limit);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch exercise history')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exerciseName) {
      fetchHistory();
    }
  }, [exerciseName, limit]);

  return { logs, loading, error, refetch: fetchHistory };
};

export const useLastExerciseLog = (exerciseName: string) => {
  const [log, setLog] = useState<ExerciseLog | null>(null);
  const [expectedPerformance, setExpectedPerformance] =
    useState<ExpectedPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLastLog = async () => {
    try {
      setLoading(true);
      const lastLog = await getLastExerciseLog(exerciseName);
      setLog(lastLog);

      if (lastLog) {
        const expected = calculateNextWorkout(lastLog);
        setExpectedPerformance(expected);
      } else {
        setExpectedPerformance(null);
      }

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch last exercise log')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exerciseName) {
      fetchLastLog();
    }
  }, [exerciseName]);

  return {
    log,
    expectedPerformance,
    loading,
    error,
    refetch: fetchLastLog,
  };
};

export const useExercisePlateauDetection = (exerciseName: string) => {
  const { logs, loading, error } = useExerciseHistory(exerciseName, 5);
  const [plateauAnalysis, setPlateauAnalysis] = useState<ReturnType<
    typeof detectPlateau
  > | null>(null);

  useEffect(() => {
    if (logs.length > 0) {
      const analysis = detectPlateau(logs);
      setPlateauAnalysis(analysis);
    }
  }, [logs]);

  return { plateauAnalysis, loading, error };
};

export const useSessionExerciseLogs = (sessionId: string | null) => {
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = async () => {
    if (!sessionId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getExerciseLogsBySession(sessionId);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch session exercise logs')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [sessionId]);

  return { logs, loading, error, refetch: fetchLogs };
};
