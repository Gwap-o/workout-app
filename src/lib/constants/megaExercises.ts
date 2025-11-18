import type { Exercise } from '@/types';
import { EXERCISES } from './exercises';

/**
 * MEGA Training Exercises
 *
 * MEGA = Minimum Effort Growth Acceleration
 * A 12-week program focused on maximizing sarcoplasmic hypertrophy
 * through higher volume and shorter rest periods.
 *
 * Program Structure:
 * - Phase 1: Weeks 1-6
 * - Phase 2: Weeks 7-12
 *
 * Recommended cycle: 6 months strength & density → 3 months MEGA
 */

export const MEGA_EXERCISES: Record<string, Exercise> = {
  // Import shared exercises from standard program
  'Close Grip Bench Press': EXERCISES['Close Grip Bench Press'],
  'Lateral Raises': EXERCISES['Lateral Raises'],
  'Hanging Knee Raises': EXERCISES['Hanging Knee Raises'],
  'Weighted Pullups': EXERCISES['Weighted Pullups'],
  'Barbell Box Squat': EXERCISES['Barbell Box Squat'],
  'Incline Barbell Press': EXERCISES['Incline Barbell Press'],
  'Standing Barbell Press': EXERCISES['Standing Barbell Press'],
  'Weighted Chinups': EXERCISES['Weighted Chinups'],
  'Incline Dumbbell Hammer Curls': EXERCISES['Incline Dumbbell Hammer Curls'],
  'Bulgarian Split Squats': EXERCISES['Bulgarian Split Squats'],
  'Dumbbell Romanian Deadlifts': EXERCISES['Dumbbell Romanian Deadlifts'],

  // MEGA-specific exercises
  // MEGA Phase 1 - Workout A
  'Incline Dumbbell Bench Press': {
    name: 'Incline Dumbbell Bench Press',
    muscle_group: 'Chest',
    training_method: 'RPT',
    equipment: 'dumbbell',
    rep_range: { min: 4, max: 6 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2],
  },

  'Cable Cross-Overs': {
    name: 'Cable Cross-Overs',
    muscle_group: 'Chest',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [1],
  },

  'Triceps Pushdowns': {
    name: 'Triceps Pushdowns',
    muscle_group: 'Triceps',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [1],
  },

  // MEGA Phase 1 - Workout B
  'Hip Thrusts': {
    name: 'Hip Thrusts',
    muscle_group: 'Legs',
    training_method: 'Kino',
    equipment: 'barbell',
    rep_range: { min: 8, max: 10 },
    weight_increment: 10,
    rest_period: { min: 90, max: 120 },
    phases: [1],
  },

  'Cable Rows': {
    name: 'Cable Rows',
    muscle_group: 'Back',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 90, max: 120 },
    phases: [1],
  },

  'Machine Curls': {
    name: 'Machine Curls',
    muscle_group: 'Biceps',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [1],
  },

  'Shrugs': {
    name: 'Shrugs',
    muscle_group: 'Back',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [1],
  },

  // MEGA Phase 2 - Workout A
  'Machine Bench Press': {
    name: 'Machine Bench Press',
    muscle_group: 'Chest',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [2],
  },

  'Dumbbell Overhead Triceps Extensions': {
    name: 'Dumbbell Overhead Triceps Extensions',
    muscle_group: 'Triceps',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [2],
  },

  'Upright Rows': {
    name: 'Upright Rows',
    muscle_group: 'Shoulders',
    training_method: 'Kino',
    equipment: 'barbell',
    rep_range: { min: 12, max: 15 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [2],
  },

  // MEGA Phase 2 - Workout B
  'Machine Rows': {
    name: 'Machine Rows',
    muscle_group: 'Back',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [2],
  },

  'Cable Rope Curls': {
    name: 'Cable Rope Curls',
    muscle_group: 'Biceps',
    training_method: 'Kino',
    equipment: 'cable',
    rep_range: { min: 10, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [2],
  },
};

/**
 * Get MEGA workout exercises for a specific phase and workout type
 */
export const getMEGAWorkoutExercises = (
  phase: 1 | 2,
  workoutType: 'A' | 'B'
): Exercise[] => {
  if (phase === 1) {
    if (workoutType === 'A') {
      return [
        MEGA_EXERCISES['Incline Dumbbell Bench Press'],
        MEGA_EXERCISES['Close Grip Bench Press'],
        MEGA_EXERCISES['Cable Cross-Overs'],
        MEGA_EXERCISES['Lateral Raises'],
        MEGA_EXERCISES['Triceps Pushdowns'],
        MEGA_EXERCISES['Hanging Knee Raises'], // Optional
      ];
    } else {
      return [
        MEGA_EXERCISES['Weighted Pullups'],
        MEGA_EXERCISES['Incline Hammer Dumbbell Curls'],
        MEGA_EXERCISES['Box Squats'],
        MEGA_EXERCISES['Hip Thrusts'],
        MEGA_EXERCISES['Cable Rows'],
        MEGA_EXERCISES['Machine Curls'],
        MEGA_EXERCISES['Shrugs'], // Optional
      ];
    }
  }

  // Phase 2
  if (workoutType === 'A') {
    return [
      MEGA_EXERCISES['Incline Barbell Bench Press'],
      MEGA_EXERCISES['Standing Barbell Press'],
      MEGA_EXERCISES['Machine Bench Press'],
      MEGA_EXERCISES['Dumbbell Overhead Triceps Extensions'],
      MEGA_EXERCISES['Upright Rows'],
      MEGA_EXERCISES['Hanging Knee Raises'],
    ];
  } else {
    return [
      MEGA_EXERCISES['Weighted Chinups'],
      MEGA_EXERCISES['Incline Dumbbell Hammer Curls'],
      MEGA_EXERCISES['Bulgarian Split Squats'],
      MEGA_EXERCISES['Dumbbell Romanian Deadlift'],
      MEGA_EXERCISES['Machine Rows'],
      MEGA_EXERCISES['Cable Rope Curls'],
    ];
  }
};

/**
 * Check if an exercise is part of MEGA training
 */
export const isMEGAExercise = (exerciseName: string): boolean => {
  return exerciseName in MEGA_EXERCISES;
};

/**
 * Get MEGA training guidance
 */
export const getMEGAGuidance = (): string => {
  return 'MEGA Training focuses on higher volume with shorter rest periods. Keep 1 rep in the tank - avoid training to failure. Use 60-90 second rest for assistance exercises. Recommended cycle: 6 months strength & density followed by 3 months MEGA.';
};
