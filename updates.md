# Greek God 2.0 Workout Tracker - Feature Updates & Roadmap

**Last Updated:** 2025-11-17
**Status:** Feature Gap Analysis Complete

---

## Overview

This document tracks the feature gaps between the documented Greek God 2.0 program (program.md) and the current implementation. Features are organized by priority tier to guide development.

---

## TIER 1: CRITICAL FEATURES (Program Cannot Function Properly)

### 1. Rest Timer Functionality ⏱️
**Priority:** HIGHEST
**Status:** ✅ **COMPLETE**
**Impact:** Core workout experience now fully functional

**Implementation:**
- ✅ Created `RestTimer` component with countdown display (219 lines)
- ✅ Implemented audio notification system using Web Audio API
- ✅ Added timer controls (pause/resume, +30s, skip)
- ✅ Fully integrated timer into ExerciseCard between sets
- ✅ Shows recommended rest time vs. actual rest time
- ✅ Handles different rest periods per training method:
  - RPT: Uses exercise.rest_period.max (typically 3 minutes)
  - Kino Training: Uses average of min/max (60-90 seconds)
  - Rest-Pause: 15 seconds between mini-sets
  - Intermediate RPT: Uses exercise.rest_period values
- ✅ Timer state management (running, paused, completed)
- ✅ Sound preferences via settings.rest_timer_sound
- ✅ Tracks actual rest time and stores in SetLog
- ✅ Color-coded completion indicators (green: on-target, yellow: rushed, blue: extra rest)

**Files Created:**
- `src/components/workout/RestTimer.tsx` (219 lines)
- `src/lib/utils/audio.ts` (107 lines)

**Files Modified:**
- `src/components/workout/ExerciseCard.tsx` (integrated RestTimer, tracking logic)

**Key Features:**
- Visual countdown with MM:SS format
- Progress bar animation
- Color transitions (green → yellow → red as time runs down)
- Double beep sound on completion (800 Hz sine wave)
- Pulsing animation when timer completes
- Manual start button after each set
- Actual vs. recommended rest time comparison

---

### 2. Warmup Set Tracking & Guidance 🏋️
**Priority:** HIGH
**Status:** ✅ **COMPLETE**
**Impact:** Safety and performance now optimized

**Implementation:**
- ✅ Added `is_warmup` boolean field to SetLog type
- ✅ Created warmup calculation utilities (warmupCalculations.ts)
- ✅ Warmup set calculator generates 60%, 75%, 90% of working weight
- ✅ Created WarmupSetInput component for UI
- ✅ Created WarmupSetCalculator component (alternative implementation)
- ✅ Integrated warmup sets into ExerciseCard
- ✅ Show/hide warmup sets toggle
- ✅ Auto-calculated warmup weights with rep guidance:
  - 60% of working weight: 5 reps (light warmup)
  - 75% of working weight: 3 reps (moderate warmup)
  - 90% of working weight: 1 rep (heavy warmup)
- ✅ "First exercise only" indicator
- ✅ Rest period guidance (2 minutes between warmup sets via WARMUP_REST_SECONDS)
- ✅ Only shown for first exercise (shouldShowWarmupSets check)
- ✅ Warmup completion tracking
- ✅ Dynamic calculation based on first working set weight

**Files Created:**
- `src/components/workout/WarmupSetInput.tsx` (99 lines)
- `src/components/workout/WarmupSetCalculator.tsx` (241 lines - alternative implementation)
- `src/lib/utils/warmupCalculations.ts` (116 lines)

**Files Modified:**
- `src/components/workout/ExerciseCard.tsx` (integrated warmup display and tracking)

**Key Features:**
- Collapsible warmup section
- Real-time warmup weight calculation based on working set input
- Percentage indicators (60%, 75%, 90%)
- Blue-themed UI to distinguish from working sets
- Completion checkmarks
- Guidance text for warmup protocol

**Database:**
- No migration required - warmup sets stored in existing JSONB sets array with `is_warmup: true` flag

---

