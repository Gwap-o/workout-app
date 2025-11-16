// Fitness Standards Tracker
// Based on Kinobody Greek God 2.0 strength tiers

export interface FitnessStandard {
  exercise: string;
  good: number; // Weight in lbs for 180lb male
  great: number;
  godlike: number;
  scalingFactor?: number; // If bodyweight-dependent (e.g., for weighted chin-ups)
}

export type TierLevel = 'beginner' | 'good' | 'great' | 'godlike';

export interface TierProgress {
  exercise: string;
  currentWeight: number;
  currentTier: TierLevel;
  nextTier: TierLevel | null;
  nextTierWeight: number | null;
  poundsAway: number | null;
  percentageToNext: number;
  strengthScore: number; // 0-100
}

// ============================================================================
// Fitness Standards (for 180 lb male)
// ============================================================================

export const FITNESS_STANDARDS: Record<string, FitnessStandard> = {
  // Upper Body Push
  'Incline Barbell Press': {
    exercise: 'Incline Barbell Press',
    good: 185,
    great: 225,
    godlike: 275,
  },
  'Incline Dumbbell Press': {
    exercise: 'Incline Dumbbell Press',
    good: 75, // per dumbbell
    great: 90,
    godlike: 110,
  },
  'Overhead Press': {
    exercise: 'Overhead Press',
    good: 135,
    great: 165,
    godlike: 185,
  },
  'Dips': {
    exercise: 'Dips',
    good: 45, // added weight
    great: 75,
    godlike: 100,
    scalingFactor: 0.25, // bodyweight scaling
  },

  // Upper Body Pull
  'Weighted Chin-ups': {
    exercise: 'Weighted Chin-ups',
    good: 45, // added weight
    great: 75,
    godlike: 100,
    scalingFactor: 0.25,
  },
  'Weighted Pull-ups': {
    exercise: 'Weighted Pull-ups',
    good: 45,
    great: 75,
    godlike: 100,
    scalingFactor: 0.25,
  },
  'Barbell Row': {
    exercise: 'Barbell Row',
    good: 185,
    great: 225,
    godlike: 275,
  },

  // Arms
  'Barbell Curls': {
    exercise: 'Barbell Curls',
    good: 115,
    great: 135,
    godlike: 155,
  },
  'Dumbbell Curls': {
    exercise: 'Dumbbell Curls',
    good: 45, // per dumbbell
    great: 55,
    godlike: 65,
  },
  'Close Grip Bench': {
    exercise: 'Close Grip Bench',
    good: 185,
    great: 225,
    godlike: 265,
  },

  // Lower Body
  'Squat': {
    exercise: 'Squat',
    good: 225,
    great: 275,
    godlike: 315,
  },
  'Front Squat': {
    exercise: 'Front Squat',
    good: 185,
    great: 225,
    godlike: 275,
  },
  'Deadlift': {
    exercise: 'Deadlift',
    good: 315,
    great: 405,
    godlike: 495,
  },
  'Romanian Deadlift': {
    exercise: 'Romanian Deadlift',
    good: 225,
    great: 275,
    godlike: 315,
  },
};

// ============================================================================
// Tier Calculation
// ============================================================================

/**
 * Scale standards based on user's bodyweight
 * Standards are for 180 lb male, scale proportionally
 */
export const scaleStandardToBodyweight = (
  standard: FitnessStandard,
  userBodyweight: number
): FitnessStandard => {
  const baseBodyweight = 180;
  const scaleFactor = userBodyweight / baseBodyweight;

  // For bodyweight-dependent exercises (weighted chin-ups, dips)
  if (standard.scalingFactor) {
    return {
      ...standard,
      good: Math.round(standard.good * scaleFactor * standard.scalingFactor),
      great: Math.round(standard.great * scaleFactor * standard.scalingFactor),
      godlike: Math.round(standard.godlike * scaleFactor * standard.scalingFactor),
    };
  }

  // For absolute strength exercises (bench, squat, deadlift)
  // Lighter athletes need higher relative strength, heavier athletes get some slack
  const adjustedScale = Math.pow(scaleFactor, 0.67); // Allometric scaling

  return {
    ...standard,
    good: Math.round(standard.good * adjustedScale),
    great: Math.round(standard.great * adjustedScale),
    godlike: Math.round(standard.godlike * adjustedScale),
  };
};

/**
 * Determine current tier based on max weight
 */
export const calculateTier = (
  currentWeight: number,
  standard: FitnessStandard,
  userBodyweight: number = 180
): TierLevel => {
  const scaledStandard = scaleStandardToBodyweight(standard, userBodyweight);

  if (currentWeight >= scaledStandard.godlike) return 'godlike';
  if (currentWeight >= scaledStandard.great) return 'great';
  if (currentWeight >= scaledStandard.good) return 'good';
  return 'beginner';
};

/**
 * Calculate comprehensive tier progress for an exercise
 */
