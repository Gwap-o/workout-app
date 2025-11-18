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
  'Incline Dumbbell Press': {
    name: 'Incline Dumbbell Press',
    muscle_group: 'Chest',
    training_method: 'RPT',
    equipment: 'dumbbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [2],
  },

  'Weighted Pullups': {
    name: 'Weighted Pullups',
    muscle_group: 'Back',
    training_method: 'RPT',
    equipment: 'bodyweight',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [2],
  },

  'One-Arm Overhead Triceps Extensions': {
    name: 'One-Arm Overhead Triceps Extensions',
    muscle_group: 'Triceps',
    training_method: 'RPT',
    equipment: 'dumbbell',
    rep_range: { min: 8, max: 10 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [2],
  },

  'Dumbbell Upright Rows': {
    name: 'Dumbbell Upright Rows',
    muscle_group: 'Shoulders',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 10, max: 15 },
    weight_increment: 5,
    rest_period: { min: 90, max: 120 },
    phases: [2],
  },

  'Side-to-Side Knee Ups': {
    name: 'Side-to-Side Knee Ups',
    muscle_group: 'Core',
    training_method: 'Kino',
    equipment: 'bodyweight',
    rep_range: { min: 8, max: 12 },
    weight_increment: 0,
    rest_period: { min: 90, max: 120 },
    phases: [2],
  },

  'Single-Leg Romanian Deadlifts': {
    name: 'Single-Leg Romanian Deadlifts',
    muscle_group: 'Legs',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 8, max: 12 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [2],
    variations: ['Barbell Hip Thrusts'],
  },

  'Barbell Hip Thrusts': {
    name: 'Barbell Hip Thrusts',
    muscle_group: 'Legs',
    training_method: 'Kino',
    equipment: 'barbell',
    rep_range: { min: 8, max: 12 },
    weight_increment: 10,
    rest_period: { min: 120, max: 180 },
    phases: [2],
    variations: ['Single-Leg Romanian Deadlifts'],
  },

  'Seated Bent-Over Flyes': {
    name: 'Seated Bent-Over Flyes',
    muscle_group: 'Shoulders',
    training_method: 'RestPause',
    equipment: 'dumbbell',
    rep_range: { min: 12, max: 15 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [2],
  },

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
  'Standing Press': {
    name: 'Standing Press',
    muscle_group: 'Shoulders',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [3],
  },

  'Triceps Rope Pushdowns': {
    name: 'Triceps Rope Pushdowns',
    muscle_group: 'Triceps',
    training_method: 'RPT',
    equipment: 'cable',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [3],
  },

  'Hanging Knee Raises': {
    name: 'Hanging Knee Raises',
    muscle_group: 'Core',
    training_method: 'Kino',
    equipment: 'bodyweight',
    rep_range: { min: 8, max: 12 },
    weight_increment: 0,
    rest_period: { min: 90, max: 120 },
    phases: [3],
  },

  'Incline Dumbbell Hammer Curls': {
    name: 'Incline Dumbbell Hammer Curls',
    muscle_group: 'Biceps',
    training_method: 'RPT',
    equipment: 'dumbbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [3],
  },

  'Bulgarian Split Squats': {
    name: 'Bulgarian Split Squats',
    muscle_group: 'Legs',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [3],
  },

  'Dumbbell Romanian Deadlifts': {
    name: 'Dumbbell Romanian Deadlifts',
    muscle_group: 'Legs',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [3],
  },

  'Face Pulls': {
    name: 'Face Pulls',
    muscle_group: 'Shoulders',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 12, max: 15 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [3],
  },

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
  workoutType: 'A' | 'B',
  trainingMode?: 'standard' | 'mega',
  specialization?: 'chest' | 'shoulder' | 'triceps' | 'back' | 'biceps' | 'legs' | null
): Exercise[] => {
  // Specialization Routines override standard workouts
  if (specialization) {
    const { getSpecializationWorkout } = require('./specializationRoutines');
    return getSpecializationWorkout(specialization, workoutType);
  }

  // MEGA Training uses a different exercise set
  if (trainingMode === 'mega') {
    // Import MEGA exercises dynamically to avoid circular dependency
    const { getMEGAWorkoutExercises } = require('./megaExercises');
    // MEGA only has 2 phases (12 weeks total)
    const megaPhase = phase <= 2 ? (phase as 1 | 2) : 1;
    return getMEGAWorkoutExercises(megaPhase, workoutType);
  }

  // Standard Strength & Density Program
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
        EXERCISES['Incline Dumbbell Press'],
        EXERCISES['Weighted Dips'],
        EXERCISES['One-Arm Overhead Triceps Extensions'],
        EXERCISES['Dumbbell Upright Rows'],
        EXERCISES['Side-to-Side Knee Ups'],
      ];
    } else {
      return [
        EXERCISES['Weighted Pullups'],
        EXERCISES['Incline Dumbbell Curls'],
        EXERCISES['Barbell Box Squat'],
        EXERCISES['Single-Leg Romanian Deadlifts'],
        EXERCISES['Seated Bent-Over Flyes'],
      ];
    }
  }

  // Phase 3
  if (workoutType === 'A') {
    return [
      EXERCISES['Incline Barbell Press'],
      EXERCISES['Standing Press'],
      EXERCISES['Triceps Rope Pushdowns'],
      EXERCISES['Lateral Raises'],
      EXERCISES['Hanging Knee Raises'],
    ];
  } else {
    return [
      EXERCISES['Weighted Chinups'],
      EXERCISES['Incline Dumbbell Hammer Curls'],
      EXERCISES['Bulgarian Split Squats'],
      EXERCISES['Dumbbell Romanian Deadlifts'],
      EXERCISES['Face Pulls'],
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
