# 🎯 DartStream - Setup Complete!

## ✅ What's Been Built

### 1. Scorekeeper App (React PWA)
**Location:** `scorekeeper-app/`
- Full-featured darts scoring system
- 501/301 game modes
- Set and leg tracking
- Score validation and editing
- Responsive design (phone/tablet/desktop)
- PWA support (installable)
- Real-time broadcast to scoreboard

### 2. TV Scoreboard App (HTML)
**Location:** `scoreboard-app/index.html`
- 1920x1080 optimized display
- Real-time score updates
- OBS Browser Source compatible
- Animated shot display
- Current player highlighting
- Live statistics

### 3. Test Tool
**Location:** `scoreboard-app/test.html`
- Send test data to scoreboard
- Perfect for development/testing

### 4. Launcher Page
**Location:** `launcher.html`
- One-click access to both apps
- Status checking
- User-friendly interface

---

## 🚀 How to Use

### Quick Start (Both Apps Running Now!)

1. **Scorekeeper is already running** at: http://localhost:5173/dartstream1/

2. **To open the Scoreboard:**
   - Open File Explorer
   - Navigate to: `C:\Users\cgcda\dartstream\scoreboard-app\`
   - Double-click `index.html`
   - OR drag `index.html` into a Chrome/Edge browser window

3. **Start playing:**
   - Enter player names in the scorekeeper
   - Choose a game preset or custom settings
   - Start entering scores
   - Watch them appear on the scoreboard in real-time!

---

## 📺 OBS Studio Setup (For Streaming)

### Add Scoreboard to OBS:

1. **In OBS**, click the **+** in Sources
2. Select **"Browser"**
3. Name it **"Darts Scoreboard"**
4. Configure:
   - ✅ **Local File** (check this box)
   - **Local File**: Browse to `C:\Users\cgcda\dartstream\scoreboard-app\index.html`
   - **Width**: 1920
   - **Height**: 1080
   - **FPS**: 30
   - ⚠️ **Uncheck** "Shutdown source when not visible"
   - ⚠️ **Uncheck** "Refresh browser when scene becomes active"
5. Click **OK**

### Important OBS Notes:
- Keep the scorekeeper app open in a regular browser (Chrome/Edge)
- The OBS browser source will automatically connect
- Make sure both are running on the same computer
- Look for "✓ Connected" in the top right of the scoreboard

---

## 🔧 Technical Details

### Communication Method
Uses **Broadcast Channel API** for instant local communication:
- ✅ Zero latency
- ✅ No internet required
- ✅ No server setup
- ✅ Works completely offline
- ⚠️ Both apps must be on same computer
- ⚠️ Use Chrome/Edge (not Safari)

### What Gets Synced
- Player names
- Current scores (remaining)
- Last shot entered (with animation)
- Current player indicator
- Sets and legs count
- 3-dart averages
- Total darts thrown
- Game format information

### Update Timing
- **Scores**: Update instantly when entered
- **Animations**: Shots appear and disappear after 3 seconds
- **Highlights**: Current player border updates on each turn
- **Stats**: Averages recalculate after every throw

---

## 📁 File Structure

```
dartstream/
│
├── launcher.html              # Easy launcher page
├── QUICK_START.md            # Quick reference guide
├── README.md                 # Main project documentation
│
├── scorekeeper-app/          # React scoring app
│   ├── src/
│   │   ├── App.jsx          # Main app (with broadcast)
│   │   ├── index.css        # Responsive styles
│   │   └── ...
│   ├── public/
│   │   └── manifest.json    # PWA manifest
│   ├── package.json
│   └── vite.config.js
│
└── scoreboard-app/           # TV display
    ├── index.html           # Main scoreboard (1920x1080)
    ├── test.html            # Development test tool
    └── README.md            # Detailed scoreboard docs
