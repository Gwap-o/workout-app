# Kinobody Greek God 2.0 Workout Tracker - Development Guide

## Project Overview

A mobile-responsive web application for tracking the Kinobody Greek God 2.0 program. This app enforces program methodology, provides intelligent workout progression, and visualizes progress over time.

**Key Principles:**
- 100% free to run (Supabase + Netlify free tiers)
- Multi-device sync (access from phone, tablet, desktop)
- Private and secure (Row Level Security)
- Strict adherence to program methodology
- Intelligent automation (minimal manual calculation)
- Mobile-first responsive design

---

## Tech Stack (Zero Cost)

### Frontend Framework
- **React 18+** with **Vite** - Fast development, modern tooling
- **TypeScript** - Type safety for complex workout logic
- **React Router** - Client-side routing

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible components (built on Radix UI)
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - PostgreSQL database + authentication + storage
- **Supabase JS Client** - TypeScript SDK for database operations
- **Row Level Security (RLS)** - User data privacy and isolation

### Charts & Visualization
- **Recharts** - React charting library
- **date-fns** - Date manipulation and formatting

### State Management
- **React Context API** + **useReducer** - Sufficient for app complexity
- **Custom hooks** - Encapsulate business logic

### Development Tools
- **ESLint** + **Prettier** - Code quality and formatting
- **TypeScript** - Type checking
- **Vite** - Hot module replacement, fast builds

### Deployment & Authentication
- **Netlify** - Free tier hosting
  - **Netlify Identity** - User authentication (free, no custom auth needed)
  - Automatic HTTPS
  - Continuous deployment from Git
  - 100GB bandwidth/month (more than enough)

### PWA Capabilities (Optional Phase 2)
- **Workbox** - Service worker for offline mode
- **vite-plugin-pwa** - PWA manifest and caching

### Testing (Optional)
- **Vitest** - Unit testing (Vite-native)
- **React Testing Library** - Component testing

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Supabase Database | **$0** | Free tier: 500 MB database, 1 GB file storage, 2 GB bandwidth/month |
| Netlify Hosting | **$0** | Free tier: 100GB bandwidth, 300 build minutes |
| Netlify Identity | **$0** | Free tier: 1,000 active users/month |
| Domain (optional) | **$0-12/year** | Use free .netlify.app subdomain or custom domain |
| **Total** | **$0/month** | Completely free to run |

**Estimated Usage (1 year solo use):**
- Database: ~10-20 MB (well within 500 MB limit)
- File Storage: ~100-200 MB for progress photos (well within 1 GB limit)
- Bandwidth: <500 MB/month (well within 2 GB limit)

---

## Project Structure

```
workout-app/
├── docs/
│   ├── program.md                  # Original program documentation
│   ├── log.md                      # Development log
│   ├── DEVELOPMENT.md              # This file
│   ├── ARCHITECTURE.md             # System architecture
│   ├── DATA_MODELS.md              # Database schemas
│   ├── FEATURES.md                 # Feature specifications
│   └── DEPLOYMENT.md               # Deployment guide
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── auth/                   # Authentication components
│   │   ├── workout/                # Workout-specific components
│   │   ├── nutrition/              # Nutrition components
│   │   ├── charts/                 # Chart components
│   │   └── layout/                 # Layout components
│   ├── lib/
│   │   ├── supabase/               # Supabase client and operations
│   │   ├── netlify/                # Netlify Identity integration
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Utility functions
│   │   └── constants/              # Program constants
│   ├── types/                      # TypeScript type definitions
│   ├── pages/                      # Route components
│   ├── contexts/                   # React contexts
│   ├── App.tsx                     # Root component
│   └── main.tsx                    # Entry point
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── netlify.toml                    # Netlify configuration
```

---

## Core Features (Priority Order)

### Phase 1: Foundation (Week 1)
**Goal:** Basic app structure, authentication, and database setup

1. **Project Setup**
   - Initialize Vite + React + TypeScript
   - Configure Tailwind CSS + shadcn/ui
   - Set up routing structure
   - Initialize Supabase client
   - Configure Netlify Identity

