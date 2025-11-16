// Custom Hook for Progress Analytics Data

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import type { ExerciseLog, BodyweightLog, WorkoutSession } from '@/types';
import {
  prepareExerciseChartData,
  prepareBodyweightChartData,
  calculateStreaks,
  calculateWeightChangeRate,
  type ExerciseProgressPoint,
  type ChartDataPoint,
  type StreakData,
} from '@/lib/utils/analytics';
import {
  calculateAllTierProgress,
  type TierProgress,
} from '@/lib/utils/fitnessStandards';
import { subMonths, format } from 'date-fns';

interface ProgressAnalyticsData {
  exerciseLogs: Record<string, ExerciseLog[]>;
  bodyweightLogs: BodyweightLog[];
  workoutSessions: WorkoutSession[];
  loading: boolean;
  error: string | null;
}

interface AnalyticsFilters {
  timePeriod: '4w' | '8w' | '6m' | '1y' | 'all';
  exercise?: string;
}

export const useProgressAnalytics = (filters: AnalyticsFilters = { timePeriod: '8w' }) => {
  const { user } = useAuth();
  const [data, setData] = useState<ProgressAnalyticsData>({
    exerciseLogs: {},
    bodyweightLogs: [],
    workoutSessions: [],
    loading: true,
    error: null,
  });

  // Calculate date range based on time period
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (filters.timePeriod) {
      case '4w':
        startDate = subMonths(now, 1);
        break;
      case '8w':
        startDate = subMonths(now, 2);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case '1y':
        startDate = subMonths(now, 12);
        break;
      case 'all':
      default:
        startDate = new Date('2000-01-01'); // Effectively all time
        break;
    }

    return {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(now, 'yyyy-MM-dd'),
    };
  }, [filters.timePeriod]);

  // Fetch all analytics data
  useEffect(() => {
    if (!user) return;

    const fetchAnalyticsData = async () => {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Fetch workout sessions
        const { data: sessions, error: sessionsError } = await supabase
          .from('workout_sessions')
          .select('*')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .order('date', { ascending: false });

        if (sessionsError) throw sessionsError;

        // Fetch exercise logs
        let exerciseQuery = supabase
          .from('exercise_logs')
          .select('*')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .order('date', { ascending: false });

        if (filters.exercise) {
          exerciseQuery = exerciseQuery.eq('exercise_name', filters.exercise);
        }

        const { data: exercises, error: exercisesError } = await exerciseQuery;
        if (exercisesError) throw exercisesError;

        // Group exercises by name
        const exerciseMap: Record<string, ExerciseLog[]> = {};
        exercises?.forEach((log) => {
          if (!exerciseMap[log.exercise_name]) {
            exerciseMap[log.exercise_name] = [];
          }
          exerciseMap[log.exercise_name].push(log as ExerciseLog);
        });

        // Fetch bodyweight logs
        const { data: bodyweight, error: bodyweightError } = await supabase
          .from('bodyweight_logs')
          .select('*')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .order('date', { ascending: false });

        if (bodyweightError) throw bodyweightError;

        setData({
          exerciseLogs: exerciseMap,
          bodyweightLogs: (bodyweight as BodyweightLog[]) || [],
          workoutSessions: (sessions as WorkoutSession[]) || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load analytics data',
        }));
      }
    };

    fetchAnalyticsData();
  }, [user, dateRange.start, dateRange.end, filters.exercise]);

  // Prepare chart data for specific exercise
  const getExerciseChartData = (exerciseName: string): ExerciseProgressPoint[] => {
    const logs = data.exerciseLogs[exerciseName] || [];
    return prepareExerciseChartData(logs);
  };

  // Prepare bodyweight chart data
  const bodyweightChartData: ChartDataPoint[] = useMemo(
    () => prepareBodyweightChartData(data.bodyweightLogs),
    [data.bodyweightLogs]
  );

  // Calculate streaks
  const streakData: StreakData = useMemo(
    () => calculateStreaks(data.workoutSessions),
    [data.workoutSessions]
  );

  // Calculate weight change rate
  const weightChangeRate = useMemo(
    () => calculateWeightChangeRate(data.bodyweightLogs),
    [data.bodyweightLogs]
  );

  // Get tier progress for all exercises with recent data
  const tierProgressData: TierProgress[] = useMemo(() => {
    const exerciseMaxWeights: Record<string, number> = {};

    // Get the most recent max weight for each exercise
    Object.entries(data.exerciseLogs).forEach(([exerciseName, logs]) => {
      if (logs.length > 0) {
        // Get top set from most recent workout
        const recentLog = logs[0];
        if (Array.isArray(recentLog.sets) && recentLog.sets[0]) {
          exerciseMaxWeights[exerciseName] = recentLog.sets[0].weight || 0;
        }
      }
    });

    // Get user's bodyweight (use most recent)
    const userBodyweight =
      data.bodyweightLogs.length > 0 ? Number(data.bodyweightLogs[0].weight) : 180;

    return calculateAllTierProgress(exerciseMaxWeights, userBodyweight);
  }, [data.exerciseLogs, data.bodyweightLogs]);

  // Get list of all tracked exercises
  const availableExercises = useMemo(
    () => Object.keys(data.exerciseLogs).sort(),
    [data.exerciseLogs]
  );

  return {
    // Raw data
    ...data,

    // Processed data
    getExerciseChartData,
    bodyweightChartData,
    streakData,
    weightChangeRate,
    tierProgressData,
    availableExercises,

    // Utilities
    dateRange,
  };
};
