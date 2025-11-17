// Core Type Definitions

export type WorkoutDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type TrainingMethod = 'RPT' | 'Kino' | 'RestPause';

export type MuscleGroup =
  | 'Chest'
  | 'Shoulders'
  | 'Back'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Core';

// User Profile
export interface UserProfile {
  id: string;
  user_id: string;

  // Personal Info
  full_name?: string;
  birthday?: string;

  // Personal Stats
  bodyweight: number;
  goal_bodyweight: number;
  height?: number;
  age?: number;

  // Program State
  current_phase: 1 | 2 | 3;
  current_week: number;
  program_start_date: string;

  // Goals & Preferences
  goal_type: 'leanBulk' | 'recomp';
  workout_schedule: WorkoutDay[];

  // Nutrition Calculations (cached)
  maintenance_calories?: number;
  training_day_calories?: number;
  rest_day_calories?: number;
  protein_target?: number;
  fat_target?: number;
  carb_target?: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Workout Session
export interface WorkoutSession {
  id: string;
  user_id: string;

  // Session Info
  date: string;
  workout_type: 'A' | 'B';
  phase: 1 | 2 | 3;

  // Status
  completed: boolean;
  duration?: number;

  // Metadata
  notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Set Log
export interface SetLog {
  set_number: number;
  weight: number;
  reps: number;
  target_reps?: string;
  rest_time?: number;
  completed: boolean;
  rpe?: number;
}

// Expected Performance
export interface ExpectedPerformance {
  weight: number;
  reps: number;
  source: 'progression' | 'plateau' | 'deload';
}

// Exercise Log
export interface ExerciseLog {
  id: string;
  user_id: string;
  session_id: string;

  // Exercise Info
  exercise_name: string;
  muscle_group: MuscleGroup;
  training_method: TrainingMethod;

  // Performance Data
  sets: SetLog[];

  // Expected vs Actual
  expected_performance?: ExpectedPerformance;
  hit_progression: boolean;

  // Metadata
  notes?: string;
  date: string;

  // Timestamps
  created_at: string;
}

// Bodyweight Log
export interface BodyweightLog {
  id: string;
  user_id: string;
  date: string;
  weight: number;

  // Optional Measurements
  measurements?: {
    chest?: number;
    waist?: number;
    arms?: number;
    shoulders?: number;
    neck?: number;
  };

  // Timestamps
  created_at: string;
}

// Meal
export interface Meal {
  id?: string;
  name: string;
  description?: string;

  // Macros
  protein: number;
  fat: number;
  carbs: number;

  // Auto-calculated
  calories: number;
}

// Meal Plan
export interface MealPlan {
  id: string;
  user_id: string;

  // Plan Info
  name: string;
  type: 'training' | 'rest';

  // Meals
  meals: Meal[];

  // Totals
  total_calories: number;
  total_protein: number;
  total_fat: number;
  total_carbs: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Progress Photo
export interface ProgressPhoto {
  id: string;
  user_id: string;
  date: string;

  // Storage Info
  storage_path: string;
  image_type?: 'front' | 'side' | 'back';

  // Context
  weight?: number;
  phase?: number;
  notes?: string;

  // Timestamps
  created_at: string;
}

// User Settings
export interface UserSettings {
  user_id: string;
  settings: AppSettings;
  updated_at: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  units: 'imperial' | 'metric';
  first_time_user: boolean;
  onboarding_completed: boolean;
  rest_timer_sound: boolean;
  show_form_cues: boolean;
}

// Exercise Definition
export interface Exercise {
  name: string;
  muscle_group: MuscleGroup;
  training_method: TrainingMethod;
  equipment: 'barbell' | 'dumbbell' | 'bodyweight' | 'cable';

  // Rep Ranges
  rep_range: {
    min: number;
    max: number;
  };

  // Progression
  weight_increment: number;

  // Rest Periods
  rest_period: {
    min: number;
    max: number;
  };

  // Phase Assignment
  phases: (1 | 2 | 3)[];

  // Alternatives
  variations?: string[];

  // Standards
  fitness_standards?: FitnessStandards;
}

export interface FitnessStandards {
  good: number;
  great: number;
  godlike: number;
}

// Nutrition Types
export interface NutritionTargets {
  maintenanceCalories: number;
  trainingDayCalories: number;
  restDayCalories: number;
  protein: number;
  fat: number;
  carbsTraining: number;
  carbsRest: number;
  proteinCalories: number;
  fatCalories: number;
  carbsTrainingCalories: number;
  carbsRestCalories: number;
  proteinPercentTraining: number;
  fatPercentTraining: number;
  carbsPercentTraining: number;
  proteinPercentRest: number;
  fatPercentRest: number;
  carbsPercentRest: number;
}

// Validation Types
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  nextAvailableDate?: string;
}

export interface GuardrailCheck {
  canProceed: boolean;
  errors: string[];
  warnings: string[];
  nextAvailableDate?: string;
  recommendations: string[];
}

// Phase Rotation Types
export interface PhaseProgress {
  currentPhase: 1 | 2 | 3;
  currentWeek: number;
  weeksInPhase: number;
  canRotate: boolean;
  nextPhase: 1 | 2 | 3;
  programStartDate: string;
}
