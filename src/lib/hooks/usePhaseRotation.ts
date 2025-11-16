// Phase Rotation Hook
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, updateUserProfile } from '@/lib/supabase/userProfile'
import type { UserProfile, PhaseProgress } from '@/types'

export function usePhaseRotation() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<PhaseProgress | null>(null)

  // Load profile and calculate phase progress
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadPhaseProgress()
  }, [user])

  async function loadPhaseProgress() {
    try {
      setLoading(true)
      setError(null)

      const userProfile = await getUserProfile(user!.id)
      setProfile(userProfile)

      if (userProfile) {
        const phaseProgress = calculatePhaseProgress(userProfile)
        setProgress(phaseProgress)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load phase progress')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calculate current phase progress
   */
  function calculatePhaseProgress(profile: UserProfile): PhaseProgress {
    const weeksInPhase = profile.current_week
    const canRotate = weeksInPhase >= 8
    const nextPhase = ((profile.current_phase % 3) + 1) as 1 | 2 | 3

    return {
      currentPhase: profile.current_phase,
      currentWeek: profile.current_week,
      weeksInPhase,
      canRotate,
      nextPhase,
      programStartDate: profile.program_start_date
    }
  }

  /**
   * Advance to next phase
   * Resets week to 1 and increments phase
   */
  async function advancePhase(): Promise<void> {
    if (!user || !progress) throw new Error('Not ready to advance phase')

    try {
      setError(null)

      const nextPhase = progress.nextPhase

      const updated = await updateUserProfile(user.id, {
        current_phase: nextPhase,
        current_week: 1
      })

      setProfile(updated)
      setProgress(calculatePhaseProgress(updated))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to advance phase')
      throw err
    }
  }

  /**
   * Manually set phase (admin override)
   */
  async function setPhase(phase: 1 | 2 | 3, week: number = 1): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)

      const updated = await updateUserProfile(user.id, {
        current_phase: phase,
        current_week: week
      })

      setProfile(updated)
      setProgress(calculatePhaseProgress(updated))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set phase')
      throw err
    }
  }

  /**
   * Increment week within current phase
   */
  async function incrementWeek(): Promise<void> {
    if (!user || !profile) throw new Error('Not ready to increment week')

    try {
      setError(null)

      const newWeek = profile.current_week + 1

      // If going past week 8, suggest phase rotation instead
      if (newWeek > 8) {
        throw new Error('Phase complete! Rotate to next phase instead.')
      }

      const updated = await updateUserProfile(user.id, {
        current_week: newWeek
      })

      setProfile(updated)
      setProgress(calculatePhaseProgress(updated))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment week')
      throw err
    }
  }

  /**
   * Check if phase rotation is recommended
   */
  function shouldRotate(): boolean {
    return progress?.canRotate || false
  }

  /**
   * Get days remaining in current phase
   */
  function getDaysRemaining(): number {
    if (!progress) return 0
    const weeksRemaining = 8 - progress.currentWeek
    return weeksRemaining * 7
  }

  /**
   * Get phase rotation message
   */
  function getRotationMessage(): string | null {
    if (!progress) return null

    if (progress.canRotate) {
      return `Phase ${progress.currentPhase} complete! Ready to rotate to Phase ${progress.nextPhase} for new exercise variations.`
    }

    if (progress.currentWeek >= 6) {
      return `Week ${progress.currentWeek} of 8. Phase rotation coming soon.`
    }

    return null
  }

  /**
   * Reset program (start from Phase 1, Week 1)
   */
  async function resetProgram(): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)

      const updated = await updateUserProfile(user.id, {
        current_phase: 1,
        current_week: 1,
        program_start_date: new Date().toISOString().split('T')[0]
      })

      setProfile(updated)
      setProgress(calculatePhaseProgress(updated))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset program')
      throw err
    }
  }

  return {
    loading,
    error,
    profile,
    progress,
    advancePhase,
    setPhase,
    incrementWeek,
    shouldRotate: shouldRotate(),
    getDaysRemaining: getDaysRemaining(),
    getRotationMessage: getRotationMessage(),
    resetProgram,
    reload: loadPhaseProgress
  }
}
