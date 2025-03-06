-- Create a table to track AI prompt generations
CREATE TABLE IF NOT EXISTS prompt_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add an index on user_id for faster lookups
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE prompt_generations ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own generations
CREATE POLICY "Users can view their own generations"
  ON prompt_generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own generations
CREATE POLICY "Users can insert their own generations"
  ON prompt_generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all generations
CREATE POLICY "Admins can view all generations"
  ON prompt_generations
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

