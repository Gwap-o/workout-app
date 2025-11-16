// Meal Plan Builder Component
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'
import { getMealPlansByType, createMealPlan, updateMealPlan, deleteMealPlan } from '@/lib/supabase/mealPlans'
import { calculateMealCalories } from '@/lib/utils/nutrition'
import { useNutrition } from '@/lib/hooks/useNutrition'
import type { Meal, MealPlan } from '@/types'

export function MealPlanBuilder() {
  const { targets } = useNutrition()
  const [planType, setPlanType] = useState<'training' | 'rest'>('training')
  const [existingPlans, setExistingPlans] = useState<MealPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [planName, setPlanName] = useState('')
  const [meals, setMeals] = useState<Meal[]>([])
  const [saving, setSaving] = useState(false)

  // Load existing plans when type changes
  useEffect(() => {
    loadPlans()
  }, [planType])

  async function loadPlans() {
    try {
      const plans = await getMealPlansByType(planType)
      setExistingPlans(plans)
    } catch (error) {
      console.error('Failed to load meal plans:', error)
    }
  }

  // Load selected plan
  function loadPlan(planId: string) {
    const plan = existingPlans.find(p => p.id === planId)
    if (plan) {
      setPlanName(plan.name)
      setMeals(plan.meals)
      setSelectedPlanId(planId)
    }
  }

  // Add new meal
  function addMeal() {
    const newMeal: Meal = {
      name: '',
      description: '',
      protein: 0,
      fat: 0,
      carbs: 0,
      calories: 0
    }
    setMeals([...meals, newMeal])
  }

  // Remove meal
  function removeMeal(index: number) {
    setMeals(meals.filter((_, i) => i !== index))
  }

  // Update meal
  function updateMeal(index: number, field: keyof Meal, value: string | number) {
    const updated = meals.map((meal, i) => {
      if (i !== index) return meal

      const updatedMeal = { ...meal, [field]: value }

      // Recalculate calories if macros changed
      if (field === 'protein' || field === 'fat' || field === 'carbs') {
        updatedMeal.calories = calculateMealCalories(
          typeof updatedMeal.protein === 'number' ? updatedMeal.protein : parseFloat(updatedMeal.protein as string) || 0,
          typeof updatedMeal.fat === 'number' ? updatedMeal.fat : parseFloat(updatedMeal.fat as string) || 0,
          typeof updatedMeal.carbs === 'number' ? updatedMeal.carbs : parseFloat(updatedMeal.carbs as string) || 0
        )
      }

      return updatedMeal
    })

    setMeals(updated)
  }

  // Calculate totals
  function calculateTotals() {
    return meals.reduce(
      (totals, meal) => ({
        protein: totals.protein + (typeof meal.protein === 'number' ? meal.protein : 0),
        fat: totals.fat + (typeof meal.fat === 'number' ? meal.fat : 0),
        carbs: totals.carbs + (typeof meal.carbs === 'number' ? meal.carbs : 0),
        calories: totals.calories + (typeof meal.calories === 'number' ? meal.calories : 0)
      }),
      { protein: 0, fat: 0, carbs: 0, calories: 0 }
    )
  }

  // Save plan
  async function handleSave() {
    if (!planName) {
      alert('Please enter a plan name')
      return
    }

    if (meals.length === 0) {
      alert('Please add at least one meal')
      return
    }

    try {
      setSaving(true)

      if (selectedPlanId) {
        // Update existing
        await updateMealPlan(selectedPlanId, { name: planName, meals })
        alert('Meal plan updated successfully!')
      } else {
        // Create new
        await createMealPlan({ name: planName, type: planType, meals })
        alert('Meal plan created successfully!')
      }

      await loadPlans()
      resetForm()
    } catch (error) {
      console.error('Failed to save meal plan:', error)
      alert('Failed to save meal plan')
    } finally {
      setSaving(false)
    }
  }

  // Delete plan
  async function handleDelete() {
    if (!selectedPlanId) return

    if (!confirm('Are you sure you want to delete this meal plan?')) return

    try {
      await deleteMealPlan(selectedPlanId)
      alert('Meal plan deleted successfully!')
      await loadPlans()
      resetForm()
    } catch (error) {
      console.error('Failed to delete meal plan:', error)
      alert('Failed to delete meal plan')
    }
  }

  // Reset form
  function resetForm() {
    setPlanName('')
    setMeals([])
    setSelectedPlanId('')
  }

  const totals = calculateTotals()
  const targetCalories = planType === 'training' ? targets?.trainingDayCalories : targets?.restDayCalories
  const targetProtein = targets?.protein || 0
  const targetFat = targets?.fat || 0
  const targetCarbs = planType === 'training' ? targets?.carbsTraining : targets?.carbsRest

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Plan Builder</CardTitle>
        <CardDescription>
          Create and manage your meal plans for training and rest days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Type Selection */}
        <div className="space-y-2">
          <Label>Plan Type</Label>
          <Select value={planType} onValueChange={(value) => setPlanType(value as 'training' | 'rest')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="training">Training Day</SelectItem>
              <SelectItem value="rest">Rest Day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Load Existing Plan */}
        {existingPlans.length > 0 && (
          <div className="space-y-2">
            <Label>Load Existing Plan (Optional)</Label>
            <Select value={selectedPlanId} onValueChange={loadPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Create new plan or select existing..." />
              </SelectTrigger>
              <SelectContent>
                {existingPlans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} ({plan.total_calories} cal)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Plan Name */}
        <div className="space-y-2">
          <Label htmlFor="plan-name">Plan Name</Label>
          <Input
            id="plan-name"
            placeholder="My Training Day Plan"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        {/* Meals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Meals</Label>
            <Button onClick={addMeal} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </div>

          {meals.map((meal, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Meal name (e.g., Breakfast)"
                    value={meal.name}
                    onChange={(e) => updateMeal(index, 'name', e.target.value)}
                    className="flex-1 mr-2"
                  />
                  <Button
                    onClick={() => removeMeal(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  placeholder="Description (optional)"
                  value={meal.description || ''}
                  onChange={(e) => updateMeal(index, 'description', e.target.value)}
                />

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Protein (g)</Label>
                    <Input
                      type="number"
                      value={meal.protein}
                      onChange={(e) => updateMeal(index, 'protein', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Fat (g)</Label>
                    <Input
                      type="number"
                      value={meal.fat}
                      onChange={(e) => updateMeal(index, 'fat', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Carbs (g)</Label>
                    <Input
                      type="number"
                      value={meal.carbs}
                      onChange={(e) => updateMeal(index, 'carbs', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Calories: {meal.calories}
                </div>
              </div>
            </Card>
          ))}

          {meals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No meals added yet. Click "Add Meal" to get started.
            </div>
          )}
        </div>

        {/* Totals */}
        {meals.length > 0 && (
          <Card className="p-4 bg-muted">
            <h4 className="font-medium mb-3">Daily Totals</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Calories</div>
                <div className="font-medium">
                  {totals.calories} / {targetCalories || 0}
                  <span className={totals.calories > (targetCalories || 0) ? 'text-red-500 ml-1' : 'text-green-500 ml-1'}>
                    ({totals.calories - (targetCalories || 0)} cal)
                  </span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Protein</div>
                <div className="font-medium">
                  {totals.protein}g / {targetProtein}g
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Fat</div>
                <div className="font-medium">
                  {totals.fat}g / {targetFat}g
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Carbs</div>
                <div className="font-medium">
                  {totals.carbs}g / {targetCarbs || 0}g
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? 'Saving...' : selectedPlanId ? 'Update Plan' : 'Save Plan'}
          </Button>
          {selectedPlanId && (
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          )}
          {selectedPlanId && (
            <Button onClick={resetForm} variant="outline">
              New Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
