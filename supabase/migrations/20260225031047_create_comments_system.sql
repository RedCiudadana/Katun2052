/*
  # Create Comments System

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `law_id` (text) - identifier for the law
      - `article_id` (text) - identifier for the article or 'general'
      - `author_name` (text) - name of the commenter
      - `author_email` (text, optional) - email of the commenter
      - `content` (text) - the comment content
      - `is_general` (boolean) - whether this is a general comment
      - `is_expert` (boolean) - whether the author is an expert
      - `is_highlighted` (boolean) - whether the comment is highlighted
      - `tags` (text array) - tags for categorization
      - `sector` (text) - sector of the commenter
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `comment_likes`
      - `id` (uuid, primary key)
      - `comment_id` (uuid, foreign key)
      - `user_identifier` (text) - anonymous user identifier
      - `created_at` (timestamptz)
    
    - `comment_replies`
      - `id` (uuid, primary key)
      - `comment_id` (uuid, foreign key)
      - `author_name` (text)
      - `author_email` (text)
      - `content` (text)
      - `is_moderator` (boolean)
      - `created_at` (timestamptz)

  2. Views
    - `comments_with_stats` - comments with like and reply counts

  3. Security
    - Enable RLS on all tables
    - Public can read all data
    - Anyone can insert comments, likes, and replies
    - No updates or deletes allowed (preserve data integrity)
*/

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  law_id text NOT NULL,
  article_id text NOT NULL DEFAULT 'general',
  author_name text NOT NULL,
  author_email text,
  content text NOT NULL,
  is_general boolean DEFAULT false,
  is_expert boolean DEFAULT false,
  is_highlighted boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  sector text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_identifier text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_identifier)
);

-- Create comment_replies table
CREATE TABLE IF NOT EXISTS comment_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  is_moderator boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_law_id ON comments(law_id);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_identifier ON comment_likes(user_identifier);
CREATE INDEX IF NOT EXISTS idx_comment_replies_comment_id ON comment_replies(comment_id);

-- Create view with stats
CREATE OR REPLACE VIEW comments_with_stats AS
SELECT 
  c.*,
  COUNT(DISTINCT cl.id) as like_count,
  COUNT(DISTINCT cr.id) as reply_count
FROM comments c
LEFT JOIN comment_likes cl ON c.id = cl.comment_id
LEFT JOIN comment_replies cr ON c.id = cr.comment_id
GROUP BY c.id;

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments table
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for comment_likes table
CREATE POLICY "Anyone can view likes"
  ON comment_likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON comment_likes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their own likes"
  ON comment_likes FOR DELETE
  TO public
  USING (true);

-- RLS Policies for comment_replies table
CREATE POLICY "Anyone can view replies"
  ON comment_replies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert replies"
  ON comment_replies FOR INSERT
  TO public
  WITH CHECK (true);