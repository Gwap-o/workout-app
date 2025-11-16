# Kinobody Greek God 2.0 Workout Tracker

A comprehensive, free workout tracking application specifically designed for the Kinobody Greek God 2.0 program. Track workouts with intelligent progression, enforce methodology guardrails, plan nutrition, and analyze progress—all synced across devices at zero cost.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

### Workout Tracking
- **A/B Split System** with phase-specific exercises (3 phases × 8 weeks each)
- **RPT Auto-Calculation** (Reverse Pyramid Training: -10% weight per set)
- **Double Progression System** (automatic weight/rep suggestions)
- **Multiple Training Methods**: RPT, Kino Rep, Rest-Pause, Standard Sets, MEGA Training
- **Plateau Detection** with actionable recommendations
- **Complete Exercise History** with filtering and search

### Methodology Guardrails
- ✅ Maximum 3 workouts per week (strict enforcement)
- ✅ No consecutive day training (48-hour CNS recovery)
- ✅ Volume monitoring (week-over-week tracking)
- ✅ Training method locking (no mid-phase changes)
- ✅ MEGA training 12-week limit
- ✅ Phase rotation enforcement (8-week cycles)
- ✅ Deload recommendations

### Nutrition Planning
- **Smart Calculator**: Auto-calculates BMR, TDEE, and macros
- **Training vs Rest Days**: Different calorie targets based on workout days
- **Meal Plan Builder**: Create custom meal templates
- **Macro Tracking**: Real-time comparison to targets
- **Goal Presets**: Lean Bulk, Recomp

### Progress Analytics
- **Exercise Progression Charts**: Line graphs showing volume and estimated 1RM
- **Fitness Standards Tracker**: Beginner/Good/Great/Godlike tiers (bodyweight-scaled)
- **Workout Consistency**: GitHub-style calendar heatmap + streak counter
- **Body Measurements**: Track weight, chest, arms, waist, and more
- **Progress Photos**: Upload and compare transformation photos
- **5-Tab Analytics Dashboard**: Comprehensive progress insights

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript (strict mode)
- **Vite** for fast builds and dev experience
- **Tailwind CSS** v4 for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **React Router** v6 for navigation
- **date-fns** for date handling

### Backend & Services
- **Supabase** (PostgreSQL database + Storage)
- **Netlify Identity** (authentication with JWT)
- **Netlify** (hosting and deployment)

### Security
- Row Level Security (RLS) on all database tables
- JWT-based authentication
- Environment variable protection
- Publishable key architecture (no exposed secrets)

## 💰 Cost

**Total Monthly Cost: $0**

- Supabase Free Tier: 500 MB database, 1 GB storage
- Netlify Free Tier: 100 GB bandwidth, 1,000 Identity users
- Perfectly suited for personal use

## 📊 Project Status - ALL 4 WEEKS COMPLETE ✅

### Week 1 - Foundation ✅
- Database fully configured (7 tables, RLS enabled)
- React app initialized with authentication
- Supabase + Netlify Identity integration
- Basic project structure

### Week 2 - Workout Tracking ✅
- Workout logging interface with RPT calculations
- Double progression system
- Plateau detection
- Exercise history viewer

### Week 3 - Guardrails & Nutrition ✅
- All 5 methodology guardrails enforced
- Nutrition calculator with BMR/TDEE
- Meal plan builder
- Phase rotation system
- Comprehensive settings page

