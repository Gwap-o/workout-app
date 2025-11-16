# Implementation Roadmap

## Overview

This document provides a week-by-week implementation plan for building the Kinobody Workout Tracker app from start to finish in **4 weeks**.

**Target Timeline:** 4 weeks (28 days)
**Estimated Hours:** 60-80 hours total (15-20 hours/week)
**Launch Date:** Mid-December 2025

---

## Week 1: Foundation, Authentication & Database Setup

**Goals:**
- Project initialized and running locally
- Supabase backend configured
- Netlify Identity authentication integrated
- Basic layout and navigation
- Core data models implemented

### Day 1-2: Project Setup & Supabase (8-10 hours)

**Tasks:**
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install and configure dependencies
- [ ] Set up Tailwind CSS
- [ ] Initialize shadcn/ui
- [ ] Configure ESLint + Prettier
- [ ] Create Supabase project
- [ ] Create PostgreSQL database schema
- [ ] Enable Row Level Security (RLS)
- [ ] Create Git repository
- [ ] Set up basic folder structure

**Commands:**
```bash
# Create Vite project
npm create vite@latest workout-app -- --template react-ts
cd workout-app
npm install

# Dependencies (UPDATED FOR SUPABASE)
npm install react-router-dom @supabase/supabase-js netlify-identity-widget date-fns recharts lucide-react

# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select table tabs toast dialog calendar
```

**Supabase Setup:**
1. Create account at supabase.com
2. Create new project
3. Copy project URL and anon key
4. Run SQL migrations from DATA_MODELS.md to create tables
5. Enable RLS on all tables
6. Create storage bucket for progress photos

**Environment Variables:**
```bash
# Create .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Deliverables:**
- ✅ Project runs on `localhost:5173`
- ✅ Tailwind working
- ✅ shadcn/ui components available
- ✅ TypeScript configured
- ✅ Git initialized

### Day 3-4: Database & Data Models (8-10 hours)

**Tasks:**
- [ ] Set up Netlify Identity integration
- [ ] Create Supabase client configuration (`lib/supabase/client.ts`)
- [ ] Define all TypeScript interfaces (`types/index.ts`)
- [ ] Implement Supabase CRUD operations for each table
- [ ] Create AuthContext with Netlify Identity
- [ ] Build Login/Signup pages
- [ ] Create Protected Routes
- [ ] Test authentication and database operations

**Files to Create:**
```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Supabase client setup
│   │   ├── userProfile.ts      # User profile CRUD
│   │   ├── workouts.ts         # Workout CRUD
│   │   ├── exercises.ts        # Exercise CRUD
│   │   ├── nutrition.ts        # Nutrition CRUD
│   │   └── photos.ts           # Photo upload/download
│   ├── netlify/
│   │   └── identity.ts         # Netlify Identity helpers
│   └── constants/
│       ├── exercises.ts        # Exercise library
│       ├── phases.ts           # Phase configurations
│       └── standards.ts        # Fitness standards
├── types/
│   ├── index.ts                # Export all types
│   ├── workout.ts              # Workout-related types
│   ├── nutrition.ts            # Nutrition types
│   ├── user.ts                 # User profile types
│   └── supabase.ts             # Generated Supabase types
├── contexts/
│   └── AuthContext.tsx         # Netlify Identity context
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       └── ProtectedRoute.tsx
└── pages/
    ├── Login.tsx
    └── Signup.tsx
