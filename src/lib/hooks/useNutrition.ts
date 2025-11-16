// Nutrition Hook
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, updateUserProfile } from '@/lib/supabase/userProfile'
import {
  calculateNutritionTargets,
  updateProfileWithNutrition,
  type NutritionTargets
} from '@/lib/utils/nutrition'
import type { UserProfile } from '@/types'

export function useNutrition() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [targets, setTargets] = useState<NutritionTargets | null>(null)

  // Load user profile and calculate nutrition targets
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadNutrition()
  }, [user])

  async function loadNutrition() {
    try {
      setLoading(true)
      setError(null)

      const userProfile = await getUserProfile(user!.id)
      setProfile(userProfile)

      // Calculate targets if we have required data
      if (userProfile?.bodyweight && userProfile?.goal_bodyweight && userProfile?.height && userProfile?.age) {
        const calculatedTargets = calculateNutritionTargets(
          userProfile.bodyweight,
          userProfile.goal_bodyweight,
          userProfile.height,
          userProfile.age,
          userProfile.goal_type
        )
        setTargets(calculatedTargets)

        // Update profile if nutrition values are missing
        if (!userProfile.maintenance_calories) {
          await saveNutritionToProfile(calculatedTargets)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nutrition data')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calculate nutrition targets from user stats
   */
  async function calculateTargets(
    bodyweight: number,
    goalBodyweight: number,
    height: number,
    age: number,
    goalType: 'leanBulk' | 'recomp'
  ): Promise<NutritionTargets> {
    const calculatedTargets = calculateNutritionTargets(
      bodyweight,
      goalBodyweight,
      height,
      age,
      goalType
    )
    setTargets(calculatedTargets)
    return calculatedTargets
  }

  /**
   * Save nutrition targets to user profile
   */
  async function saveNutritionToProfile(nutritionTargets: NutritionTargets): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)
      const updates = updateProfileWithNutrition(profile!, nutritionTargets)

      const updated = await updateUserProfile(user.id, updates)
      setProfile(updated)
      setTargets(nutritionTargets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save nutrition targets')
      throw err
    }
  }

  /**
   * Recalculate nutrition based on updated profile data
   */
  async function recalculateNutrition(updates: Partial<UserProfile>): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)

      // Update profile first
      const updated = await updateUserProfile(user.id, updates)
      setProfile(updated)

      // Recalculate if we have all required data
      if (updated.bodyweight && updated.goal_bodyweight && updated.height && updated.age) {
        const newTargets = calculateNutritionTargets(
          updated.bodyweight,
          updated.goal_bodyweight,
          updated.height,
          updated.age,
          updated.goal_type
        )

        // Save new targets to profile
        await saveNutritionToProfile(newTargets)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to recalculate nutrition')
      throw err
    }
  }

  /**
   * Check if user has completed nutrition setup
   */
  function hasNutritionSetup(): boolean {
    return !!(
      profile?.bodyweight &&
      profile?.goal_bodyweight &&
      profile?.height &&
      profile?.age &&
      profile?.maintenance_calories
    )
  }

  /**
   * Get calories for today (training vs rest day)
   */
  function getTodayCalories(isTrainingDay: boolean): number | null {
    if (!targets) return null
    return isTrainingDay ? targets.trainingDayCalories : targets.restDayCalories
  }

  /**
   * Get carbs for today (training vs rest day)
   */
  function getTodayCarbs(isTrainingDay: boolean): number | null {
    if (!targets) return null
    return isTrainingDay ? targets.carbsTraining : targets.carbsRest
  }

  return {
    loading,
    error,
    profile,
    targets,
    calculateTargets,
    saveNutritionToProfile,
    recalculateNutrition,
    hasNutritionSetup: hasNutritionSetup(),
    getTodayCalories,
    getTodayCarbs,
    reload: loadNutrition
  }
}
