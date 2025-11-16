# Deployment Guide - Kinobody Workout Tracker

Complete guide for deploying the Kinobody Greek God 2.0 Workout Tracker to Netlify.

---

## Pre-Deployment Checklist

Before deploying, ensure all of the following are complete:

- ✅ All code committed to Git repository
- ✅ `.env.local` is in `.gitignore` (never commit secrets!)
- ✅ Build succeeds locally (`npm run build`)
- ✅ Zero TypeScript errors
- ✅ All features tested locally
- ✅ Supabase project is active and configured
- ✅ Environment variables documented

---

## Step 1: Prepare GitHub Repository

### 1.1 Initialize Git (if not already done)

```bash
cd /c/Users/Danny/Desktop/Claude/workout-app
git init
git add .
git commit -m "Initial commit - Kinobody Workout Tracker complete"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `kinobody-workout-tracker`
3. Description: "Workout tracker for Kinobody Greek God 2.0 program"
4. Visibility: Private (recommended) or Public
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/kinobody-workout-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Netlify

### 2.1 Create Netlify Account

1. Go to https://www.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (easiest option)
4. Authorize Netlify to access your GitHub account

### 2.2 Create New Site

1. From Netlify Dashboard, click "Add new site"
2. Choose "Import an existing project"
3. Select "GitHub"
4. Authorize Netlify to access your repositories
5. Search for `kinobody-workout-tracker`
6. Click on the repository

### 2.3 Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`:

**Build command:** `npm run build`
**Publish directory:** `dist`
**Branch to deploy:** `main`

If not auto-detected, enter manually.

### 2.4 Add Environment Variables

**CRITICAL:** Add these BEFORE first deploy

1. Click "Show advanced"
2. Click "New variable"
3. Add the following:

```
Key: VITE_SUPABASE_URL
Value: https://ulyuilhwqloxaeklgakk.supabase.co

Key: VITE_SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_W6vTEyoZQtQja21jaQrYdw_EDVGAfRX
```

**IMPORTANT:** Use your actual values from `.env`

### 2.5 Deploy!

1. Click "Deploy site"
2. Wait for build to complete (~2-3 minutes)
3. Once complete, you'll see: ✅ "Site is live"

Your site will be available at:
```
https://random-name-12345.netlify.app
```

---

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Custom Domain

1. Go to Site Settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `workout.yourdomain.com`)
4. Click "Verify"

### 3.2 Configure DNS

Add the following DNS records at your domain registrar:

