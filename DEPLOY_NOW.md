# 🚀 Deploy Now - Quick Commands

## 1. Deploy Everything
```powershell
cd scorekeeper-app
npm run deploy
```

Wait for deployment to complete, then both apps will be live:
- **Scorekeeper**: https://dowdarts.github.io/dartstream1/
- **Scoreboard**: https://dowdarts.github.io/dartstream1/scoreboard.html

## 2. Setup Supabase Database (One-Time)

Go to: https://supabase.com/dashboard/project/svbjrjevxopwmtytfaik/editor

Click "SQL Editor" and run:

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

## 3. Get Your Anon Key

Go to: https://supabase.com/dashboard/project/svbjrjevxopwmtytfaik/settings/api

Copy the "anon" "public" key (it's safe to use in browsers).

## 4. Test It!

### Device 1 (Dart Board):
1. Open: https://dowdarts.github.io/dartstream1/
2. Setup a game
3. Enter scores

### Device 2 (Commentary/Broadcast):
1. Open: https://dowdarts.github.io/dartstream1/scoreboard.html
2. Setup screen appears:
   - **Supabase URL**: `https://svbjrjevxopwmtytfaik.supabase.co`
   - **Anon Key**: [paste from step 3]
3. Click "Connect to Supabase"
4. Scores from Device 1 appear automatically! 🎉

## 5. Add to OBS

**Browser Source:**
- URL: `https://dowdarts.github.io/dartstream1/scoreboard.html`
- Width: 1920
- Height: 1080
- ✅ Shutdown source when not visible
- ✅ Refresh browser when scene becomes active

Done! Your darts scoreboard is streaming live.

## Troubleshooting

**Deploy fails:**
```powershell
# Make sure you're in the right directory
cd c:\Users\cgcda\dartstream\scorekeeper-app
npm run deploy
```

**Scoreboard not updating:**
- Check Supabase credentials are correct
- Verify database table exists (run SQL from step 2)
- Both devices need internet connection

**Need help?**
See `DEPLOYMENT.md` for complete details and troubleshooting.
