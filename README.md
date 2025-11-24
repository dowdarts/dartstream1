# DartStream - Live Darts Scoring System

A Progressive Web App (PWA) system for live darts scoring and streaming.

## Features

### Scorekeeper App (Tablet)
- Input player names and scores
- Track game progress in real-time
- Works offline with PWA support
- Syncs scores to Supabase backend

### Scoreboard App (TV Display)
- Display live scores for streaming
- Real-time updates from scorekeeper
- Full-screen optimized for broadcasts
- Auto-updates via Supabase Realtime

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Styling**: Tailwind CSS
- **PWA**: Offline-first with service workers

## Project Structure

```
dartstream/
├── scorekeeper-app/     # Tablet scoring interface
├── scoreboard-app/      # TV display interface
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

1. Clone the repository
2. Set up each app:

```bash
# Scorekeeper App
cd scorekeeper-app
npm install
npm run dev

# Scoreboard App
cd scoreboard-app
npm install
npm run dev
```

### Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Create a `games` table with real-time enabled
3. Add your Supabase URL and anon key to `.env` files in both apps

## Development

- Run scorekeeper app: `cd scorekeeper-app && npm run dev`
- Run scoreboard app: `cd scoreboard-app && npm run dev`

## License

MIT
