import type { SetLog, Exercise } from '@/types';

/**
 * Progression Validation & Guardrails
 *
 * Prevents unsafe progressions that can lead to:
 * - Injuries from weight jumps too large
 * - Form breakdown from excessive rep increases
 * - Burnout from unsustainable progression velocity
 */

export interface ProgressionWarning {
  severity: 'error' | 'warning' | 'info';
  type: 'weight_jump' | 'rep_jump' | 'regression' | 'velocity' | 'deload_needed';
  message: string;
  recommendation: string;
  canOverride: boolean;
}

export interface GuardrailCheck {
  canProceed: boolean;
  warnings: ProgressionWarning[];
  overallSeverity: 'safe' | 'caution' | 'danger';
}

/**
 * Check if weight jump is too large
 *
 * Safe jumps:
 * - Barbell: ≤10 lbs single workout
 * - Dumbbell: ≤10 lbs per hand single workout
 * - Bodyweight: ≤5 lbs single workout
 */
export const validateWeightJump = (
  currentWeight: number,
  lastWeight: number,
  equipment: Exercise['equipment']
): ProgressionWarning | null => {
  const weightIncrease = currentWeight - lastWeight;

  if (weightIncrease <= 0) return null; // No increase or regression handled separately

  // Define safe thresholds by equipment type
  const thresholds: Record<Exercise['equipment'], number> = {
    barbell: 10,
    dumbbell: 10, // per hand
    bodyweight: 5,
    cable: 15, // cable machines can have larger jumps
  };

  const maxSafeJump = thresholds[equipment];

  if (weightIncrease > maxSafeJump * 2) {
    // Extreme jump - hard error
    return {
      severity: 'error',
      type: 'weight_jump',
      message: `Weight jump of ${weightIncrease} lbs is too large! This greatly increases injury risk.`,
      recommendation: `For ${equipment} exercises, keep jumps under ${maxSafeJump} lbs. Current jump: ${weightIncrease} lbs.`,
      canOverride: false,
    };
  }

  if (weightIncrease > maxSafeJump) {
    // Large jump - strong warning
    return {
      severity: 'warning',
      type: 'weight_jump',
      message: `Weight jump of ${weightIncrease} lbs is larger than recommended.`,
      recommendation: `For ${equipment} exercises, ${maxSafeJump} lbs is optimal. Consider a smaller increase.`,
      canOverride: true,
    };
  }

  return null;
};

/**
 * Check if rep jump is too large
 *
 * Safe rep increases:
 * - Never more than 3 reps in a single workout
 * - Typical progression is 1 rep per workout
 */
export const validateRepJump = (
  currentReps: number,
  lastReps: number
): ProgressionWarning | null => {
  const repIncrease = currentReps - lastReps;

  if (repIncrease <= 0) return null;

  if (repIncrease > 5) {
    // Extreme rep jump
    return {
      severity: 'error',
      type: 'rep_jump',
      message: `Rep increase of ${repIncrease} is excessive! This suggests poor form or data error.`,
      recommendation: 'Typical progression is 1-2 reps per workout. Verify your numbers.',
      canOverride: false,
    };
  }

  if (repIncrease > 3) {
    return {
      severity: 'warning',
      type: 'rep_jump',
      message: `Rep increase of ${repIncrease} is higher than recommended.`,
      recommendation: 'Aim for 1-2 rep increases per workout for sustainable progress.',
      canOverride: true,
    };
  }

  return null;
};

/**
 * Check for regression patterns
 *
 * Regression indicates:
 * - Inadequate recovery
 * - Potential overtraining
 * - Need for deload
 */
export const validateRegression = (
  currentWeight: number,
  currentReps: number,
  lastWeight: number,
  lastReps: number
): ProgressionWarning | null => {
  // Calculate total volume (weight × reps)
  const currentVolume = currentWeight * currentReps;
  const lastVolume = lastWeight * lastReps;

  // Check if both weight AND reps decreased
  const weightDecrease = lastWeight - currentWeight;
  const repDecrease = lastReps - currentReps;

  if (weightDecrease > 0 && repDecrease > 0) {
    return {
      severity: 'warning',
      type: 'regression',
      message: 'Both weight and reps decreased. This may indicate inadequate recovery.',
      recommendation:
        'Consider: 1) Getting more sleep, 2) Eating more, 3) Taking a deload week if this continues.',
      canOverride: true,
    };
  }

  // Check for significant volume drop (>20%)
  const volumeDecrease = ((lastVolume - currentVolume) / lastVolume) * 100;

  if (volumeDecrease > 20) {
    return {
      severity: 'warning',
      type: 'regression',
      message: `Training volume dropped by ${volumeDecrease.toFixed(0)}%. Check your recovery.`,
      recommendation:
        'Large volume drops can indicate overtraining. Ensure adequate rest and nutrition.',
      canOverride: true,
    };
  }

  return null;
};

/**
 * Check progression velocity (monthly rate)
 *
 * Optimal progression:
 * - 10-15 lbs/month for barbell exercises
 * - 5-10 lbs/month for dumbbell exercises
 * - Beginners can progress faster, advanced slower
 */
