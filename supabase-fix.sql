-- Fix the game_states table to use game_id instead of id
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Drop the old table if it exists
DROP TABLE IF EXISTS game_states CASCADE;

-- Create the game_states table with correct column names
CREATE TABLE game_states (
    game_id TEXT PRIMARY KEY,
    game_state JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write
CREATE POLICY "Allow public read access"
ON game_states FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access"
ON game_states FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access"
ON game_states FOR UPDATE
TO public
USING (true);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE game_states;

-- Create index for faster lookups
CREATE INDEX game_states_game_id_idx ON game_states(game_id);
CREATE INDEX game_states_updated_at_idx ON game_states(updated_at);

-- Create a function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_game_states_updated_at
BEFORE UPDATE ON game_states
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 'Database fixed! Column is now game_id ✅' AS status;
