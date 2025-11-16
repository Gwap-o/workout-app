// Combined Guardrail Checks
// Aggregates all validation rules for workout logging

import type { WorkoutSession, ExerciseLog } from '@/types'
import {
  validateWorkoutFrequency,
  validateConsecutiveDays,
  validateVolume,
  validateTrainingMethod,
  validateMEGATrainingDuration,
  validatePhaseRotation,
  recommendDeload,
  calculateWeeklyVolume
} from './validation'

/**
 * Combined guardrail validation result
 */
export interface GuardrailCheck {
  canProceed: boolean
  errors: string[]
  warnings: string[]
  nextAvailableDate?: string
  recommendations: string[]
}

/**
 * Run all guardrail checks before allowing workout creation
 */
export async function checkWorkoutGuardrails(
  proposedDate: string,
  existingSessions: WorkoutSession[],
  currentPhase: number,
  currentWeek: number,
  programStartDate: string
): Promise<GuardrailCheck> {
  const errors: string[] = []
  const warnings: string[] = []
  const recommendations: string[] = []
  let nextAvailableDate: string | undefined

  // 1. Check workout frequency (max 3/week)
  const frequencyCheck = validateWorkoutFrequency(existingSessions, proposedDate)
  if (!frequencyCheck.valid) {
    errors.push(frequencyCheck.error!)
    if (frequencyCheck.nextAvailableDate) {
      nextAvailableDate = frequencyCheck.nextAvailableDate
    }
  }
  if (frequencyCheck.warning) warnings.push(frequencyCheck.warning)

  // 2. Check consecutive days (no back-to-back training)
  const consecutiveCheck = validateConsecutiveDays(existingSessions, proposedDate)
  if (!consecutiveCheck.valid) {
    errors.push(consecutiveCheck.error!)
    if (consecutiveCheck.nextAvailableDate && !nextAvailableDate) {
      nextAvailableDate = consecutiveCheck.nextAvailableDate
    }
  }
  if (consecutiveCheck.warning) warnings.push(consecutiveCheck.warning)

  // 3. Check phase rotation status
  const phaseCheck = validatePhaseRotation(currentPhase, currentWeek, programStartDate)
  if (!phaseCheck.valid) {
    errors.push(phaseCheck.error!)
  }
  if (phaseCheck.warning) warnings.push(phaseCheck.warning)

  // 4. Check deload recommendation
  const deloadCheck = recommendDeload(currentWeek)
  if (deloadCheck.warning) recommendations.push(deloadCheck.warning)

  return {
    canProceed: errors.length === 0,
    errors,
    warnings,
    nextAvailableDate,
    recommendations
  }
}

/**
 * Check guardrails for exercise logging
 */
export interface ExerciseGuardrailCheck {
  canLog: boolean
  errors: string[]
  warnings: string[]
}

