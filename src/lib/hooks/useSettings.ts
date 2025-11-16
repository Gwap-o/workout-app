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
   */
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Auto: use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [settings.theme])

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
