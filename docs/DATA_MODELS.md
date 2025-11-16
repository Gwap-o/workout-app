# Data Models & Database Schema

## Overview

This document defines all data structures, TypeScript interfaces, and PostgreSQL schemas for the Kinobody Workout Tracker app using Supabase.

---

## Database Schema (PostgreSQL + Supabase)

### Database Setup

The database uses **PostgreSQL** via Supabase with **Row Level Security (RLS)** enabled on all tables to ensure user data privacy.

**Key Concepts:**
- All tables include `user_id` field referencing Netlify Identity users
- RLS policies ensure users can only access their own data
- UUID primary keys for all records
- Indexes on frequently queried columns
- JSONB fields for flexible nested data

### SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USER PROFILES
-- =============================================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE, -- Netlify Identity user ID

  -- Personal Stats
  bodyweight DECIMAL(5,1) NOT NULL,
  goal_bodyweight DECIMAL(5,1) NOT NULL,
  height DECIMAL(4,1),
  age INTEGER,

  -- Program State
  current_phase INTEGER NOT NULL CHECK (current_phase IN (1, 2, 3)),
  current_week INTEGER NOT NULL CHECK (current_week BETWEEN 1 AND 8),
  program_start_date DATE NOT NULL,

  -- Goals
  goal_type TEXT NOT NULL CHECK (goal_type IN ('leanBulk', 'recomp')),
  workout_schedule JSONB NOT NULL, -- Array of days ["Monday", "Wednesday", "Friday"]

  -- Nutrition Calculations (cached)
  maintenance_calories INTEGER,
  training_day_calories INTEGER,
  rest_day_calories INTEGER,
  protein_target INTEGER,
  fat_target INTEGER,
  carb_target INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- WORKOUT SESSIONS
-- =============================================================================

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Session Info
  date DATE NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('A', 'B')),
  phase INTEGER NOT NULL CHECK (phase IN (1, 2, 3)),

  -- Status
  completed BOOLEAN DEFAULT FALSE,
  duration INTEGER, -- minutes

  -- Metadata
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- EXERCISE LOGS
-- =============================================================================

CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,

  -- Exercise Info
  exercise_name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  training_method TEXT NOT NULL CHECK (training_method IN ('RPT', 'Kino', 'RestPause')),

  -- Performance Data (stored as JSONB for flexibility)
  sets JSONB NOT NULL, -- Array of set objects
  expected_performance JSONB,
  hit_progression BOOLEAN DEFAULT FALSE,

  -- Metadata
  notes TEXT,
  date DATE NOT NULL, -- Denormalized for fast queries

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- BODYWEIGHT LOGS
-- =============================================================================

CREATE TABLE bodyweight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  date DATE NOT NULL,
  weight DECIMAL(5,1) NOT NULL,

  -- Optional Measurements (JSONB for flexibility)
  measurements JSONB, -- { chest, waist, arms, shoulders, neck }

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- MEAL PLANS
-- =============================================================================

CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Plan Info
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('training', 'rest')),

  -- Meals (JSONB array of meal objects)
  meals JSONB NOT NULL,

  -- Totals (auto-calculated on insert/update via trigger or app logic)
  total_calories INTEGER NOT NULL,
  total_protein INTEGER NOT NULL,
  total_fat INTEGER NOT NULL,
  total_carbs INTEGER NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PROGRESS PHOTOS
-- =============================================================================

CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  date DATE NOT NULL,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage: "user_id/timestamp_filename.jpg"
  image_type TEXT CHECK (image_type IN ('front', 'side', 'back')),

  -- Context
  weight DECIMAL(5,1),
  phase INTEGER,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- USER SETTINGS
-- =============================================================================

