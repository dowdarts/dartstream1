# 🌐 Supabase Setup Guide for Remote Scoreboard

## Why Supabase?

Since your scorekeeper is hosted at https://dowdarts.github.io/dartstream1/ and you want the scoreboard on a **separate host**, you need a cloud database for communication. Supabase provides:

- ✅ **Real-time database** updates
- ✅ **Free tier** (perfect for personal use)
- ✅ **Easy setup** (no coding required)
- ✅ **Instant sync** between scorekeeper and scoreboard

---

## Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. ✅ **FREE** - No credit card required!

---

## Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `dartstream` (or any name you like)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. ⏱️ Wait 2-3 minutes for setup

---

## Step 3: Create the Database Table

1. In your Supabase dashboard, click **"Table Editor"** in the left sidebar
2. Click **"Create a new table"**
3. Configure:
   - **Name**: `game_states`
   - **Description**: Stores live game state for scoreboard
4. Add these columns:

| Column Name | Type | Default Value | Primary | Extra Settings |
|------------|------|---------------|---------|----------------|
| `id` | text | - | ✅ Yes | - |
| `state` | jsonb | - | ❌ No | - |
| `created_at` | timestamp | `now()` | ❌ No | - |
| `updated_at` | timestamp | `now()` | ❌ No | - |

5. Click **"Save"**

---

## Step 4: Enable Realtime

1. Still in **Table Editor**, click on your `game_states` table
2. Click the **"..." menu** (three dots) next to the table name
3. Select **"Edit table"**
4. Scroll down to **"Enable Realtime"**
5. Toggle it **ON** ✅
6. Click **"Save"**

---

## Step 5: Get Your API Credentials

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see:
   - **Project URL**: Something like `https://xxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

4. **Copy both values** - you'll need them!

---

## Step 6: Configure the Scorekeeper App

### Option A: Using Environment Variables (Recommended for Production)

1. In your `scorekeeper-app` folder, create a file named `.env`
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. **Important**: Add `.env` to your `.gitignore` (don't commit secrets!)

### Option B: Direct Configuration (Quick Test)

Edit `scorekeeper-app/src/supabase.js`:

```javascript
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your_anon_key_here'
```

---

## Step 7: Deploy & Test

### Deploy Scorekeeper:

```bash
cd scorekeeper-app
npm run build
npm run deploy
```

Your scorekeeper will be at: https://dowdarts.github.io/dartstream1/

### Host Scoreboard Separately:

**Option 1: GitHub Pages (Separate Repo)**
1. Create a new repo called `dartstream-scoreboard`
2. Upload `scoreboard-app/supabase.html` as `index.html`
3. Enable GitHub Pages
4. Your scoreboard will be at: `https://yourusername.github.io/dartstream-scoreboard/`

**Option 2: Netlify/Vercel (Easiest)**
1. Go to https://netlify.com or https://vercel.com
2. Sign up (free)
3. Drag & drop `scoreboard-app/supabase.html`
4. Get instant URL like: `https://your-scoreboard.netlify.app`

**Option 3: Any Web Host**
- Just upload `supabase.html` to any web server
- Can even run from `file://` on a second computer!

---

## Step 8: Connect the Scoreboard

1. **Open your scoreboard** URL
2. You'll see a setup screen
3. Enter:
   - **Supabase URL**: `https://xxxxx.supabase.co`
   - **Supabase Anon Key**: `eyJ...`
   - **Game ID**: `default` (or leave as is)
4. Click **"Connect"**
5. Should show: **"✓ Connected - Waiting for data"**

---

## Step 9: Start Scoring!

1. **Open scorekeeper**: https://dowdarts.github.io/dartstream1/
2. **Start a match** and enter player names
3. **Begin scoring**
4. **Watch the scoreboard update** in real-time! 🎯

---

## Troubleshooting

### Scoreboard shows "Not connected"
- ✅ Check Supabase URL and key are correct
- ✅ Verify table `game_states` exists
- ✅ Check Realtime is enabled on the table
- ✅ Open browser console (F12) for error messages

### Scores not updating
- ✅ Make sure you've entered game names and started match
- ✅ Check both apps can access Supabase (no firewall blocking)
- ✅ Verify the Game ID matches (default is `'default'`)

### "Error updating game state"
- ✅ Check your internet connection
- ✅ Verify anon key has INSERT permissions (default: yes)
- ✅ Check Supabase project is not paused (free tier auto-pauses after 1 week inactivity)

---

## Advanced: Multiple Matches

To run multiple matches simultaneously with different scoreboards:

### In Scorekeeper:
Edit `scorekeeper-app/src/App.jsx` line 10:
```javascript
const gameId = 'match-1'; // Change for each match
```

### In Scoreboard:
Enter different Game ID:
- Match 1: `match-1`
- Match 2: `match-2`
- etc.

Each scoreboard will only show its matching game!

---

## Security Notes

- ✅ **Anon key is safe to expose** - it's public by design
- ✅ **Row Level Security (RLS)** can be added for extra protection
- ✅ Never commit `.env` files to GitHub
- ✅ For production, consider adding API authentication

---

## Cost

**FREE TIER includes:**
- ✅ 500MB database
- ✅ Unlimited API requests
- ✅ Unlimited Realtime connections
- ✅ 2 concurrent Realtime connections

**Perfect for personal darts scoring!**

---

## Quick Reference

### Scorekeeper URLs:
- **Local Dev**: http://127.0.0.1:5173/dartstream1/
- **Production**: https://dowdarts.github.io/dartstream1/

### Scoreboard Files:
- **Local (Broadcast Channel)**: `scoreboard-app/index.html`
- **Remote (Supabase)**: `scoreboard-app/supabase.html`

### Supabase Dashboard:
- https://supabase.com/dashboard

---

## Need Help?

1. Check browser console (F12) for errors
2. Check Supabase logs in dashboard
3. Verify table structure matches Step 3
4. Test with connection-test.html first

**You're all set! Happy dart scoring! 🎯**
