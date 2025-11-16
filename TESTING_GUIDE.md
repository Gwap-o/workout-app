# Week 2 Testing Guide

This guide will help you test all implemented Week 2 features systematically.

---

## Prerequisites

Before testing, ensure:
1. Development server is running: `npm run dev`
2. You have a Supabase account and project configured
3. Environment variables are set correctly in `.env.local`
4. You can log in to the app (Netlify Identity or Supabase auth)

---

## Test Plan

### Test 1: User Profile Setup

Since the workout logger requires a user profile, you'll need to create one first.

**Note:** If you don't have a profile creation UI yet, you can create one directly in Supabase:

1. Go to Supabase Dashboard → Table Editor → `user_profiles`
2. Insert new row with:
   - `user_id`: Your Netlify Identity user ID (from `auth.users`)
   - `bodyweight`: 175
   - `goal_bodyweight`: 185
   - `current_phase`: 1
   - `current_week`: 1
   - `program_start_date`: Today's date
   - `goal_type`: 'leanBulk'
   - `workout_schedule`: `["Monday", "Wednesday", "Friday"]`

Alternatively, use Supabase MCP to insert:

```sql
INSERT INTO user_profiles (
  user_id, bodyweight, goal_bodyweight, current_phase,
  current_week, program_start_date, goal_type, workout_schedule
) VALUES (
  'YOUR_USER_ID_HERE',
  175,
  185,
  1,
  1,
  CURRENT_DATE,
  'leanBulk',
  '["Monday", "Wednesday", "Friday"]'::jsonb
);
```

---

### Test 2: Workout Logger - First Workout (Workout A)

**Steps:**
1. Navigate to http://localhost:5174
2. Click "Log Workout" card
3. Verify you see "Phase 1 - Week 1"
4. Verify workout type is set to "Workout A"
5. Verify date is today
6. Click on first exercise (Incline Barbell Press)

**Expected Results:**
- Exercise card expands
- Shows "First time logging this exercise"
- Shows target reps: 4-6
- Shows rest period: 3-4 min
- Shows 3 empty sets (RPT)

**Test RPT Auto-Calculation:**
1. Enter Set 1: 135 lbs × 5 reps
2. Click on Set 2

**Expected:**
- Set 2 weight auto-filled: 125 lbs (135 - 10%)
- Set 2 target reps: 6-7
- Set 3 weight auto-filled: 110 lbs (135 - 20%)
- Set 3 target reps: 7-8

3. Complete Set 2: 125 lbs × 6 reps
4. Complete Set 3: 110 lbs × 8 reps

**Expected:**
- All sets show green checkmark
- Exercise card shows "3/3 sets completed"

5. Repeat for remaining exercises:
   - Standing Barbell Press (6-8 reps)
   - Weighted Chinups (4-6 reps)
   - Barbell Curls (6-8 reps)

6. Click "Save Workout"

**Expected:**
- Success alert: "Workout saved successfully!"
- Redirected to /history
- Workout appears in history

---

### Test 3: Workout Logger - Second Workout (Test Progression)

**Steps:**
1. Navigate to /workout
2. Select Workout A again
3. Click on Incline Barbell Press

**Expected Results:**
- Shows "Last Workout": 135 lbs × 5 reps
- Shows "Target for Today": 135 lbs × 6 reps (rep progression)
- Shows progression indicator: "Rep increase: +1 rep(s)"

**Test Double Progression - Hit Top of Range:**
1. Enter Set 1: 135 lbs × 6 reps (hit top of 4-6 range)
2. Save workout

**Next time Expected:**
- Should show "Target for Today": 140 lbs × 4 reps (weight increase)

**Test Double Progression - Stay in Range:**
1. Enter Set 1: 135 lbs × 5 reps (within range)
2. Save workout

**Next time Expected:**
- Should show "Target for Today": 135 lbs × 6 reps (rep increase)

---

### Test 4: Plateau Detection

**Steps:**
1. Log 3 workouts with SAME weight and SAME reps:
   - Workout 1: 135 lbs × 5 reps
   - Workout 2: 135 lbs × 5 reps
   - Workout 3: 135 lbs × 5 reps

**Expected Results:**
- After 2nd workout: Warning message appears
- Shows "One stagnant workout. Push for progression..."
- After 3rd workout: Red/yellow warning
- Shows "Plateau detected. Recommended: Deload 10-15%..."
- Shows "Stagnant for 2 workouts"

---

### Test 5: Workout History - Filtering

**Steps:**
1. Navigate to /history
2. Verify all logged workouts appear
3. Click "Workout A" filter button

**Expected:**
- Only Workout A sessions shown
- Count updates correctly

4. Click "Workout B" filter button

