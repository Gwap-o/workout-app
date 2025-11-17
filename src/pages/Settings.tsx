// Settings Page
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Layout } from '@/components/layout/Layout'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/lib/hooks/useSettings'
import { useNutrition } from '@/lib/hooks/useNutrition'
import { usePhaseRotation } from '@/lib/hooks/usePhaseRotation'
import { exportAllData, clearWorkoutData, clearAllData, deleteUserAccount } from '@/lib/supabase/settings'
import { Download, Trash2, AlertTriangle, User, Dumbbell, Settings as SettingsIcon, Palette, Database } from 'lucide-react'
import { toast } from 'sonner'

export function Settings() {
  const navigate = useNavigate()
  const { settings, updateSingleSetting, cycleUnits, loading: settingsLoading } = useSettings()
  const { profile, recalculateNutrition, loading: nutritionLoading } = useNutrition()
  const { progress, setPhase, resetProgram, loading: phaseLoading } = usePhaseRotation()
  const { signOut } = useAuth()

  const [fullName, setFullName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [bodyweight, setBodyweight] = useState('')
  const [goalBodyweight, setGoalBodyweight] = useState('')
  const [height, setHeight] = useState('')
  const [goalType, setGoalType] = useState<'leanBulk' | 'recomp'>('leanBulk')
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [togglingUnits, setTogglingUnits] = useState(false)

  // Update all fields when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setBirthday(profile.birthday || '')
      setBodyweight(profile.bodyweight?.toString() || '')
      setGoalBodyweight(profile.goal_bodyweight?.toString() || profile.bodyweight?.toString() || '')
      setHeight(profile.height?.toString() || '')
      setGoalType(profile.goal_type || 'leanBulk')
    }
  }, [profile])

  // Track changes
  useEffect(() => {
    const changed =
      fullName !== (profile?.full_name || '') ||
      birthday !== (profile?.birthday || '') ||
      bodyweight !== (profile?.bodyweight?.toString() || '') ||
      goalBodyweight !== (profile?.goal_bodyweight?.toString() || '') ||
      height !== (profile?.height?.toString() || '') ||
      goalType !== (profile?.goal_type || 'leanBulk')
    setHasChanges(changed)
  }, [fullName, birthday, bodyweight, goalBodyweight, height, goalType, profile])

  async function handleSaveProfile() {
    console.log('=== SAVE PROFILE START ===')
    console.log('Form values:', { fullName, birthday, bodyweight, goalBodyweight, height, goalType })

    const missingFields = []
    if (!fullName) missingFields.push('Full Name')
    if (!birthday) missingFields.push('Birthday')
    if (!bodyweight) missingFields.push('Bodyweight')
    if (!goalBodyweight) missingFields.push('Goal Bodyweight')
    if (!height) missingFields.push('Height')
    if (!goalType) missingFields.push('Goal Type')

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields)
      toast.error('Missing Required Fields', {
        description: `Please fill in: ${missingFields.join(', ')}`
      })
      return
    }

    try {
      setSaving(true)
      console.log('Starting save process...')

      // Calculate age from birthday - this is required for nutrition calculations
      let calculatedAge = profile?.age
      if (birthday) {
        const birthDate = new Date(birthday)
        const today = new Date()
        calculatedAge = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--
        }
        console.log('Calculated age from birthday:', calculatedAge)
      }

      // Age is required for nutrition calculations
      if (!calculatedAge) {
        console.log('ERROR: No calculated age')
        toast.error('Birthday Required', {
          description: 'Birthday is required to calculate nutrition targets'
        })
        return
      }

      const currentBodyweight = parseFloat(bodyweight)
      const currentGoalBodyweight = parseFloat(goalBodyweight)
      const updates: Partial<any> = {
        full_name: fullName,
        birthday: birthday,
        age: calculatedAge,
        bodyweight: currentBodyweight,
        goal_bodyweight: currentGoalBodyweight,
        height: parseFloat(height),
        goal_type: goalType,
        current_phase: profile?.current_phase || 1, // Default to phase 1 if not set
        current_week: profile?.current_week || 1, // Default to week 1 if not set
        program_start_date: profile?.program_start_date || new Date().toISOString().split('T')[0], // Default to today if not set
        workout_schedule: profile?.workout_schedule || { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false }, // Default empty schedule
      }

      console.log('Updates to send:', updates)
      console.log('Calling recalculateNutrition...')

      await recalculateNutrition(updates)

      console.log('=== SAVE PROFILE SUCCESS ===')
      toast.success('Profile Updated', {
        description: 'Your profile and nutrition targets have been updated successfully!'
      })
    } catch (error) {
      console.error('=== SAVE PROFILE ERROR ===')
      console.error('Error details:', error)
      console.error('Error as JSON:', JSON.stringify(error, null, 2))
      console.error('Error message:', error instanceof Error ? error.message : 'No error message')
      console.error('Error code:', (error as any)?.code)
      console.error('Error details:', (error as any)?.details)
      console.error('Error hint:', (error as any)?.hint)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      toast.error('Failed to Update Profile', {
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      })
    } finally {
      setSaving(false)
      console.log('=== SAVE PROFILE END ===')
    }
  }

  async function handleExportData() {
    try {
      setExporting(true)
      const data = await exportAllData()

      // Download as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kinobody-workout-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Data Exported', {
        description: 'Your workout data has been downloaded successfully!'
      })
    } catch (error) {
      console.error('Failed to export data:', error)
      toast.error('Export Failed', {
        description: 'Failed to export your data. Please try again.'
      })
    } finally {
      setExporting(false)
    }
  }

  async function handleClearWorkouts() {
    if (!confirm('Are you sure you want to delete ALL workout data? This cannot be undone!')) return
    if (!confirm('This will permanently delete all workouts and exercise logs. Type CONFIRM to proceed.')) return

    try {
      await clearWorkoutData()
      toast.success('Data Cleared', {
        description: 'All workout data has been permanently deleted.'
      })
    } catch (error) {
      console.error('Failed to clear workouts:', error)
      toast.error('Clear Failed', {
        description: 'Failed to clear workout data. Please try again.'
      })
    }
  }

  async function handleClearAllData() {
    if (!confirm('WARNING: This will delete EVERYTHING (workouts, meals, photos, etc). This cannot be undone!')) return
    if (!confirm('Are you absolutely sure? This is permanent!')) return

    try {
      await clearAllData()
      toast.success('All Data Cleared', {
        description: 'All your data has been permanently deleted.'
      })
    } catch (error) {
      console.error('Failed to clear all data:', error)
      toast.error('Clear Failed', {
        description: 'Failed to clear all data. Please try again.'
      })
    }
  }

  async function handleToggleUnits() {
    try {
      setTogglingUnits(true)
      await cycleUnits()
      toast.success('Units Updated', {
        description: 'Your measurement units have been changed.'
      })
    } catch (error) {
      console.error('Failed to toggle units:', error)
      toast.error('Update Failed', {
        description: 'Failed to toggle units. Please try again.'
      })
    } finally {
      setTogglingUnits(false)
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('⚠️ DANGER: Delete Account?\n\nThis will PERMANENTLY DELETE:\n• Your entire account\n• All workout data\n• All meal plans\n• All progress photos\n• All settings\n\nThis action CANNOT be undone!\n\nType DELETE in the next prompt to confirm.')) return

    const confirmText = prompt('Type DELETE to confirm account deletion:')
    if (confirmText !== 'DELETE') {
      toast.info('Deletion Cancelled', {
        description: 'Your account was not deleted.'
      })
      return
    }

    try {
      await deleteUserAccount()
      toast.success('Account Deleted', {
        description: 'Your account has been permanently deleted.'
      })
      // Sign out and redirect to login
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to delete account:', error)
      toast.error('Deletion Failed', {
        description: 'Failed to delete account. Please try again or contact support.'
      })
    }
  }

  if (settingsLoading || nutritionLoading || phaseLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-[#202124] dark:text-[#E6EDF3]">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-2">Settings</h1>
        <p className="text-[#5F6368] dark:text-[#8B949E]">
          Manage your account, preferences, and application data
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Account Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#202124] dark:text-[#E6EDF3]">Account</h2>
              <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">Personal information and profile settings</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="text-sm font-medium">
                      Full Name <span className="text-red-600 dark:text-red-400">*</span>
                    </Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday" className="text-sm font-medium">
                      Birthday <span className="text-red-600 dark:text-red-400">*</span>
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="date-input-settings"
                      required
                    />
                    {birthday && (
                      <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
                        Age calculated automatically from birthday
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#E8EAED] dark:border-[#30363D]" />

                {/* Physical Stats */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bodyweight" className="text-sm font-medium">
                      Current Bodyweight <span className="text-red-600 dark:text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="bodyweight"
                        type="number"
                        value={bodyweight}
                        onChange={(e) => setBodyweight(e.target.value)}
                        className="pr-12"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#5F6368] dark:text-[#8B949E]">
                        {settings.units === 'imperial' ? 'lbs' : 'kg'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-bodyweight" className="text-sm font-medium">
                      Goal Bodyweight <span className="text-red-600 dark:text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="goal-bodyweight"
                        type="number"
                        value={goalBodyweight}
                        onChange={(e) => setGoalBodyweight(e.target.value)}
                        className="pr-12"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#5F6368] dark:text-[#8B949E]">
                        {settings.units === 'imperial' ? 'lbs' : 'kg'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium">
                      Height <span className="text-red-600 dark:text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="pr-12"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#5F6368] dark:text-[#8B949E]">
                        {settings.units === 'imperial' ? 'in' : 'cm'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal" className="text-sm font-medium">
                      Goal Type <span className="text-red-600 dark:text-red-400">*</span>
                    </Label>
                    <Select value={goalType} onValueChange={(value) => setGoalType(value as 'leanBulk' | 'recomp')}>
                      <SelectTrigger id="goal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leanBulk">Lean Bulk</SelectItem>
                        <SelectItem value="recomp">Recomposition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={saving || !hasChanges}
                  className={`w-full md:w-auto ${
                    hasChanges
                      ? 'bg-[#20808D] hover:bg-[#1A6B76] dark:bg-[#1FB8CD] dark:hover:bg-[#2DD4E8] text-white'
                      : 'bg-[#E8EAED] dark:bg-[#30363D] text-[#80868B] dark:text-[#6E7681] cursor-not-allowed'
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>

                <div className="rounded-lg bg-[#F5F5F5] dark:bg-[#161B22] p-4 text-sm text-[#5F6368] dark:text-[#8B949E]">
                  <p className="font-medium text-[#202124] dark:text-[#E6EDF3] mb-1">Note</p>
                  Updating your profile will automatically recalculate your nutrition targets
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Training Program Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#202124] dark:text-[#E6EDF3]">Training Program</h2>
              <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">Manage your current phase and progression</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              {!progress ? (
                <div className="text-center py-12">
                  <Dumbbell className="w-12 h-12 mx-auto text-[#80868B] dark:text-[#6E7681] mb-4" />
                  <p className="text-lg font-medium text-[#202124] dark:text-[#E6EDF3] mb-2">No Training Program Set</p>
                  <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">Complete your profile setup to start tracking your progress</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Phase Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-[#F5F5F5] dark:bg-[#161B22]">
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Current Phase</p>
                      <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">{progress.currentPhase}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-[#F5F5F5] dark:bg-[#161B22]">
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Current Week</p>
                      <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">{progress.currentWeek}/8</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-[#F5F5F5] dark:bg-[#161B22]">
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Can Rotate</p>
                      <p className={`text-2xl font-bold ${progress.canRotate ? 'text-[#20808D] dark:text-[#1FB8CD]' : 'text-[#5F6368] dark:text-[#8B949E]'}`}>
                        {progress.canRotate ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                {progress?.canRotate && (
                  <>
                    <div className="border-t border-[#E8EAED] dark:border-[#30363D]" />
                    <Button onClick={() => setPhase(progress.nextPhase, 1)} className="w-full">
                      Advance to Phase {progress.nextPhase}
                    </Button>
                  </>
                )}

                <div className="border-t border-[#E8EAED] dark:border-[#30363D]" />

                {/* Admin Controls */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Admin Controls</Label>
                  <div className="flex gap-3">
                    <Select
                      value={progress?.currentPhase?.toString() || '1'}
                      onValueChange={(value) => setPhase(parseInt(value) as 1 | 2 | 3, progress?.currentWeek || 1)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Phase 1</SelectItem>
                        <SelectItem value="2">Phase 2</SelectItem>
                        <SelectItem value="3">Phase 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset the program? This will set you back to Phase 1, Week 1.')) {
                          resetProgram()
                        }
                      }}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      Reset Program
                    </Button>
                  </div>
                </div>
              </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Appearance Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#202124] dark:text-[#E6EDF3]">Appearance & Preferences</h2>
              <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">Customize how the app looks and behaves</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Theme</Label>
                    <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="border-t border-[#E8EAED] dark:border-[#30363D]" />

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Units</Label>
                    <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1">
                      Currently using {settings.units} system
                    </p>
                  </div>
                  <Button onClick={handleToggleUnits} variant="outline" size="sm" disabled={togglingUnits}>
                    {togglingUnits ? 'Toggling...' : 'Toggle Units'}
                  </Button>
                </div>

                <div className="border-t border-[#E8EAED] dark:border-[#30363D]" />

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <Label htmlFor="timer-sound" className="text-sm font-medium">Rest Timer Sound</Label>
                    <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1">
                      Play sound when rest timer completes
                    </p>
                  </div>
                  <Switch
                    id="timer-sound"
                    checked={settings.rest_timer_sound}
                    onCheckedChange={(checked) => updateSingleSetting('rest_timer_sound', checked)}
                  />
                </div>

                <div className="border-t border-[#E8EAED] dark:border-[#30363D]" />

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <Label htmlFor="form-cues" className="text-sm font-medium">Form Cues</Label>
                    <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1">
                      Show exercise technique tips during workouts
                    </p>
                  </div>
                  <Switch
                    id="form-cues"
                    checked={settings.show_form_cues}
                    onCheckedChange={(checked) => updateSingleSetting('show_form_cues', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Management Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#202124] dark:text-[#E6EDF3]">Data Management</h2>
              <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">Export, backup, or delete your data</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Export */}
                <div>
                  <Button
                    onClick={handleExportData}
                    disabled={exporting}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exporting ? 'Exporting...' : 'Export All Data'}
                  </Button>
                  <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-2">
                    Download all your data as a JSON file for backup purposes
                  </p>
                </div>

                <div className="border-t border-[#E8EAED] dark:border-[#30363D]" />

                {/* Danger Zone */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <Label className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</Label>
                  </div>

                  <div>
                    <Button
                      onClick={handleClearWorkouts}
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Workout Data
                    </Button>
                    <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-2">
                      Permanently delete all workout sessions and exercise logs
                    </p>
                  </div>

                  <div>
                    <Button
                      onClick={handleClearAllData}
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      Permanently delete everything including workouts, meals, and photos
                    </p>
                  </div>

                  <div className="border-t border-red-200 dark:border-red-900" />

                  <div>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      className="w-full justify-start bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-semibold">
                      Permanently delete your account and ALL associated data from Supabase
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  )
}