### 3. Set-by-Set Rest Timers ⏲️
**Priority:** HIGH
**Status:** ✅ **COMPLETE** (duplicate of Feature #1)
**Impact:** Training method execution now fully supported

**Implementation:** Same as Feature #1 - Rest Timer Functionality
- ✅ Dynamic rest period calculation based on training method
- ✅ Display recommended rest time before each set
- ✅ Track actual rest time taken between sets
- ✅ Show comparison: recommended vs. actual rest
- ✅ Visual feedback when rest period complete (color-coded)
- ✅ Rest-pause mini-set timing (15 seconds)
- ✅ Stores actual rest times in database (rest_time field in SetLog)

**Note:** This feature was already implemented as part of Feature #1. The RestTimer component handles all set-by-set rest tracking with training method-specific durations.

---

### 4. Phase 2 & Phase 3 Complete Exercise Database 📊
**Priority:** HIGH
**Status:** Partially Implemented
**Impact:** Program progression blocked after Week 8

**Current State:**
- ✅ Phase 1 exercises complete
- ⚠️ Phase 2 has limited exercises
- ❌ Phase 3 exercises missing many assistance movements
- ❌ Missing exercises prevent proper workout generation

**Missing Phase 2 Exercises:**
- [ ] Side-to-Side Knee Ups (Workout A)
- [ ] Dumbbell Upright Rows (Workout A)
- [ ] Weighted Pullups (Phase 2 variant - Workout B)
- [ ] Single-Leg Romanian Deadlifts (Workout B)
- [ ] Seated Bent-Over Flyes (Workout B)

**Missing Phase 3 Exercises:**
- [ ] Review program.md for all Phase 3 specific exercises
- [ ] Add all assistance exercise variations

**Required Implementation:**
- [ ] Add missing exercises to database with proper metadata
- [ ] Define training methods for each exercise
- [ ] Set appropriate rep ranges and rest periods
- [ ] Add form cues and descriptions
- [ ] Define progression rules per exercise
- [ ] Update workout generation logic to include all exercises
- [ ] Test phase rotation with complete exercise database

**Files to Modify:**
- `src/lib/constants/exercises.ts`
- `supabase/migrations/YYYYMMDDHHMMSS_add_phase_2_3_exercises.sql` (NEW)
- Database seed data files

**Database Changes:**
```sql
-- Insert missing Phase 2 exercises
INSERT INTO exercises (name, phase, workout_day, training_method, ...)
VALUES
  ('Side-to-Side Knee Ups', 2, 'A', 'Kino', ...),
  ('Dumbbell Upright Rows', 2, 'A', 'RPT', ...),
  -- etc.
```

---

### 5. MEGA Training Program (12-Week Advanced Program) 💪
**Priority:** HIGH
**Status:** Documented but Not Implemented
**Impact:** Advanced progression completely missing

**Current State:**
- ⚠️ `validateMEGATrainingDuration()` exists but incomplete
- ❌ No MEGA workout definitions
- ❌ No UI to switch to MEGA training
- ❌ No MEGA exercises in database
- ❌ RestPause used as incomplete proxy

**Required Implementation:**
- [ ] Create MEGA training phase type in database
- [ ] Add all MEGA-specific exercises:
  - Cable Cross-Overs
  - Hip Thrusts
  - Machine Curls
  - Cable Rows
  - Machine Bench Press
  - (Review Chapter 10 for complete list)
- [ ] Implement MEGA workout structure:
  - Phase 1 (Weeks 1-6)
  - Phase 2 (Weeks 7-12)
- [ ] Create MEGA training toggle in UI
- [ ] Implement different progression rules for MEGA
- [ ] Add MEGA-specific rep schemes and rest periods
- [ ] Create workflow for 2:1 ratio (6 months strength → 3 months MEGA)
- [ ] Add MEGA training analytics and tracking
- [ ] Update phase rotation to include MEGA option

**Files to Modify:**
- `src/components/settings/TrainingModeSelector.tsx` (NEW)
- `src/lib/constants/megaExercises.ts` (NEW)
- `src/lib/progression/megaProgression.ts` (NEW)
- `supabase/migrations/YYYYMMDDHHMMSS_add_mega_training.sql` (NEW)

**Database Changes:**
```sql
-- Add training_mode to user_profiles
ALTER TABLE user_profiles
ADD COLUMN training_mode VARCHAR(20) DEFAULT 'standard'
CHECK (training_mode IN ('standard', 'mega'));

-- Add MEGA phase tracking
CREATE TABLE mega_training_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phase INTEGER CHECK (phase IN (1, 2)),
  start_date DATE NOT NULL,
  weeks_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## TIER 2: HIGH IMPACT FEATURES (Significant Limitations)

### 6. Specialization Routines (6 Advanced Programs) 🎯
**Priority:** MEDIUM-HIGH
**Status:** Documented but Not Implemented
**Impact:** Advanced customization missing

**Current State:**
- ❌ Phase 3 incorrectly labeled as "Specialization Phase"
- ❌ No specialization routine selection
- ❌ No specialized workout variations

**Required Specialization Programs (Chapter 11):**
- [ ] Chest Specialization
- [ ] Shoulder Specialization
- [ ] Triceps Specialization
- [ ] Back Specialization
- [ ] Biceps Specialization
- [ ] Legs Specialization

**Required Implementation:**
- [ ] Create specialization selection UI
- [ ] Add specialization-specific exercises to database
- [ ] Implement increased volume protocols
- [ ] Create specialization workout templates
- [ ] Add specialization tracking and progress
- [ ] Allow users to switch between specializations
- [ ] Rename Phase 3 appropriately
- [ ] Update analytics to track specialization progress

**Files to Modify:**
- `src/components/settings/SpecializationSelector.tsx` (NEW)
- `src/lib/constants/specializationRoutines.ts` (NEW)
- `supabase/migrations/YYYYMMDDHHMMSS_add_specialization_routines.sql` (NEW)

**Database Changes:**
```sql
ALTER TABLE user_profiles
ADD COLUMN active_specialization VARCHAR(50)
CHECK (active_specialization IN ('chest', 'shoulder', 'triceps', 'back', 'biceps', 'legs', NULL));

CREATE TABLE specialization_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialization VARCHAR(50) NOT NULL,
  exercise_id UUID REFERENCES exercises(id),
  week_number INTEGER,
  sets INTEGER,
  rep_range_min INTEGER,
  rep_range_max INTEGER
);
```

---

### 7. Form Cues & Exercise Videos 🎥
**Priority:** MEDIUM-HIGH
**Status:** UI Placeholder Only
**Impact:** Safety and learning limited

**Current State:**
- ✅ Setting toggle: `show_form_cues` exists
- ❌ No actual form cue content
- ❌ No video links or demonstrations
- ❌ Toggle has no effect

**Required Implementation:**
- [ ] Add form_cues field to exercises table
- [ ] Write form cues for all exercises (extract from program.md)
- [ ] Add video_url field to exercises table
- [ ] Source or create exercise demonstration videos
- [ ] Create FormCueDisplay component
- [ ] Integrate form cues into ExerciseCard
- [ ] Add expandable form cue section
- [ ] Implement video player modal
- [ ] Add "Show form cues" toggle functionality
- [ ] Create form checklist for critical exercises

**Example Form Cues to Add:**
- Incline Barbell Press: "Elbows tucked at 45 degrees, lower to upper chest"
- Box Squats: "Chest up, weight in heels, sit back to box"
- Romanian Deadlifts: "Slight knee bend, hinge at hips, keep bar close"

**Files to Modify:**
- `src/components/workout/FormCueDisplay.tsx` (NEW)
- `src/components/workout/ExerciseVideoPlayer.tsx` (NEW)
- `src/components/workout/ExerciseCard.tsx`
- `supabase/migrations/YYYYMMDDHHMMSS_add_form_cues_videos.sql` (NEW)

**Database Changes:**
```sql
ALTER TABLE exercises
ADD COLUMN form_cues TEXT[],
ADD COLUMN video_url VARCHAR(500),
ADD COLUMN safety_notes TEXT;
```

---

### 8. Deload Protocol Implementation 🔄
**Priority:** MEDIUM-HIGH
**Status:** ✅ COMPLETE
**Impact:** Recovery protocol fully functional

**Completed Features:**
- ✅ `useDeload()` hook for complete state management
- ✅ Deload calculation utilities (recommendation, weight reduction)
- ✅ DeloadWeekBanner component with full protocol
- ✅ DeloadManagement component for settings
- ✅ Automatic weight reduction in ExerciseCard
- ✅ Database schema and migrations
- ✅ Start/End deload workflow
- ✅ Automatic recommendations (6-8 weeks or 3+ plateaus)

**Implemented Files:**
- `src/lib/hooks/useDeload.ts` - Complete deload state management
- `src/lib/utils/deloadUtils.ts` - Calculation and recommendation logic
- `src/components/workout/DeloadWeekBanner.tsx` - Purple-themed banner
- `src/components/settings/DeloadManagement.tsx` - Control panel
- `src/components/workout/ExerciseCard.tsx` - Weight reduction integration
- `src/components/workout/WorkoutForm.tsx` - Banner integration
- `migrations/deload_weeks_table.sql` - Database schema
- `docs/DELOAD_FEATURE.md` - Complete documentation

**Database Changes:**
```sql
CREATE TABLE deload_weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(100), -- 'plateau', 'scheduled', 'manual'
  weight_reduction_percentage INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 9. Double Progression Model Nuances 📈
