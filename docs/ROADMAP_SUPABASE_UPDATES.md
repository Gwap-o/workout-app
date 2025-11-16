# Implementation Roadmap - Supabase + Netlify Auth Updates

**This document supplements IMPLEMENTATION_ROADMAP.md with Supabase-specific updates**

---

## Key Changes from Original Roadmap

### Week 1 Updates

**Day 1-2: Project Setup & Supabase**
- ✅ Already updated in IMPLEMENTATION_ROADMAP.md
- Added Supabase project creation
- Added PostgreSQL schema setup
- Replaced Dexie with @supabase/supabase-js
- Added netlify-identity-widget

**Day 3-4: Authentication & Supabase Client (NEW)**

Replace "Database & Data Models" section with:

**Tasks:**
- [ ] Set up Netlify Identity integration
- [ ] Create Supabase client configuration
- [ ] Implement AuthContext with Netlify Identity
- [ ] Create protected routes
- [ ] Build Login/Signup pages
- [ ] Test authentication flow
- [ ] Create Supabase CRUD operations (userProfile, workouts)

**Files to Create:**
```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Supabase client setup
│   │   ├── userProfile.ts         # User profile CRUD
│   │   ├── workouts.ts            # Workout CRUD
│   │   ├── exercises.ts           # Exercise CRUD
│   │   └── photos.ts              # Photo upload/download
│   └── netlify/
│       └── identity.ts            # Netlify Identity helpers
├── contexts/
│   └── AuthContext.tsx            # Netlify Identity context
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       └── ProtectedRoute.tsx
└── pages/
    ├── Login.tsx
    └── Signup.tsx
```

**Netlify Identity Setup:**
```typescript
// src/lib/netlify/identity.ts
import netlifyIdentity from 'netlify-identity-widget';

export const initIdentity = () => {
  netlifyIdentity.init({
    container: '#netlify-modal',
  });
};

export const login = () => netlifyIdentity.open('login');
export const signup = () => netlifyIdentity.open('signup');
export const logout = () => netlifyIdentity.logout();
export const getCurrentUser = () => netlifyIdentity.currentUser();

// Listen for login events
netlifyIdentity.on('login', (user) => {
  console.log('User logged in:', user);
  netlifyIdentity.close();
});

netlifyIdentity.on('logout', () => {
  console.log('User logged out');
});
```

**Supabase Client Setup:**
```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import netlifyIdentity from 'netlify-identity-widget';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});
```

**AuthContext with Netlify Identity:**
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

interface AuthContextType {
  user: any | null;
  login: () => void;
  signup: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    netlifyIdentity.init();

    const currentUser = netlifyIdentity.currentUser();
    setUser(currentUser);
    setLoading(false);