```

**Deliverables:**
- ✅ Netlify Identity authentication working
- ✅ Supabase client configured with JWT from Netlify
- ✅ Login/Signup flow functional
- ✅ Protected routes working
- ✅ Can create/read/update/delete all entities via Supabase
- ✅ Type safety across all operations
- ✅ Sample data populates correctly

### Day 5-7: Layout & Navigation (6-8 hours)

**Tasks:**
- [ ] Create app layout component
- [ ] Implement responsive navigation (mobile + desktop)
- [ ] Set up React Router with all routes
- [ ] Create placeholder pages for all routes
- [ ] Add header with app title
- [ ] Add bottom navigation for mobile
- [ ] Implement dark mode (optional)

**Routes to Create:**
```
/                   → Dashboard
/workout            → Workout Logger
/history            → Workout History
/nutrition          → Nutrition Planner
/progress           → Progress & Charts
/settings           → Settings
```

**Components to Create:**
```
src/components/
├── layout/
│   ├── Layout.tsx              # Main layout wrapper
│   ├── Navigation.tsx          # Nav menu
│   ├── Header.tsx              # App header
│   └── MobileNav.tsx           # Mobile bottom nav
└── ui/                         # shadcn/ui components
```

**Deliverables:**
- ✅ All routes accessible
- ✅ Navigation works (desktop + mobile)
- ✅ Responsive layout
- ✅ Basic styling applied

---

## Week 2: Workout Tracker & Progression Logic

**Goals:**
- Complete workout logging interface
- Implement intelligent progression system
- Add expected vs actual tracking
- Implement plateau detection

### Day 8-10: Workout Logger UI (10-12 hours)

**Tasks:**
- [ ] Create workout session page
- [ ] Build exercise list component
- [ ] Create set input interface
- [ ] Implement RPT set auto-calculation
- [ ] Add rest timer component
- [ ] Create workout completion flow
- [ ] Add warmup set calculator
- [ ] Implement form validation

**Components to Create:**
```
src/components/workout/
├── WorkoutLogger.tsx           # Main page
├── WorkoutHeader.tsx           # Date, type, phase
├── ExerciseList.tsx            # List of exercises
├── ExerciseCard.tsx            # Single exercise
├── SetInput.tsx                # Input for weight/reps
├── NextSetSuggestion.tsx       # Show calculated next set
├── RestTimer.tsx               # Countdown timer
├── WarmupCalculator.tsx        # Warmup sets
└── CompleteWorkoutButton.tsx   # Finish workout
```

**Logic to Implement:**
- RPT: 10% weight reduction per set
- Auto-calculate target reps per set
- Real-time validation (rep ranges, weight increments)
- Expected vs actual tracking

**Deliverables:**
- ✅ Can log a complete workout
- ✅ Set 2 and 3 auto-calculated after Set 1
- ✅ Rest timer works per method
- ✅ Warmup sets calculated
- ✅ Data persists to database

### Day 11-12: Progression System (8-10 hours)

**Tasks:**
- [ ] Implement double progression logic
- [ ] Create progression calculator
- [ ] Add expected performance calculation
- [ ] Implement plateau detection (2+ workouts)
- [ ] Create rotation suggestion system
- [ ] Add progression validation
- [ ] Show "hit progression" indicators

**Files to Create:**
```
src/lib/progression/
├── calculator.ts               # Progression calculations
├── validator.ts                # Validate progression
├── plateau.ts                  # Detect plateaus
├── rotation.ts                 # Exercise rotation logic
└── carryover.ts                # Strength carryover estimates
```

**Key Functions:**
```typescript
calculateNextWorkout(exerciseLog: ExerciseLog): ExpectedPerformance
validateProgression(current: SetLog, previous: SetLog): ProgressionValidation
detectPlateau(exerciseLogs: ExerciseLog[]): boolean
suggestRotation(exerciseName: string, phase: number): string
estimateCarryover(fromExercise: string, toExercise: string, weight: number): number
```

**Deliverables:**
- ✅ Next workout shows expected weight/reps
- ✅ Progression validated on log
- ✅ Plateau alert after 2 stagnant workouts
- ✅ Exercise rotation suggested with carryover

### Day 13-14: Workout History (6-8 hours)

**Tasks:**
- [ ] Create workout history page
- [ ] Build workout list component
- [ ] Add date filtering
- [ ] Implement exercise filtering
- [ ] Create detail view for past workouts
- [ ] Add edit/delete functionality
- [ ] Implement pagination

**Components to Create:**
```
src/pages/
└── WorkoutHistory.tsx

