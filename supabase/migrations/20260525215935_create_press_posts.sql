/*
  # Create press_posts table — Sala de Prensa

  ## New table: press_posts
  Stores news articles and blog posts published in the Sala de Prensa section.

  ### Columns
  - id (uuid, PK)
  - title — headline of the article
  - slug — URL-friendly identifier (unique)
  - category — 'noticia' | 'blog' | 'comunicado' | 'evento'
  - excerpt — short summary shown in the listing card
  - content — full rich-text body (markdown/HTML stored as text)
  - cover_image_url — hero/thumbnail image URL
  - author_name — display name of the author
  - published_at — explicit publish date
  - is_published — controls visibility on the public site
  - is_featured — pinned to top of the listing
  - tags — text array of topic labels
  - created_at / updated_at

  ### Security
  - RLS enabled
  - Public SELECT for published posts
  - Authenticated INSERT / UPDATE / DELETE (admin only enforced at app level)
*/

CREATE TABLE IF NOT EXISTS press_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  category        text NOT NULL DEFAULT 'noticia',
  excerpt         text NOT NULL DEFAULT '',
  content         text NOT NULL DEFAULT '',
  cover_image_url text,
  author_name     text NOT NULL DEFAULT 'SEGEPLAN',
  published_at    date NOT NULL DEFAULT CURRENT_DATE,
  is_published    boolean NOT NULL DEFAULT false,
  is_featured     boolean NOT NULL DEFAULT false,
  tags            text[] NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE press_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Public can view published press posts"
  ON press_posts FOR SELECT
  USING (is_published = true);

-- Authenticated users (admins) can read all posts
CREATE POLICY "Authenticated users can view all press posts"
  ON press_posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert press posts"
  ON press_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update press posts"
  ON press_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete press posts"
  ON press_posts FOR DELETE
  TO authenticated
  USING (true);

-- Index for listing performance
CREATE INDEX IF NOT EXISTS idx_press_posts_published_at ON press_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_press_posts_is_published ON press_posts (is_published);
CREATE INDEX IF NOT EXISTS idx_press_posts_slug ON press_posts (slug);
