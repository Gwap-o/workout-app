# System Architecture

## Overview

The Kinobody Workout Tracker is a **full-stack web application** using Supabase as the backend and Netlify for hosting and authentication. All data is stored in the cloud with Row Level Security, enabling multi-device access while remaining completely free.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Devices                            │
│         (Phone, Tablet, Desktop Browser)                     │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Netlify CDN (Edge)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         React SPA (Static Files)                      │  │
│  │  - HTML, CSS, JavaScript Bundle                       │  │
│  │  - Served via CDN                                     │  │
│  │  - HTTPS Automatic                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Netlify Identity (Authentication)             │  │
│  │  - User signup/login                                  │  │
│  │  - JWT token generation                               │  │
│  │  - Session management                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────────────────┘
             │
             │ (API Calls with JWT)
             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Backend                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database                           │  │
│  │  - workout_sessions, exercise_logs                    │  │
│  │  - user_profiles, bodyweight_logs                     │  │
│  │  - meal_plans, progress_photos                        │  │
│  │  - Row Level Security (RLS) enforced                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Supabase Storage                              │  │
│  │  - Progress photos (images)                           │  │
│  │  - User-specific buckets                              │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Supabase Realtime (Optional)                  │  │
│  │  - Live updates across devices                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Layers

### 1. Presentation Layer (Frontend)

**React SPA Hosted on Netlify**
- **Pages:** Top-level route components
  - Dashboard
  - Workout Logger
  - Workout History
  - Nutrition Planner
  - Progress Charts
  - Settings
  - Login/Signup (auth pages)

- **Components:** Reusable UI elements
  - WorkoutCard, ExerciseRow, SetInput
  - ProgressChart, MealPlanCard
  - StatsDisplay, AuthForm

- **shadcn/ui Components:** Pre-built accessible components
  - Button, Card, Dialog, Input, Select
  - Table, Tabs, Toast, Calendar
  - Chart containers

**Styling**
- Tailwind CSS for utility-first styling
- Mobile-first responsive design
- Responsive breakpoints: sm, md, lg, xl

**Routing**
- React Router v6
- Protected routes (require authentication)
- Redirect to login if not authenticated

---

### 2. Authentication Layer

**Netlify Identity**
- User signup/login (email + password or OAuth)
- JWT token generation
- Automatic session management
- Token refresh handling
- **Why Netlify Identity?**
  - No custom auth code needed
  - Free tier (1,000 users/month)
  - Seamless integration with Netlify hosting
  - Works with Supabase RLS via JWT

**Authentication Flow:**
```
User Login → Netlify Identity → JWT Token → Supabase RLS
                                      ↓
                           Stored in localStorage
                                      ↓
                           Sent with every Supabase request
```

**Integration with Supabase:**
- Netlify Identity user ID maps to Supabase `user_id`
- JWT token includes user claims
- Supabase RLS policies verify JWT
- User can only access their own data

---

### 3. State Management Layer

**React Context API**
- **AuthContext:** Current user, login/logout functions
- **WorkoutContext:** Active workout session, exercise logs
- **UserProfileContext:** User profile, preferences, current phase
- **NutritionContext:** Meal plans, calorie targets

**Custom Hooks**
- `useAuth()` - Authentication state and methods
- `useWorkout()` - Workout logging and progression
- `useExercise()` - Exercise data and calculations
- `useProgression()` - Progression logic and validation
- `useNutrition()` - Meal planning and macro calculations
- `useCharts()` - Chart data preparation
- `usePlateau()` - Plateau detection
- `usePhase()` - Phase management and rotation
- `useSupabase()` - Supabase client access

**State Flow**
```
User Action (UI)
    ↓
Component Event Handler
    ↓
Custom Hook (Business Logic)
    ↓
Supabase Client Call
    ↓
PostgreSQL Database
    ↓
Context Update (useState)
    ↓
Component Re-render
```

---

### 4. Business Logic Layer

**Core Modules**

**Progression Engine** (`lib/progression/`)
- `calculateNextWorkout()` - Double progression logic
- `calculateRPTSets()` - Auto-calculate set 2 and 3
- `detectPlateau()` - Identify stagnation
- `suggestRotation()` - Recommend exercise swap
- `validateProgression()` - Ensure proper weight/rep increases