```

---

## 🎮 Usage Workflow

### Standard Match Flow:

1. **Start Scorekeeper Dev Server** (already running!)
   ```bash
   cd scorekeeper-app
   npm run dev
   ```

2. **Open Scorekeeper** in browser
   - Go to http://localhost:5173/dartstream1/
   - Or use the launcher.html

3. **Open Scoreboard** in another window
   - Double-click `scoreboard-app/index.html`
   - Or add as OBS Browser Source

4. **Setup Match** in scorekeeper:
   - Enter player names
   - Choose game type (501/301)
   - Select format (Best of X legs/sets)
   - Choose starting player

5. **Play Darts!**
   - Enter scores in scorekeeper
   - Watch them appear on scoreboard
   - Scores animate and update automatically

---

## 🐛 Troubleshooting

### Scoreboard shows "Waiting for scorekeeper..."
- ✅ Make sure scorekeeper is on the **game screen** (not setup)
- ✅ Check you're using Chrome or Edge (not Safari)
- ✅ Refresh both apps
- ✅ Check both are open in same browser

### Scores not updating on scoreboard
- ✅ Look for "✓ Connected" in top right
- ✅ Make sure you're entering valid scores (0-180)
- ✅ Try clicking "Back" then entering score again
- ✅ Check browser console for errors (F12)

### OBS shows blank scoreboard
- ✅ Make sure "Local File" is checked
- ✅ Verify file path is correct
- ✅ Check scorekeeper is running in regular browser
- ✅ Uncheck "Shutdown when not visible"
- ✅ Set dimensions to exactly 1920x1080

### PWA not installing
- ✅ Must be accessed via HTTPS or localhost
- ✅ Deploy to GitHub Pages for production PWA
- ✅ Check browser supports PWA (Chrome/Edge)

---

## 🚀 Deployment

### Deploy Scorekeeper to GitHub Pages:

```bash
cd scorekeeper-app
npm run build
npm run deploy
```

Then access at: https://dowdarts.github.io/dartstream1/

### Deploy Scoreboard:
- Just copy `scoreboard-app/index.html` to your hosting
- Or use it locally (no deployment needed for OBS)

---

## 🎨 Customization

### Scoreboard Colors/Layout
Edit `scoreboard-app/index.html` - all styles are in the `<style>` section:
- Line 14-32: Background gradients
- Line 53-63: Player name colors/sizes
- Line 65-71: Score colors/sizes (yellow #facc15)
- Line 73-80: Last shot colors/animation
- Line 82-102: Animation timing

### Scorekeeper Theme
Edit `scorekeeper-app/src/index.css` for global styles
Edit `scorekeeper-app/src/App.jsx` for component styles (Tailwind classes)

---

## 📊 Features Implemented

- ✅ Local real-time sync (Broadcast Channel API)
- ✅ OBS browser source support
- ✅ Responsive scorekeeper (all devices)
- ✅ Score validation (0-180)
- ✅ Score editing with validation
- ✅ Set and leg tracking
- ✅ Starting player alternation
- ✅ Previous leg undo
- ✅ Bust detection
- ✅ Checkout confirmation
- ✅ 3-dart averages
- ✅ Animated shot display
- ✅ Current player highlighting
- ✅ Match statistics

---

## 🔮 Future Enhancements

Planned for future updates:
- [ ] Supabase cloud sync (remote scoreboard)
- [ ] Multiple scoreboard themes
- [ ] Sound effects
- [ ] Player statistics history
- [ ] Match replay/recording
- [ ] Tournament bracket mode
- [ ] Sponsor logo overlays
- [ ] Customizable animations

---

## 📝 Quick Commands Reference

```bash
# Start development server
cd scorekeeper-app
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Install dependencies (if needed)
npm install
```

---

## 🎯 Current Status

**READY TO USE!**

- ✅ Scorekeeper running at http://localhost:5173/dartstream1/
- ✅ Scoreboard ready at `scoreboard-app/index.html`
- ✅ Test tool available at `scoreboard-app/test.html`
- ✅ Launcher page at `launcher.html`
- ✅ Real-time sync configured
- ✅ OBS compatible

**Start playing darts and enjoy your new scoring system! 🎯**

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `scoreboard-app/README.md` for detailed setup
3. Test with `scoreboard-app/test.html` to isolate issues
4. Check browser console (F12) for errors

---

**Built with ❤️ for the darts community**

*Technology Stack: React + Vite + Tailwind CSS + Broadcast Channel API*