CREATE TABLE user_settings (
  user_id TEXT PRIMARY KEY,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User Profiles (no additional indexes needed, user_id is UNIQUE)

-- Workout Sessions
CREATE INDEX idx_workout_sessions_user_date
  ON workout_sessions(user_id, date DESC);
CREATE INDEX idx_workout_sessions_user_type
  ON workout_sessions(user_id, workout_type);

-- Exercise Logs
CREATE INDEX idx_exercise_logs_user_exercise
  ON exercise_logs(user_id, exercise_name, date DESC);
CREATE INDEX idx_exercise_logs_session
  ON exercise_logs(session_id);
CREATE INDEX idx_exercise_logs_date
  ON exercise_logs(user_id, date DESC);

-- Bodyweight Logs
CREATE INDEX idx_bodyweight_logs_user_date
  ON bodyweight_logs(user_id, date DESC);

-- Meal Plans
CREATE INDEX idx_meal_plans_user_type
  ON meal_plans(user_id, type);

-- Progress Photos
CREATE INDEX idx_progress_photos_user_date
  ON progress_photos(user_id, date DESC);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at
  BEFORE UPDATE ON workout_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bodyweight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

-- Workout Sessions Policies
CREATE POLICY "Users can view own workouts" ON workout_sessions
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own workouts" ON workout_sessions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own workouts" ON workout_sessions
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own workouts" ON workout_sessions
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Exercise Logs Policies
CREATE POLICY "Users can view own exercise logs" ON exercise_logs
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own exercise logs" ON exercise_logs
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own exercise logs" ON exercise_logs
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own exercise logs" ON exercise_logs
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Bodyweight Logs Policies
CREATE POLICY "Users can view own bodyweight logs" ON bodyweight_logs
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own bodyweight logs" ON bodyweight_logs
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own bodyweight logs" ON bodyweight_logs
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own bodyweight logs" ON bodyweight_logs
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Meal Plans Policies
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own meal plans" ON meal_plans
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own meal plans" ON meal_plans
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Progress Photos Policies
CREATE POLICY "Users can view own photos" ON progress_photos
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own photos" ON progress_photos
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own photos" ON progress_photos
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- User Settings Policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);
```

---

## Supabase Storage (Progress Photos)

```sql
-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false);

-- RLS policies for storage bucket
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos' AND
    (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
  );

CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'progress-photos' AND
    (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'progress-photos' AND
    (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
  );
```

---

## TypeScript Interfaces

### 1. User Profile

```typescript
export interface UserProfile {
  id: string;                           // UUID
  user_id: string;                      // Netlify Identity user ID

  // Personal Stats
  bodyweight: number;                   // Current weight (lbs)
  goal_bodyweight: number;              // Target weight (max current + 15)
  height?: number;                      // Optional (inches)
  age?: number;                         // Optional

  // Program State
  current_phase: 1 | 2 | 3;             // Phase 1, 2, or 3
  current_week: number;                 // Week within phase (1-8)
  program_start_date: string;           // ISO date string

  // Goals & Preferences
  goal_type: 'leanBulk' | 'recomp';     // Nutrition goal
  workout_schedule: WorkoutDay[];       // ['Monday', 'Wednesday', 'Friday']

  // Nutrition Calculations (cached)
  maintenance_calories: number;         // Base maintenance
  training_day_calories: number;        // Training day target
  rest_day_calories: number;            // Rest day target
  protein_target: number;               // Grams
  fat_target: number;                   // Grams
  carb_target: number;                  // Grams

  // Timestamps
  created_at: string;                   // ISO timestamp
  updated_at: string;                   // ISO timestamp
}

export type WorkoutDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
```

### 2. Workout Session

```typescript
export interface WorkoutSession {
  id: string;                           // UUID
  user_id: string;                      // Netlify Identity user ID

  // Session Info
  date: string;                         // ISO date string
  workout_type: 'A' | 'B';              // Workout A or B
  phase: 1 | 2 | 3;                     // Program phase

  // Status
  completed: boolean;                   // Finished or in-progress
  duration?: number;                    // Workout duration (minutes)

  // Metadata
  notes?: string;                       // User notes

  // Timestamps
  created_at: string;                   // ISO timestamp
  updated_at: string;                   // ISO timestamp
}
```

### 3. Exercise Log

```typescript
export interface ExerciseLog {
  id: string;                           // UUID
  user_id: string;                      // Netlify Identity user ID
  session_id: string;                   // Foreign key to WorkoutSession

  // Exercise Info
  exercise_name: string;                // "Incline Barbell Press"
  muscle_group: MuscleGroup;            // "Chest"
  training_method: TrainingMethod;      // "RPT" | "Kino" | "RestPause"

  // Performance Data (stored as JSONB in DB)
  sets: SetLog[];                       // Array of sets

  // Expected vs Actual
  expected_performance?: ExpectedPerformance;
  hit_progression: boolean;             // Did user progress from last workout?

  // Metadata
  notes?: string;
  date: string;                         // ISO date (denormalized for fast queries)

  // Timestamps
  created_at: string;                   // ISO timestamp
}

export interface SetLog {
  set_number: number;                   // 1, 2, 3, etc.
  weight: number;                       // Pounds
  reps: number;                         // Reps completed
  target_reps?: string;                 // "4-5", "6-7", "8-10"
  rest_time?: number;                   // Actual rest (seconds)
  completed: boolean;                   // Did user complete this set?
  rpe?: number;                         // Optional: Rate of Perceived Exertion (1-10)
}

export interface ExpectedPerformance {
  weight: number;                       // Expected weight for set 1
  reps: number;                         // Expected reps for set 1
  source: 'progression' | 'plateau' | 'deload';
}

export type TrainingMethod = 'RPT' | 'Kino' | 'RestPause';

export type MuscleGroup =
  | 'Chest'
  | 'Shoulders'
  | 'Back'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Core';
```

### 4. Exercise Constants (Not in DB)

```typescript
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
  weight_increment: number;             // 2.5 or 5 lbs

  // Rest Periods
  rest_period: {
    min: number;                        // Seconds
    max: number;
  };

  // Phase Assignment
  phases: (1 | 2 | 3)[];                // Which phases include this exercise

  // Alternatives
  variations?: string[];                // Alternative exercises

  // Standards
  fitness_standards?: FitnessStandards;
}

export interface FitnessStandards {
  good: number;                         // Multiplier of bodyweight
  great: number;
  godlike: number;
}
```

### 5. Bodyweight Log

```typescript
export interface BodyweightLog {
  id: string;                           // UUID
  user_id: string;                      // Netlify Identity user ID
  date: string;                         // ISO date string
  weight: number;                       // Pounds

  // Optional Measurements (stored as JSONB in DB)
  measurements?: {
    chest?: number;                     // Inches
    waist?: number;                     // Inches (at belly button)
    arms?: number;                      // Inches (flexed)
    shoulders?: number;                 // Inches
    neck?: number;                      // Inches
  };

  // Timestamps
  created_at: string;                   // ISO timestamp
}
```

### 6. Meal Plan

```typescript
export interface MealPlan {
  id: string;                           // UUID
  user_id: string;                      // Netlify Identity user ID

  // Plan Info
  name: string;                         // "Training Day Plan"
  type: 'training' | 'rest';            // Day type

  // Meals (stored as JSONB in DB)
  meals: Meal[];

  // Totals (auto-calculated)
  total_calories: number;
  total_protein: number;                // Grams
  total_fat: number;                    // Grams
  total_carbs: number;                  // Grams

  // Timestamps
  created_at: string;                   // ISO timestamp
  updated_at: string;                   // ISO timestamp
}

export interface Meal {
  id?: string;                          // Local ID (not DB primary key)
  name: string;                         // "Breakfast", "Lunch", "Dinner", "Snack"
  description?: string;                 // Optional meal description

  // Macros (user-entered)
  protein: number;                      // Grams
  fat: number;                          // Grams
  carbs: number;                        // Grams