**Priority:** MEDIUM
**Status:** ✅ COMPLETE
**Impact:** Equipment-specific progression fully implemented

**Completed Features:**
- ✅ Barbell progression calculator (5 lb jumps)
- ✅ Dumbbell progression calculator (conservative, wider ranges)
- ✅ Bodyweight progression calculator (2.5 lb linear)
- ✅ Cable progression calculator (pin-based)
- ✅ ProgressionGuidance component with next workout targets
- ✅ Microplate recommendations
- ✅ Equipment-specific strategy guidance

**Implemented Files:**
- `src/lib/progression/equipmentProgressionRules.ts` - All progression calculators
- `src/components/workout/ProgressionGuidance.tsx` - Indigo-themed UI component
- `src/components/workout/ExerciseCard.tsx` - Integration point
- `docs/EQUIPMENT_PROGRESSION.md` - Complete documentation

**Progression Strategies:**
- **Barbell:** Standard double progression, 5 lb jumps
- **Dumbbell:** Conservative (exceed max reps first), 5-10 lb per hand
- **Bodyweight:** Linear progression, 2.5 lb jumps with microplates
- **Cable:** Pin-based, 5-10 lb increments

**No Database Changes Required** (equipment field already exists in Exercise type)

---

### 10. Workout Scheduling & Frequency Enforcement 📅
**Priority:** MEDIUM
**Status:** ✅ COMPLETE
**Impact:** Recovery and scheduling fully enforced

