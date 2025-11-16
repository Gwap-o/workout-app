import type { ExerciseLog } from '@/types';

/**
 * Plateau Detection System
 *
 * A plateau is detected when:
 * - No progression for 2+ consecutive workouts on the same exercise
 * - Same weight AND same or fewer reps
 */

export interface PlateauAnalysis {
  isPlateaued: boolean;
  consecutiveStagnantWorkouts: number;
  suggestion: string;
  lastWeight: number;
  lastReps: number;
}

export const detectPlateau = (
  exerciseLogs: ExerciseLog[]
): PlateauAnalysis => {
  if (exerciseLogs.length < 2) {
    return {
      isPlateaued: false,
      consecutiveStagnantWorkouts: 0,
      suggestion: 'Not enough data to detect plateau',
      lastWeight: exerciseLogs[0]?.sets[0]?.weight || 0,
      lastReps: exerciseLogs[0]?.sets[0]?.reps || 0,
    };
  }

  // Sort by date descending (most recent first)
  const sortedLogs = [...exerciseLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let consecutiveStagnant = 0;
  let previousWeight = sortedLogs[0].sets[0].weight;
  let previousReps = sortedLogs[0].sets[0].reps;

  // Start from second most recent workout
  for (let i = 1; i < sortedLogs.length; i++) {
    const currentWeight = sortedLogs[i].sets[0].weight;
    const currentReps = sortedLogs[i].sets[0].reps;

    // Check if no progression from previous workout
    if (
      previousWeight === currentWeight &&
      previousReps <= currentReps + 1 // Allow for slight variation
    ) {
      consecutiveStagnant++;
    } else if (
      previousWeight > currentWeight ||
      (previousWeight === currentWeight && previousReps > currentReps)
    ) {
      // Progression found, break the streak
      break;
    }

    previousWeight = currentWeight;
    previousReps = currentReps;
  }

  const isPlateaued = consecutiveStagnant >= 2;

  let suggestion = '';
  if (isPlateaued) {
    if (consecutiveStagnant === 2) {
      suggestion =
        'Consider: 1) Extra rest day, 2) Check nutrition/sleep, 3) Deload 10% weight';
    } else if (consecutiveStagnant >= 3) {
      suggestion =
        'Plateau detected. Recommended: Deload 10-15% weight for 1-2 weeks, then rebuild';
    }
  } else if (consecutiveStagnant === 1) {
    suggestion =
      'One stagnant workout. Push for progression next session or consider small adjustments';
  } else {
    suggestion = 'Making good progress - keep going!';
  }

  return {
    isPlateaued,
    consecutiveStagnantWorkouts: consecutiveStagnant,
    suggestion,
    lastWeight: sortedLogs[0].sets[0].weight,
    lastReps: sortedLogs[0].sets[0].reps,
  };
};

// Suggest deload weight (10-15% reduction)
export const suggestDeloadWeight = (
  currentWeight: number,
  percentage: number = 10
): number => {
  const deloadWeight = currentWeight * (1 - percentage / 100);
  return Math.round(deloadWeight / 5) * 5; // Round to nearest 5
};

// Analyze progression trend over time
export const analyzeProgressionTrend = (
  exerciseLogs: ExerciseLog[]
): {
  trend: 'increasing' | 'plateaued' | 'decreasing';
  totalProgressionsMade: number;
  averageWeightIncrease: number;
} => {
  if (exerciseLogs.length < 2) {
    return {
      trend: 'increasing',
      totalProgressionsMade: 0,
      averageWeightIncrease: 0,
    };
  }

  const sortedLogs = [...exerciseLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let progressionsMade = 0;
  let totalWeightChange = 0;

  for (let i = 1; i < sortedLogs.length; i++) {
    const prevTopSet = sortedLogs[i - 1].sets[0];
    const currTopSet = sortedLogs[i].sets[0];

    if (
      currTopSet.weight > prevTopSet.weight ||
      (currTopSet.weight === prevTopSet.weight &&
        currTopSet.reps > prevTopSet.reps)
    ) {
      progressionsMade++;
      totalWeightChange += currTopSet.weight - prevTopSet.weight;
    }
  }

  const firstWeight = sortedLogs[0].sets[0].weight;
  const lastWeight = sortedLogs[sortedLogs.length - 1].sets[0].weight;
  const overallChange = lastWeight - firstWeight;

  let trend: 'increasing' | 'plateaued' | 'decreasing';
  if (overallChange > 0) {
    trend = 'increasing';
  } else if (overallChange < 0) {
    trend = 'decreasing';
  } else {
    trend = 'plateaued';
  }

  return {
    trend,
    totalProgressionsMade: progressionsMade,
    averageWeightIncrease:
      progressionsMade > 0 ? totalWeightChange / progressionsMade : 0,
  };
};

// Check if user should consider exercise rotation
export const shouldRotateExercise = (analysis: PlateauAnalysis): boolean => {
  return analysis.consecutiveStagnantWorkouts >= 4;
};
