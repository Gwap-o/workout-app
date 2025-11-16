// Settings Page
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSettings } from '@/lib/hooks/useSettings'
import { useNutrition } from '@/lib/hooks/useNutrition'
import { usePhaseRotation } from '@/lib/hooks/usePhaseRotation'
import { exportAllData, clearWorkoutData, clearAllData } from '@/lib/supabase/settings'
import { Download, Trash2, AlertTriangle } from 'lucide-react'

export function Settings() {
  const { settings, updateSingleSetting, cycleTheme, cycleUnits, loading: settingsLoading } = useSettings()
  const { profile, recalculateNutrition, loading: nutritionLoading } = useNutrition()
  const { progress, setPhase, resetProgram, loading: phaseLoading } = usePhaseRotation()

  const [bodyweight, setBodyweight] = useState(profile?.bodyweight?.toString() || '')
  const [height, setHeight] = useState(profile?.height?.toString() || '')
  const [age, setAge] = useState(profile?.age?.toString() || '')
  const [goalType, setGoalType] = useState<'leanBulk' | 'recomp'>(profile?.goal_type || 'leanBulk')
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  async function handleSaveProfile() {
    if (!bodyweight || !height || !age) {
      alert('Please fill in all fields')
      return
    }

    try {
      setSaving(true)
      await recalculateNutrition({
        bodyweight: parseFloat(bodyweight),
        height: parseFloat(height),
        age: parseInt(age),
        goal_type: goalType
      })
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
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
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  async function handleClearWorkouts() {
    if (!confirm('Are you sure you want to delete ALL workout data? This cannot be undone!')) return
    if (!confirm('This will permanently delete all workouts and exercise logs. Type CONFIRM to proceed.')) return

    try {
      await clearWorkoutData()
      alert('Workout data cleared successfully')
    } catch (error) {
      console.error('Failed to clear workouts:', error)
      alert('Failed to clear workout data')
    }
  }

  async function handleClearAllData() {
    if (!confirm('WARNING: This will delete EVERYTHING (workouts, meals, photos, etc). This cannot be undone!')) return
    if (!confirm('Are you absolutely sure? This is permanent!')) return

    try {
      await clearAllData()
      alert('All data cleared successfully')
    } catch (error) {
      console.error('Failed to clear all data:', error)
      alert('Failed to clear all data')
    }
  }

  if (settingsLoading || nutritionLoading || phaseLoading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, preferences, and data
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="phase">Phase</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal stats and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bodyweight">Bodyweight (lbs)</Label>
                  <Input
                    id="bodyweight"
                    type="number"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal Type</Label>
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

              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </Button>

              <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                Updating your profile will recalculate nutrition targets automatically
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phase Management */}
        <TabsContent value="phase">
          <Card>
            <CardHeader>
              <CardTitle>Phase Management</CardTitle>
              <CardDescription>View and manage your current training phase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Phase</span>
                  <span className="font-medium">Phase {progress?.currentPhase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Week</span>
                  <span className="font-medium">Week {progress?.currentWeek} of 8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Can Rotate</span>
                  <span className={progress?.canRotate ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                    {progress?.canRotate ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {progress?.canRotate && (
                <Button onClick={() => setPhase(progress.nextPhase, 1)} className="w-full">
                  Advance to Phase {progress.nextPhase}
                </Button>
              )}

              <div className="space-y-2">
                <Label>Manual Phase Override (Admin)</Label>
                <div className="flex gap-2">
                  <Select
                    value={progress?.currentPhase?.toString() || '1'}
                    onValueChange={(value) => setPhase(parseInt(value) as 1 | 2 | 3, progress?.currentWeek || 1)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Phase 1</SelectItem>
                      <SelectItem value="2">Phase 2</SelectItem>
                      <SelectItem value="3">Phase 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => resetProgram()} variant="outline">
                    Reset to Phase 1
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Current: {settings.theme}</p>
                </div>
                <Button onClick={cycleTheme} variant="outline">
                  Cycle Theme
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Units</Label>
                  <p className="text-sm text-muted-foreground">Current: {settings.units}</p>
                </div>
                <Button onClick={cycleUnits} variant="outline">
                  Toggle Units
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="timer-sound">Rest Timer Sound</Label>
                  <p className="text-sm text-muted-foreground">Play sound when timer completes</p>
                </div>
                <Switch
                  id="timer-sound"
                  checked={settings.rest_timer_sound}
                  onCheckedChange={(checked) => updateSingleSetting('rest_timer_sound', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="form-cues">Form Cues</Label>
                  <p className="text-sm text-muted-foreground">Show exercise form tips</p>
                </div>
                <Switch
                  id="form-cues"
                  checked={settings.show_form_cues}
                  onCheckedChange={(checked) => updateSingleSetting('show_form_cues', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import, or clear your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Export */}
              <div className="space-y-2">
                <Button onClick={handleExportData} disabled={exporting} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? 'Exporting...' : 'Export All Data (JSON)'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Download all your workout data, meal plans, and settings as a JSON file
                </p>
              </div>

              {/* Clear Workouts */}
              <div className="space-y-2 border-t pt-4">
                <Button onClick={handleClearWorkouts} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Workout Data
                </Button>
                <p className="text-sm text-muted-foreground">
                  Delete all workout sessions and exercise logs (meal plans and settings preserved)
                </p>
              </div>

              {/* Clear All */}
              <div className="space-y-2 border-t pt-4">
                <Button onClick={handleClearAllData} variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
                <p className="text-sm text-destructive">
                  WARNING: This will permanently delete EVERYTHING (workouts, meals, photos, bodyweight logs)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
