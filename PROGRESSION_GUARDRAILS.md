# Progression Guardrails & Safety Validation

## Overview

The Progression Guardrails system protects users from unsafe training progressions that can lead to injury, burnout, or form breakdown. The system validates weight increases, rep jumps, and progression velocity in real-time during workout logging.

## Key Features

### 1. **Weight Jump Validation**
Prevents excessive weight increases that greatly increase injury risk.

#### Safety Thresholds by Equipment:
- **Barbell**: ≤10 lbs per workout (20 lbs = hard error)
- **Dumbbell**: ≤10 lbs per hand (20 lbs = hard error)
- **Bodyweight**: ≤5 lbs per workout (10 lbs = hard error)
- **Cable**: ≤15 lbs per workout (30 lbs = hard error)

#### Validation Levels:
- **Error (Red)**: Jump >2x safe threshold - Cannot proceed without adjusting
- **Warning (Yellow)**: Jump >1x safe threshold - Can override with acknowledgment
- **Safe (Green)**: Jump within recommended limits

**Example:**
```
Last workout: Incline Barbell Press - 185 lbs × 5 reps
Current: 205 lbs × 5 reps (+20 lbs)

❌ Error: Weight jump of 20 lbs is too large! This greatly increases injury risk.
💡 For barbell exercises, keep jumps under 10 lbs. Current jump: 20 lbs.
```

### 2. **Rep Jump Validation**
Prevents excessive rep increases that suggest poor form or data errors.

#### Safety Guidelines:
- **Typical progression**: 1-2 reps per workout
- **Maximum safe**: 3 reps per workout
- **Hard stop**: 5+ reps (likely data error)

#### Validation Levels:
- **Error (Red)**: +5 reps or more - Cannot proceed
- **Warning (Yellow)**: +3-4 reps - Can override
- **Safe (Green)**: +1-2 reps

**Example:**
```
Last workout: Dips - 0 lbs × 8 reps
Current: 0 lbs × 14 reps (+6 reps)

❌ Error: Rep increase of 6 is excessive! This suggests poor form or data error.
💡 Typical progression is 1-2 reps per workout. Verify your numbers.
```

### 3. **Regression Detection**
Identifies performance drops that indicate inadequate recovery.

#### Regression Patterns:
- **Both weight AND reps decreased**: Recovery warning
- **Volume drop >20%**: Overtraining indicator
- **Frequent regressions**: Deload recommendation

#### Validation Levels:
- **Warning (Yellow)**: Single regression - Check recovery
- **Warning (Yellow)**: Volume drop >20% - Nutrition/sleep check
- **Info (Blue)**: Minor volume changes

**Example:**
```
Last workout: Squat - 225 lbs × 5 reps
Current: 205 lbs × 4 reps (-20 lbs, -1 rep)

⚠️ Warning: Both weight and reps decreased. This may indicate inadequate recovery.
💡 Consider: 1) Getting more sleep, 2) Eating more, 3) Taking a deload week if this continues.
```

### 4. **Progression Velocity Monitoring**
Tracks monthly progression rate to prevent unsustainable gains.

#### Healthy Monthly Ranges:
- **Barbell**: 10-15 lbs/month (25+ lbs = unsustainable)
- **Dumbbell**: 5-10 lbs/month (20+ lbs = unsustainable)
- **Bodyweight**: 2.5-7.5 lbs/month (15+ lbs = unsustainable)
- **Cable**: 10-20 lbs/month (30+ lbs = unsustainable)

#### Validation Levels:
- **Warning (Yellow)**: Gain exceeds healthy maximum - Burnout risk
- **Info (Blue)**: Gain above average but sustainable
- **Safe (Green)**: Gain within optimal range

**Example:**
```
4 weeks ago: Bench Press - 185 lbs
Current: 210 lbs (+25 lbs in 4 weeks)

⚠️ Warning: You have gained 25 lbs in 4 weeks - this pace is unsustainable.
💡 For barbell, optimal monthly gain is 10-15 lbs. Slow down to prevent burnout.
```

### 5. **Deload Recommendations**
Suggests planned recovery based on plateau patterns.

#### Deload Triggers:
- **3+ consecutive plateaus** + **4+ weeks since last deload**
- **8+ weeks of continuous training** (proactive recommendation)

#### Validation Levels:
- **Warning (Yellow)**: Deload needed - 3+ plateaus detected
- **Info (Blue)**: Deload suggested - 8+ weeks training

