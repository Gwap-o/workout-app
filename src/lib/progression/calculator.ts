import type { ExerciseLog, ExpectedPerformance, SetLog } from '@/types';
import { getWeightIncrement, EXERCISES } from '@/lib/constants/exercises';

/**
 * Double Progression Model
 *
 * IF current_reps >= top_of_range THEN
 *   next_weight = current_weight + increment (5 lbs upper, 10 lbs lower)
 *   next_reps = bottom_of_range
 * ELSE
 *   next_weight = current_weight
 *   next_reps = current_reps + 1
 */

export interface ProgressionResult {
  weight: number;
  reps: number;
  progressed: boolean;
  reason: 'weight_increase' | 'rep_increase' | 'maintain';
}

export const calculateNextWorkout = (
  lastLog: ExerciseLog
): ExpectedPerformance => {
  const exercise = EXERCISES[lastLog.exercise_name];
  if (!exercise) {
    throw new Error(`Exercise not found: ${lastLog.exercise_name}`);
  }

  const topSet = lastLog.sets[0]; // First set (heaviest in RPT)
  const { min: bottomRange, max: topRange } = exercise.rep_range;

  // Check if hit top of rep range
  if (topSet.reps >= topRange) {
    // Increase weight, reset to bottom of rep range
    const increment = getWeightIncrement(lastLog.exercise_name);
    return {
      weight: topSet.weight + increment,
      reps: bottomRange,
      source: 'progression',
    };
  } else {
    // Same weight, add 1 rep
    return {
      weight: topSet.weight,
      reps: topSet.reps + 1,
      source: 'progression',
    };
  }
};

export const calculateProgression = (
  exerciseName: string,
  currentWeight: number,
  currentReps: number
): ProgressionResult => {
  const exercise = EXERCISES[exerciseName];
  if (!exercise) {
    return {
      weight: currentWeight,
      reps: currentReps,
      progressed: false,
      reason: 'maintain',
    };
  }

  const { min: bottomRange, max: topRange } = exercise.rep_range;
  const increment = getWeightIncrement(exerciseName);

  if (currentReps >= topRange) {
    // Hit top of range - increase weight
    return {
      weight: currentWeight + increment,
      reps: bottomRange,
      progressed: true,
      reason: 'weight_increase',
    };
  } else if (currentReps < topRange) {
    // Within range - add rep
    return {
      weight: currentWeight,
      reps: currentReps + 1,
      progressed: true,
      reason: 'rep_increase',
    };
  }

  return {
    weight: currentWeight,
    reps: currentReps,
    progressed: false,
    reason: 'maintain',
  };
};

export const didHitProgression = (
  expected: ExpectedPerformance,
  actual: SetLog
): boolean => {
  // Check if user met or exceeded expected performance
  if (actual.weight > expected.weight) {
    return true;
  }
  if (actual.weight === expected.weight && actual.reps >= expected.reps) {
    return true;
  }
  return false;
};

export const validateProgression = (
  previousLog: ExerciseLog,
  currentLog: ExerciseLog
): {
  valid: boolean;
  message: string;
  type: 'success' | 'warning' | 'error';
} => {
  const prevTopSet = previousLog.sets[0];
  const currTopSet = currentLog.sets[0];

  // Check for progression
  if (
    currTopSet.weight > prevTopSet.weight ||
    (currTopSet.weight === prevTopSet.weight && currTopSet.reps > prevTopSet.reps)
  ) {
    return {
      valid: true,
      message: 'Progression achieved!',
      type: 'success',
    };
  }

  // Check for regression
  if (
    currTopSet.weight < prevTopSet.weight ||
    (currTopSet.weight === prevTopSet.weight && currTopSet.reps < prevTopSet.reps)
  ) {
    return {
      valid: true,
      message: 'Performance decreased - may need deload',
      type: 'warning',
    };
  }

  // No change
  return {
    valid: true,
    message: 'Same as last workout - try to progress next time',
    type: 'warning',
  };
};

// Calculate estimated 1RM (one-rep max)
export const calculate1RM = (weight: number, reps: number): number => {
  // Epley formula: 1RM = weight × (1 + reps/30)
  return Math.round(weight * (1 + reps / 30));
};

// Calculate relative strength (weight / bodyweight)
export const calculateRelativeStrength = (
  weight: number,
  bodyweight: number,
  isBodyweight: boolean = false
): number => {
  const totalWeight = isBodyweight ? weight + bodyweight : weight;
  return Number((totalWeight / bodyweight).toFixed(2));
};