**Workout Engine** (`lib/workout/`)
- `createWorkoutSession()` - Initialize workout
- `logExercise()` - Record sets/reps/weight
- `calculateRestPeriod()` - Method-specific rest times
- `validateWorkoutFrequency()` - Prevent over-training
- `getExpectedPerformance()` - Predict next workout

**Nutrition Engine** (`lib/nutrition/`)
- `calculateMaintenance()` - Base calorie needs
- `calculateMacros()` - Protein, fat, carb targets
- `calculateDayType()` - Training vs rest day
- `validateMealPlan()` - Check against targets

**Phase Manager** (`lib/phase/`)
- `getCurrentPhase()` - Determine active phase
- `triggerPhaseChange()` - Switch between phases
- `rotateExercises()` - Swap to phase-specific exercises
- `carryOverStrength()` - Estimate new exercise weights

**Analytics Engine** (`lib/analytics/`)
- `calculateFitnessTier()` - Good/Great/Godlike
- `generateProgressData()` - Chart data preparation
- `calculateConsistency()` - Workout adherence
- `calculateVolume()` - Sets per muscle group
- `detectTrends()` - Weight gain rate, strength trends

**Validation Engine** (`lib/validation/`)
- `validateRepRange()` - Method-specific rep validation
- `validateVolume()` - Set count limits
- `validateRestPeriod()` - Minimum rest enforcement
- `validateWeightIncrement()` - Proper progression jumps
- `validateExerciseSwap()` - Approved variations only

---

### 5. Data Access Layer

**Supabase Client** (`lib/supabase/`)

**Client Setup:**
```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
```

**CRUD Operations:**