**Completed Features:**
- ✅ Schedule validation utilities with comprehensive checks
- ✅ Consecutive day detection and blocking
- ✅ Off-schedule workout warnings
- ✅ ScheduleValidator component with red/yellow theming
- ✅ Integration into WorkoutForm
- ✅ Workout frequency and adherence calculations
- ✅ Workout streak tracking

**Implemented Files:**
- `src/lib/utils/scheduleValidation.ts` - All validation logic and calculations
- `src/components/workout/ScheduleValidator.tsx` - Warning/error component
- `src/components/workout/WorkoutForm.tsx` - Integrated validation

**Validation Features:**
- **Consecutive Day Blocking:** Hard stop if training on consecutive days
- **Same Day Blocking:** Prevents multiple workouts same day
- **Off-Schedule Warnings:** Yellow warning if not on scheduled day
- **Next Scheduled Workout:** Shows upcoming workout date
- **Workout Frequency:** Calculates workouts per week (4-week average)
- **Schedule Adherence:** Tracks % adherence to planned schedule
- **Workout Streak:** Counts consecutive weeks with workouts

**No Database Changes Required**

---

## TIER 3: MODERATE FEATURES (Useful Features Missing)

### 11. Progression Validation & Guardrails 🛡️ ✅ **COMPLETE**
**Priority:** MEDIUM
**Status:** ✅ Implemented (2025-11-17) | 🐛 Bug Fixed (2025-11-17)

**Current State:**
- ✅ Comprehensive progression validation system
- ✅ Real-time warnings during workout logging
- ✅ Equipment-specific weight jump thresholds
- ✅ Rep progression limits with override capability
- ✅ Regression detection and recovery recommendations
- ✅ Progression velocity monitoring (monthly rate)
- ✅ Deload recommendations based on plateaus
- ✅ Null safety fixes applied to prevent runtime crashes

