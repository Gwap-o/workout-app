/**
 * Warmup Set Calculations
 *
 * Calculates recommended warmup weights based on working set weight.
 * Warmup protocol: 60%, 75%, 90% of working weight for 1-5 reps each.
 */

export interface WarmupSet {
  percentage: number;
  weight: number;
  reps: number;
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
      reps: 5,
    },
    {
      percentage: 75,
      weight: Math.round(workingWeight * 0.75 / 5) * 5,
      reps: 3,
    },
    {
      percentage: 90,
      weight: Math.round(workingWeight * 0.9 / 5) * 5,
      reps: 1,
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
