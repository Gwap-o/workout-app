import type { Exercise, SetLog } from '@/types';
import { getRepRange } from '@/lib/constants/exercises';

/**
 * Equipment-Specific Progression Rules
 *
 * Different equipment types have different progression strategies:
 * - Barbell: 5 lb jumps, standard double progression
 * - Dumbbell: 5-10 lb jumps (each hand), wider rep ranges
 * - Bodyweight (Closed-chain): 2.5 lb jumps, linear progression
 * - Cable: 5-10 lb jumps depending on machine
 */

export interface ProgressionResult {
  nextWeight: number;
  nextReps: number;
  progressionType: 'weight' | 'reps' | 'maintain';
  message: string;
  microplatesRecommended?: boolean;
}

/**
 * Barbell Progression Calculator
 *
 * Standard double progression:
 * 1. Increase reps until top of range
 * 2. Add 5 lbs and drop to bottom of range
 */
export const calculateBarbellProgression = (
  exercise: Exercise,
  lastSet: SetLog
): ProgressionResult => {
  const { weight, reps } = lastSet;
  const { weight_increment } = exercise;
  const repRange = getRepRange(exercise);

  // Hit top of rep range - add weight
  if (reps >= repRange.max) {
    return {
      nextWeight: weight + weight_increment,
      nextReps: repRange.min,
      progressionType: 'weight',
      message: `Add ${weight_increment} lbs, drop to ${repRange.min} reps`,
    };
  }

  // Within range - increase reps
  if (reps >= repRange.min && reps < repRange.max) {
    return {
      nextWeight: weight,
      nextReps: reps + 1,
      progressionType: 'reps',
      message: `Same weight, aim for ${reps + 1} reps`,
    };
  }

  // Below range - maintain and try to hit min reps
  return {
    nextWeight: weight,
    nextReps: repRange.min,
    progressionType: 'maintain',
    message: `Same weight, aim for at least ${repRange.min} reps`,
  };
};

/**
 * Dumbbell Progression Calculator
 *
 * Dumbbells have larger jumps (5-10 lbs per hand = 10-20 lbs total)
 * Use wider rep ranges and more gradual progression
 */
export const calculateDumbbellProgression = (
  exercise: Exercise,
  lastSet: SetLog
): ProgressionResult => {
  const { weight, reps } = lastSet;
  const repRange = getRepRange(exercise);
  const { weight_increment } = exercise;

  // Dumbbell increment is typically 5 lbs per hand
  const dumbbellIncrement = weight_increment; // Already set correctly in exercise definitions

  // Hit top of rep range solidly (max + 1 for dumbbells to ensure readiness)
  if (reps > repRange.max) {
    return {
      nextWeight: weight + dumbbellIncrement,
      nextReps: repRange.min,
      progressionType: 'weight',
      message: `Add ${dumbbellIncrement} lbs per hand, drop to ${repRange.min} reps`,
    };
  }

  // At top of range - try to exceed before adding weight
  if (reps === repRange.max) {
    return {
      nextWeight: weight,
      nextReps: repRange.max + 1,
      progressionType: 'reps',
      message: `Same weight, try to exceed ${repRange.max} reps before adding weight`,
    };
  }

  // Within range - increase reps
  if (reps >= repRange.min && reps < repRange.max) {
    return {
      nextWeight: weight,
      nextReps: reps + 1,
      progressionType: 'reps',
      message: `Same weight, aim for ${reps + 1} reps`,
    };
  }

  // Below range
  return {
    nextWeight: weight,
    nextReps: repRange.min,
    progressionType: 'maintain',
    message: `Same weight, build up to ${repRange.min} reps`,
  };
};

/**
 * Bodyweight (Closed-Chain) Progression Calculator
 *
 * For weighted chinups, dips, etc.
 * Linear progression: Add 2.5 lbs every workout when hit target reps
 */