**Example:**
```
⚠️ Warning: 3 consecutive plateaus detected. A deload week is recommended.
💡 Take a deload week (reduce weights 10-15%) to allow full recovery. You will often break through plateaus after deloading.
```

## Implementation

### File Structure

```
src/
├── lib/
│   └── utils/
│       └── progressionValidation.ts    # Core validation logic
├── components/
│   └── workout/
│       ├── ProgressionWarning.tsx      # Warning display components
│       └── ExerciseCard.tsx            # Integrated validation
```

### Core Functions

#### `checkProgressionGuardrails()`
Master function that runs all validations:

```typescript
export const checkProgressionGuardrails = (
  currentSet: SetLog,
  lastSet: SetLog | undefined,
  exercise: Exercise,
  recentPlateaus: number = 0,
  weeksSinceLastDeload: number = 0,
  weightFourWeeksAgo?: number
): GuardrailCheck => {
  const warnings: ProgressionWarning[] = [];

  // Run all validations
  const weightWarning = validateWeightJump(currentSet.weight, lastSet.weight, exercise.equipment);
  const repWarning = validateRepJump(currentSet.reps, lastSet.reps);
  const regressionWarning = validateRegression(currentSet.weight, currentSet.reps, lastSet.weight, lastSet.reps);
  const velocityWarning = validateProgressionVelocity(currentWeight, weightFourWeeksAgo, equipment);
  const deloadWarning = checkDeloadNeeded(recentPlateaus, weeksSinceLastDeload);

  // Determine overall severity and whether user can proceed
  return { canProceed, warnings, overallSeverity };
};
```

#### Individual Validators

```typescript
// Weight validation
export const validateWeightJump = (
  currentWeight: number,
  lastWeight: number,
  equipment: Exercise['equipment']
): ProgressionWarning | null

// Rep validation
export const validateRepJump = (
  currentReps: number,
  lastReps: number
): ProgressionWarning | null

// Regression detection
export const validateRegression = (
  currentWeight: number,
  currentReps: number,
  lastWeight: number,
  lastReps: number
): ProgressionWarning | null

// Velocity monitoring
export const validateProgressionVelocity = (
  currentWeight: number,
  weightFourWeeksAgo: number,
  equipment: Exercise['equipment']
): ProgressionWarning | null

// Deload check
export const checkDeloadNeeded = (
  recentPlateaus: number,
  weeksSinceLastDeload: number
): ProgressionWarning | null
```

### UI Components

#### ProgressionWarning Component
Full-featured warning display with override capability:

```typescript
<ProgressionWarning
  guardrailCheck={check}
  onOverride={() => handleOverride()}
  onCancel={() => handleCancel()}
/>
```

Features:
- Color-coded severity (red/yellow/blue)
- Detailed warning messages and recommendations
- Two-step override process for safety
- Hard errors block progression without adjustment

#### InlineProgressionWarning Component
Compact inline display for individual warnings:

```typescript
<InlineProgressionWarning warning={warning} />
```

Features:
- Minimal space footprint
- Icon-based severity indication
- Inline recommendations
- Dark mode support

## User Experience

### Real-Time Validation Flow

1. **User enters first set weight and reps**
2. **System compares to last workout**
3. **Validation runs automatically**
4. **Warnings display if thresholds exceeded**
5. **User reviews feedback and adjusts if needed**

### Warning Severity Levels

#### 🛑 Error (Red)
- Cannot proceed without adjusting numbers
- Indicates high injury risk or data error
- Examples: >20 lb barbell jump, >5 rep increase

#### ⚠️ Warning (Yellow)
- Can proceed with two-step acknowledgment
- Indicates elevated risk or suboptimal progression
- Examples: >10 lb barbell jump, volume regression

#### ℹ️ Info (Blue)
- Informational only, no blocking
- Provides context on progression rate
- Examples: Above-average monthly gains

### Override Process (Warnings Only)

1. User sees warning with override option
2. Click "I Understand the Risks" button
3. Button changes to "✓ Proceed Anyway"
4. Confirm to continue with progression

**Errors cannot be overridden** - numbers must be adjusted.

## Integration Points

### ExerciseCard.tsx

Guardrails run automatically when first set is completed:

```typescript
const handleSetUpdate = (setNumber: number, weight: number, reps: number) => {
  // ... set update logic ...

  // Run progression guardrails on the first set
  if (setNumber === 1 && isNowCompleted && lastLog?.sets[0]) {
    const check = checkProgressionGuardrails(
      currentSet,
      lastSet,
      exercise,
      recentPlateaus,
      weeksSinceLastDeload,
      weightFourWeeksAgo
    );
    setGuardrailCheck(check);
  }
};
```