**Implemented Features:**
- [x] Implement max progression velocity check (10-15 lbs/month optimal)
- [x] Warn when weight jumps are too large (>10 lbs single workout)
- [x] Validate rep progression (prevent going from 4 reps to 10 reps in one session)
- [x] Check for regression patterns
- [x] Alert when deload may be beneficial
- [x] Add "Override Guardrail" option with confirmation
- [x] Real-time UI integration with color-coded warnings

**Safety Thresholds:**
- Barbell: ≤10 lbs/workout (20 lbs = error)
- Dumbbell: ≤10 lbs/hand (20 lbs = error)
- Bodyweight: ≤5 lbs/workout (10 lbs = error)
- Cable: ≤15 lbs/workout (30 lbs = error)
- Rep progression: ≤3 reps/workout (5+ reps = error)

**Files Created:**
- `src/lib/utils/progressionValidation.ts` (364 lines)
- `src/components/workout/ProgressionWarning.tsx` (170 lines)
- `PROGRESSION_GUARDRAILS.md` (comprehensive documentation)

**Files Modified:**
- `src/components/workout/ExerciseCard.tsx` (integrated validation)

**Bug Fixes (2025-11-17):**
- Fixed null safety in ExerciseCard.tsx:143 - Changed `lastLog?.sets[0]` to `lastLog?.sets?.[0]`
- Added validation to ensure both current and last sets have valid weight/reps before running guardrails
- Prevented runtime crash when accessing undefined sets array
- Fixed schedule validation crash in scheduleValidation.ts (workout_schedule not being an array):
  - Added defensive checks in `isScheduledWorkoutDay()` function
  - Added defensive checks in `getNextScheduledWorkout()` function
  - Added defensive checks in `validateWorkoutSchedule()` function
  - Prevented TypeError: schedule.includes/map/join is not a function
- Created missing `deload_weeks` table in Supabase database
  - Applied migration: 20251118000000_create_deload_weeks.sql
  - Fixed 404 errors when fetching deload data

---

### 12. Indicator Exercises Dashboard 🎯 ✅ **COMPLETE**
**Priority:** MEDIUM
**Status:** ✅ Implemented (2025-11-17)

**Current State:**
- ✅ All 6 indicator exercises defined
- ✅ Dedicated dashboard with filtering
- ✅ Progress tracking to Greek God standards
- ✅ Strength standards display with levels
- ✅ Recent workout history per exercise
- ✅ Status badges (Progressing, Plateau, Greek God, Elite)

**6 Key Indicator Exercises:**
1. Incline Barbell Press (225 lbs target)
2. Standing Barbell Press (155 lbs target)
3. Weighted Chinups (BW + 45 lbs target)
4. Weighted Dips (BW + 45 lbs target)
5. Bulgarian Split Squat (140 lbs target)
6. Romanian Deadlift (275 lbs target)

**Implemented Features:**
- [x] Create Indicator Exercises Dashboard page
- [x] Show progress bars for all 6 indicators
- [x] Display strength standards progress (Beginner/Greek God/Elite)
- [x] Status detection (Progressing, Plateau, Regressing)
- [x] Muscle group filtering (All, Chest, Shoulders, Back, Legs)
- [x] Recent workout history (5 most recent per exercise)
- [x] Progress calculation and next milestone tracking
- [x] Expandable cards with detailed stats

**Files Created:**
- `src/lib/constants/indicatorExercises.ts` (176 lines)
- `src/pages/IndicatorDashboard.tsx` (249 lines)
- `src/components/progress/IndicatorExerciseCard.tsx` (311 lines)

**Files Modified:**
- `src/App.tsx` (added /indicators route)
- `src/components/layout/AppSidebar.tsx` (added Indicators nav item)

---

### 13. Training Method UI Distinctions 🎨 ✅ **COMPLETE**
**Priority:** MEDIUM
**Status:** ✅ Implemented (2025-11-17)

**Current State:**
- ✅ Training methods stored in database
- ✅ Visual distinction with color-coded badges
- ✅ Rest-pause mini-set component created
- ✅ RPT weight reduction guidance displayed
- ✅ Kino training progression guidance shown
- ✅ Training method legend with descriptions