2. **Authentication**
   - Integrate Netlify Identity
   - Create login/signup flow
   - Protected routes
   - User session management

3. **Database Setup**
   - Create Supabase PostgreSQL schema
   - Enable Row Level Security (RLS)
   - Define TypeScript interfaces
   - Implement CRUD operations with Supabase client

4. **Basic Layout**
   - Navigation
   - Responsive layout structure
   - Theme setup (dark mode optional)

### Phase 2: Workout Tracker (Week 1-2)
**Goal:** Core workout logging with intelligent progression

1. **Workout Logger**
   - A/B workout split interface
   - Exercise list with method indicators (RPT/Kino/Rest-Pause)
   - Set/rep/weight input with validation
   - Real-time next-set calculations
   - Rest timer (method-specific)

2. **Progression System**
   - Expected vs actual tracking
   - Auto-calculation of next workout targets
   - Double progression logic
   - Plateau detection (2+ workouts no progress)

3. **Exercise Rotation**
   - Phase management (1, 2, 3)
   - Auto-swap exercises on phase change
   - Strength carryover calculations

4. **Workout History**
   - View past workouts
   - Filter by date, exercise, workout type
   - Edit historical data

### Phase 3: Program Enforcement (Week 2)
**Goal:** Guardrails to prevent methodology violations

1. **Frequency Lock**
   - Prevent 4+ workouts per week
   - Block consecutive day training
   - Enforce 48-hour CNS recovery

2. **Methodology Enforcer**
   - Lock exercises to correct training method
   - Validate rep ranges per method
   - Enforce proper rest periods

3. **Volume Monitor**
   - Track sets per muscle group
   - Block excessive volume
   - MEGA training timer (12-week max)

4. **Progression Validator**
   - Block weight increases without hitting rep targets
   - Enforce proper weight increments
   - Warmup set requirements

### Phase 4: Nutrition Module (Week 2)
**Goal:** Simple meal planning without daily tracking

1. **Stats Calculator**
   - One-time setup: bodyweight, goal, type
   - Auto-calculate maintenance calories
   - Training day vs rest day targets
   - Macro breakdown (protein, fat, carbs)

2. **Meal Plan Builder**
   - Create meal templates (Training Day, Rest Day)
   - Manual macro entry per meal
   - Real-time total calculation
   - Visual comparison to targets

3. **Quick Reference**
   - Daily view: "Today is Training Day"
   - Show saved meal plan
   - No logging required

### Phase 5: Progress & Analytics (Week 3)
**Goal:** Visualize progress and maintain motivation

1. **Exercise Progression Charts**
   - Line charts per exercise (Set 1, 2, 3)
   - Time period toggles (4 weeks, 8 weeks, 6 months, all time)
   - View by: weight, reps, volume, estimated 1RM
   - Phase annotations

2. **Workout Consistency Dashboard**
   - Calendar heatmap (GitHub-style)
   - Streak counter
   - Adherence metrics
   - Workout A/B distribution

3. **Fitness Standards Tracker**
   - Real-time tier calculation (Good/Great/Godlike)
   - Progress bars with current position
   - Distance to next tier
   - Multi-exercise comparison

4. **Body Composition Tracking**
   - Weekly bodyweight chart
   - Measurements (chest, waist, arms, shoulders, neck)
   - Trend lines and rate calculations
   - Goal weight overlay

### Phase 6: Polish & Deploy (Week 3-4)
**Goal:** Production-ready application

1. **Mobile Optimization**
   - Touch-friendly inputs
   - Responsive tables/charts
   - Mobile navigation
   - Landscape mode support

2. **Data Management**
   - Export to JSON/CSV
   - Import from backup
   - Data persistence verification
   - Clear all data option

3. **User Experience**
   - Loading states
   - Error handling
   - Form validation
   - Success messages
   - Onboarding flow

4. **Deployment**
   - Netlify configuration
   - Password protection setup
   - Environment variables
   - Performance optimization

