// Nutrition Calculator Component
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNutrition } from '@/lib/hooks/useNutrition'
import type { NutritionTargets } from '@/types'

export function NutritionCalculator() {
  const { profile, calculateTargets, saveNutritionToProfile, loading } = useNutrition()

  const [bodyweight, setBodyweight] = useState(profile?.bodyweight?.toString() || '')
  const [goalBodyweight, setGoalBodyweight] = useState(profile?.goal_bodyweight?.toString() || '')
  const [height, setHeight] = useState(profile?.height?.toString() || '')
  const [age, setAge] = useState(profile?.age?.toString() || '')
  const [goalType, setGoalType] = useState<'leanBulk' | 'recomp'>(profile?.goal_type || 'leanBulk')
  const [calculatedTargets, setCalculatedTargets] = useState<NutritionTargets | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleCalculate() {
    if (!bodyweight || !goalBodyweight || !height || !age) {
      alert('Please fill in all fields')
      return
    }

    try {
      setCalculating(true)
      const targets = await calculateTargets(
        parseFloat(bodyweight),
        parseFloat(goalBodyweight),
        parseFloat(height),
        parseInt(age),
        goalType
      )
      setCalculatedTargets(targets)
    } catch (error) {
      console.error('Failed to calculate targets:', error)
      alert('Failed to calculate nutrition targets')
    } finally {
      setCalculating(false)
    }
  }

  async function handleSave() {
    if (!calculatedTargets) return

    try {
      setSaving(true)
      await saveNutritionToProfile(calculatedTargets)
      alert('Nutrition targets saved successfully!')
    } catch (error) {
      console.error('Failed to save targets:', error)
      alert('Failed to save nutrition targets')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Calculator</CardTitle>
        <CardDescription>
          Calculate your daily calorie and macro targets based on your stats and goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Input */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bodyweight">Current Bodyweight (lbs)</Label>
            <Input
              id="bodyweight"
              type="number"
              placeholder="175"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-bodyweight">Goal Bodyweight (lbs)</Label>
            <Input
              id="goal-bodyweight"
              type="number"
              placeholder="185"
              value={goalBodyweight}
              onChange={(e) => setGoalBodyweight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              type="number"
              placeholder="70"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>

        {/* Goal Type */}
        <div className="space-y-2">
          <Label htmlFor="goal-type">Goal Type</Label>
          <Select value={goalType} onValueChange={(value) => setGoalType(value as 'leanBulk' | 'recomp')}>
            <SelectTrigger id="goal-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leanBulk">Lean Bulk (+500 training, +100 rest)</SelectItem>
              <SelectItem value="recomp">Recomp (+400 training, -300 rest)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {goalType === 'leanBulk'
              ? 'Gradual weight gain with minimal fat. Ideal for building muscle.'
              : 'Maintain weight while improving body composition.'}
          </p>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={calculating || !bodyweight || !goalBodyweight || !height || !age}
          className="w-full"
        >
          {calculating ? 'Calculating...' : 'Calculate Nutrition Targets'}
        </Button>

        {/* Results */}
        {calculatedTargets && (
          <div className="mt-6 space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">Your Nutrition Targets</h3>

            {/* Calories */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Maintenance</span>
                <span className="font-medium">{calculatedTargets.maintenanceCalories} cal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Training Day</span>
                <span className="font-medium text-green-600">{calculatedTargets.trainingDayCalories} cal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rest Day</span>
                <span className="font-medium text-blue-600">{calculatedTargets.restDayCalories} cal</span>
              </div>
            </div>

            {/* Macros */}
            <div className="space-y-2 border-t pt-4">
              <h4 className="text-sm font-medium">Daily Macros</h4>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Protein</span>
                <span className="font-medium">{calculatedTargets.protein}g ({calculatedTargets.proteinCalories} cal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fat</span>
                <span className="font-medium">{calculatedTargets.fat}g ({calculatedTargets.fatCalories} cal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Carbs (Training)</span>
                <span className="font-medium text-green-600">
                  {calculatedTargets.carbsTraining}g ({calculatedTargets.carbsTrainingCalories} cal)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Carbs (Rest)</span>
                <span className="font-medium text-blue-600">
                  {calculatedTargets.carbsRest}g ({calculatedTargets.carbsRestCalories} cal)
                </span>
              </div>
            </div>

            {/* Percentages */}
            <div className="space-y-2 border-t pt-4">
              <h4 className="text-sm font-medium">Macro Split (Training Day)</h4>
              <div className="flex gap-2">
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold">{calculatedTargets.proteinPercentTraining}%</div>
                  <div className="text-xs text-muted-foreground">Protein</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold">{calculatedTargets.fatPercentTraining}%</div>
                  <div className="text-xs text-muted-foreground">Fat</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold">{calculatedTargets.carbsPercentTraining}%</div>
                  <div className="text-xs text-muted-foreground">Carbs</div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="default"
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Nutrition Targets to Profile'}
            </Button>
          </div>
        )}

        {/* Information */}
        <div className="rounded-lg bg-muted p-4 text-sm">
          <h4 className="font-medium mb-2">How it works:</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>BMR calculated using Mifflin-St Jeor equation</li>
            <li>TDEE uses 1.375 multiplier (3x/week training)</li>
            <li>Protein: 1g per lb of goal bodyweight</li>
            <li>Fat: 0.35g per lb of current bodyweight</li>
            <li>Carbs: Remaining calories</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
