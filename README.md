# DartStream - Professional Darts Scoring & Broadcasting System

A comprehensive PWA system for live darts scoring with real-time cloud streaming, multi-board management, and professional TV overlay capabilities.

## Live Deployment

🌐 **https://dowdarts.github.io/dartstream1/**

## System Overview

DartStream consists of multiple integrated apps for complete darts event management:

### 🎯 Landing Page (`landing.html`)
- Central hub for all DartStream applications
- Quick access to scoring, match central, and scoreboard
- Instructions and GitHub repository link

### 📱 Scorekeeper App (React PWA)
- Full-featured tablet/mobile scoring interface
- 501/301 game modes with double-in/double-out options
- Set and leg tracking with alternating starting players
- Real-time match statistics (averages, darts thrown)
- Score validation and undo functionality
- Cloud sync via Supabase for remote broadcasting
- 4-digit pairing code system
- Offline-capable Progressive Web App
- Responsive design for all devices

### 🏆 Match Central (`match-central.html`)
- **Multi-board tournament control center**
- Real-time discovery of all active matches
- Automatic game filtering (10-min timeout, 1-hour age limit)
- Click any match card to instantly display on scoreboard
- Manual 4-digit code entry option
- Perfect for tournament directors managing multiple boards

### 📺 Scoreboard Display (`scoreboard.html`)
- **Professional TV overlay** optimized for streaming
- Real-time cloud sync from any scorekeeper app
- **Dual indicator system:**
  - 🟢 Green circle: Shows who has the throw (started leg)
  - ⏩ Red arrow: Shows whose turn it is currently
- Customizable settings:
  - Player names with flag icons (12+ countries)
  - Footer text (group, event name, format)
  - Advertisement bar with image upload
- **Advertisement Bar Features:**
  - Slides in from left side with smooth animation
  - 10-second auto-hide timer
  - Lock button to keep ad displayed
  - Upload PNG/JPG images or show placeholder
- Uniform 7-column layout for professional appearance
- Large fonts optimized for TV viewing
- Animated score displays (2.5s shot animations)
- OBS Browser Source compatible

## Tech Stack

- **Frontend**: React 18 + Vite (scorekeeper), Vanilla HTML/CSS/JS (scoreboard & match central)
- **Styling**: Tailwind CSS (scorekeeper), Custom CSS (scoreboard)
- **Real-time Sync**: Supabase Realtime (PostgreSQL subscriptions)
- **Database**: Supabase PostgreSQL with JSONB storage
- **PWA**: Service workers for offline capability
- **Hosting**: GitHub Pages
- **Image Storage**: Base64 encoding in sessionStorage

## Project Structure

```
dartstream/
├── landing.html                    # Main landing page & app hub
├── scorekeeper-app/                # React PWA scoring app
│   ├── src/
│   │   ├── App.jsx                # Main scoring logic (1922 lines)
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # React entry point
│   ├── public/
│   │   ├── scoreboard.html        # Professional TV overlay (1234 lines)
│   │   ├── match-central.html     # Multi-board control center (441 lines)
│   │   ├── manifest.json          # PWA manifest
│   │   └── flags/                 # Country flag icons
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── scoreboard-app/                 # Legacy standalone files
├── supabase-setup.sql             # Database schema
└── README.md
```

## Quick Start

### For Users (Deployed Version)

1. **Open Landing Page**: https://dowdarts.github.io/dartstream1/landing.html
2. **Scorekeeper** (tablet/phone):
   - Click "Scoring App" → Create new match
   - Note the 4-digit code displayed on screen
3. **Match Central** (tournament control):
   - Click "Match Central" → See all active matches
   - Click any match card to display it
4. **Scoreboard** (TV/OBS):
   - Opens automatically from Match Central
   - Or manually enter 4-digit code
   - Configure via settings panel (click header)

### For Developers (Local Setup)

```bash
# Clone repository
git clone https://github.com/dowdarts/dartstream1.git
cd dartstream1

# Install and run scorekeeper app
cd scorekeeper-app
npm install
npm run dev        # Opens at http://localhost:5173

# Scoreboard and Match Central
# Just open the HTML files in public/ folder
```

### Deployment to GitHub Pages

```bash
cd scorekeeper-app
npm run build
npm run deploy
```

Automatically deploys to `https://[username].github.io/dartstream1/`

## OBS Studio Integration

Perfect for streaming professional darts events!

### Method 1: Browser Source (Recommended)

1. **In OBS Studio**, add a new **Browser Source**
2. **URL**: `https://dowdarts.github.io/dartstream1/scorekeeper-app/public/scoreboard.html`
3. **Dimensions**: 1920 x 1080
4. **FPS**: 30
5. **Custom CSS** (optional): Add transparency or positioning
6. **In scoreboard**: Enter 4-digit code from scorekeeper
7. **Configure**: Click scoreboard header to customize

### Method 2: Local File

1. Add **Browser Source** in OBS
2. **Check "Local File"**
3. **Browse** to `scorekeeper-app/public/scoreboard.html`
4. **Set dimensions**: 1920 x 1080
5. Connect using 4-digit code

### Method 3: Match Central Integration

1. Open Match Central in browser
2. Click any active match
3. Scoreboard opens with auto-connect
4. Copy URL and paste into OBS Browser Source

