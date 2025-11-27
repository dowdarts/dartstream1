# Deploy Scoreboard to GitHub Pages

## Overview
The scoreboard (supabase.html) is ready to deploy separately from the scorekeeper app. It uses CDN-based Supabase libraries and doesn't require building.

## Option 1: Add to Existing dartstream1 Repo (Recommended)

1. Copy the scoreboard file to your existing dartstream1 repository:
   ```
   Copy: scoreboard-app/supabase.html
   To: Your dartstream1 repo as "scoreboard.html"
   ```

2. Commit and push:
   ```bash
   git add scoreboard.html
   git commit -m "Add remote scoreboard"
   git push origin main
   ```

3. Access at: `https://dowdarts.github.io/dartstream1/scoreboard.html`

## Option 2: Create Separate Scoreboard Repo

1. Create a new GitHub repository: `dartstream-scoreboard`

2. Clone and add the scoreboard:
   ```bash
   git clone https://github.com/dowdarts/dartstream-scoreboard.git
   cd dartstream-scoreboard
   ```

3. Copy and rename:
   ```
   Copy: scoreboard-app/supabase.html
   To: dartstream-scoreboard/index.html
   ```

4. Commit and push:
   ```bash
   git add index.html
   git commit -m "Initial scoreboard"
   git push origin main
   ```

5. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

6. Access at: `https://dowdarts.github.io/dartstream-scoreboard/`

## Supabase Setup (Required for Remote Sync)

The scoreboard will show a setup overlay on first load. You need:

1. **Supabase URL**: `https://svbjrjevxopwmtytfaik.supabase.co`

2. **Anon Key**: (Your key - keep secure but OK for client-side)

3. Database must have the `game_states` table. Run this SQL in Supabase:
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

## Testing Cross-Device Sync

### Device 1 (Dart Board):
1. Open: `https://dowdarts.github.io/dartstream1/`
2. Start a game and enter scores

### Device 2 (Commentary/Broadcast):
1. Open your scoreboard URL
2. Enter Supabase credentials on setup screen
3. Click "Connect to Supabase"
4. Scores from Device 1 should appear automatically

## How It Works

- **Scorekeeper**: Sends scores via Broadcast Channel API (local only)
- **Scoreboard**: 
  - Listens to Broadcast Channel (if on same device)
  - Connects to Supabase and listens for real-time updates
  - Writes received game state back to Supabase for other devices
  
This means:
- ✅ Same device: Uses fast Broadcast Channel
- ✅ Different devices: Uses Supabase Realtime
- ✅ Scoreboard acts as relay between scorekeeper and remote displays

## OBS Setup

1. Add Browser Source
2. URL: Your scoreboard GitHub Pages URL
3. Resolution: 1920x1080
4. Check "Shutdown source when not visible"
5. Check "Refresh browser when scene becomes active"

## Troubleshooting

**Scoreboard not updating:**
- Check Supabase credentials are correct
- Verify database table exists and has RLS policies
- Check browser console for errors
- Ensure both devices have internet connection

**Setup screen won't dismiss:**
- Make sure you clicked "Connect to Supabase"
- Verify credentials are saved (localStorage)
- Check console for connection errors

**Scores delayed:**
- Supabase Realtime typically has <100ms latency
- Check your internet connection speed
- Verify Supabase project is not paused (free tier auto-pauses after 1 week inactive)
