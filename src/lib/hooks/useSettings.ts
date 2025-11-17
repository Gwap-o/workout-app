// Settings Hook
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getUserSettings,
  updateUserSettings,
  updateSetting,
  resetUserSettings,
  completeOnboarding,
  toggleTheme,
  toggleUnits,
  DEFAULT_SETTINGS
} from '@/lib/supabase/settings'
import type { AppSettings } from '@/types'

export function useSettings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  // Load settings on mount
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadSettings()
  }, [user])

  async function loadSettings() {
    try {
      setLoading(true)
      setError(null)

      const userSettings = await getUserSettings()
      setSettings(userSettings.settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update multiple settings at once
   */
  async function updateSettings(updates: Partial<AppSettings>): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)
      const updated = await updateUserSettings(updates)
      setSettings(updated.settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      throw err
    }
  }

  /**
   * Update a single setting
   */
  async function updateSingleSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)
      const updated = await updateSetting(key, value)
      setSettings(updated.settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting')
      throw err
    }
  }

  /**
   * Reset all settings to defaults
   */
  async function resetSettings(): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)
      const updated = await resetUserSettings()
      setSettings(updated.settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset settings')
      throw err
    }
  }

  /**
   * Mark onboarding as complete
   */
  async function finishOnboarding(): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)
      const updated = await completeOnboarding()
      setSettings(updated.settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding')
      throw err
    }
  }

  /**
   * Toggle theme (light → dark → auto → light)
   */
  async function cycleTheme(): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)
      const updated = await toggleTheme()
      setSettings(updated.settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle theme')
      throw err
    }
  }

  /**
   * Toggle units (imperial ↔ metric)
   */
  async function cycleUnits(): Promise<void> {
    if (!user) throw new Error('Not authenticated')

    try {
      setError(null)
      const updated = await toggleUnits()
      setSettings(updated.settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle units')
      throw err
    }
  }

  /**
   * Apply theme to document
   * NOTE: Theme application is now handled by ThemeContext to avoid conflicts
   */
  // Removed duplicate theme application - ThemeContext handles this

  return {
    loading,
    error,
    settings,
    updateSettings,
    updateSingleSetting,
    resetSettings,
    finishOnboarding,
    cycleTheme,
    cycleUnits,
    reload: loadSettings
  }
}