export async function checkExerciseGuardrails(
  exerciseName: string,
  proposedMethod: string,
  previousLogs: ExerciseLog[],
  currentPhase: number
): Promise<ExerciseGuardrailCheck> {
  const errors: string[] = []
  const warnings: string[] = []

  // Get the most recent log for this exercise
  const recentLog = previousLogs.length > 0 ? previousLogs[0] : null

  // 1. Check training method lock
  if (recentLog) {
    const methodCheck = validateTrainingMethod(
      exerciseName,
      proposedMethod,
      recentLog.training_method,
      currentPhase
    )

    if (!methodCheck.valid) {
      errors.push(methodCheck.error!)
    }
    if (methodCheck.warning) {
      warnings.push(methodCheck.warning)
    }
  }

  // 2. Check MEGA training duration (if applicable)
  // Count consecutive weeks of MEGA training (RestPause is MEGA training in this context)
  if (proposedMethod === 'RestPause') {
    let megaWeeks = 0
    for (const log of previousLogs) {
      if (log.training_method === 'RestPause') {
        megaWeeks++
      } else {
        break // Stop at first non-MEGA workout
      }
    }

    const megaCheck = validateMEGATrainingDuration(megaWeeks + 1)
    if (!megaCheck.valid) {
      errors.push(megaCheck.error!)
    }
    if (megaCheck.warning) {
      warnings.push(megaCheck.warning)
    }
  }

  return {
    canLog: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Check volume guardrails
 */
export async function checkVolumeGuardrails(
  currentWeekSessions: WorkoutSession[],
  previousWeekSessions: WorkoutSession[]
): Promise<GuardrailCheck> {
  const errors: string[] = []
  const warnings: string[] = []
  const recommendations: string[] = []

  const currentVolume = calculateWeeklyVolume(currentWeekSessions)
  const previousVolume = previousWeekSessions.length > 0
    ? calculateWeeklyVolume(previousWeekSessions)
    : undefined

  const volumeCheck = validateVolume(currentVolume, previousVolume)

  if (!volumeCheck.valid) {
    errors.push(volumeCheck.error!)
  }
  if (volumeCheck.warning) {
    warnings.push(volumeCheck.warning)
  }

  return {
    canProceed: errors.length === 0,
    errors,
    warnings,
    recommendations
  }
}

/**
 * Format guardrail messages for display
 */
export function formatGuardrailMessages(check: GuardrailCheck): {
  hasIssues: boolean
  blockingIssues: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
} {
  if (check.errors.length > 0) {
    return {
      hasIssues: true,
      blockingIssues: true,
      message: check.errors.join(' '),
      severity: 'error'
    }
  }

  if (check.warnings.length > 0) {
    return {
      hasIssues: true,
      blockingIssues: false,
      message: check.warnings.join(' '),
      severity: 'warning'
    }
  }

  if (check.recommendations.length > 0) {
    return {
      hasIssues: true,
      blockingIssues: false,
      message: check.recommendations.join(' '),
      severity: 'info'
    }
  }

  return {
    hasIssues: false,
    blockingIssues: false,
    message: 'All guardrails passed. Ready to log workout!',
    severity: 'info'
  }
}

/**
 * Get next available workout date
 * Considers both frequency and consecutive day rules
 */
export function getNextAvailableWorkoutDate(
  existingSessions: WorkoutSession[]
): string {
  if (existingSessions.length === 0) {
    return new Date().toISOString().split('T')[0]
  }

  // Sort sessions by date descending
  const sortedSessions = [...existingSessions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const lastWorkout = new Date(sortedSessions[0].date)

  // Next available is at least 2 days after last workout
  const nextDate = new Date(lastWorkout)
  nextDate.setDate(lastWorkout.getDate() + 2)

  // Also check frequency constraint
  const proposedDateStr = nextDate.toISOString().split('T')[0]
  const frequencyCheck = validateWorkoutFrequency(existingSessions, proposedDateStr)

  if (!frequencyCheck.valid && frequencyCheck.nextAvailableDate) {
    return frequencyCheck.nextAvailableDate
  }

  return proposedDateStr
}

/**
 * Check if today is a valid workout day
 */
export function canWorkoutToday(
  existingSessions: WorkoutSession[]
): { canWorkout: boolean; reason?: string; nextDate?: string } {
  const today = new Date().toISOString().split('T')[0]

  const frequencyCheck = validateWorkoutFrequency(existingSessions, today)
  if (!frequencyCheck.valid) {
    return {
      canWorkout: false,
      reason: frequencyCheck.error,
      nextDate: frequencyCheck.nextAvailableDate
    }
  }

  const consecutiveCheck = validateConsecutiveDays(existingSessions, today)
  if (!consecutiveCheck.valid) {
    return {
      canWorkout: false,
      reason: consecutiveCheck.error,
      nextDate: consecutiveCheck.nextAvailableDate
    }
  }

  return { canWorkout: true }
}