    netlifyIdentity.on('login', (user) => {
      setUser(user);
      netlifyIdentity.close();
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const login = () => netlifyIdentity.open('login');
  const signup = () => netlifyIdentity.open('signup');
  const logout = () => netlifyIdentity.logout();

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Deliverables:**
- ✅ Netlify Identity authentication working
- ✅ Supabase client configured with JWT from Netlify
- ✅ Login/Signup flow functional
- ✅ Protected routes implemented
- ✅ Basic CRUD operations tested

---

### Week 2-4: No Major Changes

The rest of the implementation roadmap (Week 2-4) remains largely the same, with these minor updates:

**All Database Operations:**
- Replace Dexie calls with Supabase client calls
- Use `supabase.from('table_name')` instead of `db.tableName`
- Handle async operations with Supabase
- Use RLS for security instead of manual user filtering

**Example Replacements:**

**Old (Dexie):**
```typescript
const workout = await db.workoutSessions.add({
  date: new Date(),
  workoutType: 'A',
  phase: 1
});
```

**New (Supabase):**
```typescript
const { data: user } = await supabase.auth.getUser();
const { data: workout, error } = await supabase
  .from('workout_sessions')
  .insert({
    user_id: user.id,
    date: new Date().toISOString(),
    workout_type: 'A',
    phase: 1
  })
  .select()
  .single();
```

---

## Deployment Updates (Week 4)

### Netlify Configuration

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Enable Netlify Identity

1. Go to Netlify dashboard
2. Site settings → Identity → Enable Identity
3. Registration preferences:
   - **Invite only** (for personal use)
   - Or **Open** if you want public signups
4. External providers (optional):
   - Enable Google/GitHub OAuth if desired
5. Emails:
   - Confirmation template
   - Invitation template
6. Services:
   - Git Gateway: Enable if using CMS (not needed for this app)

### Environment Variables

In Netlify dashboard (Site settings → Environment variables):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Testing Checklist Updates

**Authentication Testing:**
- [ ] Sign up with email
- [ ] Confirm email
- [ ] Login with credentials
- [ ] Logout
- [ ] Refresh token works
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login

**Multi-Device Testing:**
- [ ] Log in on phone
- [ ] Log workout on phone
- [ ] Check if workout appears on desktop
- [ ] Log workout on desktop
- [ ] Verify sync on phone
- [ ] Test simultaneous edits (conflict resolution)

**Supabase Testing:**
- [ ] RLS prevents cross-user data access
- [ ] CRUD operations work for all tables
- [ ] Photo upload to Storage works
- [ ] Signed URLs generated for photos
- [ ] Data export includes all user data

---

## Updated Testing Strategy

### Local Development
```bash
# Start Supabase local development (optional)
npx supabase start

# Or test against cloud Supabase directly
npm run dev
```

### Production Testing
1. Deploy to Netlify
2. Enable Netlify Identity
3. Create test account
4. Test full workout logging flow
5. Verify multi-device sync
6. Check RLS (try to access other user's data - should fail)

---

## Troubleshooting Common Issues

### Netlify Identity + Supabase RLS

**Issue:** RLS policies don't recognize Netlify Identity JWT

**Solution:** Ensure Supabase client sends Authorization header:
```typescript
const supabase = createClient(url, key, {
  global: {
    headers: async () => {
      const user = netlifyIdentity.currentUser();
      return user?.token?.access_token
        ? { Authorization: `Bearer ${user.token.access_token}` }
        : {};
    },
  },
});
```

**Issue:** User ID mismatch between Netlify Identity and Supabase

**Solution:** Use Netlify Identity's user.id in Supabase user_id fields:
```typescript
const user = netlifyIdentity.currentUser();
await supabase.from('user_profiles').insert({
  user_id: user.id, // Use Netlify Identity ID
  ...profile
});
```

### Multi-Device Sync Issues

**Issue:** Changes not appearing across devices

**Solution:**
- Check if RLS policies are correct (auth.jwt() ->> 'sub' = user_id)
- Verify JWT token is being sent with requests
- Test by querying Supabase directly (should use same user_id)

---

## Migration Notes

**If You Started with IndexedDB:**

1. Export data from IndexedDB
2. Transform to match Supabase schema
3. Import via Supabase client:

```typescript
const migrateToSupabase = async (localData) => {
  const user = netlifyIdentity.currentUser();

  // Migrate workouts
  for (const workout of localData.workouts) {
    await supabase.from('workout_sessions').insert({
      user_id: user.id,
      ...workout
    });
  }

  // Migrate exercises, etc.
};
```

---

## Summary of Changes

### Removed:
- ❌ Dexie.js
- ❌ dexie-react-hooks
- ❌ IndexedDB schemas
- ❌ Local-only storage
- ❌ Netlify password protection (replaced with Identity)

### Added:
- ✅ @supabase/supabase-js
- ✅ netlify-identity-widget
- ✅ PostgreSQL database via Supabase
- ✅ Row Level Security (RLS)
- ✅ Supabase Storage for photos
- ✅ Netlify Identity authentication
- ✅ Multi-device sync
- ✅ Cloud backup

### Updated:
- 🔄 All CRUD operations (Dexie → Supabase)
- 🔄 Authentication (password protection → Netlify Identity)
- 🔄 Data models (add user_id everywhere)
- 🔄 File structure (db/ → supabase/ + netlify/)

---

*Last Updated: November 16, 2025*
