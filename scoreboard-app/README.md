# DartStream Scoreboard App

A TV scoreboard display for DartStream that syncs in real-time with the scorekeeper app.

## Features

- **Real-time Sync**: Automatically updates when scores are entered in the scorekeeper app
- **1920x1080 Display**: Optimized for TV/streaming displays
- **OBS Browser Source Compatible**: Perfect for streaming darts events
- **Animated Scores**: Shot scores appear with animation and auto-clear
- **Current Player Highlight**: Visual indicator shows whose turn it is
- **Live Statistics**: Displays averages, darts thrown, sets, and legs

## Setup Instructions

### For Local Use (Same Computer)

1. **Start the Scorekeeper App**
   - Open the scorekeeper app in your browser
   - Enter player names and start a match

2. **Open the Scoreboard**
   - Open `scoreboard-app/index.html` in a separate browser window
   - The scoreboard will automatically connect when the scorekeeper app is running
   - You should see "✓ Connected" in the top right corner

3. **Display on TV/Second Monitor**
   - Drag the scoreboard window to your TV/second monitor
   - Press F11 to enter fullscreen mode

### For OBS Studio

1. **Add Browser Source**
   - In OBS, click the + button in Sources
   - Select "Browser"
   - Give it a name like "Darts Scoreboard"

2. **Configure Browser Source**
   - **Local File**: Check this option
   - **Local File Path**: Browse to `scoreboard-app/index.html` in your dartstream folder
   - **Width**: 1920
   - **Height**: 1080
   - **FPS**: 30
   - Click OK

3. **Start Scorekeeper**
   - Open the scorekeeper app in your regular browser
   - The OBS browser source will automatically connect and display scores

4. **Layout Tips**
   - Position the scoreboard in your OBS scene
   - You can add additional overlays or backgrounds
   - The scoreboard has a semi-transparent background that blends well

## How It Works

The apps communicate using the **Broadcast Channel API**, which allows same-origin browser tabs/windows to send messages to each other. This means:

- ✅ No internet connection required
- ✅ No server setup needed
- ✅ Works completely locally
- ✅ Zero latency
- ⚠️ Both apps must be open on the same computer

## Display Information

The scoreboard shows:

### Player Sections (Left & Right)
- Player name (large, uppercase)
- Remaining score (extra large, yellow)
- Last shot entered (animated, green)
- 3-dart average
- Total darts thrown

### Bottom Stats Bar
- Current sets score (home-away)
- Current legs score (home-away)

### Visual Indicators
- **Yellow border**: Indicates current player's turn
- **Green text**: Last shot entered (appears for 3 seconds)
- **Pulsing animation**: Shot scores pulse when entered

## Troubleshooting

### "Waiting for scorekeeper..." message
- Make sure the scorekeeper app is running
- Both apps must be open in the same browser
- Try refreshing both pages

### Scores not updating
- Check that the scorekeeper is on the main game screen (not setup screens)
- Look for "✓ Connected" status in top right
- Refresh both apps and try again

### OBS shows blank screen
- Make sure "Local File" is checked in browser source settings
- Verify the file path is correct
- Check that the scorekeeper app is running in a regular browser window

### Display looks wrong
- Verify OBS browser source is set to 1920x1080
- Check that "Shutdown source when not visible" is unchecked
- Make sure "Refresh browser when scene becomes active" is unchecked

## Customization

You can edit `scoreboard-app/index.html` to customize:

- **Colors**: Change the color scheme in the `<style>` section
- **Sizes**: Adjust font sizes for player names, scores, etc.
- **Layout**: Modify the grid layout and spacing
- **Animations**: Change the shot animation timing and effects
- **Background**: Update the gradient background colors

## Technical Details

- **Communication**: Broadcast Channel API
- **Dimensions**: 1920x1080 pixels (16:9 aspect ratio)
- **Refresh Rate**: Updates instantly on every score entry
- **Browser Support**: Chrome, Edge, Firefox, Opera (Not Safari)
- **File Type**: Standalone HTML file (no build required)

## Future Enhancements

Planned features for future updates:
- Supabase cloud sync (for remote scoreboard on different computer)
- Customizable themes/skins
- Sponsor logo overlays
- Sound effects for scores
- Match statistics display
- Player photos
