import type { DeloadRecommendation } from '@/types';

/**
 * Deload Protocol Utilities
 *
 * Deload weeks are crucial for recovery and preventing plateau/burnout.
 * Recommended: Every 6-8 weeks or when hitting plateau
 */

/**
 * Calculate if a deload is recommended based on training history
 */
export const calculateDeloadRecommendation = (
  weeksSinceLastDeload: number,
  recentPlateaus: number
): DeloadRecommendation => {
  // Automatic deload after 8 weeks
  if (weeksSinceLastDeload >= 8) {
    return {
      shouldDeload: true,
      reason: 'Scheduled deload - You\'ve been training hard for 8+ weeks',
      weeksSinceLastDeload,
      recommendedReduction: 10,
    };
  }

  // Suggest deload after 6 weeks
  if (weeksSinceLastDeload >= 6) {
    return {
      shouldDeload: true,
      reason: 'Consider a deload week for recovery and CNS reset',
      weeksSinceLastDeload,
      recommendedReduction: 10,
    };
  }

  // Plateau-based deload
  if (recentPlateaus >= 3) {
    return {
      shouldDeload: true,
      reason: 'Multiple plateaus detected - deload to break through',
      weeksSinceLastDeload,
      recommendedReduction: 15,
    };
  }

  return {
    shouldDeload: false,
    reason: 'Keep training hard!',
    weeksSinceLastDeload,
    recommendedReduction: 0,
  };
};

/**
 * Calculate deload weight for a given exercise
 */
export const calculateDeloadWeight = (
  currentWeight: number,
  reductionPercentage: number = 10
): number => {
  const reduction = currentWeight * (reductionPercentage / 100);
  const deloadWeight = currentWeight - reduction;

  // Round to nearest 5 lbs
  return Math.round(deloadWeight / 5) * 5;
};

/**
 * Get deload week guidance
 */
export const getDeloadGuidance = (): string[] => {
  return [
    'Reduce all working weights by 10-15%',
    'Maintain the same sets and reps',
    'Focus on perfect form and control',
    'Recovery week - not a rest week',
    'You should feel refreshed after',
    'Return to normal weights next week',
  ];
};

/**
 * Get deload benefits explanation
 */
export const getDeloadBenefits = (): string[] => {
  return [
    'Allows Central Nervous System to fully recover',
    'Reduces accumulated fatigue',
    'Prevents overtraining and burnout',
    'Often leads to strength gains afterward',
    'Gives joints and connective tissue a break',
    'Mental refresh and motivation boost',
  ];
};

/**
 * Check if currently in a deload week
 */
export const isInDeloadWeek = (
  currentDate: Date,
  deloadStartDate?: string,
  deloadEndDate?: string
): boolean => {
  if (!deloadStartDate || !deloadEndDate) {
    return false;
  }

  const start = new Date(deloadStartDate);
  const end = new Date(deloadEndDate);

  return currentDate >= start && currentDate <= end;
};

/**
 * Calculate deload week dates
 */
export const calculateDeloadWeekDates = (startDate?: Date): { start: string; end: string } => {
  const start = startDate || new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 7); // 7-day deload week

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};
