# Equipment-Specific Progression Feature Documentation

## Overview
The Equipment-Specific Progression system provides tailored progression strategies for different equipment types, ensuring optimal progression regardless of whether you're using barbells, dumbbells, bodyweight, or cables.

## Features Implemented

### 1. Equipment-Specific Progression Calculators
**Location:** `src/lib/progression/equipmentProgressionRules.ts`

Provides progression logic for each equipment type:

#### Barbell Progression
- **Strategy:** Standard double progression
- **Increment:** 5 lbs
- **Logic:** Increase reps until top of range → Add 5 lbs and drop to minimum reps
- **Example:** 135x8 → 140x5 → 140x6 → 140x7 → 140x8 → 145x5

```typescript
calculateBarbellProgression(exercise, lastSet)
```

#### Dumbbell Progression
- **Strategy:** Conservative progression with wider rep ranges
- **Increment:** 5-10 lbs per hand (10-20 lbs total)
- **Logic:** Exceed max reps before adding weight to account for larger jumps
- **Example:** 40s x 8 → 40s x 9 → 45s x 6 → 45s x 7 → 45s x 8

```typescript
calculateDumbbellProgression(exercise, lastSet)
```

#### Bodyweight (Closed-Chain) Progression
- **Strategy:** Linear progression with microplates
- **Increment:** 2.5 lbs (total)
- **Logic:** Add 2.5 lbs every workout when hit target reps
- **Microplates:** Recommended (1.25 lb plates)
- **Example:** BW → BW+2.5 → BW+5 → BW+7.5 → BW+10

```typescript
calculateBodyweightProgression(exercise, lastSet)
```

#### Cable Progression
- **Strategy:** Pin-based progression
- **Increment:** 5-10 lbs (machine dependent)
- **Logic:** Move to next pin setting when hit max reps
- **Note:** Some machines use fractional plates

```typescript
calculateCableProgression(exercise, lastSet)
```

### 2. ProgressionGuidance Component
**Location:** `src/components/workout/ProgressionGuidance.tsx`

Indigo-themed collapsible component that displays:

**Key Features:**
- Next workout target (weight and reps)
- Visual indicators for progression type (weight ↑ or reps ↑)
- Equipment-specific progression strategy
- Equipment information (type and increment)
- Microplate recommendation when applicable

**Props:**
```typescript
{
  exercise: Exercise,
  lastSet?: SetLog
}
```

**Display Sections:**
1. **Next Workout Target**
   - Calculated weight and rep targets
   - Visual indicators for increases
   - Strategy message

2. **Progression Strategy**
   - 4-5 bullet points specific to equipment type
   - Examples of progression sequences
   - Best practices

3. **Equipment Info**
   - Equipment type (capitalized)
   - Increment amount
   - Per-hand notation for dumbbells

4. **Microplate Recommendation** (when applicable)
   - Yellow-themed alert box
   - Specific guidance for bodyweight or small dumbbell jumps

### 3. Master Progression Calculator
**Location:** `src/lib/progression/equipmentProgressionRules.ts`

Routes to appropriate calculator based on equipment:

```typescript
export const calculateProgression = (
  exercise: Exercise,
  lastSet: SetLog
): ProgressionResult
```

**Returns:**
```typescript
{
  nextWeight: number,
  nextReps: number,
  progressionType: 'weight' | 'reps' | 'maintain',
  message: string,
  microplatesRecommended?: boolean
}
```

### 4. Integration with ExerciseCard
**Location:** `src/components/workout/ExerciseCard.tsx`

Positioned after ProgressionIndicator and before warmup sets:

```typescript
<ProgressionGuidance
  exercise={exercise}
  lastSet={lastLog?.sets[0]}
/>
```

## Progression Logic Details

### Double Progression Model

**Phase 1: Rep Progression**
- Keep weight constant
- Increase reps each workout
- Work from min to max of rep range

**Phase 2: Weight Progression**
- Hit top of rep range
- Add equipment-specific increment
- Drop back to minimum reps
- Repeat cycle

### Equipment-Specific Nuances

#### Barbell (5 lb jumps)
```
Week 1: 135 x 5 reps
Week 2: 135 x 6 reps
Week 3: 135 x 7 reps
Week 4: 135 x 8 reps ← Hit max
Week 5: 140 x 5 reps ← Add 5 lbs
Week 6: 140 x 6 reps
...continue cycle
```

#### Dumbbell (Conservative)
```
Week 1: 40s x 6 reps
Week 2: 40s x 7 reps
Week 3: 40s x 8 reps ← At max
Week 4: 40s x 9 reps ← Exceed max
Week 5: 45s x 6 reps ← Add 5 lbs per hand
Week 6: 45s x 7 reps
...continue cycle
```

#### Bodyweight (Linear)
```
Week 1: BW + 0 x 8 reps ← Hit max
Week 2: BW + 2.5 x 6 reps
Week 3: BW + 2.5 x 7 reps
Week 4: BW + 2.5 x 8 reps ← Hit max
Week 5: BW + 5 x 6 reps
Week 6: BW + 5 x 7 reps
...continue cycle
```

### Microplate Recommendations

**When Recommended:**
- Bodyweight exercises (chinups, dips)
- Dumbbells with ≤5 lb increment
- Any exercise where smaller jumps benefit progression

**Benefits:**
- Smoother progression curve
- Less strength drop when adding weight
- Better for intermediate/advanced lifters
- Reduces injury risk from large jumps

**Equipment Needed:**
- 1.25 lb plates (pair = 2.5 lbs total)
- 2.5 lb plates for bodyweight
- Fractional plates for precise loading

