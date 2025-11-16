# Supabase Backend Integration with Netlify Identity

## Overview

This document outlines the integration of **Supabase** as the backend database and **Netlify Identity** for authentication in the Kinobody Workout Tracker, enabling **multi-device synchronization** and **cloud backup** while remaining **completely free**.

**Key Benefits:**
- Access your data from phone, tablet, and desktop
- Automatic cloud backup
- Real-time sync across devices
- Secure authentication via Netlify Identity
- Row Level Security (RLS) for data privacy
- Still 100% free (Supabase + Netlify free tiers)

---

## Supabase Free Tier

**What's Included:**
- 500 MB database storage
- 1 GB file storage (for progress photos)
- 2 GB bandwidth per month
- 50,000 monthly active users (way more than needed)
- Unlimited API requests
- Row Level Security (RLS) for privacy
- Real-time subscriptions

**Estimated Usage (1 year of solo use):**
- Database: ~5-10 MB
- Photos: ~100 MB (if uploading monthly)
- Bandwidth: <100 MB/month
- **Well within free tier limits**

---

## Updated Architecture

### New Tech Stack

**Backend:**
- **Supabase** - PostgreSQL database + authentication
- **Supabase JS Client** - TypeScript SDK
- **Row Level Security (RLS)** - User data privacy

**Frontend (unchanged):**
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Recharts for charts

**Data Flow:**
```
React App → Supabase Client → Supabase API → PostgreSQL Database
                                          ↓
                                    Storage Bucket (photos)
```

---

## Database Schema (PostgreSQL)

### Updated Schema

Instead of IndexedDB tables, we'll use PostgreSQL tables in Supabase:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase Auth handles this automatically)
-- We'll reference auth.users(id) in our tables

-- User Profile
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

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
  workout_schedule JSONB NOT NULL, -- Array of days

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

-- Workout Sessions
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('A', 'B')),
  phase INTEGER NOT NULL CHECK (phase IN (1, 2, 3)),
  completed BOOLEAN DEFAULT FALSE,
  duration INTEGER, -- minutes
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise Logs
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,

  exercise_name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  training_method TEXT NOT NULL CHECK (training_method IN ('RPT', 'Kino', 'RestPause')),

  sets JSONB NOT NULL, -- Array of set objects
  expected_performance JSONB,
  hit_progression BOOLEAN DEFAULT FALSE,

  notes TEXT,
  date DATE NOT NULL, -- Denormalized for fast queries

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bodyweight Logs
CREATE TABLE bodyweight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  weight DECIMAL(5,1) NOT NULL,
  measurements JSONB, -- Chest, waist, arms, shoulders, neck

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Plans
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('training', 'rest')),
  meals JSONB NOT NULL, -- Array of meal objects

  total_calories INTEGER NOT NULL,
  total_protein INTEGER NOT NULL,
  total_fat INTEGER NOT NULL,
  total_carbs INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Photos (metadata only, actual images in Storage)
CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  image_type TEXT CHECK (image_type IN ('front', 'side', 'back')),
  weight DECIMAL(5,1),
  phase INTEGER,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings
CREATE TABLE user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, date DESC);
CREATE INDEX idx_exercise_logs_user_exercise ON exercise_logs(user_id, exercise_name, date DESC);
CREATE INDEX idx_exercise_logs_session ON exercise_logs(session_id);
CREATE INDEX idx_bodyweight_logs_user_date ON bodyweight_logs(user_id, date DESC);
CREATE INDEX idx_meal_plans_user_type ON meal_plans(user_id, type);
CREATE INDEX idx_progress_photos_user_date ON progress_photos(user_id, date DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Row Level Security (RLS)

**Critical for privacy:** Users should only see their own data.

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bodyweight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data

-- User Profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Workout Sessions
CREATE POLICY "Users can view own workouts" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Exercise Logs
CREATE POLICY "Users can view own exercise logs" ON exercise_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise logs" ON exercise_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise logs" ON exercise_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise logs" ON exercise_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Bodyweight Logs
CREATE POLICY "Users can view own bodyweight logs" ON bodyweight_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bodyweight logs" ON bodyweight_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bodyweight logs" ON bodyweight_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bodyweight logs" ON bodyweight_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Meal Plans
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" ON meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" ON meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Progress Photos
CREATE POLICY "Users can view own photos" ON progress_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos" ON progress_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON progress_photos
  FOR DELETE USING (auth.uid() = user_id);

-- User Settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## Supabase Storage (for Progress Photos)

```sql
-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false);

-- RLS for storage bucket
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'progress-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'progress-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Frontend Integration

### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Supabase Client Setup

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase'; // Generated types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### TypeScript Types Generation

```bash
# Generate TypeScript types from Supabase schema
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

---

## Authentication with Netlify Identity

### Why Netlify Identity?

**Chosen over Supabase Auth because:**
- No custom authentication code needed
- Seamless integration with Netlify hosting
- Free tier: 1,000 active users/month
- Provides JWT tokens that work with Supabase RLS
- User specifically requested Netlify auth

### Install Netlify Identity Widget

```bash
npm install netlify-identity-widget
```

### Netlify Identity Setup

```typescript
// src/lib/netlify/identity.ts
import netlifyIdentity from 'netlify-identity-widget';

// Initialize Netlify Identity
export const initNetlifyIdentity = () => {
  netlifyIdentity.init({
    container: '#netlify-modal', // Optional: custom modal container
  });
};

// Auth methods
export const login = () => netlifyIdentity.open('login');
export const signup = () => netlifyIdentity.open('signup');
export const logout = () => netlifyIdentity.logout();
export const getCurrentUser = () => netlifyIdentity.currentUser();

// Event listeners
netlifyIdentity.on('init', (user) => {
  console.log('Identity initialized', user);
});

netlifyIdentity.on('login', (user) => {
  console.log('User logged in:', user);
  netlifyIdentity.close(); // Close the modal
});

netlifyIdentity.on('logout', () => {
  console.log('User logged out');
});

netlifyIdentity.on('error', (err) => {
  console.error('Identity error:', err);
});
```

### Supabase Client with Netlify Identity JWT

Update Supabase client to use Netlify Identity tokens:

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import netlifyIdentity from 'netlify-identity-widget';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: async () => {
      const user = netlifyIdentity.currentUser();

      if (user?.token?.access_token) {
        return {
          Authorization: `Bearer ${user.token.access_token}`,
        };
      }

      return {};
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

### Auth Context with Netlify Identity

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

interface NetlifyUser {
  id: string;
  email: string;
  user_metadata: any;
  app_metadata: any;
  token?: {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    token_type: string;
  };
}

interface AuthContextType {
  user: NetlifyUser | null;
  loading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<NetlifyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init();

    // Get current user
    const currentUser = netlifyIdentity.currentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for login
    netlifyIdentity.on('login', (user) => {
      setUser(user);
      netlifyIdentity.close();
    });

    // Listen for logout
    netlifyIdentity.on('logout', () => {
      setUser(null);
    });

    // Cleanup listeners
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const login = () => netlifyIdentity.open('login');
  const signup = () => netlifyIdentity.open('signup');
  const logout = () => netlifyIdentity.logout();

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Login/Signup Components

```typescript
// src/pages/Login.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Kinobody Workout Tracker</h1>
        <p className="mb-6 text-muted-foreground">
          Track your Greek God 2.0 program progress
        </p>
        <div className="space-y-4">
          <Button onClick={login} className="w-full">
            Log In
          </Button>
          <Button onClick={signup} variant="outline" className="w-full">
            Sign Up
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

### Protected Routes

```typescript
// src/components/auth/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### Usage in App

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Other protected routes */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## CRUD Operations (Examples)

### User Profile

```typescript
// src/lib/supabase/userProfile.ts
import { supabase } from './client';
import type { UserProfile } from '../types';

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const createUserProfile = async (profile: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
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

### Workout Sessions

```typescript
// src/lib/supabase/workouts.ts
import { supabase } from './client';
import type { WorkoutSession } from '../types';

export const createWorkoutSession = async (session: Partial<WorkoutSession>) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWorkoutHistory = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, exercise_logs(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getWorkoutById = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, exercise_logs(*)')
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
};
```

### Exercise Logs

```typescript
// src/lib/supabase/exercises.ts
import { supabase } from './client';

export const getExerciseHistory = async (
  userId: string,
  exerciseName: string,
  limit = 10
) => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_name', exerciseName)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const createExerciseLog = async (log: Partial<ExerciseLog>) => {
  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Progress Photos

```typescript
// src/lib/supabase/photos.ts
import { supabase } from './client';

export const uploadProgressPhoto = async (
  userId: string,
  file: File,
  metadata: { date: Date; weight?: number; notes?: string }
) => {
  // Upload to storage
  const filePath = `${userId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Create database record
  const { data, error } = await supabase
    .from('progress_photos')
    .insert({
      user_id: userId,
      storage_path: filePath,
      date: metadata.date,
      weight: metadata.weight,
      notes: metadata.notes
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProgressPhotos = async (userId: string) => {
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  // Get signed URLs for images
  const photosWithUrls = await Promise.all(
    data.map(async (photo) => {
      const { data: { signedUrl } } = await supabase.storage
        .from('progress-photos')
        .createSignedUrl(photo.storage_path, 3600); // 1 hour expiry

      return { ...photo, imageUrl: signedUrl };
    })
  );

  return photosWithUrls;
};
```

---

## Real-time Subscriptions (Optional)

For live updates across devices:

```typescript
// src/lib/supabase/realtime.ts
import { supabase } from './client';

export const subscribeToWorkouts = (userId: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel('workout-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workout_sessions',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
```

---

## Updated Project Structure

```
workout-app/
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase client setup
│   │   │   ├── userProfile.ts      # User profile CRUD
│   │   │   ├── workouts.ts         # Workout CRUD
│   │   │   ├── exercises.ts        # Exercise CRUD
│   │   │   ├── nutrition.ts        # Meal plan CRUD
│   │   │   ├── photos.ts           # Photo upload/download
│   │   │   └── realtime.ts         # Real-time subscriptions
│   │   ├── netlify/
│   │   │   └── identity.ts         # Netlify Identity helpers
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Utility functions
│   │   └── constants/              # Program constants
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Auth state
│   │   ├── WorkoutContext.tsx      # Workout state
│   │   └── UserContext.tsx         # User profile state
│   ├── types/
│   │   ├── supabase.ts             # Generated Supabase types
│   │   └── index.ts                # Additional types
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── ... (other components)
│   └── pages/
│       ├── Login.tsx
│       ├── Signup.tsx
│       └── ... (other pages)
├── .env.local                       # Supabase credentials
└── supabase/
    ├── migrations/                  # Database migrations
    └── seed.sql                     # Sample data
```

---

## Deployment Updates

### Netlify Environment Variables

Add in Netlify dashboard (Site settings → Environment variables):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Enable Netlify Identity

1. Go to Netlify dashboard → Site settings → Identity
2. Click "Enable Identity"
3. Registration preferences:
   - **Invite only** (for personal use)
   - Or **Open** if you want public signups
4. External providers (optional):
   - Enable Google/GitHub OAuth if desired
5. Emails:
   - Customize confirmation and invitation templates if needed

---

## Cost Breakdown (Updated)

| Service | Cost | Notes |
|---------|------|-------|
| Supabase | **$0** | Free tier: 500 MB DB, 1 GB storage, 2 GB bandwidth |
| Netlify Hosting | **$0** | Free tier: 100 GB bandwidth |
| Netlify Identity | **$0** | Free tier: 1,000 users/month |
| Domain (optional) | **$0-12/year** | Use free subdomain or custom |
| **Total** | **$0/month** | Completely free! |

---

## Development Workflow with MCP

Since you have the Supabase MCP connector:

### Using MCP for Development

```typescript
// You can use MCP tools during development:
// - List tables
// - Execute SQL
// - Apply migrations
// - Check project status

// Example: Check tables
// Use MCP tool: list_tables({ project_id: 'your-project' })

// Example: Run migration
// Use MCP tool: apply_migration({
//   project_id: 'your-project',
//   name: 'create_user_profiles',
//   query: 'CREATE TABLE ...'
// })
```

---

## Next Steps

1. **Set up Supabase project** (5 min)
   - Create account at supabase.com
   - Create new project
   - Copy URL and anon key to `.env.local`

2. **Create database schema** (30 min)
   - Run SQL migrations from DATA_MODELS.md
   - Enable RLS on all tables
   - Create storage bucket `progress-photos`

3. **Set up Netlify Identity** (5 min)
   - Deploy to Netlify
   - Enable Identity in dashboard
   - Configure registration preferences
   - Add environment variables for Supabase

4. **Implement frontend code** (1-2 hours)
   - Install dependencies: `@supabase/supabase-js`, `netlify-identity-widget`
   - Create Supabase client with Netlify JWT integration
   - Implement AuthContext
   - Build Login/Signup pages
   - Add Protected Routes

5. **Test multi-device sync** (30 min)
   - Sign up and log in on phone
   - Log a workout
   - Log in on desktop
   - Verify workout appears
   - Test RLS (data isolation)

---

**With Supabase, your app is now:**
- ✅ Multi-device compatible
- ✅ Cloud-backed
- ✅ Auto-syncing
- ✅ Still 100% free
- ✅ More scalable

*Last Updated: November 16, 2025*