export const validateProgressionVelocity = (
  currentWeight: number,
  weightFourWeeksAgo: number,
  equipment: Exercise['equipment']
): ProgressionWarning | null => {
  const monthlyGain = currentWeight - weightFourWeeksAgo;

  if (monthlyGain <= 0) return null; // No gain or regression

  // Define healthy ranges by equipment
  const ranges: Record<
    Exercise['equipment'],
    { min: number; max: number; extreme: number }
  > = {
    barbell: { min: 10, max: 15, extreme: 25 },
    dumbbell: { min: 5, max: 10, extreme: 20 },
    bodyweight: { min: 2.5, max: 7.5, extreme: 15 },
    cable: { min: 10, max: 20, extreme: 30 },
  };

  const range = ranges[equipment];

  if (monthlyGain > range.extreme) {
    return {
      severity: 'warning',
      type: 'velocity',
      message: `You've gained ${monthlyGain} lbs in 4 weeks - this pace is unsustainable.`,
      recommendation: `For ${equipment}, optimal monthly gain is ${range.min}-${range.max} lbs. Slow down to prevent burnout.`,
      canOverride: true,
    };
  }

  if (monthlyGain > range.max) {
    return {
      severity: 'info',
      type: 'velocity',
      message: `Great progress! ${monthlyGain} lbs in 4 weeks is above average.`,
      recommendation: `This pace is excellent but may not be sustainable long-term. Enjoy it while it lasts!`,
      canOverride: true,
    };
  }

  return null;
};

/**
 * Check if deload is needed based on plateau pattern
 */
export const checkDeloadNeeded = (
  recentPlateaus: number,
  weeksSinceLastDeload: number
): ProgressionWarning | null => {
  if (recentPlateaus >= 3 && weeksSinceLastDeload >= 4) {
    return {
      severity: 'warning',
      type: 'deload_needed',
      message: `${recentPlateaus} consecutive plateaus detected. A deload week is recommended.`,
      recommendation:
        'Take a deload week (reduce weights 10-15%) to allow full recovery. You will often break through plateaus after deloading.',
      canOverride: true,
    };
  }

  if (weeksSinceLastDeload >= 8) {
    return {
      severity: 'info',
      type: 'deload_needed',
      message: `It has been ${weeksSinceLastDeload} weeks since your last deload.`,
      recommendation:
        'Consider taking a deload week soon to prevent accumulated fatigue.',
      canOverride: true,
    };
  }

  return null;
};

/**
 * Master guardrail check - runs all validations
 */
export const checkProgressionGuardrails = (
  currentSet: SetLog,
  lastSet: SetLog | undefined,
  exercise: Exercise,
  recentPlateaus: number = 0,
  weeksSinceLastDeload: number = 0,
  weightFourWeeksAgo?: number
): GuardrailCheck => {
  const warnings: ProgressionWarning[] = [];

  // Only validate if we have historical data
  if (!lastSet) {
    return {
      canProceed: true,
      warnings: [],
      overallSeverity: 'safe',
    };
  }

  // Weight jump validation
  const weightWarning = validateWeightJump(
    currentSet.weight,
    lastSet.weight,
    exercise.equipment
  );
  if (weightWarning) warnings.push(weightWarning);

  // Rep jump validation
  const repWarning = validateRepJump(currentSet.reps, lastSet.reps);
  if (repWarning) warnings.push(repWarning);

  // Regression validation
  const regressionWarning = validateRegression(
    currentSet.weight,
    currentSet.reps,
    lastSet.weight,
    lastSet.reps
  );
  if (regressionWarning) warnings.push(regressionWarning);

  // Progression velocity (if we have 4-week data)
  if (weightFourWeeksAgo) {
    const velocityWarning = validateProgressionVelocity(
      currentSet.weight,
      weightFourWeeksAgo,
      exercise.equipment
    );
    if (velocityWarning) warnings.push(velocityWarning);
  }

  // Deload check
  const deloadWarning = checkDeloadNeeded(recentPlateaus, weeksSinceLastDeload);
  if (deloadWarning) warnings.push(deloadWarning);

  // Determine overall severity
  const hasErrors = warnings.some((w) => w.severity === 'error');
  const hasWarnings = warnings.some((w) => w.severity === 'warning');

  const overallSeverity: GuardrailCheck['overallSeverity'] = hasErrors
    ? 'danger'
    : hasWarnings
    ? 'caution'
    : 'safe';

  // Can only proceed if no hard errors OR all warnings are overridable
  const canProceed = !hasErrors || warnings.every((w) => w.canOverride);

  return {
    canProceed,
    warnings,
    overallSeverity,
  };
};

/**
 * Get severity color for UI
 */
export const getSeverityColor = (
  severity: ProgressionWarning['severity']
): {
  bg: string;
  border: string;
  text: string;
  icon: string;
} => {
  switch (severity) {
    case 'error':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-400 dark:border-red-700',
        text: 'text-red-800 dark:text-red-200',
        icon: '🛑',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-400 dark:border-yellow-700',
        text: 'text-yellow-800 dark:text-yellow-200',
        icon: '⚠️',
      };
    case 'info':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-400 dark:border-blue-700',
        text: 'text-blue-800 dark:text-blue-200',
        icon: 'ℹ️',
      };
  }
};
