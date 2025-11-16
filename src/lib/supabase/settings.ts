// User Settings CRUD Operations
import { supabase } from './client'
import type { UserSettings, AppSettings } from '@/types'

/**
 * Default app settings
 */
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  units: 'imperial',
  first_time_user: true,
  onboarding_completed: false,
  rest_timer_sound: true,
  show_form_cues: true,
}

/**
 * Get user settings
 */
export async function getUserSettings(): Promise<UserSettings> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If settings don't exist, create defaults
  if (error && error.code === 'PGRST116') {
    return createUserSettings(DEFAULT_SETTINGS)
  }

  if (error) throw error
  return data
}

/**
 * Create user settings (usually on first login)
 */
export async function createUserSettings(
  settings: Partial<AppSettings> = {}
): Promise<UserSettings> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const finalSettings: AppSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  }

  const { data, error } = await supabase
    .from('user_settings')
    .insert({
      user_id: user.id,
      settings: finalSettings,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  updates: Partial<AppSettings>
): Promise<UserSettings> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get current settings
  const current = await getUserSettings()

  // Merge with updates
  const newSettings: AppSettings = {
    ...current.settings,
    ...updates,
  }

  const { data, error } = await supabase
    .from('user_settings')
    .update({
      settings: newSettings,
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a single setting
 */
export async function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): Promise<UserSettings> {
  return updateUserSettings({ [key]: value })
}

/**
 * Reset settings to defaults
 */
export async function resetUserSettings(): Promise<UserSettings> {
  return updateUserSettings(DEFAULT_SETTINGS)
}

/**
 * Mark onboarding as complete
 */
export async function completeOnboarding(): Promise<UserSettings> {
  return updateUserSettings({
    first_time_user: false,
    onboarding_completed: true,
  })
}

/**
 * Toggle theme
 */
export async function toggleTheme(): Promise<UserSettings> {
  const current = await getUserSettings()
  const themes: AppSettings['theme'][] = ['light', 'dark', 'auto']
  const currentIndex = themes.indexOf(current.settings.theme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]

  return updateSetting('theme', nextTheme)
}

/**
 * Toggle units
 */
export async function toggleUnits(): Promise<UserSettings> {
  const current = await getUserSettings()
  const newUnits = current.settings.units === 'imperial' ? 'metric' : 'imperial'

  return updateSetting('units', newUnits)
}

/**
 * Export all user data
 */
export async function exportAllData(): Promise<{
  profile: any
  workouts: any[]
  exercises: any[]
  bodyweight: any[]
  mealPlans: any[]
  settings: UserSettings
}> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const [
    profile,
    workouts,
    exercises,
    bodyweight,
    mealPlans,
    settings
  ] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('workout_sessions').select('*').order('date', { ascending: false }),
    supabase.from('exercise_logs').select('*').order('date', { ascending: false }),
    supabase.from('bodyweight_logs').select('*').order('date', { ascending: false }),
    supabase.from('meal_plans').select('*'),
    getUserSettings()
  ])

  return {
    profile: profile.data,
    workouts: workouts.data || [],
    exercises: exercises.data || [],
    bodyweight: bodyweight.data || [],
    mealPlans: mealPlans.data || [],
    settings
  }
}

/**
 * Clear all user workout data (WARNING: DESTRUCTIVE)
 */
export async function clearWorkoutData(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Delete in order (exercise_logs first due to foreign key)
  await supabase.from('exercise_logs').delete().eq('user_id', user.id)
  await supabase.from('workout_sessions').delete().eq('user_id', user.id)
}

/**
 * Clear all user data (WARNING: EXTREMELY DESTRUCTIVE)
 */
export async function clearAllData(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Delete all data
  await Promise.all([
    supabase.from('exercise_logs').delete().eq('user_id', user.id),
    supabase.from('workout_sessions').delete().eq('user_id', user.id),
    supabase.from('bodyweight_logs').delete().eq('user_id', user.id),
    supabase.from('meal_plans').delete().eq('user_id', user.id),
    supabase.from('progress_photos').delete().eq('user_id', user.id),
  ])

  // Reset settings to defaults
  await resetUserSettings()
}

/**
 * Delete user account (WARNING: PERMANENT)
 */
export async function deleteUserAccount(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Clear all data first
  await clearAllData()

  // Delete profile
  await supabase.from('user_profiles').delete().eq('user_id', user.id)
  await supabase.from('user_settings').delete().eq('user_id', user.id)

  // Note: Netlify Identity user deletion must be done through Netlify dashboard
  // or their API - Supabase can't delete the auth user directly
}
