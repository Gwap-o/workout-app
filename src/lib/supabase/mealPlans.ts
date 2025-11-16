// Meal Plans CRUD Operations
import { supabase } from './client'
import type { MealPlan, Meal } from '@/types'
import { calculateMealCalories } from '@/lib/utils/nutrition'

/**
 * Get all meal plans for current user
 */
export async function getMealPlans(): Promise<MealPlan[]> {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get meal plans by type (training or rest)
 */
export async function getMealPlansByType(
  type: 'training' | 'rest'
): Promise<MealPlan[]> {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get a single meal plan by ID
 */
export async function getMealPlan(id: string): Promise<MealPlan> {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new meal plan
 */
export async function createMealPlan(
  plan: {
    name: string
    type: 'training' | 'rest'
    meals: Meal[]
  }
): Promise<MealPlan> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Calculate totals
  const totals = plan.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      fat: acc.fat + meal.fat,
      carbs: acc.carbs + meal.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  )

  const { data, error } = await supabase
    .from('meal_plans')
    .insert({
      user_id: user.id,
      name: plan.name,
      type: plan.type,
      meals: plan.meals,
      total_calories: totals.calories,
      total_protein: totals.protein,
      total_fat: totals.fat,
      total_carbs: totals.carbs,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an existing meal plan
 */
export async function updateMealPlan(
  id: string,
  updates: {
    name?: string
    meals?: Meal[]
  }
): Promise<MealPlan> {
  // If meals are being updated, recalculate totals
  let calculatedTotals: any = {}

  if (updates.meals) {
    const totals = updates.meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        fat: acc.fat + meal.fat,
        carbs: acc.carbs + meal.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    )

    calculatedTotals = {
      total_calories: totals.calories,
      total_protein: totals.protein,
      total_fat: totals.fat,
      total_carbs: totals.carbs,
    }
  }

  const { data, error } = await supabase
    .from('meal_plans')
    .update({
      ...updates,
      ...calculatedTotals,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a meal plan
 */
export async function deleteMealPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from('meal_plans')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Add a meal to an existing plan
 */
export async function addMealToPlan(
  planId: string,
  meal: Meal
): Promise<MealPlan> {
  // Get current plan
  const plan = await getMealPlan(planId)

  // Add meal and recalculate
  const updatedMeals = [...plan.meals, meal]

  return updateMealPlan(planId, { meals: updatedMeals })
}

/**
 * Remove a meal from a plan
 */
export async function removeMealFromPlan(
  planId: string,
  mealIndex: number
): Promise<MealPlan> {
  // Get current plan
  const plan = await getMealPlan(planId)

  // Remove meal
  const updatedMeals = plan.meals.filter((_, index) => index !== mealIndex)

  return updateMealPlan(planId, { meals: updatedMeals })
}

/**
 * Update a specific meal in a plan
 */
export async function updateMealInPlan(
  planId: string,
  mealIndex: number,
  updatedMeal: Meal
): Promise<MealPlan> {
  // Get current plan
  const plan = await getMealPlan(planId)

  // Update meal
  const updatedMeals = plan.meals.map((meal, index) =>
    index === mealIndex ? updatedMeal : meal
  )

  return updateMealPlan(planId, { meals: updatedMeals })
}

/**
 * Duplicate a meal plan
 */
export async function duplicateMealPlan(
  id: string,
  newName?: string
): Promise<MealPlan> {
  const plan = await getMealPlan(id)

  return createMealPlan({
    name: newName || `${plan.name} (Copy)`,
    type: plan.type,
    meals: plan.meals,
  })
}

/**
 * Create default meal plan templates
 */
export async function createDefaultMealPlans(): Promise<{
  training: MealPlan
  rest: MealPlan
}> {
  // Get user profile for targets
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) throw new Error('User profile not found')

  // Create training day template
  const trainingMeals: Meal[] = [
    {
      name: 'Breakfast',
      description: 'Protein-rich breakfast',
      protein: Math.round((profile.protein_target || 150) * 0.25),
      fat: Math.round((profile.fat_target || 60) * 0.2),
      carbs: Math.round(((profile.carb_target || 300) * 0.2)),
      calories: 0, // Will be calculated
    },
    {
      name: 'Lunch',
      description: 'Balanced meal',
      protein: Math.round((profile.protein_target || 150) * 0.35),
      fat: Math.round((profile.fat_target || 60) * 0.4),
      carbs: Math.round((profile.carb_target || 300) * 0.35),
      calories: 0,
    },
    {
      name: 'Post-Workout',
      description: 'Protein and carbs for recovery',
      protein: Math.round((profile.protein_target || 150) * 0.25),
      fat: Math.round((profile.fat_target || 60) * 0.1),
      carbs: Math.round((profile.carb_target || 300) * 0.3),
      calories: 0,
    },
    {
      name: 'Dinner',
      description: 'Evening meal',
      protein: Math.round((profile.protein_target || 150) * 0.15),
      fat: Math.round((profile.fat_target || 60) * 0.3),
      carbs: Math.round((profile.carb_target || 300) * 0.15),
      calories: 0,
    },
  ]

  // Calculate calories for each meal
  trainingMeals.forEach(meal => {
    meal.calories = calculateMealCalories(meal.protein, meal.fat, meal.carbs)
  })

  const trainingPlan = await createMealPlan({
    name: 'Training Day Plan',
    type: 'training',
    meals: trainingMeals,
  })

  // Create rest day template (lower carbs)
  const restMeals: Meal[] = [
    {
      name: 'Breakfast',
      description: 'Protein and fats',
      protein: Math.round((profile.protein_target || 150) * 0.3),
      fat: Math.round((profile.fat_target || 60) * 0.3),
      carbs: Math.round((profile.carb_target || 200) * 0.2),
      calories: 0,
    },
    {
      name: 'Lunch',
      description: 'Main meal',
      protein: Math.round((profile.protein_target || 150) * 0.35),
      fat: Math.round((profile.fat_target || 60) * 0.4),
      carbs: Math.round((profile.carb_target || 200) * 0.4),
      calories: 0,
    },
    {
      name: 'Snack',
      description: 'Light snack',
      protein: Math.round((profile.protein_target || 150) * 0.15),
      fat: Math.round((profile.fat_target || 60) * 0.1),
      carbs: Math.round((profile.carb_target || 200) * 0.2),
      calories: 0,
    },
    {
      name: 'Dinner',
      description: 'Evening meal',
      protein: Math.round((profile.protein_target || 150) * 0.2),
      fat: Math.round((profile.fat_target || 60) * 0.2),
      carbs: Math.round((profile.carb_target || 200) * 0.2),
      calories: 0,
    },
  ]

  restMeals.forEach(meal => {
    meal.calories = calculateMealCalories(meal.protein, meal.fat, meal.carbs)
  })

  const restPlan = await createMealPlan({
    name: 'Rest Day Plan',
    type: 'rest',
    meals: restMeals,
  })

  return { training: trainingPlan, rest: restPlan }
}
