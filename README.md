# DartStream - Live Darts Scoring System

A two-part system for live darts scoring with real-time streaming capabilities.

## Features

### 📱 Scorekeeper App (Tablet/Desktop)
- Full-featured darts scoring interface
- 501/301 game modes with double-in/double-out options
- Set and leg tracking with alternating starting players
- Score validation and editing
- Works offline as a PWA
- Real-time broadcast to scoreboard via Broadcast Channel API
- Responsive design for phones, tablets, and desktops

### 📺 Scoreboard App (TV Display)
- **1920x1080 optimized display** for TV/streaming
- **Real-time score updates** from scorekeeper app
- **OBS Browser Source compatible** for live streaming
- **Host on separate server** - works remotely via Supabase
- Animated shot display (appears for 3 seconds)
- Current player highlighting
- Live statistics (averages, darts thrown)
- Sets and legs display
- **Two modes**:
  - Local: Broadcast Channel API (same computer)
  - Remote: Supabase Realtime (separate hosting)

## Tech Stack

- **Scorekeeper**: React + Vite + Tailwind CSS
- **Scoreboard**: Standalone HTML (no build required)
- **Communication**: 
  - Local: Broadcast Channel API (instant, same machine)
  - Remote: Supabase Realtime (cloud, separate hosts)
- **PWA**: Offline-first with service workers
- **Database**: Supabase (PostgreSQL + Realtime)

## Project Structure

```
dartstream/
├── scorekeeper-app/     # React scoring interface
│   ├── src/
│   ├── public/
│   └── package.json
├── scoreboard-app/      # Standalone TV display
│   ├── index.html       # Main scoreboard (1920x1080)
│   ├── test.html        # Test tool for development
│   └── README.md        # Detailed scoreboard setup
└── README.md
```

## Quick Start

### Option 1: Local Setup (Recommended)

**Scorekeeper App:**
```bash
cd scorekeeper-app
npm install
npm run dev
```
Open at http://localhost:5173

**Scoreboard Display:**
Simply open `scoreboard-app/index.html` in a browser window. It will automatically connect to the scorekeeper app.

### Option 2: GitHub Pages (Deployed)

1. **Deploy Scorekeeper:**
```bash
cd scorekeeper-app
npm run build
npm run deploy
```

2. **Scoreboard:** Use the local `index.html` file and point it to your deployed scorekeeper URL (requires Supabase for remote sync - coming soon)

## Using with OBS Studio

Perfect for streaming darts events!

1. **In OBS**, add a new **Browser Source**
2. **Check "Local File"**
3. **Browse** to `scoreboard-app/index.html`
4. **Set dimensions**: 1920 x 1080
5. **Set FPS**: 30
6. **Open scorekeeper app** in your regular browser
7. Scores will appear automatically on the OBS display!

See `scoreboard-app/README.md` for detailed OBS setup instructions.

## How It Works

The apps communicate using the **Broadcast Channel API**, which allows browser tabs on the same computer to send messages instantly:

- ✅ **Zero latency** - instant updates
- ✅ **No internet required** - works completely offline
- ✅ **No server setup** - no backend to configure
- ✅ **Simple & reliable** - just open both apps

**Note:** Both apps must be open on the same computer. For remote scoreboard display, Supabase integration is planned (future update).

## Testing the Scoreboard

Use the included test tool to verify scoreboard functionality:

1. Open `scoreboard-app/test.html` in a browser
2. Open `scoreboard-app/index.html` in another window
3. Click buttons in test.html to send test data
4. Watch the scoreboard update in real-time

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

## Browser Compatibility

- **Scorekeeper**: Chrome, Edge, Firefox, Safari (modern versions)
- **Scoreboard**: Chrome, Edge, Firefox, Opera
- **Broadcast Channel API**: Not supported in Safari (use Chrome/Edge for both apps)

## Features Roadmap

- [x] Local real-time sync via Broadcast Channel API
- [x] OBS browser source support
- [x] Responsive scorekeeper for all devices
- [x] Score validation and editing
- [ ] Supabase cloud sync for remote scoreboards
- [ ] Customizable scoreboard themes
- [ ] Sound effects
- [ ] Player statistics history
- [ ] Match replay

## License

MIT