### Phase 7: Advanced Features (Optional)
**Goal:** Nice-to-have enhancements

1. **PWA Capabilities**
   - Offline mode
   - Install to home screen
   - Background sync

2. **Advanced Analytics**
   - PR timeline
   - Phase comparison
   - Workout quality metrics
   - Success rate tracking

3. **Exercise Library**
   - Form cues and tips
   - Video demonstrations (embedded links)
   - Approved variations list

4. **Progress Photos**
   - Upload to Supabase Storage
   - Before/after comparisons
   - Monthly timeline

---

## Development Workflow

### Initial Setup
```bash
# Create Vite project
npm create vite@latest workout-app -- --template react-ts
cd workout-app
npm install

# Install dependencies
npm install react-router-dom
npm install @supabase/supabase-js
npm install netlify-identity-widget
npm install date-fns
npm install recharts
npm install lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui
npx shadcn-ui@latest init
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Git Workflow
```bash
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin <your-repo-url>
git push -u origin main
```

### Netlify Deployment
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Enable Netlify Identity:
   - Site settings → Identity → Enable Identity
   - Registration: Invite only (for personal use)
   - External providers: Email (or Google/GitHub if preferred)
4. Add environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

---

## Data Models Overview

### Core Entities

1. **UserProfile**
   - Bodyweight, goals, preferences
   - Current phase and week
   - Body measurements

2. **WorkoutSession**
   - Date, workout type (A/B)
   - Phase number
   - Completed exercises

3. **ExerciseLog**
   - Exercise name and method
   - Sets, reps, weight
   - Rest times, notes

4. **Exercise (Constants)**
   - Name, muscle group
   - Training method (RPT/Kino/Rest-Pause)
   - Rep ranges, rest periods
   - Approved variations

5. **MealPlan**
   - Name (Training Day, Rest Day)
   - Meals with macros
   - Total calories and macros

6. **BodyweightLog**
   - Date and weight
   - Measurements (optional)

7. **ProgressPhoto**
   - Date and Supabase Storage path
   - Notes

**All entities include `user_id` for Row Level Security (RLS)**

See `DATA_MODELS.md` for detailed PostgreSQL schemas.

---

## Key Business Logic

### Progression Calculation

**Double Progression System:**
```typescript
function calculateNextWorkout(currentLog: ExerciseLog) {
  const { weight, reps, targetRepRange } = currentLog;

  if (reps >= targetRepRange.max) {
    // Hit top of range, add weight
    const increment = getWeightIncrement(currentLog.exercise);
    return {
      weight: weight + increment,
      targetReps: targetRepRange.min
    };
  } else {
    // Stay at same weight, aim for more reps
    return {
      weight: weight,
      targetReps: reps + 1
    };
  }
}

