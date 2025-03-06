-- Add upvotes and comments columns to prompts table
ALTER TABLE IF EXISTS prompts
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments INTEGER DEFAULT 0;

-- Create a table for tracking user follows
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a unique constraint to prevent duplicate follows
  UNIQUE(follower_id, following_id)
);

-- Add RLS policies for user_follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own follows
CREATE POLICY "Users can view their own follows"
  ON user_follows
  FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- Allow users to create their own follows
CREATE POLICY "Users can create their own follows"
  ON user_follows
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Allow users to delete their own follows
CREATE POLICY "Users can delete their own follows"
  ON user_follows
  FOR DELETE
  USING (auth.uid() = follower_id);

-- Create a table for tracking prompt upvotes
CREATE TABLE IF NOT EXISTS prompt_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a unique constraint to prevent duplicate upvotes
  UNIQUE(user_id, prompt_id)
);

-- Add RLS policies for prompt_upvotes
ALTER TABLE prompt_upvotes ENABLE ROW LEVEL SECURITY;

-- Allow users to see all upvotes
CREATE POLICY "Users can view all upvotes"
  ON prompt_upvotes
  FOR SELECT
  USING (true);

-- Allow users to create their own upvotes
CREATE POLICY "Users can create their own upvotes"
  ON prompt_upvotes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own upvotes
CREATE POLICY "Users can delete their own upvotes"
  ON prompt_upvotes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a table for tracking prompt comments
CREATE TABLE IF NOT EXISTS prompt_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for prompt_comments
ALTER TABLE prompt_comments ENABLE ROW LEVEL SECURITY;

-- Allow users to see comments on public prompts or their own prompts
CREATE POLICY "Users can view comments on public prompts or their own prompts"
  ON prompt_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prompts
      WHERE prompts.id = prompt_id
      AND (prompts.is_public = true OR prompts.user_id = auth.uid())
    )
  );

-- Allow users to create their own comments
CREATE POLICY "Users can create their own comments"
  ON prompt_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
  ON prompt_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON prompt_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a table for tracking user achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add a unique constraint to prevent duplicate achievements
  UNIQUE(user_id, achievement_id)
);

-- Add RLS policies for user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to see other users' achievements
CREATE POLICY "Users can view other users' achievements"
  ON user_achievements
  FOR SELECT
  USING (true);

-- Create a function to update prompt upvotes count
CREATE OR REPLACE FUNCTION update_prompt_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prompts
    SET upvotes = upvotes + 1
    WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prompts
    SET upvotes = upvotes - 1
    WHERE id = OLD.prompt_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for the upvotes function
CREATE TRIGGER update_prompt_upvotes_trigger
AFTER INSERT OR DELETE ON prompt_upvotes
FOR EACH ROW
EXECUTE FUNCTION update_prompt_upvotes();

-- Create a function to update prompt comments count
CREATE OR REPLACE FUNCTION update_prompt_comments()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prompts
    SET comments = comments + 1
    WHERE id = NEW.prompt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prompts
    SET comments = comments - 1
    WHERE id = OLD.prompt_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for the comments function
CREATE TRIGGER update_prompt_comments_trigger
AFTER INSERT OR DELETE ON prompt_comments
FOR EACH ROW
EXECUTE FUNCTION update_prompt_comments();

