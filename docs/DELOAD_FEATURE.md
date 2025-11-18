# Deload Week Feature Documentation

## Overview
The Deload Week feature provides automated recovery week management with intelligent weight reduction to prevent overtraining and promote long-term progress.

## Features Implemented

### 1. Deload Tracking Hook (`useDeload`)
**Location:** `src/lib/hooks/useDeload.ts`

Provides complete deload state management:
- Fetch current active deload week
- Start new deload week (plateau, scheduled, or manual)
- End deload week early
- Check if currently in deload
- Get reduction percentage

**Usage:**
```typescript
const {
  currentDeload,
  loading,
  error,
  isDeloadActive,
  reductionPercentage,
  startDeload,
  endDeload,
  refetch,
} = useDeload();
```

### 2. Deload Utilities (`deloadUtils`)
**Location:** `src/lib/utils/deloadUtils.ts`

Core deload calculation functions:

#### `calculateDeloadRecommendation()`
Determines if deload is needed based on:
- 8+ weeks: Automatic deload recommended
- 6+ weeks: Deload suggested
- 3+ plateaus: Plateau-based deload

Returns:
```typescript
{
  shouldDeload: boolean,
  reason: string,
  weeksSinceLastDeload: number,
  recommendedReduction: number (10-15%)
}
```

#### `calculateDeloadWeight()`
Reduces weight by percentage and rounds to nearest 5 lbs:
```typescript
calculateDeloadWeight(200, 10) // Returns 180
calculateDeloadWeight(155, 10) // Returns 140 (rounded)
```

#### `isInDeloadWeek()`
Checks if a date falls within deload period.

#### `calculateDeloadWeekDates()`
Generates 7-day deload period from start date.

### 3. DeloadWeekBanner Component
**Location:** `src/components/workout/DeloadWeekBanner.tsx`

Purple-themed banner displayed during deload weeks:

**Features:**
- Quick tips (Same Volume, Lighter Load, Perfect Form)
- Collapsible detailed protocol and benefits
- Example weight calculations
- End deload button

**Props:**
```typescript
{
  isDeloadWeek: boolean,
  reductionPercentage?: number,
  onEndDeload?: () => void
}
```

### 4. Deload Management Component
**Location:** `src/components/settings/DeloadManagement.tsx`

Complete deload control panel:

**Features:**
- Current deload status display
- Deload recommendations based on training history
- Start deload (scheduled, plateau, manual)
- End deload early
- Training stats (weeks since deload, recent plateaus)
- Educational information

**Props:**
```typescript
{
  weeksSinceLastDeload?: number,
  recentPlateaus?: number
}
```

### 5. ExerciseCard Integration
**Location:** `src/components/workout/ExerciseCard.tsx`

**New Props:**
```typescript
{
  isDeloadWeek?: boolean,
  deloadReductionPercentage?: number
}
```

**Behavior:**
- Automatically adjusts expected performance weights during deload
- Uses `adjustedExpectedPerformance` for progression tracking
- Displays reduced weight targets to user

### 6. WorkoutForm Integration
**Location:** `src/components/workout/WorkoutForm.tsx`

**Integrated Features:**
- Uses `useDeload()` hook to detect active deload
- Displays DeloadWeekBanner when active
- Passes deload props to all ExerciseCards
- Handles deload end confirmation

## Database Schema

### Table: `deload_weeks`

```sql
CREATE TABLE deload_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('plateau', 'scheduled', 'manual')),
  weight_reduction_percentage INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);
```

**Indexes:**
- `idx_deload_weeks_user_id`
- `idx_deload_weeks_dates`

**RLS Policies:**
- SELECT: Users can view their own deload weeks
- INSERT: Users can create their own deload weeks
- UPDATE: Users can update their own deload weeks
- DELETE: Users can delete their own deload weeks

## Deload Protocol

### When to Deload
1. **Scheduled (6-8 weeks):** Automatic recommendation after 6+ weeks of training
2. **Plateau-based:** After 3+ consecutive plateaus on key exercises
3. **Manual:** User feels overtrained or fatigued

### Deload Guidelines
- **Duration:** 7 days (1 week)
- **Weight Reduction:** 10-15% (default 10%)
- **Volume:** Keep same sets and reps
- **Focus:** Perfect form, technique refinement, recovery

### Benefits
1. CNS recovery and fatigue dissipation
2. Joint and connective tissue healing
3. Mental refresh and motivation boost
4. Often leads to strength gains post-deload
5. Prevents overtraining and burnout

## User Workflow

### Starting a Deload Week

1. **Via Settings/Dashboard:**
   - Navigate to Deload Management
   - Review recommendation
   - Click "Start Recommended Deload" or "Start Manual Deload"
   - Confirmation alert shown

2. **Automatic Detection:**
   - System calculates recommendation based on training history
   - User notified when 6-8 weeks elapsed

### During Deload Week

1. **Workout View:**
   - Purple DeloadWeekBanner displayed at top
   - Shows reduction percentage and quick tips
   - Can expand for full protocol and benefits

2. **Exercise Tracking:**
   - All exercise weights automatically reduced by percentage
   - Expected performance adjusted in ProgressionIndicator
   - Progression tracking uses deload-adjusted targets

3. **Ending Early:**
   - Click "End Deload Week" in banner
   - Confirmation alert
   - Returns to normal training immediately

## Technical Implementation Details

### Weight Reduction Logic
```typescript
// Round to nearest 5 lbs for practical weight selection
const reduction = currentWeight * (reductionPercentage / 100);
const deloadWeight = currentWeight - reduction;
return Math.round(deloadWeight / 5) * 5;
```

### Deload Detection
```typescript
// Check if current date falls within deload period
const today = new Date();
const start = new Date(deload.start_date);
const end = new Date(deload.end_date);
return today >= start && today <= end;
```

### Expected Performance Adjustment
```typescript
// Apply deload reduction to expected performance
const adjustedExpectedPerformance = isDeloadWeek && expectedPerformance
  ? {
      ...expectedPerformance,
      weight: calculateDeloadWeight(
        expectedPerformance.weight,
        reductionPercentage
      ),
    }
  : expectedPerformance;
```

## Migration Instructions

### Apply Database Migration
```bash
# Run the migration SQL file in Supabase SQL Editor
# File: migrations/deload_weeks_table.sql
```

### Testing Checklist
- [ ] Create manual deload week
- [ ] Verify banner displays in WorkoutForm
- [ ] Confirm weights reduced by correct percentage
- [ ] Test ending deload early
- [ ] Check scheduled deload recommendation (6+ weeks)
- [ ] Verify plateau-based recommendation (3+ plateaus)
- [ ] Test RLS policies (can only access own deloads)
- [ ] Verify no deload overlap (one active deload at a time)

## Future Enhancements
1. Deload history tracking and analytics
2. Custom deload duration (beyond 7 days)
3. Per-exercise deload percentages
4. Deload reminder notifications
5. Post-deload performance comparison
6. Integration with Progress page for deload markers on charts

## Related Files
- `src/lib/hooks/useDeload.ts`
- `src/lib/utils/deloadUtils.ts`
- `src/components/workout/DeloadWeekBanner.tsx`
- `src/components/settings/DeloadManagement.tsx`
- `src/components/workout/ExerciseCard.tsx`
- `src/components/workout/WorkoutForm.tsx`
- `src/types/index.ts` (DeloadWeek, DeloadRecommendation)
- `migrations/deload_weeks_table.sql`
