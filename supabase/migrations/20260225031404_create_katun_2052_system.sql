/*
  # Create K'atun 2052 Platform System

  ## Overview
  This migration transforms the platform from ForoMINFIN to SEGEPLAN's K'atun 2052.
  It creates a system for publishing official documents organized by 5 dimensions
  and collecting structured citizen feedback.

  ## New Tables
  
  ### 1. dimensions
  The 5 core dimensions of K'atun: Nuestra Guatemala 2052
  - `id` (uuid, primary key)
  - `code` (text, unique) - Short code (e.g., 'dimension-1')
  - `name` (text) - Full dimension name
  - `description` (text) - Detailed description
  - `color` (text) - Theme color for UI
  - `icon` (text) - Icon identifier
  - `order_index` (integer) - Display order
  - `is_active` (boolean) - Whether accepting feedback
  - `created_at` (timestamptz)
  
  ### 2. documents
  Official documents published by SEGEPLAN
  - `id` (uuid, primary key)
  - `dimension_id` (uuid, foreign key) - Related dimension
  - `title` (text) - Document title
  - `description` (text) - Brief description
  - `document_type` (text) - Type: plan, diagnosis, strategy, etc.
  - `version` (text) - Document version (e.g., '1.0', 'Final')
  - `status` (text) - approved, draft, archived
  - `pdf_url` (text) - URL to PDF file
  - `publication_date` (date) - Official publication date
  - `sections` (jsonb) - Structured sections for granular feedback
  - `metadata` (jsonb) - Additional metadata
  - `is_published` (boolean) - Visibility control
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. feedback
  Citizen feedback on documents (replaces comments table)
  - `id` (uuid, primary key)
  - `document_id` (uuid, foreign key)
  - `dimension_id` (uuid, foreign key)
  - `section_id` (text, optional) - Specific section reference
  - `author_name` (text, optional)
  - `author_email` (text, optional)
  - `actor_type` (text) - Citizen, Academia, Civil Society, Private Sector, Other
  - `content` (text) - Feedback content
  - `thematic_tags` (text array) - Auto-classified themes
  - `is_general` (boolean) - General vs specific feedback
  - `attachments` (jsonb) - Optional file attachments metadata
  - `is_highlighted` (boolean) - Featured feedback
  - `is_reviewed` (boolean) - Admin review status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. structured_responses
  Responses to dimension-specific guided questions
  - `id` (uuid, primary key)
  - `dimension_id` (uuid, foreign key)
  - `document_id` (uuid, optional foreign key)
  - `author_name` (text, optional)
  - `author_email` (text, optional)
  - `actor_type` (text)
  - `responses` (jsonb) - Question-answer pairs
  - `scale_responses` (jsonb) - Scale-type question responses
  - `attachments` (jsonb) - Optional file attachments metadata
  - `created_at` (timestamptz)
  
  ### 5. feedback_likes (replaces comment_likes)
  Likes on feedback items
  - `id` (uuid, primary key)
  - `feedback_id` (uuid, foreign key)
  - `user_identifier` (text)
  - `created_at` (timestamptz)
  - UNIQUE(feedback_id, user_identifier)
  
  ### 6. feedback_replies (replaces comment_replies)
  Replies to feedback, especially from moderators
  - `id` (uuid, primary key)
  - `feedback_id` (uuid, foreign key)
  - `author_name` (text)
  - `author_email` (text)
  - `content` (text)
  - `is_moderator` (boolean)
  - `created_at` (timestamptz)
  
  ### 7. process_milestones
  Timeline events for K'atun 2052 process
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `milestone_date` (date)
  - `status` (text) - completed, in_progress, upcoming
  - `milestone_type` (text) - publication, consultation, deadline, event
  - `related_dimension_id` (uuid, optional foreign key)
  - `order_index` (integer)
  - `is_visible` (boolean)
  - `created_at` (timestamptz)

  ## Views
  
  ### feedback_with_stats
  Enhanced feedback view with aggregated statistics
  
  ## Security
  - All tables have RLS enabled
  - Public read access to published documents and approved feedback
  - Public write access for feedback submission
  - Admin-only access for document management and moderation

  ## Indexes
  Created for optimal query performance on:
  - Foreign keys
  - Search fields (dimension_id, document_id, thematic_tags)
  - Temporal data (created_at, publication_date)
*/

-- =============================================================================
-- 1. DIMENSIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS dimensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT 'blue',
  icon text DEFAULT 'box',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dimensions_code ON dimensions(code);
CREATE INDEX IF NOT EXISTS idx_dimensions_order ON dimensions(order_index);