function getWeightIncrement(exercise: Exercise): number {
  if (exercise.name.includes('Chinup') || exercise.name.includes('Dip')) {
    return 2.5; // Weighted bodyweight exercises
  }
  if (exercise.equipment === 'dumbbell') {
    return 5; // 5 lbs per hand = 10 total
  }
  return 5; // Barbell exercises
}
```

### RPT Set Calculation
```typescript
function calculateRPTSets(set1: { weight: number; reps: number }) {
  const set2Weight = Math.round((set1.weight * 0.9) / 2.5) * 2.5; // 10% reduction, round to nearest 2.5
  const set3Weight = Math.round((set2Weight * 0.9) / 2.5) * 2.5;

  return [
    { set: 1, weight: set1.weight, targetReps: '4-5' },
    { set: 2, weight: set2Weight, targetReps: '6-7' },
    { set: 3, weight: set3Weight, targetReps: '8-10' }
  ];
}
```

### Plateau Detection
```typescript
function detectPlateau(exerciseLogs: ExerciseLog[]): boolean {
  const recent = exerciseLogs.slice(-3); // Last 3 workouts

  if (recent.length < 3) return false;

  const firstSet = recent.map(log => log.sets[0]);
  const sameWeight = firstSet.every(set => set.weight === firstSet[0].weight);
  const sameReps = firstSet.every(set => set.reps === firstSet[0].reps);

  return sameWeight && sameReps;
}
```

### Fitness Standards Calculation
```typescript
function getFitnessTier(exercise: Exercise, weight: number, reps: number, bodyweight: number): Tier {
  const relativeStrength = weight / bodyweight;
  const standards = EXERCISE_STANDARDS[exercise.name];

  if (reps >= 5) {
    if (relativeStrength >= standards.godlike) return 'GODLIKE';
    if (relativeStrength >= standards.great) return 'GREAT';
    if (relativeStrength >= standards.good) return 'GOOD';
  }

  return 'BEGINNER';
}
```

### Calorie/Macro Calculation
```typescript
function calculateNutrition(profile: UserProfile) {
  const maintenance = profile.bodyweight * 15; // Base formula

  const targets = {
    leanBulk: {
      training: maintenance + 500,
      rest: maintenance + 100
    },
    recomp: {
      training: maintenance + 400,
      rest: maintenance - 300
    }
  };

  const protein = profile.goalBodyweight * 1; // 1g per lb
  const fatCalories = targets[profile.goal].training * 0.25;
  const fat = fatCalories / 9; // 9 cal per gram
  const carbCalories = targets[profile.goal].training - (protein * 4) - (fat * 9);
  const carbs = carbCalories / 4; // 4 cal per gram

  return { protein, fat, carbs };
}
```

---

## Testing Strategy

### Critical Paths to Test

1. **Workout Logging**
   - Creating new workout session
   - Logging sets with various methods (RPT/Kino/Rest-Pause)
   - Editing historical workouts
   - Deleting workouts

2. **Progression Logic**
   - Double progression calculations
   - Weight increment validation
   - Plateau detection
   - Exercise rotation triggers

3. **Guardrails**
   - Frequency blocking (4+ workouts)
   - Consecutive day prevention
   - Volume ceiling enforcement
   - Methodology locking

4. **Data Persistence**
   - Supabase CRUD operations
   - Data export/import
   - Multi-device sync
   - Cloud backup

5. **Calculations**
   - RPT set weight calculations
   - Nutrition macro calculations
   - Fitness tier calculations
   - Relative strength ratios

### Testing Approach
- **Unit tests** for business logic functions
- **Integration tests** for database operations
- **Manual testing** for UI/UX flows
- **E2E tests** (optional) for critical user journeys

---

## Performance Considerations

### Optimization Strategies

1. **Data Loading**
   - Lazy load historical data (pagination)
   - Use Supabase indexes for fast queries
   - Virtualize long lists (react-window if needed)

2. **Chart Rendering**
   - Limit data points (downsample for large ranges)
   - Debounce chart updates
   - Memoize expensive calculations

3. **State Management**
   - Use React.memo for pure components
   - useMemo/useCallback for expensive operations
   - Context splitting (workout context separate from nutrition)

4. **Bundle Size**
   - Code splitting by route
   - Tree-shake unused components
   - Dynamic imports for charts

5. **Database Optimization**
   - Batch writes when possible
   - Use Supabase indexes for fast queries
   - Use .limit() to constrain query result size

---

## Security & Privacy

### Data Storage
- **Cloud backend** - all data stored in Supabase PostgreSQL
- Multi-device access with automatic sync
- Row Level Security (RLS) ensures data isolation
- Encrypted in transit (HTTPS) and at rest
- No analytics or tracking
- No third-party API calls (except Supabase backend)

### User Authentication
- User authentication via Netlify Identity
- Email/password login or OAuth (Google, GitHub)
- Prevents public access to the app
- Free tier includes 1,000 active users/month

### Data Export
- Allow user to export all data as JSON
- Import backup to restore
- User owns and controls all data

---

## Browser Support

### Minimum Requirements
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- JavaScript enabled (for Supabase client)
- ES2020+ JavaScript features
- CSS Grid and Flexbox

### Tested Browsers
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android 10+)

---

## Accessibility

### WCAG 2.1 AA Compliance Goals

1. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Focus indicators visible
   - Logical tab order

2. **Screen Readers**
   - Semantic HTML
   - ARIA labels where needed
   - Alt text for images

3. **Color Contrast**
   - Minimum 4.5:1 for text
   - 3:1 for UI components
   - Don't rely solely on color

4. **Responsive Text**
   - Support browser zoom (up to 200%)
   - Relative units (rem/em)

---

## Future Enhancements (Backlog)

### Nice-to-Have Features
- Dark mode toggle
- Multiple user profiles (share device)
- Export charts as images
- Progress sharing (social media)
- Voice input for logging (Web Speech API)
- Apple Health / Google Fit integration (if needed)
- Rest timer notifications (Web Notifications API)
- Workout reminders
- Achievement system (gamification)

### Advanced Analytics
- Predict time to reach goals
- Volume/intensity periodization tracking
- Muscle group balance analysis
- Recovery metrics
- Exercise correlation analysis (which lifts improve together)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All features tested on mobile and desktop
- [ ] Data persistence verified
- [ ] Export/import tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Form validation complete
- [ ] TypeScript errors resolved
- [ ] Build succeeds without warnings
- [ ] Performance audit passed (Lighthouse)
- [ ] Accessibility audit passed

### Netlify Setup
- [ ] GitHub repo connected
- [ ] Build settings configured
- [ ] Netlify Identity enabled and configured
- [ ] Supabase environment variables set (URL + anon key)
- [ ] Custom domain (optional) configured
- [ ] HTTPS enabled (automatic)
- [ ] 404 page configured (SPA redirect)

### Post-Deployment
- [ ] Test on actual mobile devices
- [ ] Create test user account via Netlify Identity
- [ ] Test multi-device sync (phone + desktop)
- [ ] Verify Supabase free tier quota sufficient
- [ ] Monitor Netlify bandwidth usage
- [ ] Document any deployment issues
- [ ] Create user guide (optional)

---

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review Netlify bandwidth usage
- Backup data export template
- Monitor browser compatibility
- Review user feedback (if collecting)

### Data Migration Strategy
If database schema changes:
1. Create new migration file in Supabase
2. Apply migration via Supabase dashboard or MCP tool
3. Update TypeScript types (regenerate from schema)
4. Test with development data first

---

## Support & Documentation

### User Documentation (Optional)
- Quick start guide
- Feature overview
- FAQ
- Troubleshooting

### Developer Documentation
- Code comments for complex logic
- JSDoc for public functions
- README.md with setup instructions
- This development guide

---

## Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- Time to interactive < 3 seconds
- Lighthouse score > 90
- Zero TypeScript errors
- Zero console errors

### User Experience Metrics
- Workout logging time < 2 minutes
- Zero methodology violations possible
- 100% data persistence reliability
- Mobile usability score 100%

---

## Questions & Decisions Log

### Open Questions
- Do we need offline mode (PWA) in Phase 1?
- Should we add video exercise demonstrations?
- Should we add social features (sharing progress)?

### Design Decisions
- **Why Supabase?** - Free tier sufficient, multi-device sync, PostgreSQL, real-time capabilities
- **Why Netlify Identity?** - No custom auth needed, free tier, works seamlessly with Netlify hosting
- **Why shadcn/ui?** - High quality, accessible, customizable, no bloat
- **Why Recharts?** - Actively maintained, good docs, sufficient features
- **Why no Redux?** - Context API sufficient for app complexity, simpler to maintain

---

## Getting Started

### For Development
See detailed implementation guide in `docs/IMPLEMENTATION_ROADMAP.md`

### For Deployment
See deployment instructions in `docs/DEPLOYMENT.md`

### For Architecture
See system design in `docs/ARCHITECTURE.md`

### For Data Models
See database schemas in `docs/DATA_MODELS.md`

---

## Contact & Support

**Developer:** Danny
**Project Start:** November 2025
**Target Launch:** December 2025 (4 weeks)
**Repository:** (Add GitHub URL when created)

---

*Last Updated: November 16, 2025*
