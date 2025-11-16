import type { Exercise, TrainingMethod } from '@/types';

// Exercise library for Greek God 2.0 Program
// Based on the program's indicator exercises and assistance movements

export const EXERCISES: Record<string, Exercise> = {
  // PHASE 1 - Workout A
  'Incline Barbell Press': {
    name: 'Incline Barbell Press',
    muscle_group: 'Chest',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 4, max: 6 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
    fitness_standards: {
      good: 1.0,
      great: 1.25,
      godlike: 1.5,
    },
  },

  'Standing Barbell Press': {
    name: 'Standing Barbell Press',
    muscle_group: 'Shoulders',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [1],
  },

  'Weighted Chinups': {
    name: 'Weighted Chinups',
    muscle_group: 'Back',
    training_method: 'RPT',
    equipment: 'bodyweight',
    rep_range: { min: 4, max: 6 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
    fitness_standards: {
      good: 0.5,
      great: 0.75,
      godlike: 1.0,
    },
  },

  'Barbell Curls': {
    name: 'Barbell Curls',
    muscle_group: 'Biceps',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [1],
  },

  // PHASE 1 - Workout B
  'Weighted Dips': {
    name: 'Weighted Dips',
    muscle_group: 'Triceps',
    training_method: 'RPT',
    equipment: 'bodyweight',
    rep_range: { min: 4, max: 6 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
    fitness_standards: {
      good: 0.5,
      great: 0.75,
      godlike: 1.0,
    },
  },

  'Bulgarian Split Squat': {
    name: 'Bulgarian Split Squat',
    muscle_group: 'Legs',
    training_method: 'RPT',
    equipment: 'dumbbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 10,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2],
    variations: ['Barbell Box Squat'],
  },

  'Barbell Box Squat': {
    name: 'Barbell Box Squat',
    muscle_group: 'Legs',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 4, max: 6 },
    weight_increment: 10,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2],
    variations: ['Bulgarian Split Squat'],
  },

  'Romanian Deadlift': {
    name: 'Romanian Deadlift',
    muscle_group: 'Legs',
    training_method: 'Kino',
    equipment: 'barbell',
    rep_range: { min: 8, max: 12 },
    weight_increment: 10,
    rest_period: { min: 120, max: 180 },
    phases: [1, 2, 3],
  },

  'Lateral Raises': {
    name: 'Lateral Raises',
    muscle_group: 'Shoulders',
    training_method: 'RestPause',
    equipment: 'dumbbell',
    rep_range: { min: 12, max: 15 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [1, 2, 3],
  },

  // PHASE 2 - Additional Exercises
  'Close Grip Bench Press': {
    name: 'Close Grip Bench Press',
    muscle_group: 'Triceps',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [2],
  },

  'Incline Dumbbell Curls': {
    name: 'Incline Dumbbell Curls',
    muscle_group: 'Biceps',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 8, max: 10 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [2],
  },

  'Bent Over Flyes': {
    name: 'Bent Over Flyes',
    muscle_group: 'Shoulders',
    training_method: 'RestPause',
    equipment: 'dumbbell',
    rep_range: { min: 12, max: 15 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [2, 3],
  },

  // PHASE 3 - Additional Exercises
  'Skull Crushers': {
    name: 'Skull Crushers',
    muscle_group: 'Triceps',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [3],
  },

  'Rope Extensions': {
    name: 'Rope Extensions',
    muscle_group: 'Triceps',
    training_method: 'RestPause',
    equipment: 'cable',
    rep_range: { min: 12, max: 15 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [3],
  },
};

// Get exercises for specific phase and workout type
export const getWorkoutExercises = (
  phase: 1 | 2 | 3,
  workoutType: 'A' | 'B'
): Exercise[] => {
  if (phase === 1) {
    if (workoutType === 'A') {
      return [
        EXERCISES['Incline Barbell Press'],
        EXERCISES['Standing Barbell Press'],
        EXERCISES['Weighted Chinups'],
        EXERCISES['Barbell Curls'],
      ];
    } else {
      return [
        EXERCISES['Weighted Dips'],
        EXERCISES['Bulgarian Split Squat'], // or Box Squat
        EXERCISES['Romanian Deadlift'],
        EXERCISES['Lateral Raises'],
      ];
    }
  }

  if (phase === 2) {
    if (workoutType === 'A') {
      return [
        EXERCISES['Incline Barbell Press'],
        EXERCISES['Weighted Chinups'],
        EXERCISES['Close Grip Bench Press'],
        EXERCISES['Incline Dumbbell Curls'],
      ];
    } else {
      return [
        EXERCISES['Weighted Dips'],
        EXERCISES['Bulgarian Split Squat'],
        EXERCISES['Romanian Deadlift'],
        EXERCISES['Lateral Raises'],
        EXERCISES['Bent Over Flyes'],
      ];
    }
  }

  // Phase 3
  if (workoutType === 'A') {
    return [
      EXERCISES['Incline Barbell Press'],
      EXERCISES['Weighted Chinups'],
      EXERCISES['Skull Crushers'],
      EXERCISES['Bent Over Flyes'],
    ];
  } else {
    return [
      EXERCISES['Weighted Dips'],
      EXERCISES['Romanian Deadlift'],
      EXERCISES['Lateral Raises'],
      EXERCISES['Rope Extensions'],
    ];
  }
};

// Helper to check if exercise is upper or lower body
export const isLowerBody = (exerciseName: string): boolean => {
  const exercise = EXERCISES[exerciseName];
  return exercise?.muscle_group === 'Legs';
};

// Get weight increment for exercise
export const getWeightIncrement = (exerciseName: string): number => {
  return isLowerBody(exerciseName) ? 10 : 5;
};

// Get number of sets based on training method
export const getSetsForMethod = (method: TrainingMethod): number => {
  switch (method) {
    case 'RPT':
      return 3;
    case 'Kino':
      return 2;
    case 'RestPause':
      return 1; // Actually 3 mini-sets with 15s rest
    default:
      return 3;
  }
};