Display warnings below progression guidance:

```tsx
{/* Progression Guardrails */}
{guardrailCheck && guardrailCheck.warnings.length > 0 && (
  <div className="space-y-2">
    {guardrailCheck.warnings.map((warning, index) => (
      <InlineProgressionWarning key={index} warning={warning} />
    ))}
  </div>
)}
```

## Benefits

### Injury Prevention
- Prevents weight jumps that exceed safe biomechanical limits
- Reduces risk of muscle strains, joint injuries, and form breakdown
- Educates users on proper progression rates

### Form Quality
- Excessive rep jumps often indicate compensatory movement patterns
- Guardrails encourage maintaining strict form throughout progression
- Validates that strength gains are genuine, not technique degradation

### Recovery Optimization
- Regression detection identifies when body needs more rest
- Deload recommendations prevent accumulated fatigue
- Helps users understand relationship between recovery and performance

### Sustainable Progress
- Velocity monitoring prevents burnout from overly aggressive progression
- Encourages consistent, steady gains over quick spikes
- Builds long-term training habits that minimize injury risk

## Future Enhancements

### Planned Features
1. **Historical plateau tracking** - Calculate exact plateau count from workout history
2. **Deload integration** - Fetch actual deload dates from database
3. **4-week velocity** - Track exact weight progression over time
4. **Per-exercise calibration** - Adjust thresholds based on exercise difficulty
5. **User override tracking** - Monitor patterns of warning overrides
6. **Injury risk score** - Cumulative risk assessment across all exercises

### Potential Expansions
- **Volume progression limits** - Total weekly/monthly volume caps
- **Frequency guardrails** - Prevent training same muscles too frequently
- **Form check reminders** - Suggest video recording on large progressions
- **Personalized thresholds** - Adjust limits based on training age and history
- **Coach review flags** - Alert coaches when users override errors

## Technical Details

### Type Definitions

```typescript
export interface ProgressionWarning {
  severity: 'error' | 'warning' | 'info';
  type: 'weight_jump' | 'rep_jump' | 'regression' | 'velocity' | 'deload_needed';
  message: string;
  recommendation: string;
  canOverride: boolean;
}

export interface GuardrailCheck {
  canProceed: boolean;
  warnings: ProgressionWarning[];
  overallSeverity: 'safe' | 'caution' | 'danger';
}
```

### Color Schemes

```typescript
export const getSeverityColor = (severity: ProgressionWarning['severity']) => {
  switch (severity) {
    case 'error':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-400 dark:border-red-700',
        text: 'text-red-800 dark:text-red-200',
        icon: '🛑',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-400 dark:border-yellow-700',
        text: 'text-yellow-800 dark:text-yellow-200',
        icon: '⚠️',
      };
    case 'info':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-400 dark:border-blue-700',
        text: 'text-blue-800 dark:text-blue-200',
        icon: 'ℹ️',
      };
  }
};
```

## Testing Scenarios

### Test Case 1: Extreme Weight Jump
```
Input: Last workout = 135 lbs, Current = 165 lbs (+30 lbs)
Expected: Red error - Cannot proceed
```

### Test Case 2: Moderate Weight Jump
```
Input: Last workout = 185 lbs, Current = 200 lbs (+15 lbs)
Expected: Yellow warning - Can override
```

### Test Case 3: Safe Progression
```
Input: Last workout = 185 lbs × 6 reps, Current = 190 lbs × 5 reps
Expected: No warnings - Safe progression
```

### Test Case 4: Rep Jump Error
```
Input: Last workout = 100 lbs × 6 reps, Current = 100 lbs × 12 reps
Expected: Red error - Excessive rep increase
```

### Test Case 5: Volume Regression
```
Input: Last workout = 225 lbs × 8 reps (1800 volume)
       Current = 205 lbs × 6 reps (1230 volume, -32% drop)
Expected: Yellow warning - Recovery check recommended
```

## Related Documentation

- [Equipment Progression Rules](./EQUIPMENT_PROGRESSION.md) - Equipment-specific progression strategies
- [Deload Protocol](./DELOAD_PROTOCOL.md) - Deload week implementation
- [Workout Scheduling](./SCHEDULE_VALIDATION.md) - Schedule adherence and recovery timing

## Version History

- **v1.0.0** (2025-11-17): Initial implementation
  - Weight jump validation
  - Rep jump validation
  - Regression detection
  - Progression velocity monitoring
  - Deload recommendations
  - Real-time UI integration