### Week 4 - Analytics & Deployment ✅
- Exercise progression charts
- Fitness standards tracker
- Workout consistency (heatmap + streaks)
- Body measurements tracking
- Progress photos upload/gallery
- Netlify deployment configuration

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Netlify account ([netlify.com](https://netlify.com))
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Gwap-o/workout-app.git
cd workout-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API**
3. Copy your **Project URL** and **Publishable Key**

**CRITICAL - Use Publishable Keys:**
Per [Supabase's guidance](https://github.com/orgs/supabase/discussions/29260), always use publishable keys (`sb_publishable_...`) instead of deprecated anon keys.

4. Create `.env.local` in project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

5. **Database Setup:**

The database schema has already been created via Supabase MCP. To verify:
- Check that all 7 tables exist in Supabase Dashboard → Database → Tables
- Verify RLS is enabled on all tables
- Confirm the `progress-photos` storage bucket exists

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

**Note**: Authentication requires Netlify Identity, which only works in deployed environments. Deploy first for full testing.

## 🌐 Deployment to Netlify

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Netlify

1. Sign in to [netlify.com](https://netlify.com)
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub** and authorize
4. Select repository: `Gwap-o/workout-app`
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

### Step 3: Add Environment Variables

1. Go to **Site settings → Environment variables**
2. Add these variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your publishable key
3. Click **"Save"**
4. **Trigger redeploy**: Deploys → Trigger deploy → Deploy site

### Step 4: Enable Netlify Identity

1. Go to **Site settings → Identity**
2. Click **"Enable Identity"**
3. Under **Registration**, choose:
   - **Invite only** (for personal use)
   - **Open** (if sharing with others)
4. (Optional) Configure external providers (Google, GitHub OAuth)

### Step 5: Test Your Deployment

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Click **"Sign Up"** to create an account
3. Verify email if required
4. Log in and start using the app!

## 📖 User Guide

### Getting Started

1. **Create Account**: Sign up via Netlify Identity
2. **Set Up Profile**: Settings → Profile, enter your stats
3. **Calculate Nutrition**: Nutrition tab, run calculator
4. **Log First Workout**: Workout Logger
5. **Track Progress**: View Progress tab

### Logging a Workout

1. Navigate to **Workout Logger**
2. Select workout type (A or B) and date
3. Enter weight/reps for each exercise
4. RPT calculations happen automatically
5. Click **"Save Workout"**

### Understanding Progression

**Double Progression System:**
- Hit top of rep range → increase weight, reset reps
- Below top range → keep weight, add reps

**Example:**
- Week 1: 135 lbs × 6 reps → Next: 135 lbs, aim for 7+
- Week 2: 135 lbs × 8 reps → Next: 140 lbs, reset to 6

## 📁 Project Structure

```
workout-app/
├── src/
│   ├── components/
│   │   ├── auth/                 # Login, Signup, ProtectedRoute
│   │   ├── charts/               # Analytics charts
│   │   ├── layout/               # Navigation, Layout
│   │   ├── nutrition/            # Meal planner, Calculator
│   │   ├── settings/             # Settings pages
│   │   └── workout/              # Workout logging UI
│   ├── contexts/                 # React contexts (Auth)
│   ├── lib/
│   │   ├── constants/            # Exercises, phases
│   │   ├── hooks/                # Custom React hooks
│   │   ├── supabase/             # Database CRUD
│   │   └── utils/                # Utilities (progression, nutrition, validation)
│   ├── pages/                    # Route pages
│   ├── types/                    # TypeScript interfaces
│   ├── App.tsx                   # Router
│   └── main.tsx                  # Entry point
├── .env.local                    # Environment variables (DO NOT COMMIT)
├── netlify.toml                  # Netlify configuration
└── tsconfig.json
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Guidelines

- TypeScript strict mode (zero errors required)
- Functional React components with hooks
- shadcn/ui for consistent styling
- Proper error handling and loading states
- Always use Supabase MCP for database operations

## 📊 Database Schema

7 main tables (all with RLS enabled):

1. **user_profiles**: User stats, current phase, nutrition targets
2. **workout_sessions**: Individual workout records
3. **exercise_logs**: Sets, reps, weight per exercise (JSONB)
4. **bodyweight_logs**: Weight tracking over time
5. **meal_plans**: Nutrition meal templates
6. **progress_photos**: Photo metadata (files in Supabase Storage)
7. **user_settings**: App preferences (JSONB)

See `docs/DATA_MODELS.md` for complete schema.

## 🛡️ Methodology Guardrails

The app enforces Kinobody methodology to prevent overtraining:

1. **Max 3 Workouts/Week**: Blocks 4th workout attempt
2. **No Consecutive Days**: Requires 48-hour rest
3. **Volume Monitoring**: Warns on 10%+ increases
4. **Training Method Lock**: Can't change mid-phase
5. **MEGA Limit**: 12-week maximum
6. **Phase Rotation**: Enforces 8-week phases

These rules **cannot be bypassed** without manual override.

## 🔐 Security

- **Row Level Security (RLS)** on all tables
- **JWT Authentication** via Netlify Identity
- **Publishable Keys** (not anon keys - [see why](https://github.com/orgs/supabase/discussions/29260))
- **Environment Variables** protected via `.gitignore`
- **No Sensitive Data** in client-side code

## 📝 License

MIT License

## 🙏 Acknowledgments

- **Kinobody** for the Greek God 2.0 program
- **Supabase** for the backend platform
- **Netlify** for hosting and identity
- **shadcn/ui** for components
- **Recharts** for data visualization

## 📞 Support

For issues or questions:
1. Check `docs/` folder for documentation
2. Review `.claude.md` for development guidelines
3. Open an issue on GitHub

## 🗺️ Future Enhancements

- [ ] PWA support (offline mode)
- [ ] Supabase Realtime (live sync)
- [ ] Exercise video demonstrations
- [ ] Advanced analytics (predicted trends)
- [ ] Workout templates
- [ ] Mobile app (React Native)

---

**Built with ❤️ for fitness tracking**

*Zero cost. Maximum gains.*
