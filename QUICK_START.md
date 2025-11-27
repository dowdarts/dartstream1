# 🎯 Quick Start Guide

## Current Status
✅ Scorekeeper app is running at: http://localhost:5173/dartstream1/

## To View the Scoreboard:

### Option 1: Open in Browser (Quick Test)
1. Open a new browser window
2. Navigate to: `file:///c:/Users/cgcda/dartstream/scoreboard-app/index.html`
3. Or drag & drop `scoreboard-app/index.html` into a browser window

### Option 2: Using OBS Studio
1. Add **Browser Source** in OBS
2. Check ✅ **Local File**
3. Browse to: `C:\Users\cgcda\dartstream\scoreboard-app\index.html`
4. Set **Width**: 1920, **Height**: 1080
5. Set **FPS**: 30

### Option 3: Test Tool (For Development)
1. Open `scoreboard-app/test.html` in your browser
2. Click buttons to send test data to the scoreboard

## How to Use

1. **Start a match** in the scorekeeper app (the one already open)
2. **Open the scoreboard** using one of the options above
3. **Look for "✓ Connected"** in the top right of the scoreboard
4. **Enter scores** in the scorekeeper app
5. **Watch them appear** on the scoreboard in real-time!

## Tips

- Both apps must be open at the same time
- Use the same browser (Chrome/Edge recommended)
- The scoreboard updates automatically when you enter scores
- Shots appear with animation and disappear after 3 seconds
- The current player is highlighted with a yellow border

## Troubleshooting

**"Waiting for scorekeeper..." on scoreboard?**
- Make sure scorekeeper is on the main game screen (not setup)
- Refresh both apps
- Make sure you're using Chrome or Edge (not Safari)

**Scoreboard not updating?**
- Check for "✓ Connected" status in top right
- Make sure both apps are open in the same browser
- Try refreshing the scoreboard

## Next Steps

To deploy the scorekeeper to GitHub Pages:
```bash
cd scorekeeper-app
npm run build
npm run deploy
```

Then access it at: https://dowdarts.github.io/dartstream1/
