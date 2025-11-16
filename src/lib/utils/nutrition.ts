// Nutrition Calculation Utilities
// Implements Kinobody nutrition formulas per FEATURES.md

import type { UserProfile } from '@/types'

/**
 * Nutrition targets interface
 */
export interface NutritionTargets {
  // Calories
  maintenanceCalories: number
  trainingDayCalories: number
  restDayCalories: number

  // Macros (grams)
  protein: number
  fat: number
  carbsTraining: number
  carbsRest: number

  // Macro calories
  proteinCalories: number
  fatCalories: number
  carbsTrainingCalories: number
  carbsRestCalories: number

  // Percentages
  proteinPercentTraining: number
  fatPercentTraining: number
  carbsPercentTraining: number
  proteinPercentRest: number
  fatPercentRest: number
  carbsPercentRest: number
}

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * Men: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 */
export function calculateBMR(
  bodyweight: number, // lbs
  height: number, // inches
  age: number,
  sex: 'male' | 'female' = 'male'
): number {
  // Convert to metric
  const weightKg = bodyweight * 0.453592
  const heightCm = height * 2.54

  let bmr: number

  if (sex === 'male') {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
  } else {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161
  }

  return Math.round(bmr)
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * BMR × activity multiplier
 * Kinobody: 3x/week training = 1.375 multiplier
 */
export function calculateTDEE(bmr: number, activityMultiplier: number = 1.375): number {
  return Math.round(bmr * activityMultiplier)
}

/**
 * Calculate maintenance calories (simple method if no BMR data)
 * Bodyweight × 15 (for moderately active males)
 */
export function calculateMaintenanceSimple(bodyweight: number): number {
  return Math.round(bodyweight * 15)
}

/**
 * Calculate training day and rest day calories based on goal
 */
export function calculateDailyCalories(
  maintenance: number,
  goalType: 'leanBulk' | 'recomp'
): { trainingDay: number; restDay: number } {
  let trainingDay: number
  let restDay: number

  if (goalType === 'leanBulk') {
    // Lean Bulk: +500 training, +100 rest
    trainingDay = maintenance + 500
    restDay = maintenance + 100
  } else {
    // Recomp: +400 training, -300 rest
    trainingDay = maintenance + 400
    restDay = maintenance - 300
  }

  return {
    trainingDay: Math.round(trainingDay),
    restDay: Math.round(restDay)
  }
}

/**
 * Calculate macro targets
 * Protein: 1g per lb bodyweight
 * Fat: 0.3-0.4g per lb bodyweight
 * Carbs: Remainder of calories
 */
export function calculateMacros(
  bodyweight: number,
  goalBodyweight: number,
  trainingDayCalories: number,
  restDayCalories: number
): Pick<NutritionTargets, 'protein' | 'fat' | 'carbsTraining' | 'carbsRest'> {
  // Protein: 1g per lb of GOAL bodyweight
  const protein = Math.round(goalBodyweight * 1.0)

  // Fat: 0.35g per lb of current bodyweight (middle of 0.3-0.4 range)
  const fat = Math.round(bodyweight * 0.35)

  // Calculate calories from protein and fat
  const proteinCalories = protein * 4
  const fatCalories = fat * 9

  // Carbs: Remainder of calories
  const carbsTrainingCalories = trainingDayCalories - proteinCalories - fatCalories
  const carbsRestCalories = restDayCalories - proteinCalories - fatCalories

  const carbsTraining = Math.round(carbsTrainingCalories / 4)
  const carbsRest = Math.round(carbsRestCalories / 4)

  return {
    protein,
    fat,
    carbsTraining,
    carbsRest
  }
}

/**
 * Calculate complete nutrition targets
 */
export function calculateNutritionTargets(
  bodyweight: number,
  goalBodyweight: number,
  height: number,
  age: number,
  goalType: 'leanBulk' | 'recomp',
  sex: 'male' | 'female' = 'male'
): NutritionTargets {
  // Calculate BMR and TDEE
  const bmr = calculateBMR(bodyweight, height, age, sex)
  const maintenance = calculateTDEE(bmr)

  // Calculate daily calories
  const { trainingDay, restDay } = calculateDailyCalories(maintenance, goalType)

  // Calculate macros
  const macros = calculateMacros(bodyweight, goalBodyweight, trainingDay, restDay)

  // Calculate macro calories
  const proteinCalories = macros.protein * 4
  const fatCalories = macros.fat * 9
  const carbsTrainingCalories = macros.carbsTraining * 4
  const carbsRestCalories = macros.carbsRest * 4

  // Calculate percentages
  const proteinPercentTraining = Math.round((proteinCalories / trainingDay) * 100)
  const fatPercentTraining = Math.round((fatCalories / trainingDay) * 100)
  const carbsPercentTraining = Math.round((carbsTrainingCalories / trainingDay) * 100)

  const proteinPercentRest = Math.round((proteinCalories / restDay) * 100)
  const fatPercentRest = Math.round((fatCalories / restDay) * 100)
  const carbsPercentRest = Math.round((carbsRestCalories / restDay) * 100)

  return {
    maintenanceCalories: maintenance,
    trainingDayCalories: trainingDay,
    restDayCalories: restDay,
    protein: macros.protein,
    fat: macros.fat,
    carbsTraining: macros.carbsTraining,
    carbsRest: macros.carbsRest,
    proteinCalories,
    fatCalories,
    carbsTrainingCalories,
    carbsRestCalories,
    proteinPercentTraining,
    fatPercentTraining,
    carbsPercentTraining,
    proteinPercentRest,
    fatPercentRest,
    carbsPercentRest
  }
}

/**
 * Update user profile with calculated nutrition targets
 */
export function updateProfileWithNutrition(
  _profile: UserProfile,
  targets: NutritionTargets
): Partial<UserProfile> {
  return {
    maintenance_calories: targets.maintenanceCalories,
    training_day_calories: targets.trainingDayCalories,
    rest_day_calories: targets.restDayCalories,
    protein_target: targets.protein,
    fat_target: targets.fat,
    carb_target: targets.carbsTraining // Default to training day carbs
  }
}

/**
 * Calculate meal macros
 */
export function calculateMealCalories(
  protein: number,
  fat: number,
  carbs: number
): number {
  return (protein * 4) + (fat * 9) + (carbs * 4)
}

/**
 * Calculate total macros from meals
 */
export interface MealMacros {
  protein: number
  fat: number
  carbs: number
  calories: number
}

export function calculateTotalMacros(meals: MealMacros[]): MealMacros {
  return meals.reduce(
    (totals, meal) => ({
      protein: totals.protein + meal.protein,
      fat: totals.fat + meal.fat,
      carbs: totals.carbs + meal.carbs,
      calories: totals.calories + meal.calories
    }),
    { protein: 0, fat: 0, carbs: 0, calories: 0 }
  )
}

/**
 * Compare meal plan to targets
 */
export interface MacroComparison {
  protein: {
    current: number
    target: number
    difference: number
    percentOfTarget: number
  }
  fat: {
    current: number
    target: number
    difference: number
    percentOfTarget: number
  }
  carbs: {
    current: number
    target: number
    difference: number
    percentOfTarget: number
  }
  calories: {
    current: number
    target: number
    difference: number
    percentOfTarget: number
  }
}

export function compareMacros(
  current: MealMacros,
  targets: Pick<NutritionTargets, 'protein' | 'fat' | 'carbsTraining' | 'trainingDayCalories'>
): MacroComparison {
  return {
    protein: {
      current: current.protein,
      target: targets.protein,
      difference: current.protein - targets.protein,
      percentOfTarget: Math.round((current.protein / targets.protein) * 100)
    },
    fat: {
      current: current.fat,
      target: targets.fat,
      difference: current.fat - targets.fat,
      percentOfTarget: Math.round((current.fat / targets.fat) * 100)
    },
    carbs: {
      current: current.carbs,
      target: targets.carbsTraining,
      difference: current.carbs - targets.carbsTraining,
      percentOfTarget: Math.round((current.carbs / targets.carbsTraining) * 100)
    },
    calories: {
      current: current.calories,
      target: targets.trainingDayCalories,
      difference: current.calories - targets.trainingDayCalories,
      percentOfTarget: Math.round((current.calories / targets.trainingDayCalories) * 100)
    }
  }
}

/**
 * Validate macro targets (ensure they add up correctly)
 */
export function validateNutritionTargets(targets: NutritionTargets): boolean {
  const trainingDayTotal = targets.proteinCalories + targets.fatCalories + targets.carbsTrainingCalories
  const restDayTotal = targets.proteinCalories + targets.fatCalories + targets.carbsRestCalories

  // Allow 5% margin of error for rounding
  const trainingDayValid = Math.abs(trainingDayTotal - targets.trainingDayCalories) < (targets.trainingDayCalories * 0.05)
  const restDayValid = Math.abs(restDayTotal - targets.restDayCalories) < (targets.restDayCalories * 0.05)

  return trainingDayValid && restDayValid
}