  // Auto-calculated
  calories: number;                     // (P × 4) + (F × 9) + (C × 4)
}
```

### 7. Progress Photo

```typescript
export interface ProgressPhoto {
  id: string;                           // UUID
  user_id: string;                      // Netlify Identity user ID
  date: string;                         // ISO date string

  // Storage Info
  storage_path: string;                 // Path in Supabase Storage
  image_type?: 'front' | 'side' | 'back';

  // Context
  weight?: number;                      // Weight at time of photo
  phase?: number;                       // Phase at time of photo
  notes?: string;                       // User notes

  // Timestamps
  created_at: string;                   // ISO timestamp
}
```

### 8. User Settings

```typescript
export interface UserSettings {
  user_id: string;                      // Netlify Identity user ID (PK)
  settings: AppSettings;                // JSONB field
  updated_at: string;                   // ISO timestamp
}

export type AppSettings = {
  theme: 'light' | 'dark' | 'auto';
  units: 'imperial' | 'metric';
  first_time_user: boolean;
  onboarding_completed: boolean;
  rest_timer_sound: boolean;
  show_form_cues: boolean;
};
```

---

## Supabase Client CRUD Operations

### User Profile

```typescript
// src/lib/supabase/userProfile.ts
import { supabase } from './client';
import type { UserProfile } from '@/types';

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Workout Sessions

```typescript
// src/lib/supabase/workouts.ts
import { supabase } from './client';
import type { WorkoutSession } from '@/types';

export const createWorkoutSession = async (
  session: Omit<WorkoutSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<WorkoutSession> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      ...session,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWorkoutHistory = async (limit = 50): Promise<WorkoutSession[]> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, exercise_logs(*)')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getWorkoutById = async (sessionId: string): Promise<WorkoutSession> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, exercise_logs(*)')
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
};

export const updateWorkoutSession = async (
  sessionId: string,
  updates: Partial<WorkoutSession>
): Promise<WorkoutSession> => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteWorkoutSession = async (sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('workout_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
};
```

### Exercise Logs

```typescript
// src/lib/supabase/exercises.ts
import { supabase } from './client';
import type { ExerciseLog } from '@/types';

export const getExerciseHistory = async (
  exerciseName: string,
  limit = 10
): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('exercise_name', exerciseName)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const createExerciseLog = async (
  log: Omit<ExerciseLog, 'id' | 'user_id' | 'created_at'>
): Promise<ExerciseLog> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert({
      ...log,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRecentExerciseLogs = async (
  exerciseName: string,
  count = 3
): Promise<ExerciseLog[]> => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('exercise_name', exerciseName)
    .order('date', { ascending: false })
    .limit(count);

  if (error) throw error;
  return data;
};
```

### Progress Photos

