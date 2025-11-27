-- DartStream Supabase Database Setup
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Create the game_states table
CREATE TABLE IF NOT EXISTS game_states (
    id TEXT PRIMARY KEY,
    state JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write
-- (For production, you may want to restrict this)
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
CREATE INDEX IF NOT EXISTS game_states_id_idx ON game_states(id);
CREATE INDEX IF NOT EXISTS game_states_updated_at_idx ON game_states(updated_at);

-- Optional: Create a function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create trigger to auto-update updated_at
CREATE TRIGGER update_game_states_updated_at
BEFORE UPDATE ON game_states
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 'Database setup complete! ✅' AS status;
