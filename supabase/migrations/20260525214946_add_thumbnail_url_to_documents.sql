/*
  # Add thumbnail_url to documents table

  Adds an optional thumbnail image URL column used to display a preview card
  in the "Documentos Destacados" section on the home page.
  Also adds word_url if not already present.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN thumbnail_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'word_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN word_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE documents ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;