**User Profile:**
```typescript
// src/lib/supabase/userProfile.ts
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
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

**Workout Sessions:**
```typescript
// src/lib/supabase/workouts.ts
export const createWorkoutSession = async (session: Partial<WorkoutSession>) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      ...session,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWorkoutHistory = async (limit = 50) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, exercise_logs(*)')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
```

**Progress Photos:**
```typescript
// src/lib/supabase/photos.ts
export const uploadProgressPhoto = async (file: File, metadata: PhotoMetadata) => {
  const user = (await supabase.auth.getUser()).data.user;
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
```

---

## Data Flow Patterns

### Example: User Login and Data Access

```
1. User enters email/password
        ↓
2. netlifyIdentity.login(email, password)
        ↓
3. Netlify Identity authenticates
        ↓
4. JWT token returned and stored
        ↓
5. AuthContext updates (user logged in)
        ↓
6. Redirect to Dashboard
        ↓
7. Dashboard loads user profile from Supabase
        ↓
8. Supabase verifies JWT from Netlify
        ↓
9. RLS checks: user_id = auth.uid()
        ↓
10. Data returned to React app
```

### Example: Logging a Workout Set

```
1. User enters: 225 lbs × 5 reps (Incline Press, Set 1)
        ↓
2. Component calls: useWorkout().logSet()
        ↓
3. Hook validates (rep range, weight increment)
        ↓
4. Calculate next sets (RPT: -10% per set)
        ↓
5. Call Supabase: createExerciseLog()
        ↓
6. Supabase inserts into exercise_logs table
        ↓
7. RLS verifies user_id matches JWT
        ↓
8. Database write succeeds
        ↓
9. Return success to hook
        ↓
10. Update context state
        ↓
11. Re-render UI with next set suggestions
```

### Example: Multi-Device Sync

```
Device 1 (Phone):
User logs workout
        ↓
Supabase: INSERT into workout_sessions
        ↓
Database updated

Device 2 (Desktop):
User refreshes dashboard
        ↓
Supabase: SELECT from workout_sessions
        ↓
Latest workout appears
        ↓
Automatic sync (no manual sync needed)
```

---

## Component Hierarchy

```
App
├── AuthProvider (Netlify Identity context)
├── SupabaseProvider (Supabase client context)
│
├── Router
│   ├── PublicRoutes
│   │   ├── Login
│   │   └── Signup
│   │
│   ├── ProtectedRoutes (require authentication)
│   │   ├── Layout
│   │   │   ├── Navigation
│   │   │   ├── Header
│   │   │   └── Footer
│   │   │
│   │   ├── Dashboard (/)
│   │   │   ├── WelcomeCard
│   │   │   ├── TodayOverview
│   │   │   ├── NextWorkoutPreview
│   │   │   └── QuickStats
│   │   │
│   │   ├── WorkoutLogger (/workout)
│   │   │   ├── WorkoutHeader (A/B, Phase, Date)
│   │   │   ├── ExerciseList
│   │   │   │   └── ExerciseCard (for each exercise)
│   │   │   │       ├── SetInput (Set 1, 2, 3)
│   │   │   │       ├── NextSetSuggestion
│   │   │   │       └── RestTimer
│   │   │   └── CompleteWorkoutButton
│   │   │
│   │   ├── WorkoutHistory (/history)
│   │   │   ├── FilterBar (date, exercise, workout type)
│   │   │   ├── WorkoutList
│   │   │   │   └── WorkoutCard (for each workout)
│   │   │   │       └── ExerciseDetails
│   │   │   └── Pagination
│   │   │
│   │   ├── Nutrition (/nutrition)
│   │   │   ├── StatsCalculator
│   │   │   │   ├── UserStatsForm
│   │   │   │   └── CalculatedTargets
│   │   │   ├── MealPlanBuilder
│   │   │   │   ├── MealPlanSelector (Training/Rest)
│   │   │   │   ├── MealList
│   │   │   │   │   └── MealInput (Breakfast, Lunch, Dinner)
│   │   │   │   └── MacroComparison
│   │   │   └── DailyReference
│   │   │       └── TodaysMacros
│   │   │
│   │   ├── Progress (/progress)
│   │   │   ├── Tabs (Charts, Standards, Body Comp, Consistency)
│   │   │   │
│   │   │   ├── Charts Tab
│   │   │   │   ├── ExerciseSelector
│   │   │   │   ├── TimePeriodToggle
│   │   │   │   └── ProgressChart (Recharts)
│   │   │   │
│   │   │   ├── Standards Tab
│   │   │   │   ├── FitnessStandardsGrid
│   │   │   │   └── TierProgressBar (for each exercise)
│   │   │   │
│   │   │   ├── Body Comp Tab
│   │   │   │   ├── BodyweightChart
│   │   │   │   ├── MeasurementsChart
│   │   │   │   └── ProgressPhotos
│   │   │   │
│   │   │   └── Consistency Tab
│   │   │       ├── CalendarHeatmap
│   │   │       ├── StreakCounter
│   │   │       └── AdherenceMetrics
│   │   │
│   │   └── Settings (/settings)
│   │       ├── ProfileSettings
│   │       ├── PhaseManagement
│   │       ├── DataManagement (Export/Import)
│   │       └── AppPreferences
```

---

## Database Schema (PostgreSQL)

### Tables Overview

```sql
-- User profile (linked to Netlify Identity user)
user_profiles
  - id (UUID, PK)
  - user_id (UUID, FK to Netlify Identity)
  - bodyweight, goal_bodyweight
  - current_phase, current_week
  - nutrition targets

-- Workout sessions
workout_sessions
  - id (UUID, PK)
  - user_id (UUID, indexed)
  - date, workout_type, phase
  - completed, duration

-- Exercise logs
exercise_logs
  - id (UUID, PK)
  - user_id (UUID, indexed)
  - session_id (UUID, FK)
  - exercise_name, muscle_group
  - sets (JSONB), training_method
  - date (indexed)

-- Bodyweight tracking
bodyweight_logs
  - id (UUID, PK)
  - user_id (UUID, indexed)
  - date, weight
  - measurements (JSONB)

-- Meal plans
meal_plans
  - id (UUID, PK)
  - user_id (UUID, indexed)
  - name, type
  - meals (JSONB)
  - total macros

-- Progress photos metadata
progress_photos
  - id (UUID, PK)
  - user_id (UUID, indexed)
  - date, storage_path
  - weight, phase, notes

-- User settings
user_settings
  - user_id (UUID, PK)
  - settings (JSONB)
```

**Row Level Security (RLS):**
- Every table has RLS enabled
- Policies: `user_id = auth.uid()`
- Users can only access their own data
- Prevents data leaks across users

See `DATA_MODELS.md` for full schema.

---

## Security Architecture

### Authentication Security
- **Netlify Identity** handles all auth
- No passwords stored in app code
- JWT tokens expire and refresh automatically
- HTTPS enforced on all connections

### Data Security
- **Row Level Security (RLS)** enforced at database level
- Users cannot query other users' data
- Supabase anon key is public (safe)
- Service role key never exposed to client

### API Security
- All API calls authenticated via JWT
- Supabase validates JWT on every request
- No direct SQL from client (Supabase client only)

### Storage Security
- Progress photos stored per user folder
- Storage RLS policies prevent cross-user access
- Signed URLs expire after 1 hour

---

## Performance Optimizations

### 1. Database Indexing
- Indexes on `user_id`, `date`, `exercise_name`
- Compound indexes for common queries
- Fast lookups for workout history

### 2. Query Optimization
- Limit query results (e.g., last 50 workouts)
- Use `.select()` to fetch only needed columns
- Pagination for long lists

### 3. Caching
- User profile cached in React Context
- Active workout cached in memory
- Chart data memoized with `useMemo`

### 4. Code Splitting
- Lazy load routes with `React.lazy()`
- Charts loaded only on Progress page
- Reduces initial bundle size

### 5. Image Optimization
- Compress photos before upload
- Generate thumbnails for gallery view
- Use signed URLs with expiration

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│       Developer Machine                  │
│  - Write code                            │
│  - Git commit                            │
│  - Push to GitHub                        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│       GitHub Repository                  │
│  - Source code                           │
│  - Webhook to Netlify on push           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│       Netlify Build                      │
│  1. Clone repo                           │
│  2. npm install                          │
│  3. npm run build (Vite)                │
│  4. Deploy to CDN                        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│       Netlify CDN (Production)           │
│  - Serve static files globally           │
│  - HTTPS automatic                       │
│  - Netlify Identity active               │
└─────────────────────────────────────────┘
             │
             ▼ (API calls)
┌─────────────────────────────────────────┐
│       Supabase Backend                   │
│  - PostgreSQL database                   │
│  - Storage bucket                        │
│  - RLS enforced                          │
└─────────────────────────────────────────┘
```

**Cost: $0/month**
- Netlify free tier: 100 GB bandwidth, 300 build minutes
- Supabase free tier: 500 MB DB, 1 GB storage, 2 GB bandwidth
- Netlify Identity free tier: 1,000 users/month

---

## Monitoring & Debugging

### Development
- React DevTools
- Supabase Dashboard (query logs, table viewer)
- Netlify logs (build logs, function logs)
- Browser DevTools (Network tab for API calls)

### Production
- Netlify Analytics (optional, paid)
- Supabase Dashboard (query performance)
- Error boundaries for graceful failures
- User-facing error messages

### Performance
- Lighthouse audits
- Chrome DevTools Performance tab
- Supabase query performance metrics

---

## Scalability Considerations

### Current Scale (Solo User)
- Database: ~10-20 MB/year
- Storage: ~100-200 MB/year (photos)
- Bandwidth: <500 MB/month
- Well within all free tier limits

### Future Scale (Multiple Users - Hypothetical)
- Supabase free tier supports up to 500 MB DB
- ~25-50 users possible on free tier
- Upgrade to Supabase Pro ($25/mo) for unlimited
- Netlify Identity: 1,000 users free, then $99/mo

### Optimization for Scale
- Database indexes already in place
- RLS prevents data leaks
- Query limits prevent large data pulls
- Image compression reduces storage

---

## Offline Support (Future)

**Currently:** Requires internet connection
**Future (PWA):**
- Service worker for offline mode
- Cache workout data locally
- Sync when connection restored
- Conflict resolution for multi-device edits

**Implementation:**
- vite-plugin-pwa
- Workbox for caching strategies
- Supabase Realtime for conflict detection

---

## Backup & Disaster Recovery

### Supabase Automatic Backups
- Point-in-time recovery (paid plans)
- Database snapshots (manual)

### User-Initiated Backups
- Export all data to JSON
- Download from Settings page
- Import to restore

### Data Loss Prevention
- RLS prevents accidental cross-user deletion
- Soft deletes (optional)
- Audit logs (optional)

---

*Last Updated: November 16, 2025*
