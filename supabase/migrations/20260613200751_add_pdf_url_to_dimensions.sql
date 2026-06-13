-- Add pdf_url column to dimensions for book/PDF viewer feature
ALTER TABLE dimensions ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE dimensions ADD COLUMN IF NOT EXISTS pdf_title TEXT;
