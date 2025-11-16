// Workout Validation Utilities
// Implements methodology guardrails per FEATURES.md

import type { WorkoutSession } from '@/types'

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  error?: string
  warning?: string
  nextAvailableDate?: string
}

/**
 * Workout frequency validation
 * MAX 3 workouts per week
 */
export function validateWorkoutFrequency(
  existingSessions: WorkoutSession[],
  proposedDate: string
): ValidationResult {
  // Get start of week (Sunday) for the proposed date
  const proposedDateObj = new Date(proposedDate)
  const weekStart = new Date(proposedDateObj)
  weekStart.setDate(proposedDateObj.getDate() - proposedDateObj.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  // Count workouts in the same week
  const workoutsThisWeek = existingSessions.filter(session => {
    const sessionDate = new Date(session.date)
    return sessionDate >= weekStart && sessionDate <= weekEnd
  })

  if (workoutsThisWeek.length >= 3) {
    // Find next available date (next Sunday)
    const nextWeekStart = new Date(weekEnd)
    nextWeekStart.setDate(nextWeekStart.getDate() + 1)

    return {
      valid: false,
      error: 'Maximum 3 workouts per week. You already have 3 workouts this week.',
      nextAvailableDate: nextWeekStart.toISOString().split('T')[0]
    }
  }

  return { valid: true }
}

/**
 * Consecutive day validation
 * NO consecutive day training (minimum 48-hour CNS recovery)
 */
export function validateConsecutiveDays(
  existingSessions: WorkoutSession[],
  proposedDate: string
): ValidationResult {
  const proposedDateObj = new Date(proposedDate)
  proposedDateObj.setHours(0, 0, 0, 0)

  // Check for workouts within 48 hours before
  const twoDaysBefore = new Date(proposedDateObj)
  twoDaysBefore.setDate(proposedDateObj.getDate() - 1)

  // Check for workouts within 48 hours after
  const twoDaysAfter = new Date(proposedDateObj)
  twoDaysAfter.setDate(proposedDateObj.getDate() + 1)

  // Find any sessions on adjacent days
  const conflictingSessions = existingSessions.filter(session => {
    const sessionDate = new Date(session.date)
    sessionDate.setHours(0, 0, 0, 0)

    const timeDiff = Math.abs(proposedDateObj.getTime() - sessionDate.getTime())
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    return daysDiff === 1 // Consecutive day
  })

  if (conflictingSessions.length > 0) {
    // Find the last workout date
    const lastWorkout = conflictingSessions.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]

    const lastWorkoutDate = new Date(lastWorkout.date)
    const nextAvailableDate = new Date(lastWorkoutDate)
    nextAvailableDate.setDate(lastWorkoutDate.getDate() + 2) // At least 1 day rest

    return {
      valid: false,
      error: `No consecutive day training allowed. Minimum 48-hour CNS recovery required between workouts.`,
      nextAvailableDate: nextAvailableDate.toISOString().split('T')[0]
    }
  }

  return { valid: true }
}

/**
 * Volume monitoring
 * Track total weekly volume and warn if excessive
 */
export interface VolumeData {
  totalSets: number
  totalReps: number
  totalWeight: number
  weekOverWeekChange?: number
}

export function calculateWeeklyVolume(
  sessions: WorkoutSession[]
): VolumeData {
  let totalSets = 0
  let totalReps = 0
  let totalWeight = 0

  sessions.forEach(_session => {
    // Note: sessions should have exercise_logs populated
    // For now, we'll calculate based on typical workout structure
    // This would need actual exercise log data in production
    totalSets += 9 // Typical: 3 exercises × 3 sets
  })

  return {
    totalSets,
    totalReps,
    totalWeight,
  }
}

export function validateVolume(
  currentWeekVolume: VolumeData,
  previousWeekVolume?: VolumeData
): ValidationResult {
  // Check for excessive volume (>15 sets per workout session)
  // Kinobody methodology: 9-12 sets per workout
  const MAX_SETS_PER_WORKOUT = 15

  if (currentWeekVolume.totalSets > MAX_SETS_PER_WORKOUT) {
    return {
      valid: false,
      error: `Excessive volume detected (${currentWeekVolume.totalSets} sets). Kinobody recommends 9-12 sets per workout.`,
      warning: 'Consider reducing volume to prevent overtraining.'
    }
  }

  // Check week-over-week volume increase
  if (previousWeekVolume) {
    const volumeIncrease =
      ((currentWeekVolume.totalSets - previousWeekVolume.totalSets) / previousWeekVolume.totalSets) * 100

    if (volumeIncrease > 10) {
      return {
        valid: true,
        warning: `Volume increased ${volumeIncrease.toFixed(1)}% from last week. Gradual increases are recommended to prevent overtraining.`
      }
    }
  }

  return { valid: true }
}

/**
 * Training method locking
 * Training methods locked per exercise (cannot change mid-phase)
 */
export function validateTrainingMethod(
  exerciseName: string,
  proposedMethod: string,
  historicalMethod?: string,
  currentPhase?: number,
  lastPhaseChanged?: number
): ValidationResult {
  if (!historicalMethod) {
    return { valid: true } // First time logging this exercise
  }

  // Check if we're in the same phase
  const phaseChanged = lastPhaseChanged !== currentPhase

  if (proposedMethod !== historicalMethod && !phaseChanged) {
    return {
      valid: false,
      error: `Training method locked to "${historicalMethod}" for ${exerciseName}. Cannot change method mid-phase.`,
      warning: 'Training method can only be changed when starting a new phase (every 8 weeks).'
    }
  }

  return { valid: true }
}

/**
 * MEGA training duration limit
 * Maximum 12 weeks of MEGA training per exercise
 */
export function validateMEGATrainingDuration(
  weekCount: number
): ValidationResult {
  const MAX_MEGA_WEEKS = 12

  if (weekCount >= MAX_MEGA_WEEKS) {
    return {
      valid: false,
      error: `MEGA training limit reached (${weekCount} weeks). Maximum 12 weeks per exercise.`,
      warning: 'Switch to a different training method or exercise variation to prevent CNS burnout.'
    }
  }

  if (weekCount >= 10) {
    return {
      valid: true,
      warning: `MEGA training week ${weekCount} of 12. Consider planning your next training phase.`
    }
  }

  return { valid: true }
}

/**
 * Phase rotation validation
 * Phase changes only allowed every 8 weeks
 */
export function validatePhaseRotation(
  currentPhase: number,
  currentWeek: number,
  _programStartDate: string
): ValidationResult {
  // Check if user is trying to change phase prematurely
  if (currentWeek < 8) {
    return {
      valid: true,
      warning: `Week ${currentWeek} of 8 in Phase ${currentPhase}. Phase rotation recommended after completing 8 weeks.`
    }
  }

  if (currentWeek >= 8) {
    return {
      valid: true,
      warning: `Phase ${currentPhase} complete! Consider rotating to Phase ${(currentPhase % 3) + 1} for exercise variation and continued progression.`
    }
  }

  return { valid: true }
}

/**
 * Deload week recommendation
 * Suggest deload after 6-8 weeks of progressive overload
 */
export function recommendDeload(
  weeksOfProgression: number
): ValidationResult {
  if (weeksOfProgression >= 8) {
    return {
      valid: true,
      warning: `${weeksOfProgression} weeks of progressive overload. Consider a deload week (reduce weight by 10-15%) to allow recovery before starting next phase.`
    }
  }

  if (weeksOfProgression >= 6) {
    return {
      valid: true,
      warning: `${weeksOfProgression} weeks of progressive overload. Deload week may be beneficial soon.`
    }
  }

  return { valid: true }
}
