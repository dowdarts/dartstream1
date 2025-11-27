# ✅ DartStream Ready to Deploy!

## Build Status
- ✅ Scorekeeper built successfully (dist/ folder ready)
- ✅ Scoreboard included (dist/scoreboard.html)
- ✅ No Supabase dependencies in scorekeeper (clean build)

## How Remote Sync Works

### Simplified Architecture
1. **Scorekeeper** → Broadcasts via Broadcast Channel API (local only)
2. **Scoreboard** → Listens to Broadcast Channel + Supabase Realtime
3. **Scoreboard** → Writes game state to Supabase for other devices

### Why This Works
- Scorekeeper stays simple and lightweight
- Scoreboard acts as a "relay" to Supabase
- Remote devices connect to Supabase and get updates
- No build complexity with Supabase dependencies

## Deployment Steps

### 1. Deploy to GitHub Pages

From the `scorekeeper-app` directory:

```bash
npm run deploy
```

This pushes the `dist/` folder to GitHub Pages, including:
- `index.html` - Scorekeeper app
- `scoreboard.html` - Remote-capable scoreboard

**URLs after deploy:**
- Scorekeeper: `https://dowdarts.github.io/dartstream1/`
- Scoreboard: `https://dowdarts.github.io/dartstream1/scoreboard.html`

### 2. Setup Supabase (One-Time)

Run this SQL in your Supabase project (https://supabase.com/dashboard/project/svbjrjevxopwmtytfaik):

```sql
CREATE TABLE game_states (
  game_id TEXT PRIMARY KEY,
  game_state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON game_states FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON game_states FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON game_states FOR UPDATE USING (true);
```

### 3. Configure Scoreboard

First time you open the scoreboard, you'll see a setup screen:

**Supabase URL:** `https://svbjrjevxopwmtytfaik.supabase.co`  
**Anon Key:** (Get from: https://supabase.com/dashboard/project/svbjrjevxopwmtytfaik/settings/api)

Click "Connect to Supabase" - settings are saved in browser localStorage.

## Testing Cross-Device

### Device 1 (Dart Board)
Open: `https://dowdarts.github.io/dartstream1/`
- Start game
- Enter scores

### Device 2 (Commentary/Broadcast)
Open: `https://dowdarts.github.io/dartstream1/scoreboard.html`
- Enter Supabase credentials (first time only)
- Scores from Device 1 appear automatically!

### Device 3+ (Additional Displays)
Same as Device 2 - any device can open the scoreboard URL and see live scores.

## OBS Studio Setup

**For streaming the scoreboard:**

1. Add Source → Browser
2. URL: `https://dowdarts.github.io/dartstream1/scoreboard.html`
3. Width: 1920
4. Height: 1080
5. ✅ Check "Shutdown source when not visible"
6. ✅ Check "Refresh browser when scene becomes active"

## How Data Flows

### Same Device (Local)
```
Scorekeeper → Broadcast Channel → Scoreboard (instant)
```

### Different Devices (Remote)
```
Device 1 Scorekeeper → Broadcast Channel → Device 1 Scoreboard → Supabase → Device 2 Scoreboard
```

**Key Insight:** The scoreboard on Device 1 (same as scorekeeper) receives scores via Broadcast Channel AND writes them to Supabase for all other devices.

## File Structure

```
dartstream/
├── scorekeeper-app/
│   ├── dist/                    # Built files (ready to deploy)
│   │   ├── index.html           # Scorekeeper
│   │   ├── scoreboard.html      # Scoreboard with Supabase
│   │   └── assets/              # CSS and JS bundles
│   ├── src/
│   │   └── App.jsx              # Scorekeeper logic (Broadcast Channel only)
│   └── package.json
├── scoreboard-app/
│   ├── index.html               # Local version (Broadcast Channel)
│   └── supabase.html            # Remote version (Supabase + Broadcast Channel)
└── DEPLOYMENT.md                # This file
```

## Troubleshooting

### Build Issues
- ✅ Fixed: Removed Supabase from scorekeeper build
- ✅ Fixed: tslib dependency conflicts resolved
- ✅ Scoreboard uses CDN imports (no build needed)

### Connection Issues
**Scoreboard not updating:**
- Check Supabase credentials in setup screen
- Verify internet connection on both devices
- Check browser console (F12) for errors
- Ensure Supabase table `game_states` exists

**Scorekeeper not connecting to local scoreboard:**
- Both must be on same domain/device for Broadcast Channel
- Open scoreboard first, then scorekeeper
- Check both are using same origin (both HTTPS or both local)

### Supabase Issues
**"Table not found" error:**
- Run the SQL setup script in Supabase dashboard
- Verify table name is exactly `game_states`

**"Authentication failed":**
- Check anon key is correct (no extra spaces)
- Verify URL format: `https://[project].supabase.co`

**Updates delayed:**
- Supabase Realtime has ~50-100ms latency (normal)
- Free tier projects pause after 1 week inactive (wake up via dashboard)

## Next Steps

1. ✅ Built successfully - `dist/` folder ready
2. 🚀 Run `npm run deploy` to push to GitHub Pages
3. 🔧 Setup Supabase table (one-time SQL script)
4. 📺 Open scoreboard URL and configure credentials
5. 🎯 Test with scorekeeper on different device

## Support Files

- `DEPLOY_SCOREBOARD.md` - Detailed scoreboard deployment options
- `SUPABASE_SETUP.md` - Complete Supabase setup guide
- `REMOTE_SETUP.md` - Original remote setup documentation
- `supabase-setup.sql` - Database table creation script