**Implemented Features:**
- [x] Add training method badges to ExerciseCard
- [x] Show RPT weight reduction guidance (10% per set)
- [x] Display rest-pause mini-set structure (1 heavy + 3 mini-sets)
- [x] Add Kino training set progression UI (light → heavy)
- [x] Color-code sets by training method
- [x] Show method-specific instructions
- [x] Add training method legend/help

**Files Created:**
- `src/components/workout/TrainingMethodBadge.tsx` (102 lines)
- `src/components/workout/RestPauseMiniSets.tsx` (138 lines)

**Files Modified:**
- `src/components/workout/ExerciseCard.tsx` (added badges and guidance)
- `src/components/workout/WorkoutForm.tsx` (added training method legend)

**Visual Improvements:**
- RPT: Purple badge with ⬇️ icon and weight reduction guidance
- Kino: Blue badge with ⬆️ icon and weight progression guidance
- Rest-Pause: Orange badge with ⏸️ icon
- Intermediate RPT: Indigo badge with 2-min rest indicator
- Training Method Legend: Collapsible guide showing all methods

---

### 14. Bonus Leg Specialization Routine 🦵
**Priority:** LOW-MEDIUM
**Status:** Not Implemented

**Required Implementation:**
- [ ] Add 12-week leg specialization routine from Bonus Chapter
- [ ] Create leg specialization workout templates
- [ ] Implement heavy deadlift progression protocol
- [ ] Add toggle to activate leg specialization

**Files to Modify:**
- `src/lib/constants/legSpecialization.ts` (NEW)
- `src/components/settings/SpecializationSelector.tsx`

---

### 15. Nutrition Tracking by Day Type 🍎
**Priority:** MEDIUM
**Status:** Calculated but Not Fully Integrated

**Current State:**
- ✅ `training_day_calories` and `rest_day_calories` calculated
- ✅ `carbsTraining` and `carbsRest` in nutrition targets
- ❌ No UI to select day type when logging meals
- ❌ MealPlanBuilder doesn't distinguish day types

**Required Implementation:**
- [ ] Add "Is this a training day?" toggle to nutrition logging
- [ ] Show correct calorie/macro targets based on day type
- [ ] Update MealPlanBuilder to support day type selection
- [ ] Add training day calendar integration
- [ ] Display training vs. rest day targets side-by-side
- [ ] Auto-detect training day from workout log

**Files to Modify:**
- `src/components/nutrition/DayTypeSelector.tsx` (NEW)
- `src/components/nutrition/MealPlanBuilder.tsx`
- `src/pages/NutritionPage.tsx`

---

### 16. Phase Progression Automation 🔄
**Priority:** MEDIUM
**Status:** Partial Logic, No UI

**Current State:**
- ✅ `shouldRotatePhase()` and `getNextPhase()` exist
- ✅ `usePhaseRotation()` hook implemented
- ❌ No automatic notification when phase complete
- ❌ Manual navigation to Settings required

**Required Implementation:**
- [ ] Add phase rotation notification system
- [ ] Create "Phase Complete" banner on dashboard
- [ ] Add "Rotate to Next Phase" quick action button
- [ ] Send email when 8 weeks complete
- [ ] Show countdown to phase rotation
- [ ] Add phase history timeline view

**Files to Modify:**
- `src/components/dashboard/PhaseRotationNotification.tsx` (NEW)
- `src/lib/notifications/phaseNotifications.ts` (NEW)
- `src/pages/DashboardPage.tsx`

---

### 17. Body Measurements Tracking 📏
**Priority:** MEDIUM
**Status:** Partially Implemented

**Current State:**
- ✅ BodyweightLog supports measurements
- ✅ BodyMeasurementsTracker component exists
- ❌ Not prompted to take measurements regularly
- ❌ Limited progress visualization

**Required Implementation:**
- [ ] Add measurement reminder system (every 4 weeks)
- [ ] Create measurement progress charts
- [ ] Add body part measurement guides (where to measure)
- [ ] Implement measurement vs. weight correlation analysis
- [ ] Add measurement goals/targets
- [ ] Create measurement photo overlay (visual guide)