### Customization Options

- **Player names & flags**: Click scoreboard header
- **Footer text**: Group name, event, format
- **Advertisement bar**: Upload sponsor logos
- **Persistent settings**: Saved in browser sessionStorage

## How It Works

### Cloud-Based Real-Time Sync

DartStream uses **Supabase Realtime** for instant score synchronization across devices and locations:

1. **Scorekeeper** creates match → generates 4-digit code
2. **Game state stored** in Supabase PostgreSQL (JSONB format)
3. **Real-time subscriptions** via WebSocket connections
4. **Scoreboard subscribes** to code → receives instant updates
5. **Match Central polls** every 5 seconds → discovers active games

### Architecture Benefits

- ✅ **Remote hosting** - scorekeeper and scoreboard on different computers/networks
- ✅ **Multi-board support** - multiple matches simultaneously
- ✅ **Cloud persistence** - game states stored in database
- ✅ **Auto-cleanup** - games expire after 1 hour or 10 min inactivity
- ✅ **Scalable** - handles tournament-scale deployments

### Data Flow

```
Scorekeeper (Tablet)
    ↓ broadcasts game state
Supabase Database (game_states table)
    ↓ realtime subscription
Scoreboard (TV/OBS)
    ↓ displays scores
Match Central (Control)
    → lists all active games
```

### Game State Management

- **Created timestamp**: Filters games older than 1 hour
- **Updated timestamp**: Removes games inactive >10 minutes  
- **gameStarted flag**: Only shows games in progress
- **Automatic filtering**: Stale games removed from Match Central

## Development

### Scorekeeper App
```bash
cd scorekeeper-app
npm run dev          # Start dev server
npm run build        # Build for production
npm run deploy       # Deploy to GitHub Pages
```

### Scoreboard App
No build step required! Just edit `index.html` directly.

## Key Features Explained

### Match Scoring
- **Average calculation**: Uses total match darts, not leg darts (prevents 272+ impossible averages)
- **Alternating throw**: Starting player rotates each leg
- **Score validation**: Prevents invalid checkouts
- **Undo functionality**: Revert last dart throw
- **Match stats**: Real-time averages, darts thrown, legs won

### Match Central Filtering
- **Active games only**: `gameStarted === true`
- **Timeout filter**: Games inactive >10 minutes removed
- **Age limit**: Matches >1 hour old automatically hidden
- **5-second polling**: Keeps match list current

### Scoreboard Layout
1. **Throw Indicator** (🟢 Green circle): Shows who started the leg
2. **Player Name**: With optional country flag
3. **LEGS**: Current leg score
4. **AVG**: Match average (total points ÷ total darts × 3)
5. **DARTS**: Total darts thrown in match
6. **SCORE**: Remaining score (501/301)
7. **Turn Arrow** (⏩ Red): Current player's turn

### Advertisement Bar
- **Position**: Slides from left side
- **Timer**: 10-second auto-hide
- **Lock mode**: Keep ad visible indefinitely
- **Image support**: PNG/JPG upload via base64
- **Placeholder**: Shows when no image uploaded
- **Smooth animations**: Cubic-bezier easing

### Settings Persistence
- **sessionStorage**: Survives page refresh
- **Player names & flags**: Saved per browser
- **Footer text**: Group, event, format
- **Ad images**: Base64 encoded
- **Ad bar state**: Enabled/disabled

## Browser Compatibility

- **Scorekeeper**: Chrome, Edge, Firefox, Safari (modern versions)
- **Scoreboard**: Chrome 80+, Edge 80+, Firefox 75+, Opera 67+
- **Match Central**: All modern browsers
- **Supabase Realtime**: WebSocket support required
- **Recommended**: Chrome/Edge for best performance

## Technical Details

### Database Schema
```sql
-- game_states table
game_id VARCHAR(4)       -- Primary key, 4-digit code
created_at TIMESTAMP     -- Auto-generated
updated_at TIMESTAMP     -- Auto-updated
game_state JSONB         -- Full game state object
```

### Average Calculation Fix
```javascript
// WRONG (was causing 272+ averages)
average = (legScore / legDarts) * 3

// CORRECT (implemented)
average = (matchScore / matchDarts) * 3
```

Where:
- `matchScore` = cumulative points scored across all legs
- `matchDarts` = total darts thrown in entire match

## Features Implemented

- [x] Cloud real-time sync via Supabase
- [x] Multi-board tournament support (Match Central)
- [x] 4-digit pairing code system
- [x] OBS browser source compatibility
- [x] Responsive scorekeeper for all devices
- [x] Score validation and undo
- [x] Customizable scoreboard (names, flags, footer)
- [x] Advertisement bar with image upload
- [x] Automatic game cleanup/filtering
- [x] Dual indicator system (throw + turn)
- [x] Professional TV-optimized layout
- [x] Match statistics (averages, darts, legs)
- [x] PWA offline capability

## Future Enhancements

- [ ] Sound effects on checkout
- [ ] Player statistics history/database
- [ ] Match replay functionality
- [ ] Multiple scoreboard themes
- [ ] 301/701/1001 game modes
- [ ] Cricket game mode
- [ ] Tournament bracket management
- [ ] Player profile system
- [ ] Streaming integration (Twitch/YouTube)
- [ ] Mobile app versions

## License

MIT
