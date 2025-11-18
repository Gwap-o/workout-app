/**
 * Indicator Exercises - The 6 Key Lifts
 *
 * These are the most important exercises in the Greek God 2.0 program.
 * Progress on these indicators determines overall program effectiveness.
 *
 * From the program:
 * "These 6 exercises are your north star. If you're progressing on these,
 * you're building the Greek God physique."
 */

export const INDICATOR_EXERCISES = [
  'Incline Barbell Press',
  'Standing Barbell Press',
  'Weighted Chinups',
  'Weighted Dips',
  'Bulgarian Split Squat',
  'Romanian Deadlift',
] as const;

export type IndicatorExerciseName = (typeof INDICATOR_EXERCISES)[number];

/**
 * Check if an exercise is an indicator exercise
 */
export const isIndicatorExercise = (exerciseName: string): boolean => {
  return INDICATOR_EXERCISES.includes(exerciseName as IndicatorExerciseName);
};

/**
 * Strength standards for indicator exercises
 * Values are for intermediate level (Greek God physique target)
 */
export interface StrengthStandard {
  exerciseName: IndicatorExerciseName;
  beginner: number; // lbs for typical bodyweight
  intermediate: number; // Greek God target
  advanced: number; // Elite level
  unit: 'lbs' | 'bodyweight_multiplier';
  description: string;
}

export const INDICATOR_STRENGTH_STANDARDS: Record<
  IndicatorExerciseName,
  StrengthStandard
> = {
  'Incline Barbell Press': {
    exerciseName: 'Incline Barbell Press',
    beginner: 135,
    intermediate: 225, // Greek God target: 225 lbs for reps
    advanced: 275,
    unit: 'lbs',
    description: 'Upper chest development indicator',
  },
  'Standing Barbell Press': {
    exerciseName: 'Standing Barbell Press',
    beginner: 95,
    intermediate: 155, // Greek God target: 155 lbs for reps
    advanced: 185,
    unit: 'lbs',
    description: 'Shoulder strength and size indicator',
  },
  'Weighted Chinups': {
    exerciseName: 'Weighted Chinups',
    beginner: 0, // Bodyweight only
    intermediate: 45, // Greek God target: BW + 45 lbs for reps
    advanced: 90,
    unit: 'lbs',
    description: 'Back width and bicep development',
  },
  'Weighted Dips': {
    exerciseName: 'Weighted Dips',
    beginner: 0, // Bodyweight only
    intermediate: 45, // Greek God target: BW + 45 lbs for reps
    advanced: 90,
    unit: 'lbs',
    description: 'Lower chest and tricep strength',
  },
  'Bulgarian Split Squat': {
    exerciseName: 'Bulgarian Split Squat',
    beginner: 80,
    intermediate: 140, // Greek God target: 140 lbs dumbbells (70 per hand)
    advanced: 180,
    unit: 'lbs',
    description: 'Leg development and stability',
  },
  'Romanian Deadlift': {
    exerciseName: 'Romanian Deadlift',
    beginner: 135,
    intermediate: 275, // Greek God target: 275 lbs for reps
    advanced: 365,
    unit: 'lbs',
    description: 'Posterior chain and hamstring strength',
  },
};

/**
 * Calculate progress percentage toward Greek God standard
 */
export const calculateIndicatorProgress = (
  exerciseName: IndicatorExerciseName,
  currentWeight: number
): {
  percentage: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  nextMilestone: number;
  nextLevel: string;
} => {
  const standard = INDICATOR_STRENGTH_STANDARDS[exerciseName];

  if (currentWeight < standard.beginner) {
    return {
      percentage: (currentWeight / standard.beginner) * 100,
      level: 'beginner',
      nextMilestone: standard.beginner,
      nextLevel: 'Beginner',
    };
  } else if (currentWeight < standard.intermediate) {
    const range = standard.intermediate - standard.beginner;
    const progress = currentWeight - standard.beginner;
    return {
      percentage: 100 + (progress / range) * 100,
      level: 'beginner',
      nextMilestone: standard.intermediate,
      nextLevel: 'Greek God (Intermediate)',
    };
  } else if (currentWeight < standard.advanced) {
    const range = standard.advanced - standard.intermediate;
    const progress = currentWeight - standard.intermediate;
    return {
      percentage: 200 + (progress / range) * 100,
      level: 'intermediate',
      nextMilestone: standard.advanced,
      nextLevel: 'Advanced',
    };
  } else {
    return {
      percentage: 300,
      level: 'advanced',
      nextMilestone: standard.advanced,
      nextLevel: 'Elite',
    };
  }
};

/**
 * Get muscle groups targeted by indicator exercises
 */
export const getIndicatorMuscleGroups = (): Record<
  string,
  IndicatorExerciseName[]
> => {
  return {
    Chest: ['Incline Barbell Press', 'Weighted Dips'],
    Shoulders: ['Standing Barbell Press'],
    Back: ['Weighted Chinups'],
    Legs: ['Bulgarian Split Squat', 'Romanian Deadlift'],
  };
};

/**
 * Priority order for displaying indicators
 */
export const INDICATOR_DISPLAY_ORDER: IndicatorExerciseName[] = [
  'Incline Barbell Press',
  'Weighted Chinups',
  'Standing Barbell Press',
  'Weighted Dips',
  'Bulgarian Split Squat',
  'Romanian Deadlift',
];