```typescript
// src/lib/supabase/photos.ts
import { supabase } from './client';
import type { ProgressPhoto } from '@/types';

export const uploadProgressPhoto = async (
  file: File,
  metadata: { date: string; weight?: number; phase?: number; notes?: string; image_type?: 'front' | 'side' | 'back' }
): Promise<ProgressPhoto> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Upload to storage
  const filePath = `${user.id}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Create database record
  const { data, error } = await supabase
    .from('progress_photos')
    .insert({
      user_id: user.id,
      storage_path: filePath,
      ...metadata
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProgressPhotos = async (): Promise<(ProgressPhoto & { image_url: string })[]> => {
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;

  // Get signed URLs for images
  const photosWithUrls = await Promise.all(
    data.map(async (photo) => {
      const { data: { signedUrl } } = await supabase.storage
        .from('progress-photos')
        .createSignedUrl(photo.storage_path, 3600); // 1 hour expiry

      return { ...photo, image_url: signedUrl || '' };
    })
  );

  return photosWithUrls;
};

export const deleteProgressPhoto = async (photoId: string, storagePath: string): Promise<void> => {
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('progress-photos')
    .remove([storagePath]);

  if (storageError) throw storageError;

  // Delete database record
  const { error } = await supabase
    .from('progress_photos')
    .delete()
    .eq('id', photoId);

  if (error) throw error;
};
```

---

## Query Examples

### Get User's Current Phase and Week

```typescript
const { data } = await supabase
  .from('user_profiles')
  .select('current_phase, current_week')
  .single();
```

### Get All Workouts This Week

```typescript
const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

const { data } = await supabase
  .from('workout_sessions')
  .select('*')
  .gte('date', startOfWeek.toISOString().split('T')[0])
  .order('date', { ascending: true });
```

### Get Exercise History for Charts

```typescript
const { data } = await supabase
  .from('exercise_logs')
  .select('date, sets')
  .eq('exercise_name', 'Incline Barbell Press')
  .gte('date', '2025-01-01')
  .order('date', { ascending: true });
```

### Check Plateau (Last 3 Workouts)

```typescript
const { data } = await supabase
  .from('exercise_logs')
  .select('sets')
  .eq('exercise_name', 'Incline Barbell Press')
  .order('date', { ascending: false })
  .limit(3);
```

### Get Bodyweight Trend (Last 12 Weeks)

```typescript
const twelveWeeksAgo = new Date();
twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

const { data } = await supabase
  .from('bodyweight_logs')
  .select('date, weight')
  .gte('date', twelveWeeksAgo.toISOString().split('T')[0])
  .order('date', { ascending: true });
```

---

## Data Export Format

```typescript
export interface DataExport {
  version: string;                      // "1.0.0"
  export_date: string;                  // ISO timestamp
  user_id: string;                      // Netlify Identity user ID

  data: {
    user_profile: UserProfile;
    workout_sessions: WorkoutSession[];
    exercise_logs: ExerciseLog[];
    bodyweight_logs: BodyweightLog[];
    meal_plans: MealPlan[];
    progress_photos: ProgressPhoto[];   // Metadata only, not actual images
    settings: UserSettings;
  };

  metadata: {
    total_workouts: number;
    date_range: {
      start: string;
      end: string;
    };
    program_phase: number;
    program_week: number;
  };
}
```

### Export Function

```typescript
export const exportAllData = async (): Promise<DataExport> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const [
    userProfile,
    workoutSessions,
    exerciseLogs,
    bodyweightLogs,
    mealPlans,
    progressPhotos,
    settings
  ] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('workout_sessions').select('*').order('date', { ascending: false }),
    supabase.from('exercise_logs').select('*').order('date', { ascending: false }),
    supabase.from('bodyweight_logs').select('*').order('date', { ascending: false }),
    supabase.from('meal_plans').select('*'),
    supabase.from('progress_photos').select('*').order('date', { ascending: false }),
    supabase.from('user_settings').select('*').eq('user_id', user.id).single()
  ]);

  return {
    version: '1.0.0',
    export_date: new Date().toISOString(),
    user_id: user.id,
    data: {
      user_profile: userProfile.data!,
      workout_sessions: workoutSessions.data || [],
      exercise_logs: exerciseLogs.data || [],
      bodyweight_logs: bodyweightLogs.data || [],
      meal_plans: mealPlans.data || [],
      progress_photos: progressPhotos.data || [],
      settings: settings.data!
    },
    metadata: {
      total_workouts: workoutSessions.data?.length || 0,
      date_range: {
        start: workoutSessions.data?.[workoutSessions.data.length - 1]?.date || '',
        end: workoutSessions.data?.[0]?.date || ''
      },
      program_phase: userProfile.data?.current_phase || 1,
      program_week: userProfile.data?.current_week || 1
    }
  };
};
```

---

## TypeScript Type Generation

Generate types from Supabase schema:

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

This creates a `Database` type with all tables:

```typescript
import type { Database } from '@/types/supabase';

// Use generated types with Supabase client
const supabase = createClient<Database>(url, key);
```

---

*Last Updated: November 16, 2025*