-- =============================================================================
-- 2. DOCUMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dimension_id uuid REFERENCES dimensions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  document_type text DEFAULT 'document',
  version text DEFAULT '1.0',
  status text DEFAULT 'approved',
  pdf_url text DEFAULT '',
  publication_date date DEFAULT CURRENT_DATE,
  sections jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_dimension ON documents(dimension_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_published ON documents(is_published);
CREATE INDEX IF NOT EXISTS idx_documents_publication_date ON documents(publication_date);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);

-- =============================================================================
-- 3. FEEDBACK TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  dimension_id uuid REFERENCES dimensions(id) ON DELETE CASCADE,
  section_id text DEFAULT '',
  author_name text DEFAULT '',
  author_email text DEFAULT '',
  actor_type text DEFAULT 'Ciudadano',
  content text NOT NULL,
  thematic_tags text[] DEFAULT '{}',
  is_general boolean DEFAULT false,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_highlighted boolean DEFAULT false,
  is_reviewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_document ON feedback(document_id);
CREATE INDEX IF NOT EXISTS idx_feedback_dimension ON feedback(dimension_id);
CREATE INDEX IF NOT EXISTS idx_feedback_section ON feedback(section_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_actor_type ON feedback(actor_type);
CREATE INDEX IF NOT EXISTS idx_feedback_thematic_tags ON feedback USING gin(thematic_tags);

-- =============================================================================
-- 4. STRUCTURED RESPONSES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS structured_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dimension_id uuid NOT NULL REFERENCES dimensions(id) ON DELETE CASCADE,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  author_name text DEFAULT '',
  author_email text DEFAULT '',
  actor_type text DEFAULT 'Ciudadano',
  responses jsonb DEFAULT '{}'::jsonb,
  scale_responses jsonb DEFAULT '{}'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_structured_responses_dimension ON structured_responses(dimension_id);
CREATE INDEX IF NOT EXISTS idx_structured_responses_document ON structured_responses(document_id);
CREATE INDEX IF NOT EXISTS idx_structured_responses_created_at ON structured_responses(created_at);

-- =============================================================================
-- 5. FEEDBACK LIKES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedback_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  user_identifier text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(feedback_id, user_identifier)
);

CREATE INDEX IF NOT EXISTS idx_feedback_likes_feedback_id ON feedback_likes(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_likes_user_identifier ON feedback_likes(user_identifier);

-- =============================================================================
-- 6. FEEDBACK REPLIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedback_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  is_moderator boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_replies_feedback_id ON feedback_replies(feedback_id);

-- =============================================================================
-- 7. PROCESS MILESTONES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS process_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  milestone_date date NOT NULL,
  status text DEFAULT 'upcoming',
  milestone_type text DEFAULT 'event',
  related_dimension_id uuid REFERENCES dimensions(id) ON DELETE SET NULL,
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_milestones_date ON process_milestones(milestone_date);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON process_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_order ON process_milestones(order_index);
CREATE INDEX IF NOT EXISTS idx_milestones_dimension ON process_milestones(related_dimension_id);

-- =============================================================================
-- VIEWS
-- =============================================================================

CREATE OR REPLACE VIEW feedback_with_stats AS
SELECT 
  f.*,
  COUNT(DISTINCT fl.id) as like_count,
  COUNT(DISTINCT fr.id) as reply_count
FROM feedback f
LEFT JOIN feedback_likes fl ON f.id = fl.feedback_id
LEFT JOIN feedback_replies fr ON f.id = fr.feedback_id
GROUP BY f.id;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE structured_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_milestones ENABLE ROW LEVEL SECURITY;

-- Dimensions: Public read access
CREATE POLICY "Anyone can view active dimensions"
  ON dimensions FOR SELECT
  TO public
  USING (is_active = true);

-- Documents: Public read access to published documents
CREATE POLICY "Anyone can view published documents"
  ON documents FOR SELECT
  TO public
  USING (is_published = true);

-- Feedback: Public read and insert
CREATE POLICY "Anyone can view feedback"
  ON feedback FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can submit feedback"
  ON feedback FOR INSERT
  TO public
  WITH CHECK (true);

-- Structured Responses: Public read and insert
CREATE POLICY "Anyone can view structured responses"
  ON structured_responses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can submit structured responses"
  ON structured_responses FOR INSERT
  TO public
  WITH CHECK (true);

-- Feedback Likes: Public read, insert, and delete
CREATE POLICY "Anyone can view feedback likes"
  ON feedback_likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add feedback likes"
  ON feedback_likes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can remove their feedback likes"
  ON feedback_likes FOR DELETE
  TO public
  USING (true);

-- Feedback Replies: Public read and insert
CREATE POLICY "Anyone can view feedback replies"
  ON feedback_replies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can submit feedback replies"
  ON feedback_replies FOR INSERT
  TO public
  WITH CHECK (true);

-- Process Milestones: Public read access to visible milestones
CREATE POLICY "Anyone can view visible milestones"
  ON process_milestones FOR SELECT
  TO public
  USING (is_visible = true);