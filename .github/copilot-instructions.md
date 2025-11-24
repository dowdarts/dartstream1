# DartStream - Darts Scoring System

## Project Overview
A two-part PWA for darts scoring with real-time streaming:
- **Scorekeeper App**: Tablet-based scoring interface for the scorekeeper
- **Scoreboard App**: TV display app for live streaming

## Tech Stack
- **Frontend**: React with Vite
- **Backend**: Supabase (real-time database)
- **Styling**: Tailwind CSS
- **PWA**: Service workers for offline support

## Project Structure
- `/scorekeeper-app` - Tablet scoring interface
- `/scoreboard-app` - TV display interface
- Shared Supabase configuration

## Development Guidelines
- Keep both apps as independent PWAs
- Use Supabase Realtime for score syncing
- Optimize for tablet (scorekeeper) and large display (scoreboard)
- Ensure offline functionality where possible