export const calculateTierProgress = (
  exerciseName: string,
  currentWeight: number,
  userBodyweight: number = 180
): TierProgress | null => {
  const standard = FITNESS_STANDARDS[exerciseName];
  if (!standard) return null;

  const scaledStandard = scaleStandardToBodyweight(standard, userBodyweight);
  const currentTier = calculateTier(currentWeight, standard, userBodyweight);

  let nextTier: TierLevel | null = null;
  let nextTierWeight: number | null = null;

  // Determine next tier
  switch (currentTier) {
    case 'beginner':
      nextTier = 'good';
      nextTierWeight = scaledStandard.good;
      break;
    case 'good':
      nextTier = 'great';
      nextTierWeight = scaledStandard.great;
      break;
    case 'great':
      nextTier = 'godlike';
      nextTierWeight = scaledStandard.godlike;
      break;
    case 'godlike':
      nextTier = null;
      nextTierWeight = null;
      break;
  }

  const poundsAway = nextTierWeight ? nextTierWeight - currentWeight : null;

  // Calculate percentage to next tier
  let percentageToNext = 0;
  if (nextTierWeight) {
    const previousTierWeight =
      currentTier === 'beginner'
        ? 0
        : currentTier === 'good'
        ? scaledStandard.good
        : scaledStandard.great;

    const range = nextTierWeight - previousTierWeight;
    const progress = currentWeight - previousTierWeight;
    percentageToNext = Math.min(100, Math.max(0, (progress / range) * 100));
  } else {
    percentageToNext = 100; // Already at max tier
  }

  // Calculate overall strength score (0-100)
  const strengthScore = calculateStrengthScore(currentWeight, scaledStandard);

  return {
    exercise: exerciseName,
    currentWeight,
    currentTier,
    nextTier,
    nextTierWeight,
    poundsAway,
    percentageToNext: Math.round(percentageToNext),
    strengthScore,
  };
};

/**
 * Calculate overall strength score (0-100)
 * Beginner = 0-25, Good = 25-50, Great = 50-75, Godlike = 75-100
 */
const calculateStrengthScore = (
  currentWeight: number,
  scaledStandard: FitnessStandard
): number => {
  if (currentWeight >= scaledStandard.godlike) {
    // Beyond godlike, cap at 100
    const excess = currentWeight - scaledStandard.godlike;
    const bonus = Math.min(25, (excess / scaledStandard.godlike) * 25);
    return Math.min(100, 75 + bonus);
  }

  if (currentWeight >= scaledStandard.great) {
    // Great to Godlike range (75-100)
    const range = scaledStandard.godlike - scaledStandard.great;
    const progress = currentWeight - scaledStandard.great;
    return 75 + (progress / range) * 25;
  }

  if (currentWeight >= scaledStandard.good) {
    // Good to Great range (50-75)
    const range = scaledStandard.great - scaledStandard.good;
    const progress = currentWeight - scaledStandard.good;
    return 50 + (progress / range) * 25;
  }

  // Beginner to Good range (0-50)
  const range = scaledStandard.good;
  const progress = currentWeight;
  return (progress / range) * 50;
};

/**
 * Get all tier progress for multiple exercises
 */
export const calculateAllTierProgress = (
  exerciseWeights: Record<string, number>,
  userBodyweight: number = 180
): TierProgress[] => {
  const results: TierProgress[] = [];

  Object.entries(exerciseWeights).forEach(([exerciseName, weight]) => {
    const progress = calculateTierProgress(exerciseName, weight, userBodyweight);
    if (progress) {
      results.push(progress);
    }
  });

  return results.sort((a, b) => b.strengthScore - a.strengthScore);
};

/**
 * Estimate time to next tier based on recent progression rate
 * @param currentWeight - Current max weight
 * @param nextTierWeight - Target weight for next tier
 * @param progressionRate - Pounds added per week on average
 */
export const estimateTimeToNextTier = (
  currentWeight: number,
  nextTierWeight: number,
  progressionRate: number
): { weeks: number; months: number } | null => {
  if (progressionRate <= 0 || nextTierWeight <= currentWeight) {
    return null;
  }

  const poundsNeeded = nextTierWeight - currentWeight;
  const weeksNeeded = Math.ceil(poundsNeeded / progressionRate);
  const monthsNeeded = Math.ceil(weeksNeeded / 4);

  return {
    weeks: weeksNeeded,
    months: monthsNeeded,
  };
};

/**
 * Calculate progression rate from recent exercise logs
 * Returns average pounds gained per week
 */
export const calculateProgressionRate = (
  weights: { date: string; weight: number }[]
): number | null => {
  if (weights.length < 2) return null;

  const sorted = [...weights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstEntry = sorted[0];
  const lastEntry = sorted[sorted.length - 1];

  const weightGain = lastEntry.weight - firstEntry.weight;
  const daysDiff =
    (new Date(lastEntry.date).getTime() - new Date(firstEntry.date).getTime()) /
    (1000 * 60 * 60 * 24);
  const weeksDiff = daysDiff / 7;

  if (weeksDiff === 0) return null;

  return Number((weightGain / weeksDiff).toFixed(2));
};

/**
 * Get tier badge color
 */
export const getTierColor = (tier: TierLevel): string => {
  switch (tier) {
    case 'beginner':
      return 'bg-gray-500';
    case 'good':
      return 'bg-blue-500';
    case 'great':
      return 'bg-purple-500';
    case 'godlike':
      return 'bg-yellow-500';
  }
};

/**
 * Get tier display name
 */
export const getTierDisplayName = (tier: TierLevel): string => {
  switch (tier) {
    case 'beginner':
      return 'Beginner';
    case 'good':
      return 'Good';
    case 'great':
      return 'Great';
    case 'godlike':
      return 'Godlike';
  }
};
