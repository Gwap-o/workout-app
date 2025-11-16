// Analytics Utilities for Progress Charts

import type { ExerciseLog, BodyweightLog, WorkoutSession } from '@/types';
import { format, parseISO, startOfWeek, eachDayOfInterval, differenceInDays } from 'date-fns';

// ============================================================================
// Chart Data Preparation
// ============================================================================

export interface ChartDataPoint {
  date: string; // ISO date string
  displayDate: string; // Formatted for display (e.g., "Jan 15")
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface ExerciseProgressPoint extends ChartDataPoint {
  weight: number;
  reps: number;
  sets: number;
  volume: number; // sets × reps × weight
  estimatedMax: number; // Estimated 1RM
}

export interface MultiExercisePoint {
  date: string;
  displayDate: string;
  [exerciseName: string]: number | string; // Dynamic exercise names as keys
}

// ============================================================================
// Exercise Progression Data
// ============================================================================

/**
 * Prepare exercise log data for line charts
 * Calculates total volume and estimated 1RM for each workout
 */
export const prepareExerciseChartData = (
  logs: ExerciseLog[]
): ExerciseProgressPoint[] => {
  const points: ExerciseProgressPoint[] = [];

  logs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((log) => {
      // Calculate metrics from sets
      const sets = Array.isArray(log.sets) ? log.sets : [];
      const topSet = sets[0]; // First set is usually the heaviest

      if (!topSet) {
        return;
      }

      const weight = topSet.weight || 0;
      const reps = topSet.reps || 0;
      const totalVolume = sets.reduce(
        (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
        0
      );

      // Estimate 1RM using Brzycki formula: weight × (36 / (37 - reps))
      const estimatedMax = reps > 0 ? weight * (36 / (37 - reps)) : weight;

      points.push({
        date: log.date,
        displayDate: format(parseISO(log.date), 'MMM d'),
        value: totalVolume,
        weight,
        reps,
        sets: sets.length,
        volume: totalVolume,
        estimatedMax: Math.round(estimatedMax),
        metadata: {
          exercise: log.exercise_name,
          method: log.training_method,
          hitProgression: log.hit_progression,
        },
      });
    });

  return points;
};

/**
 * Prepare data for multi-exercise comparison chart
 */
export const prepareMultiExerciseData = (
  exerciseLogs: Record<string, ExerciseLog[]>
): MultiExercisePoint[] => {
  const allDates = new Set<string>();

  // Collect all unique dates
  Object.values(exerciseLogs).forEach((logs) => {
    logs.forEach((log) => allDates.add(log.date));
  });

  // Sort dates
  const sortedDates = Array.from(allDates).sort();

  // Build data points with all exercises
  return sortedDates.map((date) => {
    const point: MultiExercisePoint = {
      date,
      displayDate: format(parseISO(date), 'MMM d'),
    };

    Object.entries(exerciseLogs).forEach(([exerciseName, logs]) => {
      const logForDate = logs.find((log) => log.date === date);
      if (logForDate && Array.isArray(logForDate.sets) && logForDate.sets[0]) {
        // Use estimated 1RM for comparison
        const topSet = logForDate.sets[0];
        const weight = topSet.weight || 0;
        const reps = topSet.reps || 0;
        const estimatedMax = reps > 0 ? weight * (36 / (37 - reps)) : weight;
        point[exerciseName] = Math.round(estimatedMax);
      }
    });

    return point;
  });
};

// ============================================================================
// Bodyweight Trend Data
// ============================================================================

/**
 * Prepare bodyweight log data for trend charts
 * Includes moving averages for smoother visualization
 */
export const prepareBodyweightChartData = (
  logs: BodyweightLog[],
  movingAverageDays: number = 7
): ChartDataPoint[] => {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedLogs.map((log, index) => {
    // Calculate moving average
    const startIndex = Math.max(0, index - movingAverageDays + 1);
    const relevantLogs = sortedLogs.slice(startIndex, index + 1);
    const avgWeight =
      relevantLogs.reduce((sum, l) => sum + Number(l.weight), 0) /
      relevantLogs.length;

    return {
      date: log.date,
      displayDate: format(parseISO(log.date), 'MMM d'),
      value: Number(log.weight),
      label: `${Number(log.weight).toFixed(1)} lbs`,
      metadata: {
        movingAverage: Number(avgWeight.toFixed(1)),
        measurements: log.measurements,
      },
    };
  });
};

/**
 * Calculate weight change rate (lbs per week)
 */
export const calculateWeightChangeRate = (
  logs: BodyweightLog[]
): number | null => {
  if (logs.length < 2) return null;

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstLog = sortedLogs[0];
  const lastLog = sortedLogs[sortedLogs.length - 1];

  const weightChange = Number(lastLog.weight) - Number(firstLog.weight);
  const daysDiff = differenceInDays(
    parseISO(lastLog.date),
    parseISO(firstLog.date)
  );

  if (daysDiff === 0) return null;

  const weeksElapsed = daysDiff / 7;
  return Number((weightChange / weeksElapsed).toFixed(2));
};

// ============================================================================
// Workout Consistency Data
// ============================================================================

export interface ConsistencyData {
  date: string;
  workoutType: 'A' | 'B' | null;
  volume: number;
  intensity: 'low' | 'medium' | 'high' | 'none';
}

/**
 * Prepare calendar heatmap data showing workout consistency
 */
export const prepareConsistencyHeatmap = (
  sessions: WorkoutSession[],
  startDate: Date,
  endDate: Date
): ConsistencyData[] => {
  // Create map of dates to sessions
  const sessionMap = new Map<string, WorkoutSession>();
  sessions.forEach((session) => {
    sessionMap.set(session.date, session);
  });

  // Generate all dates in range
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });

  return allDates.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const session = sessionMap.get(dateStr);

    if (!session) {
      return {
        date: dateStr,
        workoutType: null,
        volume: 0,
        intensity: 'none' as const,
      };
    }

    // Determine intensity based on duration (if available)
    let intensity: 'low' | 'medium' | 'high' = 'medium';
    if (session.duration) {
      if (session.duration < 45) intensity = 'low';
      else if (session.duration > 75) intensity = 'high';
    }

    return {
      date: dateStr,
      workoutType: session.workout_type,
      volume: 0, // Could calculate from exercise_logs if needed
      intensity,
    };
  });
};

// ============================================================================
// Streak Calculations
// ============================================================================

export interface StreakData {
  currentStreak: number; // Consecutive weeks with 3 workouts
  longestStreak: number; // All-time best
  thisWeekWorkouts: number;
  weeklyConsistency: number; // Percentage (0-100)
}

/**
 * Calculate workout streaks and consistency metrics
 */
export const calculateStreaks = (sessions: WorkoutSession[]): StreakData => {
  if (sessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      thisWeekWorkouts: 0,
      weeklyConsistency: 0,
    };
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group sessions by week
  const weekMap = new Map<string, WorkoutSession[]>();
  sortedSessions.forEach((session) => {
    const sessionDate = parseISO(session.date);
    const weekStart = startOfWeek(sessionDate, { weekStartsOn: 0 }); // Sunday
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, []);
    }
    weekMap.get(weekKey)!.push(session);
  });

  // Get weeks with 3+ workouts
  const completeWeeks = Array.from(weekMap.entries())
    .filter(([, sessions]) => sessions.length >= 3)
    .map(([weekKey]) => weekKey)
    .sort()
    .reverse();

  // Calculate current streak
  let currentStreak = 0;
  const now = new Date();
  const currentWeekStart = format(startOfWeek(now, { weekStartsOn: 0 }), 'yyyy-MM-dd');

  for (let i = 0; i < completeWeeks.length; i++) {
    const weeksDiff = differenceInDays(
      parseISO(currentWeekStart),
      parseISO(completeWeeks[i])
    ) / 7;

    if (weeksDiff === i) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < completeWeeks.length; i++) {
    if (i === 0 || differenceInDays(parseISO(completeWeeks[i - 1]), parseISO(completeWeeks[i])) === 7) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // This week's workouts
  const thisWeekSessions = weekMap.get(currentWeekStart) || [];
  const thisWeekWorkouts = thisWeekSessions.length;

  // Weekly consistency (last 12 weeks)
  const last12Weeks = Array.from(weekMap.entries()).slice(0, 12);
  const weeksWithThreeWorkouts = last12Weeks.filter(([, sessions]) => sessions.length >= 3).length;
  const weeklyConsistency = last12Weeks.length > 0
    ? Math.round((weeksWithThreeWorkouts / last12Weeks.length) * 100)
    : 0;

  return {
    currentStreak,
    longestStreak,
    thisWeekWorkouts,
    weeklyConsistency,
  };
};

// ============================================================================
// Volume Analysis
// ============================================================================

/**
 * Calculate total volume for a set of exercise logs
 */
export const calculateTotalVolume = (logs: ExerciseLog[]): number => {
  return logs.reduce((total, log) => {
    const sets = Array.isArray(log.sets) ? log.sets : [];
    const logVolume = sets.reduce(
      (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
      0
    );
    return total + logVolume;
  }, 0);
};

/**
 * Group volume by muscle group
 */
export const calculateVolumeByMuscleGroup = (
  logs: ExerciseLog[]
): Record<string, number> => {
  const volumeMap: Record<string, number> = {};

  logs.forEach((log) => {
    const muscleGroup = log.muscle_group;
    const sets = Array.isArray(log.sets) ? log.sets : [];
    const volume = sets.reduce(
      (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
      0
    );

    volumeMap[muscleGroup] = (volumeMap[muscleGroup] || 0) + volume;
  });

  return volumeMap;
};

// ============================================================================
// Trend Analysis
// ============================================================================

/**
 * Calculate linear regression trend for progression analysis
 */
export const calculateTrend = (
  dataPoints: ChartDataPoint[]
): { slope: number; intercept: number; isIncreasing: boolean } | null => {
  if (dataPoints.length < 2) return null;

  const n = dataPoints.length;
  const xValues = dataPoints.map((_, i) => i); // Use index as x
  const yValues = dataPoints.map((p) => p.value);

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return {
    slope,
    intercept,
    isIncreasing: slope > 0,
  };
};

/**
 * Detect if recent progress shows a plateau
 */
export const detectPlateauInChart = (
  dataPoints: ExerciseProgressPoint[],
  recentCount: number = 3
): boolean => {
  if (dataPoints.length < recentCount) return false;

  const recentPoints = dataPoints.slice(-recentCount);
  const trend = calculateTrend(recentPoints);

  if (!trend) return false;

  // Plateau if slope is near zero (less than 1% change per workout)
  const avgValue = recentPoints.reduce((sum, p) => sum + p.value, 0) / recentPoints.length;
  const relativeSlope = Math.abs(trend.slope) / avgValue;

  return relativeSlope < 0.01;
};