## User Workflow

### Viewing Progression Guidance

1. **Open Exercise Card:**
   - Click to expand any exercise
   - Located after expected performance

2. **View Guidance:**
   - Click indigo "Progression" button
   - Shows equipment icon and type

3. **Next Workout Target:**
   - See calculated weight and reps
   - Visual indicators show what increases

4. **Strategy:**
   - Equipment-specific tips
   - Example progression sequences

5. **Equipment Details:**
   - Equipment type and increment
   - Microplate recommendation if applicable

### Using Progression Targets

1. **Check Target Before Workout:**
   - Expand progression guidance
   - Note next weight and rep target

2. **Execute Workout:**
   - Aim for recommended target
   - Use equipment-appropriate increment

3. **Record Actual Performance:**
   - Log sets as completed
   - Next workout will calculate new target

## Technical Implementation

### Progression Result Interface

```typescript
interface ProgressionResult {
  nextWeight: number;        // Calculated target weight
  nextReps: number;          // Calculated target reps
  progressionType: 'weight' | 'reps' | 'maintain';
  message: string;           // User-friendly guidance
  microplatesRecommended?: boolean;
}
```

### Equipment Type Handling

Exercise type already has equipment field:
```typescript
interface Exercise {
  equipment: 'barbell' | 'dumbbell' | 'bodyweight' | 'cable';
  weight_increment: number;  // Equipment-specific increment
  // ...other fields
}
```

### Calculator Selection Logic

```typescript
export const calculateProgression = (exercise, lastSet) => {
  switch (exercise.equipment) {
    case 'barbell':
      return calculateBarbellProgression(exercise, lastSet);
    case 'dumbbell':
      return calculateDumbbellProgression(exercise, lastSet);
    case 'bodyweight':
      return calculateBodyweightProgression(exercise, lastSet);
    case 'cable':
      return calculateCableProgression(exercise, lastSet);
    default:
      return calculateBarbellProgression(exercise, lastSet);
  }
};
```

## UI/UX Design

### Color Scheme
- **Primary:** Indigo (matches progression theme)
- **Accent:** Green (weight increases), Blue (rep increases)
- **Warning:** Yellow (microplate recommendations)

### Collapsible Design
- Starts collapsed to avoid overwhelming user
- Expandable on-demand for those who want details
- Indigo button with equipment emoji

### Responsive Layout
- Mobile-friendly grid for equipment info
- Clear hierarchy of information
- Accessible icons and color coding

## Examples by Exercise Type

### Incline Barbell Press (Barbell)
```
Equipment: Barbell
Increment: 5 lbs
Strategy:
• Add 5 lbs when you hit the top of your rep range
• Drop back to the minimum reps with new weight
• Work your way back up through the rep range
• Example: 135x8 → 140x5 → 140x6 → 140x7 → 140x8 → 145x5
```

### Incline Dumbbell Press (Dumbbell)
```
Equipment: Dumbbell
Increment: 5 lbs per hand
Strategy:
• Try to exceed max reps before adding weight
• Dumbbell jumps are larger (5-10 lbs per hand)
• Use wider rep ranges to account for larger jumps
• Example: 40s x 8 → 40s x 9 → 45s x 6 → 45s x 7 → 45s x 8
Microplates Recommended: Consider 2.5 lb dumbbells for smaller jumps
```

### Weighted Chinups (Bodyweight)
```
Equipment: Bodyweight
Increment: 2.5 lbs
Strategy:
• Add 2.5 lbs every workout you hit target reps
• Microplates (1.25 lb) recommended for smaller jumps
• Linear progression works best for closed-chain exercises
• Example: BW → BW+2.5 → BW+5 → BW+7.5 → BW+10
Microplates Recommended: Use 1.25 lb plates (2.5 lbs total) for gradual bodyweight progression
```

### Cable Rows (Cable)
```
Equipment: Cable
Increment: 10 lbs
Strategy:
• Increase to next pin setting when hit max reps
• Cable increments vary by machine (5-10 lbs typical)
• Some machines use fractional plates for smaller jumps
• Focus on control and full range of motion
```

## Future Enhancements

1. **Progression History Tracking**
   - Chart showing weight/rep progression over time
   - Identify sticking points in progression
   - Compare progression rates across equipment types

2. **Auto-Suggested Microplate Purchase**
   - Based on exercises in program
   - Calculate ROI for microplate investment

3. **Equipment-Specific Plateaus**
   - Different plateau detection for each equipment
   - Dumbbell plateaus may need different strategies

4. **Progressive Overload Metrics**
   - Calculate total volume progression
   - Equipment-adjusted progression scoring

5. **Rep Range Optimization**
   - Suggest optimal rep ranges per equipment
   - Adjust based on progression success rate

## Related Files
- `src/lib/progression/equipmentProgressionRules.ts` - Core logic
- `src/components/workout/ProgressionGuidance.tsx` - UI component
- `src/components/workout/ExerciseCard.tsx` - Integration point
- `src/types/index.ts` - Exercise type with equipment field

## Testing Checklist
- [ ] Test barbell progression calculation (5 lb jumps)
- [ ] Test dumbbell progression (exceeding max reps)
- [ ] Test bodyweight progression (2.5 lb linear)
- [ ] Test cable progression (pin-based)
- [ ] Verify microplate recommendations
- [ ] Check UI collapsible behavior
- [ ] Test with actual exercise data
- [ ] Verify equipment type routing
- [ ] Test edge cases (negative progression)
- [ ] Verify mobile responsiveness