**Expected:**
- Only Workout B sessions shown (or empty if none logged)

5. Click "All" button

**Expected:**
- All workouts shown again

6. Select a date in the date picker

**Expected:**
- Only workouts from that date shown

7. Click "Clear" button

**Expected:**
- Date filter removed
- All workouts shown again

---

### Test 6: Workout History - View Details

**Steps:**
1. Click on any workout card (collapsed)

**Expected:**
- Card expands
- Shows all exercises logged
- Each exercise shows:
  - Exercise name
  - Muscle group
  - Training method
  - All sets with weight × reps
  - Progression indicator if achieved
  - Exercise notes (if any)
- Shows workout notes (if any)
- Shows duration (if logged)

---

### Test 7: Delete Workout

**Steps:**
1. Click "Delete" button on a workout card
2. Confirm deletion in dialog

**Expected:**
- Workout removed from list
- Count updates
- No errors in console

---

### Test 8: Workout B (Different Exercises)

**Steps:**
1. Navigate to /workout
2. Select "Workout B"
3. Verify exercises are:
   - Weighted Dips (4-6 reps, RPT)
   - Bulgarian Split Squat or Box Squat (6-8 reps, RPT)
   - Romanian Deadlift (8-12 reps, Kino)
   - Lateral Raises (12-15 reps, Rest-Pause)

4. Log complete workout
5. Verify save works

---

### Test 9: Mobile Responsiveness

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro or similar
4. Navigate through:
   - Dashboard
   - Workout logger
   - History page

**Expected:**
- All pages responsive
- Cards stack vertically
- Inputs are touch-friendly
- No horizontal scrolling
- Text readable without zooming

---

### Test 10: Edge Cases

**Test Empty State:**
1. Clear all workouts from Supabase
2. Navigate to /history

**Expected:**
- Shows "No workouts logged yet"
- Shows "Log Your First Workout" button

**Test Missing Profile:**
1. Delete user profile from Supabase
2. Navigate to /workout

**Expected:**
- Shows "Profile Not Found" message
- Shows "Go to Settings" button

**Test Invalid Data:**
1. Try to save workout with no exercises

**Expected:**
- Alert: "Please log at least one exercise"
- Workout not saved

---

## Database Verification

After testing, verify data in Supabase:

**Check workout_sessions table:**
```sql
SELECT * FROM workout_sessions
WHERE user_id = 'YOUR_USER_ID'
ORDER BY date DESC;
```

**Expected:**
- All logged workouts present
- Correct workout_type (A or B)
- Correct phase
- completed = true
- timestamps populated

**Check exercise_logs table:**
```sql
SELECT el.*, ws.date
FROM exercise_logs el
JOIN workout_sessions ws ON el.session_id = ws.id
WHERE el.user_id = 'YOUR_USER_ID'
ORDER BY el.date DESC;
```

**Expected:**
- All exercise logs present
- Correct exercise_name
- sets stored as JSONB array
- hit_progression tracked
- date matches session date

---

## Common Issues & Solutions

### Issue: "Not authenticated"
**Solution:** Ensure you're logged in with Netlify Identity or Supabase auth

### Issue: "Profile Not Found"
**Solution:** Create user profile in Supabase (see Test 1)

### Issue: RPT calculations not working
**Solution:** Make sure Set 1 is completed first before Sets 2 & 3 enable

### Issue: Plateau detection not showing
**Solution:** Need at least 2 workouts logged for same exercise

### Issue: History empty
**Solution:** Check RLS policies are enabled and user_id matches

---

## Performance Checks

**Build Size:**
- Should be ~627 KB (189 KB gzipped)
- If much larger, check for duplicate dependencies

**Load Times:**
- Dashboard: < 1s
- Workout Logger: < 2s (fetches profile + history)
- History: < 2s (fetches workouts + exercises)

**Database Queries:**
- All queries use indexes
- No N+1 query issues
- RLS policies enforced

---

## Success Criteria

All tests pass if:
- [x] Can log workouts A and B
- [x] RPT calculations work correctly
- [x] Progression logic calculates expected performance
- [x] Plateau detection triggers after 2+ stagnant workouts
- [x] History shows all workouts
- [x] Filtering works (type and date)
- [x] Delete works
- [x] Mobile responsive
- [x] No console errors
- [x] Data persists to Supabase correctly

---

## Next Steps After Testing

If all tests pass:
1. Commit changes to Git
2. Deploy to Netlify for production testing
3. Test with real Netlify Identity auth
4. Proceed to Week 3 implementation

If tests fail:
1. Note which test failed
2. Check browser console for errors
3. Verify Supabase connection
4. Check RLS policies
5. Debug and fix issues

---

*Happy Testing!*