src/components/history/
├── WorkoutList.tsx             # List of workouts
├── WorkoutCard.tsx             # Single workout summary
├── WorkoutDetail.tsx           # Expanded view
├── FilterBar.tsx               # Date/exercise filters
└── Pagination.tsx              # Page navigation
```

**Deliverables:**
- ✅ View all past workouts
- ✅ Filter by date, exercise, workout type
- ✅ Edit historical workouts
- ✅ Delete workouts with confirmation

---

## Week 3: Guardrails, Nutrition & Phase Management

**Goals:**
- Implement all methodology enforcement
- Build nutrition calculator and meal planner
- Add phase rotation system
- Create settings page

### Day 15-16: Methodology Guardrails (8-10 hours)

**Tasks:**
- [ ] Implement workout frequency validation
- [ ] Add consecutive day blocking
- [ ] Create volume monitor
- [ ] Add methodology enforcement (RPT/Kino/Rest-Pause)
- [ ] Implement MEGA training timer
- [ ] Add exercise substitution lock
- [ ] Create validation UI (alerts/warnings)

**Files to Create:**
```
src/lib/validation/
├── frequency.ts                # 3 workouts/week max
├── volume.ts                   # Set count limits
├── methodology.ts              # Method enforcement
├── recovery.ts                 # CNS/muscle recovery
└── substitution.ts             # Exercise swap rules
```

**Validation Rules:**
- Block 4+ workouts per week
- Prevent consecutive day training
- Enforce 48-hour CNS recovery
- Block excessive volume (5+ sets)
- Lock exercises to correct method
- MEGA training max 12 weeks

**Deliverables:**
- ✅ Cannot create workout violating rules
- ✅ Warnings shown before violations
- ✅ Methodology locked per exercise
- ✅ Volume tracked and limited

### Day 17-18: Nutrition Module (8-10 hours)

**Tasks:**
- [ ] Create stats calculator page
- [ ] Build meal plan builder
- [ ] Implement macro calculations
- [ ] Add training vs rest day logic
- [ ] Create meal input interface
- [ ] Show real-time macro comparison
- [ ] Add meal plan save/load

**Components to Create:**
```
src/pages/
└── Nutrition.tsx

src/components/nutrition/
├── StatsCalculator.tsx         # User stats input
├── CalculatedTargets.tsx       # Show calculated macros
├── MealPlanBuilder.tsx         # Build meal plans
├── MealPlanSelector.tsx        # Switch between plans
├── MealInput.tsx               # Enter meal macros
├── MacroComparison.tsx         # Compare to targets
└── DailyReference.tsx          # Today's plan view
```

**Calculations:**
```typescript
Maintenance = bodyweight × 15
Training Day = maintenance + 500 (lean bulk) or +400 (recomp)
Rest Day = maintenance + 100 (lean bulk) or -300 (recomp)

Protein = goalBodyweight × 1g
Fat = calories × 25% / 9
Carbs = (calories - proteinCal - fatCal) / 4
```

**Deliverables:**
- ✅ Calculate nutrition targets
- ✅ Build training day meal plan
- ✅ Build rest day meal plan
- ✅ Real-time macro totals
- ✅ Visual comparison to targets

### Day 19-20: Phase Management (6-8 hours)

**Tasks:**
- [ ] Create phase tracking system
- [ ] Implement 8-week phase timer
- [ ] Add phase rotation alerts
- [ ] Auto-swap exercises on phase change
- [ ] Create phase history view
- [ ] Add manual phase override

**Files to Create:**
```
src/lib/phase/
├── manager.ts                  # Phase state management
├── rotation.ts                 # Exercise rotation
├── timer.ts                    # 8-week countdown
└── carryover.ts                # Strength estimates
```

**Logic:**
- Track current phase (1, 2, 3)
- Track week within phase (1-8)
- Alert at week 8: "Switch to Phase 2?"
- Auto-swap exercises per PHASES constant
- Estimate starting weights for new variations

**Deliverables:**
- ✅ Phase tracked automatically
- ✅ Alert at 8 weeks complete
- ✅ One-click phase rotation
- ✅ Exercises auto-swap
- ✅ Strength carryover calculated

### Day 21: Settings & Profile (4-6 hours)

**Tasks:**
- [ ] Create settings page
- [ ] Add profile editor
- [ ] Implement data export (JSON)
- [ ] Add data import
- [ ] Create clear data option
- [ ] Add app preferences (theme, units)

**Components to Create:**
```
src/pages/
└── Settings.tsx

