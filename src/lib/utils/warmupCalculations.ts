/**
 * Warmup Set Calculations
 *
 * Calculates recommended warmup weights based on working set weight.
 * Warmup protocol: 60%, 75%, 90% of working weight for 1-5 reps each.
 *
 * Standard warmup protocol:
 * - Only for the FIRST exercise of each workout
 * - 3 warmup sets at 60%, 75%, 90% of working weight
 * - Rep recommendations: 5 reps @ 60%, 3 reps @ 75%, 1 rep @ 90%
 * - 2-3 minute rest between warmup sets
 */

import type { SetLog } from '@/types';

export interface WarmupSet {
  percentage: number;
  weight: number;
  reps: number;
  suggested_reps: number;
}

/**
 * Convert WarmupSet to SetLog format
 */
export function warmupSetToSetLog(warmupSet: WarmupSet, setNumber: number): SetLog {
  return {
    set_number: setNumber,
    weight: warmupSet.weight,
    reps: 0, // User fills this in
    completed: false,
    is_warmup: true,
    rest_time: 0,
  };
}

/**
 * Calculate warmup sets based on the planned working weight
 * Returns 3 warmup sets at 60%, 75%, and 90% of working weight
 *
 * @param workingWeight - The weight planned for the first working set
 * @returns Array of warmup sets with weight and rep recommendations
 */
export function calculateWarmupSets(workingWeight: number): WarmupSet[] {
  if (workingWeight <= 0) {
    return [];
  }

  return [
    {
      percentage: 60,
      weight: Math.round(workingWeight * 0.6 / 5) * 5, // Round to nearest 5 lbs
      reps: 0, // User fills in actual reps
      suggested_reps: 5,
    },
    {
      percentage: 75,
      weight: Math.round(workingWeight * 0.75 / 5) * 5,
      reps: 0, // User fills in actual reps
      suggested_reps: 3,
    },
    {
      percentage: 90,
      weight: Math.round(workingWeight * 0.9 / 5) * 5,
      reps: 0, // User fills in actual reps
      suggested_reps: 1,
    },
  ];
}

/**
 * Check if warmup sets are needed for this exercise
 * Warmup sets should only be done for the FIRST exercise of the workout
 *
 * @param exerciseIndex - Index of the exercise in the workout (0-based)
 * @returns true if warmup sets should be shown
 */
export function shouldShowWarmupSets(exerciseIndex: number): boolean {
  return exerciseIndex === 0;
}

/**
 * Get warmup guidance text
 */
export function getWarmupGuidance(): string {
  return 'Warmup sets prepare your muscles and nervous system. Do 3 warmup sets at 60%, 75%, and 90% of your working weight. Rest 2-3 minutes between warmup sets. Only warmup for the first exercise.';
}

/**
 * Get recommended rest time for warmup sets (in seconds)
 */
export const WARMUP_REST_SECONDS = 120; // 2 minutes between warmup sets

/**
 * Get warmup guidance for specific percentage
 */
export function getWarmupSetGuidance(percentage: number): string {
  switch (percentage) {
    case 60:
      return 'Light warmup - Focus on form and movement pattern';
    case 75:
      return 'Moderate warmup - Start feeling the weight';
    case 90:
      return 'Heavy warmup - Prepare for working weight';
    default:
      return 'Warmup set';
  }
}

/**
 * Validate that warmup sets are completed
 */
export function areWarmupsComplete(warmupSets: SetLog[]): boolean {
  return warmupSets.filter((s) => s.is_warmup).every((set) => set.completed);
}