**Files to Modify:**
- `src/components/progress/MeasurementReminder.tsx` (NEW)
- `src/components/progress/MeasurementProgressCharts.tsx` (NEW)
- `src/components/progress/MeasurementGuide.tsx` (NEW)

---

### 18. Progress Photo Management 📸
**Priority:** MEDIUM
**Status:** Partially Implemented

**Current State:**
- ✅ ProgressPhoto type exists
- ✅ ProgressPhotosGallery component exists
- ❌ No structured photo schedule
- ❌ No reminder system

**Required Implementation:**
- [ ] Add photo reminder system (every 4 weeks)
- [ ] Create photo comparison view (side-by-side)
- [ ] Implement photo timeline
- [ ] Add photo angle guide (front, side, back)
- [ ] Create before/after transformation view
- [ ] Add photo tags (phase, body weight, date)

**Files to Modify:**
- `src/components/progress/PhotoReminder.tsx` (NEW)
- `src/components/progress/PhotoComparison.tsx` (NEW)
- `src/components/progress/ProgressPhotosGallery.tsx`

---

## TIER 4: NICE-TO-HAVE FEATURES (Completion & Polish)

### 19. Exercise Alternatives & Variations 🔀
**Priority:** LOW-MEDIUM
**Status:** Data Structure Only

**Required Implementation:**
- [ ] Make variations accessible in UI
- [ ] Add "Switch Exercise" button
- [ ] Show alternative exercises when plateau detected
- [ ] Create exercise substitution guide

**Files to Modify:**
- `src/components/workout/ExerciseAlternatives.tsx` (NEW)

---

### 20. RPE (Rate of Perceived Exertion) Tracking 💯
**Priority:** LOW-MEDIUM
**Status:** Not Implemented

**Required Implementation:**
- [ ] Add RPE input to SetInput component
- [ ] Show RPE scale guidance (1-10, leave 1 rep in tank = RPE 9)
- [ ] Track RPE trends over time
- [ ] Correlate RPE with progression success
- [ ] Warn when RPE consistently too high (overtraining) or too low

**Files to Modify:**
- `src/components/workout/SetInput.tsx`
- `src/components/workout/RPESelector.tsx` (NEW)
- `src/components/progress/RPEAnalytics.tsx` (NEW)

---

### 21. Contextual Workout Notes 📝
**Priority:** LOW
**Status:** Partially Implemented

**Required Implementation:**
- [ ] Add structured note prompts (sleep quality, stress level, nutrition)
- [ ] Create quick-select context tags
- [ ] Analyze notes correlation with performance
- [ ] Show context insights on progress page

**Files to Modify:**
- `src/components/workout/ContextualNotes.tsx` (NEW)
- `src/components/workout/WorkoutSession.tsx`

---

### 22. Body Fat Percentage Tracking 📊
**Priority:** LOW
**Status:** Not Implemented

**Required Implementation:**
- [ ] Add body_fat_percentage field to UserProfile
- [ ] Create body fat logging UI
- [ ] Calculate lean body mass
- [ ] Show relative strength metrics (strength per lb of lean mass)
- [ ] Track body composition changes over time

**Files to Modify:**
- `src/components/profile/BodyFatTracker.tsx` (NEW)
- `supabase/migrations/YYYYMMDDHHMMSS_add_body_fat_tracking.sql` (NEW)

**Database Changes:**
```sql
ALTER TABLE bodyweight_logs
ADD COLUMN body_fat_percentage DECIMAL(4,2);
```

---

### 23. Interactive Program Education 📚
**Priority:** LOW
**Status:** Partially Implemented

**Required Implementation:**
- [ ] Add interactive tutorials for first-time users
- [ ] Create step-by-step workout walkthroughs
- [ ] Implement context-sensitive help tooltips
- [ ] Add video demonstrations
- [ ] Create "Why This Works" educational popups

**Files to Modify:**
- `src/components/education/InteractiveTutorial.tsx` (NEW)
- `src/components/education/ContextHelp.tsx` (NEW)

---

### 24. Strength Standards UI & Benchmarking 🏆
**Priority:** LOW
**Status:** Data Only

**Required Implementation:**
- [ ] Create strength standards page
- [ ] Show user progress towards standards (Good, Great, Godlike)
- [ ] Add benchmark visualization
- [ ] Display percentile rankings
- [ ] Set strength goals based on standards