export const calculateBodyweightProgression = (
  exercise: Exercise,
  lastSet: SetLog
): ProgressionResult => {
  const { weight, reps } = lastSet;
  const repRange = getRepRange(exercise);

  // Closed-chain exercises use 2.5 lb increments (microplates)
  const closedChainIncrement = 2.5;

  // Hit target reps - add 2.5 lbs
  if (reps >= repRange.max) {
    return {
      nextWeight: weight + closedChainIncrement,
      nextReps: repRange.min,
      progressionType: 'weight',
      message: `Add ${closedChainIncrement} lbs, aim for ${repRange.min}-${repRange.max} reps`,
      microplatesRecommended: true,
    };
  }

  // Within range - increase reps
  if (reps >= repRange.min && reps < repRange.max) {
    return {
      nextWeight: weight,
      nextReps: reps + 1,
      progressionType: 'reps',
      message: `Same weight, aim for ${reps + 1} reps`,
    };
  }

  // Below range
  return {
    nextWeight: weight,
    nextReps: repRange.min,
    progressionType: 'maintain',
    message: `Same weight, work up to ${repRange.min} reps`,
  };
};

/**
 * Cable Progression Calculator
 *
 * Similar to barbell but may have different increments depending on machine
 * Some cable machines use pin systems with 5-10 lb jumps
 */
export const calculateCableProgression = (
  exercise: Exercise,
  lastSet: SetLog
): ProgressionResult => {
  const { weight, reps } = lastSet;
  const repRange = getRepRange(exercise);
  const { weight_increment } = exercise;

  // Cable machines typically use 5-10 lb increments
  const cableIncrement = weight_increment;

  // Hit top of rep range
  if (reps >= repRange.max) {
    return {
      nextWeight: weight + cableIncrement,
      nextReps: repRange.min,
      progressionType: 'weight',
      message: `Increase to next cable setting (+${cableIncrement} lbs), drop to ${repRange.min} reps`,
    };
  }

  // Within range
  if (reps >= repRange.min && reps < repRange.max) {
    return {
      nextWeight: weight,
      nextReps: reps + 1,
      progressionType: 'reps',
      message: `Same cable setting, aim for ${reps + 1} reps`,
    };
  }

  // Below range
  return {
    nextWeight: weight,
    nextReps: repRange.min,
    progressionType: 'maintain',
    message: `Same cable setting, aim for ${repRange.min} reps`,
  };
};

/**
 * Master progression calculator - routes to equipment-specific logic
 */
export const calculateProgression = (
  exercise: Exercise,
  lastSet: SetLog
): ProgressionResult => {
  switch (exercise.equipment) {
    case 'barbell':
      return calculateBarbellProgression(exercise, lastSet);

    case 'dumbbell':
      return calculateDumbbellProgression(exercise, lastSet);

    case 'bodyweight':
      return calculateBodyweightProgression(exercise, lastSet);

    case 'cable':
      return calculateCableProgression(exercise, lastSet);

    default:
      // Fallback to barbell progression
      return calculateBarbellProgression(exercise, lastSet);
  }
};

/**
 * Get equipment-specific progression guidance
 */
export const getProgressionGuidance = (equipment: Exercise['equipment']): string[] => {
  switch (equipment) {
    case 'barbell':
      return [
        'Add 5 lbs when you hit the top of your rep range',
        'Drop back to the minimum reps with new weight',
        'Work your way back up through the rep range',
        'Example: 135x8 → 140x5 → 140x6 → 140x7 → 140x8 → 145x5',
      ];

    case 'dumbbell':
      return [
        'Try to exceed max reps before adding weight',
        'Dumbbell jumps are larger (5-10 lbs per hand)',
        'Use wider rep ranges to account for larger jumps',
        'Example: 40s x 8 → 40s x 9 → 45s x 6 → 45s x 7 → 45s x 8',
      ];

    case 'bodyweight':
      return [
        'Add 2.5 lbs every workout you hit target reps',
        'Microplates (1.25 lb) recommended for smaller jumps',
        'Linear progression works best for closed-chain exercises',
        'Example: BW → BW+2.5 → BW+5 → BW+7.5 → BW+10',
      ];

    case 'cable':
      return [
        'Increase to next pin setting when hit max reps',
        'Cable increments vary by machine (5-10 lbs typical)',
        'Some machines use fractional plates for smaller jumps',
        'Focus on control and full range of motion',
      ];

    default:
      return ['Standard double progression applies'];
  }
};

/**
 * Check if exercise should recommend microplates
 */
export const shouldRecommendMicroplates = (exercise: Exercise): boolean => {
  return (
    exercise.equipment === 'bodyweight' ||
    (exercise.equipment === 'dumbbell' && exercise.weight_increment <= 5)
  );
};