**For subdomain (workout.yourdomain.com):**
```
Type: CNAME
Name: workout
Value: random-name-12345.netlify.app
```

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 75.2.60.5 (Netlify's load balancer IP)
```

### 3.3 Enable HTTPS

Netlify automatically provisions SSL certificate via Let's Encrypt:

1. Go to Site Settings → Domain management → HTTPS
2. Wait for certificate provisioning (~1-2 minutes)
3. Enable "Force HTTPS" to redirect HTTP to HTTPS

---

## Step 4: Post-Deployment Testing

### 4.1 Basic Functionality Test

Visit your deployed site and test:

1. **Load App:** Site loads without errors
2. **Sign Up:** Create a new account (if using Netlify Identity)
3. **Authentication:** Login/logout works
4. **Navigation:** All routes accessible

### 4.2 Workout Flow Test

1. **Log Workout:**
   - Create new workout session
   - Log exercise sets
   - Verify RPT calculations
   - Complete workout

2. **View History:**
   - See logged workout in history
   - Filter by date/exercise
   - View workout details

3. **Progress Charts:**
   - Navigate to Progress page
   - Select exercise
   - Verify chart renders with data

### 4.3 Data Persistence Test

1. Log workout on Device A
2. Open app on Device B (or different browser)
3. Login with same account
4. Verify workout appears (cloud sync working)

### 4.4 Mobile Testing

1. Open site on mobile browser
2. Test responsive layout
3. Verify touch targets (buttons, tabs)
4. Test charts on small screen
5. Upload progress photo from mobile

### 4.5 Performance Audit

Run Lighthouse audit (Chrome DevTools):

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Mobile"
4. Run audit

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 80+

---

## Step 5: Enable Netlify Identity (If Using)

**Note:** Only needed if you want Netlify-managed authentication instead of custom auth.

### 5.1 Enable Identity

1. Go to Site Settings → Identity
2. Click "Enable Identity"
3. Choose registration preference:
   - **Open:** Anyone can sign up
   - **Invite only:** You manually invite users

### 5.2 Configure Identity Settings

1. **Registration:**
   - Email confirmation: Required (recommended)
   - Auto confirm: Disabled (recommended)

2. **External Providers:**
   - Enable Google, GitHub, etc. if desired
   - Configure OAuth apps in respective platforms

3. **Email Templates:**
   - Customize confirmation email
   - Customize recovery email
   - Add your logo/branding

### 5.3 Update Supabase RLS Policies

If using Netlify Identity, update RLS policies to validate Netlify JWT:

```sql
-- Example updated policy
CREATE POLICY "Users can view own data" ON user_profiles
  FOR SELECT USING (
    auth.jwt() ->> 'sub' = user_id
  );
```

---

## Step 6: Continuous Deployment

Netlify automatically deploys when you push to GitHub:

### 6.1 Make Changes Locally

```bash
# Make code changes
git add .
git commit -m "Fix: Updated exercise progression chart"
git push origin main
```

### 6.2 Auto-Deploy Triggered

Netlify detects the push and:
1. Starts build automatically
2. Runs `npm run build`
3. Deploys to production if build succeeds
4. Sends notification (email/Slack)

### 6.3 Deploy Previews

For branches other than `main`:
```bash
git checkout -b feature/new-chart
# Make changes
git push origin feature/new-chart
```

Netlify creates a preview deploy:
- URL: `https://deploy-preview-123--your-site.netlify.app`
- Test before merging to main

---

## Troubleshooting

### Build Fails: "Module not found"

**Cause:** Missing dependency or incorrect import path

**Solution:**
```bash
# Check dependencies
npm install

# Verify imports use absolute paths (@/...)
# Check tsconfig.json has correct paths
```

### Build Fails: "Environment variable undefined"

**Cause:** Environment variables not set in Netlify

**Solution:**
1. Go to Site Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Trigger manual deploy

### Charts Don't Render

**Cause:** No data in database or RLS blocking access

**Solution:**
1. Check browser console for errors
2. Verify Supabase RLS policies
3. Ensure user is authenticated
4. Log a workout to create data

### Photos Don't Upload

**Cause:** Supabase Storage not configured or RLS issue

**Solution:**
1. Check Supabase Storage bucket exists: `progress-photos`
2. Verify RLS policies on `storage.objects`
3. Check file size (must be under 5 MB)
4. Ensure CORS enabled in Supabase

### Blank Page After Login

**Cause:** Routing issue or authentication error

**Solution:**
1. Check `netlify.toml` has redirect rules
2. Verify authentication token is stored
3. Check browser console for errors
4. Clear browser cache and try again

### Slow Performance

**Cause:** Large bundle size or unoptimized queries

**Solution:**
1. Enable code splitting:
   ```typescript
   // Use React.lazy for routes
   const Progress = lazy(() => import('./pages/Progress'));
   ```
2. Optimize images (compress before upload)
3. Add database indexes for common queries
4. Enable Netlify's asset optimization

---

## Monitoring & Maintenance

### Monitor Builds

1. Go to Netlify Dashboard → Deploys
2. View build logs
3. Check for warnings or errors
4. Monitor build time (should be <3 min)

### Monitor Performance

1. Use Netlify Analytics (paid feature)
2. Or integrate Google Analytics
3. Monitor page load times
4. Track user engagement

### Database Monitoring

1. Go to Supabase Dashboard
2. Check database size (free tier: 500 MB)
3. Monitor API requests (free tier: 500K/month)
4. Review slow queries

### Cost Monitoring

**Free Tiers:**
- Netlify: 100 GB bandwidth/month, 300 build minutes/month
- Supabase: 500 MB database, 1 GB file storage, 2 GB bandwidth
- Total Cost: **$0/month** (within limits)

**Upgrade When:**
- Netlify: Exceed bandwidth or need more build minutes
- Supabase: Exceed database size or storage
- Typical upgrade: ~$20-30/month for small user base

---

## Backup & Recovery

### Export All Data

Use the Settings → Data Management feature:

1. Click "Export All Data"
2. Downloads JSON file with:
   - User profile
   - All workouts
   - Exercise logs
   - Body weight logs
   - Meal plans
   - Settings

3. Store backup securely

### Database Backups

Supabase Pro/Team plans include automatic daily backups.

**Free Tier:** Manual backups only

1. Go to Supabase Dashboard → Database
2. Click "Backups"
3. Download SQL dump
4. Store securely (encrypted)

### Restore from Backup

1. Create new Supabase project
2. Run migrations from `docs/DATA_MODELS.md`
3. Import SQL dump or use data import feature
4. Update environment variables
5. Redeploy app

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env.local` to Git
- ✅ Use publishable key, NOT service role key
- ✅ Rotate keys periodically (every 90 days)
- ✅ Different keys for dev/staging/production

### Supabase Security

- ✅ RLS enabled on all tables
- ✅ Storage RLS policies configured
- ✅ API keys stored securely
- ✅ Monitor auth logs for suspicious activity

### Netlify Security

- ✅ Enable HTTPS (Force HTTPS on)
- ✅ Security headers in `netlify.toml`
- ✅ Content Security Policy (CSP) if needed
- ✅ Rate limiting (Netlify Edge Functions)

### User Data

- ✅ Data encrypted at rest (Supabase default)
- ✅ Data encrypted in transit (HTTPS)
- ✅ User data isolated via RLS
- ✅ No sensitive data in logs

---

## Support & Resources

### Documentation

- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Recharts Docs: https://recharts.org

### Community

- Netlify Discord: https://discord.gg/netlify
- Supabase Discord: https://discord.supabase.com
- React Community: https://react.dev/community

### Troubleshooting

- Netlify Status: https://www.netlifystatus.com
- Supabase Status: https://status.supabase.com
- GitHub Issues: Create issue in your repo

---

## Checklist: Ready to Deploy?

Before clicking "Deploy," confirm:

- [ ] Code builds successfully locally (`npm run build`)
- [ ] Zero TypeScript errors
- [ ] All environment variables documented
- [ ] `.env.local` in `.gitignore`
- [ ] Code pushed to GitHub
- [ ] Supabase project active
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Storage bucket created
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Environment variables added in Netlify
- [ ] `netlify.toml` configured
- [ ] Custom domain ready (optional)

If all checked, you're ready to deploy! 🚀

---

**Deployment Guide Complete**

Your Kinobody Workout Tracker is production-ready and can be deployed with confidence!

*Last Updated: November 16, 2025*