**Files to Modify:**
- `src/pages/StrengthStandardsPage.tsx` (NEW)
- `src/components/progress/BenchmarkProgress.tsx` (NEW)

---

### 25. Form Cue Content Library 📖
**Priority:** LOW
**Status:** Setting Only

**Required Implementation:**
- [ ] Write complete form cue content for all exercises
- [ ] Add safety warnings
- [ ] Create common mistake callouts
- [ ] Add mobility prerequisite notes

**Files to Modify:**
- Exercise database seed data
- `src/lib/constants/formCues.ts` (NEW)

---

## Implementation Roadmap

### Sprint 1: Core Workout Experience (Weeks 1-2)
**Goal:** Make workouts functional and safe
- [ ] Feature 1: Rest Timer Functionality
- [ ] Feature 2: Warmup Set Tracking
- [ ] Feature 3: Set-by-Set Rest Timers

### Sprint 2: Complete Exercise Database (Week 3)
**Goal:** Enable full program progression
- [ ] Feature 4: Phase 2 & 3 Complete Exercises
- [ ] Feature 12: Indicator Exercise Dashboard

### Sprint 3: Advanced Programs (Weeks 4-5)
**Goal:** Add MEGA and Specialization options
- [ ] Feature 5: MEGA Training Program
- [ ] Feature 6: Specialization Routines

### Sprint 4: Safety & Guidance (Week 6)
**Goal:** Improve user education and safety
- [ ] Feature 7: Form Cues & Videos
- [ ] Feature 9: Double Progression Nuances
- [ ] Feature 11: Progression Guardrails

### Sprint 5: Recovery & Scheduling (Week 7)
**Goal:** Optimize recovery and adherence
- [ ] Feature 8: Deload Implementation
- [ ] Feature 10: Workout Scheduling
- [ ] Feature 16: Phase Progression Automation

### Sprint 6: Tracking Enhancements (Week 8)
**Goal:** Better data capture and analysis
- [ ] Feature 13: Training Method UI
- [ ] Feature 15: Nutrition Day Type
- [ ] Feature 20: RPE Tracking

### Sprint 7: Progress Monitoring (Week 9)
**Goal:** Enhanced progress tracking
- [ ] Feature 17: Body Measurements
- [ ] Feature 18: Progress Photos
- [ ] Feature 22: Body Fat Tracking

### Sprint 8: Polish & Completion (Week 10)
**Goal:** Final features and refinements
- [ ] Feature 14: Leg Specialization
- [ ] Feature 19: Exercise Alternatives
- [ ] Feature 21: Contextual Notes
- [ ] Feature 23: Interactive Education
- [ ] Feature 24: Strength Standards UI
- [ ] Feature 25: Form Cue Content

---

## Success Metrics

### Critical Feature Completion
- [ ] Users can complete full workouts with proper rest timing
- [ ] Users can safely progress through all 3 phases
- [ ] Users can access MEGA training after 6 months
- [ ] Users can select specialization routines

### User Experience
- [ ] Average workout completion time reduced by proper rest timing
- [ ] Injury rate minimized through warmup tracking and form cues
- [ ] User retention improved through complete program access
- [ ] Progression adherence improved through guardrails

### Data Quality
- [ ] 90%+ of sets have rest time tracked
- [ ] 80%+ of workouts include warmup sets (first exercise)
- [ ] RPE data available for analysis
- [ ] Body measurements logged monthly

---

## Notes

**Priority Definitions:**
- **CRITICAL:** Program cannot function properly without this
- **HIGH:** Significant limitations to user experience
- **MEDIUM:** Useful features that improve usability
- **LOW:** Nice-to-have polish and enhancements

**Implementation Philosophy:**
- Build features in order of user impact
- Prioritize safety (warmups, form cues, guardrails)
- Enable complete program progression (phases, MEGA, specialization)
- Enhance tracking quality (timers, RPE, context)
- Add polish and education last

**Database Migration Strategy:**
- All schema changes require new migration files
- Test migrations on development branch first
- Backup production data before applying migrations
- Document all breaking changes

---

**Document Maintained By:** Development Team
**Review Frequency:** Weekly during active development
**Last Feature Audit:** 2025-11-17