src/components/settings/
├── ProfileSettings.tsx         # Edit user profile
├── PhaseManagement.tsx         # View/change phase
├── DataManagement.tsx          # Export/import/clear
└── AppPreferences.tsx          # Theme, units, etc.
```

**Deliverables:**
- ✅ Edit user profile
- ✅ Export all data to JSON
- ✅ Import from backup
- ✅ Clear all data (with confirmation)

---

## Week 4: Progress Charts, Analytics & Polish

**Goals:**
- Build all progress charts
- Implement fitness standards tracker
- Add consistency dashboard
- Polish UI/UX
- Deploy to Netlify

### Day 22-23: Progress Charts (10-12 hours)

**Tasks:**
- [ ] Create progress page with tabs
- [ ] Implement exercise progression charts
- [ ] Add time period toggles
- [ ] Build bodyweight chart
- [ ] Create measurements chart
- [ ] Add multi-exercise comparison
- [ ] Implement chart export

**Components to Create:**
```
src/pages/
└── Progress.tsx

src/components/charts/
├── ExerciseProgressChart.tsx   # Line chart for exercise
├── BodyweightChart.tsx         # Weight over time
├── MeasurementsChart.tsx       # Body measurements
├── MultiExerciseChart.tsx      # Compare exercises
├── TimePeriodToggle.tsx        # 4w, 8w, 6m, 1y, all
└── ChartExport.tsx             # Export as image
```

**Chart Data Preparation:**
```
src/lib/analytics/
├── chartData.ts                # Prepare data for Recharts
├── trends.ts                   # Calculate trends
└── aggregation.ts              # Aggregate data by time period
```

**Chart Types:**
- Line charts: Exercise progression, bodyweight
- Bar charts: Volume per muscle group
- Progress bars: Fitness tier progress

**Deliverables:**
- ✅ View exercise progression over time
- ✅ Toggle time periods (4w, 8w, 6m, 1y, all)
- ✅ See bodyweight trend
- ✅ Compare multiple exercises
- ✅ Export charts as images

### Day 24: Fitness Standards & Consistency (6-8 hours)

**Tasks:**
- [ ] Create fitness standards dashboard
- [ ] Calculate real-time tier (Good/Great/Godlike)
- [ ] Show progress bars per exercise
- [ ] Add calendar heatmap for consistency
- [ ] Calculate streak counters
- [ ] Show adherence metrics

**Components to Create:**
```
src/components/progress/
├── FitnessStandards.tsx        # Standards grid
├── TierProgressBar.tsx         # Single exercise tier
├── CalendarHeatmap.tsx         # Workout calendar
├── StreakCounter.tsx           # Current/longest streak
└── AdherenceMetrics.tsx        # Completion rate
```

**Calculations:**
```typescript
relativeStre ngth = weight / bodyweight
tier = calculateTier(relativeStrength, exercise)
nextTierWeight = bodyweight × nextTierMultiplier
poundsAway = nextTierWeight - currentWeight
```

**Deliverables:**
- ✅ See current tier for each exercise
- ✅ Visual progress to next tier
- ✅ Calendar heatmap of workouts
- ✅ Streak counter
- ✅ Adherence percentage

### Day 25-26: UI/UX Polish (8-10 hours)

**Tasks:**
- [ ] Review all pages for mobile responsiveness
- [ ] Add loading states everywhere
- [ ] Implement error boundaries
- [ ] Add success/error toasts
- [ ] Improve form validation UX
- [ ] Add keyboard shortcuts
- [ ] Optimize performance
- [ ] Add empty states
- [ ] Create onboarding flow
- [ ] Write user guide (optional)

**Polish Checklist:**
- [ ] All buttons have hover states
- [ ] Forms show validation errors inline
- [ ] Loading spinners during data operations
- [ ] Toast notifications for success/error
- [ ] Empty states for new users
- [ ] Confirmation dialogs for destructive actions
- [ ] Keyboard navigation works
- [ ] Mobile touch targets are 44×44px minimum
- [ ] Text is readable (contrast ratio 4.5:1+)
- [ ] All images have alt text

**Performance:**
- [ ] Code split by route
- [ ] Lazy load charts
- [ ] Memoize expensive calculations
- [ ] Debounce chart updates
- [ ] Optimize bundle size

**Deliverables:**
- ✅ Smooth, polished UI
- ✅ Mobile-optimized
- ✅ Fast performance
- ✅ Error handling everywhere
- ✅ Accessibility improvements

### Day 27-28: Testing & Deployment (6-8 hours)

**Tasks:**
- [ ] Manual testing of all features
- [ ] Test on mobile devices
- [ ] Fix any bugs found
- [ ] Write README.md
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Connect to Netlify
- [ ] Configure build settings
- [ ] Enable password protection
- [ ] Test production deployment
- [ ] Final QA

**Testing Checklist:**
- [ ] Log a complete workout (A and B)
- [ ] Test progression logic
- [ ] Trigger plateau detection
- [ ] Rotate exercises
- [ ] Create meal plans
- [ ] View all charts
- [ ] Export/import data
- [ ] Test all validations
- [ ] Verify data persistence
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS and Android

**Deployment Steps:**
1. Create GitHub repo
2. Push code: `git push origin main`
3. Connect Netlify to GitHub
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Enable password protection:
   - Site settings → Access control → Visitor access
6. Add custom domain (optional)
7. Test deployed app

**Deliverables:**
- ✅ All features tested
- ✅ App deployed to Netlify
- ✅ Password protection enabled
- ✅ Works on all devices
- ✅ No critical bugs

---

## Post-Launch (Optional Enhancements)

### Week 5+ (Backlog)

**Nice-to-Have Features:**
- [ ] Dark mode toggle
- [ ] PWA capabilities (offline mode)
- [ ] Progress photo gallery
- [ ] PR timeline view
- [ ] Exercise form cues
- [ ] Voice input for logging
- [ ] Rest timer notifications
- [ ] Workout reminders
- [ ] Achievement system
- [ ] Advanced analytics (phase comparison, etc.)

**Future Considerations:**
- Multi-device sync (Supabase integration)
- Multiple user profiles
- Social sharing
- Apple Health / Google Fit integration

---

## Development Best Practices

### Daily Workflow

1. **Start of Day:**
   - Review roadmap tasks for the day
   - Pull latest code (if collaborating)
   - Plan 2-3 hour work session

2. **During Development:**
   - Commit frequently (after each feature/fix)
   - Write meaningful commit messages
   - Test in browser as you build
   - Document complex logic

3. **End of Day:**
   - Push code to GitHub
   - Update roadmap checklist
   - Note any blockers or questions
   - Plan next day's tasks

### Git Commit Strategy

**Commit Message Format:**
```
feat: Add workout logger component
fix: Correct RPT set calculation
docs: Update README with setup instructions
style: Format code with Prettier
refactor: Extract progression logic to separate file
test: Add unit tests for progression calculator
```

**Branching (Optional):**
- `main` - Production-ready code
- `develop` - Development branch
- `feature/workout-logger` - Feature branches

### Code Organization Tips

**Keep Components Small:**
- Max 200-300 lines per component
- Extract logic to custom hooks
- Create reusable sub-components

**Use TypeScript:**
- Define types for all props
- Avoid `any` type
- Use interfaces for data structures

**Performance:**
- Use `React.memo` for pure components
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to children

**Accessibility:**
- Use semantic HTML
- Add ARIA labels where needed
- Test keyboard navigation
- Ensure color contrast

---

## Milestones & Checkpoints

### End of Week 1 Checkpoint
- [ ] Project runs locally
- [ ] Database operational
- [ ] Navigation works
- [ ] Can create basic workout session

### End of Week 2 Checkpoint
- [ ] Can log complete workout
- [ ] Progression logic works
- [ ] Plateau detection implemented
- [ ] Workout history viewable

### End of Week 3 Checkpoint
- [ ] Guardrails enforced
- [ ] Nutrition calculator functional
- [ ] Phase rotation works
- [ ] Settings page complete

### End of Week 4 Checkpoint (Launch!)
- [ ] All charts working
- [ ] UI polished
- [ ] Deployed to Netlify
- [ ] Tested on all devices
- [ ] Ready for use

---

## Risk Mitigation

### Potential Blockers

**Technical Risks:**
- IndexedDB quota issues → Test on multiple browsers
- Chart performance with large datasets → Implement pagination/downsampling
- Mobile layout issues → Test early and often

**Scope Risks:**
- Features taking longer than estimated → Prioritize core features, defer nice-to-haves
- Unexpected bugs → Allocate buffer time in Week 4

**Solutions:**
- Daily progress tracking
- Focus on MVP first
- Defer optional features if needed
- Test incrementally

---

## Success Criteria

### Minimum Viable Product (MVP)

Must-have features for launch:
- ✅ Log workouts (A and B splits)
- ✅ Track progression (double progression)
- ✅ Detect plateaus
- ✅ Nutrition calculator
- ✅ Basic progress charts
- ✅ Fitness standards tracker
- ✅ Workout frequency enforcement
- ✅ Data export

### Nice-to-Have (Can defer)
- Dark mode
- PWA/offline mode
- Progress photos
- Advanced analytics
- Voice input

---

## Resources & References

### Documentation
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Supabase: https://supabase.com/docs
- Supabase JS Client: https://supabase.com/docs/reference/javascript
- Netlify Identity: https://docs.netlify.com/visitor-access/identity
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org
- shadcn/ui: https://ui.shadcn.com

### Tutorials
- Supabase Quickstart: https://supabase.com/docs/guides/getting-started
- Netlify Identity Widget: https://github.com/netlify/netlify-identity-widget
- React Router: https://reactrouter.com/en/main
- Vite: https://vitejs.dev/guide

### Tools
- React DevTools (browser extension)
- Supabase Dashboard: https://app.supabase.com
- Netlify Dashboard: https://app.netlify.com
- Lighthouse (Chrome DevTools)

---

## Questions & Support

### Getting Help
- React/TypeScript: Stack Overflow, React docs
- Supabase: Official docs, Discord community, GitHub issues
- Netlify Identity: Official docs, Netlify support forums
- Tailwind: Official docs, component examples
- General: ChatGPT, Claude, programming communities

### Decision Log
- Why no Redux? → Context API sufficient for app size
- Why Supabase? → Free tier, PostgreSQL power, multi-device sync, RLS security
- Why Netlify Identity? → No custom auth code, free tier, works with Supabase RLS
- Why Recharts? → Best balance of features and bundle size
- Why Netlify hosting? → Free tier, easy deployment, seamless Identity integration

---

**Let's build this!** 🚀

*Last Updated: November 16, 2025*
