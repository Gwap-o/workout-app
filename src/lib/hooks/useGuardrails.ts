// Guardrails Hook
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile } from '@/lib/supabase/userProfile'
import { getWorkoutHistory } from '@/lib/supabase/workouts'
import {
  checkWorkoutGuardrails,
  checkExerciseGuardrails,
  canWorkoutToday,
  getNextAvailableWorkoutDate,
  type GuardrailCheck
} from '@/lib/utils/guardrails'
import type { WorkoutSession, ExerciseLog, UserProfile } from '@/types'

export function useGuardrails() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([])

  // Load profile and recent workouts
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadData()
  }, [user])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const [userProfile, workouts] = await Promise.all([
        getUserProfile(user!.id),
        getWorkoutHistory(30) // Last 30 workouts for validation
      ])

      setProfile(userProfile)
      setRecentSessions(workouts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guardrail data')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Check if a workout can be created on a specific date
   */
  async function checkWorkoutDate(date: string): Promise<GuardrailCheck> {
    if (!profile) throw new Error('Profile not loaded')

    return checkWorkoutGuardrails(
      date,
      recentSessions,
      profile.current_phase,
      profile.current_week,
      profile.program_start_date
    )
  }

  /**
   * Check if an exercise can be logged with a specific training method
   */
  async function checkExercise(
    exerciseName: string,
    trainingMethod: string,
    previousLogs: ExerciseLog[]
  ): Promise<{ canLog: boolean; errors: string[]; warnings: string[] }> {
    if (!profile) throw new Error('Profile not loaded')

    return checkExerciseGuardrails(
      exerciseName,
      trainingMethod,
      previousLogs,
      profile.current_phase
    )
  }

  /**
   * Check if user can workout today
   */
  async function checkToday(): Promise<{
    canWorkout: boolean
    reason?: string
    nextDate?: string
  }> {
    return canWorkoutToday(recentSessions)
  }

  /**
   * Get next available workout date
   */
  function getNextDate(): string {
    return getNextAvailableWorkoutDate(recentSessions)
  }

  /**
   * Get workouts this week
   */
  function getThisWeekWorkouts(): WorkoutSession[] {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay()) // Sunday
    weekStart.setHours(0, 0, 0, 0)

    return recentSessions.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate >= weekStart
    })
  }

  /**
   * Get remaining workouts this week
   */
  function getRemainingWorkouts(): number {
    const thisWeek = getThisWeekWorkouts()
    return Math.max(0, 3 - thisWeek.length)
  }

  /**
   * Check if max workouts this week reached
   */
  function isWeekLimitReached(): boolean {
    return getThisWeekWorkouts().length >= 3
  }

  /**
   * Get last workout date
   */
  function getLastWorkoutDate(): string | null {
    if (recentSessions.length === 0) return null
    return recentSessions[0].date
  }

  /**
   * Get days since last workout
   */
  function getDaysSinceLastWorkout(): number | null {
    const lastDate = getLastWorkoutDate()
    if (!lastDate) return null

    const last = new Date(lastDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - last.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  /**
   * Check if minimum rest period met
   */
  function isRestPeriodMet(): boolean {
    const days = getDaysSinceLastWorkout()
    if (days === null) return true // No previous workout
    return days >= 2 // At least 48 hours (2 days)
  }

  return {
    loading,
    error,
    profile,
    checkWorkoutDate,
    checkExercise,
    checkToday,
    getNextDate: getNextDate(),
    thisWeekWorkouts: getThisWeekWorkouts(),
    remainingWorkouts: getRemainingWorkouts(),
    isWeekLimitReached: isWeekLimitReached(),
    lastWorkoutDate: getLastWorkoutDate(),
    daysSinceLastWorkout: getDaysSinceLastWorkout(),
    isRestPeriodMet: isRestPeriodMet(),
    reload: loadData
  }
}
