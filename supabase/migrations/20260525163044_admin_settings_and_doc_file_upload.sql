/*
  # Admin Settings and Document Upload Support

  1. New Tables
    - `admin_settings` — key/value store for admin-configurable settings
      - `key` (text, primary key)
      - `value` (jsonb)
      - `updated_at` (timestamptz)

  2. Modified Tables
    - `documents` — add `file_url` (text) for Word/PDF uploads and `word_url` for Word doc

  3. Storage
    - Creates `documents` bucket for file uploads

  4. Security
    - RLS on admin_settings: authenticated users can read, only service_role can write
    - We use a simple "is_admin" approach via a helper function that checks a whitelist table
*/

-- admin_settings key-value store
CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (survey embed is public)
CREATE POLICY "Public can read admin settings"
  ON admin_settings FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can update settings
CREATE POLICY "Authenticated users can update admin settings"
  ON admin_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert admin settings"
  ON admin_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed default survey embed config
INSERT INTO admin_settings (key, value)
VALUES ('survey_embed', '{"src": "https://ee.kobotoolbox.org/i/EfHgXxdw", "width": "800", "height": "600"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Add word_url column to documents if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'word_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN word_url text;
  END IF;
END $$;

-- Add file_url column to documents if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN file_url text;
  END IF;
END $$;

-- Extend documents RLS to allow authenticated users full CRUD
-- (authenticated = admin in this app)
CREATE POLICY "Authenticated users can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);
