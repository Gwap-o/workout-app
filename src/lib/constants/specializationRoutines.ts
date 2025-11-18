import type { Exercise } from '@/types';
import { EXERCISES } from './exercises';

/**
 * Specialization Routines
 *
 * Advanced training programs focused on rapid growth of specific muscle groups.
 * Pick one muscle group per workout day and add extra volume.
 *
 * Duration: 6 weeks per specialization
 * Note: Can't increase volume on all muscle groups - would lead to overtraining
 */

export type SpecializationType = 'chest' | 'shoulder' | 'triceps' | 'back' | 'biceps' | 'legs' | null;

// Additional exercises needed for specializations
export const SPECIALIZATION_EXERCISES: Record<string, Exercise> = {
  'Flat Bench Press': {
    name: 'Flat Bench Press',
    muscle_group: 'Chest',
    training_method: 'RPT',
    equipment: 'dumbbell',
    rep_range: { min: 6, max: 8 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
  },

  'Hang Cleans': {
    name: 'Hang Cleans',
    muscle_group: 'Back',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 5, max: 6 },
    weight_increment: 10,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
  },

  'Sumo Deadlifts': {
    name: 'Sumo Deadlifts',
    muscle_group: 'Legs',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 5, max: 6 },
    weight_increment: 10,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
  },

  'Weighted Close-Grip Chinups': {
    name: 'Weighted Close-Grip Chinups',
    muscle_group: 'Biceps',
    training_method: 'RPT',
    equipment: 'bodyweight',
    rep_range: { min: 5, max: 6 },
    weight_increment: 5,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
  },

  'Pistol Squats': {
    name: 'Pistol Squats',
    muscle_group: 'Legs',
    training_method: 'RPT',
    equipment: 'bodyweight',
    rep_range: { min: 3, max: 5 },
    weight_increment: 5,
    rest_period: { min: 120, max: 180 },
    phases: [1, 2, 3],
  },

  'Calf Raises': {
    name: 'Calf Raises',
    muscle_group: 'Legs',
    training_method: 'Kino',
    equipment: 'dumbbell',
    rep_range: { min: 8, max: 12 },
    weight_increment: 5,
    rest_period: { min: 60, max: 90 },
    phases: [1, 2, 3],
  },

  'Squats': {
    name: 'Squats',
    muscle_group: 'Legs',
    training_method: 'RPT',
    equipment: 'barbell',
    rep_range: { min: 5, max: 6 },
    weight_increment: 10,
    rest_period: { min: 180, max: 240 },
    phases: [1, 2, 3],
  },
};

/**
 * Get specialization workout exercises
 */
export const getSpecializationWorkout = (
  specialization: SpecializationType,
  workoutType: 'A' | 'B'
): Exercise[] => {
  if (!specialization) {
    return [];
  }

  // Workout A specializations (Chest, Shoulders, Triceps focus)
  if (workoutType === 'A') {
    switch (specialization) {
      case 'chest':
        return [
          { ...EXERCISES['Incline Barbell Press'], rep_range: { min: 5, max: 5 } }, // 5 sets
          SPECIALIZATION_EXERCISES['Flat Bench Press'],
          EXERCISES['Lateral Raises'],
          EXERCISES['Skull Crushers'],
        ];

      case 'shoulder':
        return [
          { ...EXERCISES['Standing Press'], rep_range: { min: 5, max: 5 } }, // 5 sets
          EXERCISES['Weighted Dips'],
          EXERCISES['Lateral Raises'],
          EXERCISES['Skull Crushers'],
        ];

      case 'triceps':
        return [
          EXERCISES['Incline Barbell Press'],
          EXERCISES['Weighted Dips'],
          EXERCISES['Lateral Raises'],
          EXERCISES['Skull Crushers'],
          EXERCISES['Rope Extensions'], // Extra triceps exercise
        ];

      default:
        return [];
    }
  }

  // Workout B specializations (Back, Biceps, Legs focus)
  if (workoutType === 'B') {
    switch (specialization) {
      case 'back':
        return [
          { ...EXERCISES['Weighted Pullups'], rep_range: { min: 5, max: 5 } }, // 5 sets (pullups not chinups)
          SPECIALIZATION_EXERCISES['Hang Cleans'], // or Sumo Deadlifts
          EXERCISES['Bent Over Flyes'],
          EXERCISES['Barbell Curls'],
        ];

      case 'biceps':
        return [
          SPECIALIZATION_EXERCISES['Weighted Close-Grip Chinups'],
          EXERCISES['Barbell Curls'],
          EXERCISES['Incline Dumbbell Curls'], // Extra biceps exercise
          EXERCISES['Bent Over Flyes'],
          SPECIALIZATION_EXERCISES['Pistol Squats'],
          SPECIALIZATION_EXERCISES['Calf Raises'],
        ];

      case 'legs':
        return [
          SPECIALIZATION_EXERCISES['Squats'], // or Pistol Squats
          SPECIALIZATION_EXERCISES['Calf Raises'],
          EXERCISES['Weighted Chinups'],
          EXERCISES['Bent Over Flyes'],
          EXERCISES['Barbell Curls'],
        ];

      default:
        return [];
    }
  }

  return [];
};

/**
 * Get specialization guidance text
 */
export const getSpecializationGuidance = (specialization: SpecializationType): string => {
  const guidanceMap: Record<Exclude<SpecializationType, null>, string> = {
    chest: 'Add 2 extra sets to incline bench (5 total). Use same weight for last 3 sets. Add flat bench press for overall chest mass.',
    shoulder: 'Add 2 extra sets to standing press (5 total). Use same weight for last 3 sets. Great for building capped delts.',
    triceps: 'Add rope extensions at end of workout. Keep rest 60-90 seconds. Forces rapid triceps growth.',
    back: 'Perform pullups instead of chinups for 5 total sets. Can switch to lat pulldown for last sets if needed.',
    biceps: 'Add incline dumbbell curls at end. Keep rest 60-90 seconds. Excellent for peak development.',
    legs: 'Squats progress faster than upper body - add 5 lbs every workout. Only use if you want bigger legs!',
  };

  return specialization ? guidanceMap[specialization] : '';
};

/**
 * Get recommended duration for specialization
 */
export const getSpecializationDuration = (): string => {
  return 'Stick with same specialization for 6 weeks before changing to avoid overtraining.';
};

/**
 * Check if specialization is valid
 */
export const isValidSpecialization = (spec: string | null | undefined): spec is SpecializationType => {
  return spec === null || ['chest', 'shoulder', 'triceps', 'back', 'biceps', 'legs'].includes(spec as string);
};
