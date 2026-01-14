-- Jams table for user-created chord progressions with sections
CREATE TABLE IF NOT EXISTS jams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL DEFAULT 'C',
  bpm INTEGER NOT NULL DEFAULT 120,
  sections JSONB NOT NULL DEFAULT '{}',
  arrangement TEXT[] NOT NULL DEFAULT ARRAY['A'],
  lyrics JSONB,
  ideas TEXT[],
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  vibe TEXT[] NOT NULL DEFAULT ARRAY['pop'],
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS jams_user_id_idx ON jams(user_id);
CREATE INDEX IF NOT EXISTS jams_is_public_idx ON jams(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS jams_created_at_idx ON jams(created_at DESC);

-- RLS policies
ALTER TABLE jams ENABLE ROW LEVEL SECURITY;

-- Users can read their own jams
CREATE POLICY "Users can read own jams" ON jams
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read public jams
CREATE POLICY "Anyone can read public jams" ON jams
  FOR SELECT USING (is_public = true);

-- Users can insert their own jams
CREATE POLICY "Users can insert own jams" ON jams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own jams
CREATE POLICY "Users can update own jams" ON jams
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own jams
CREATE POLICY "Users can delete own jams" ON jams
  FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_jams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jams_updated_at
  BEFORE UPDATE ON jams
  FOR EACH ROW
  EXECUTE FUNCTION update_jams_updated_at();
