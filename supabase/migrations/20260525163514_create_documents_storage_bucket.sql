/*
  # Create documents storage bucket

  Sets up a public storage bucket for document file uploads (Word, PDF).
  Authenticated users can upload; everyone can read.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  52428800, -- 50 MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Public read policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Public can read document files'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Public can read document files"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'documents');
  END IF;
END $$;

-- Authenticated upload policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can upload document files'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can upload document files"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'documents');
  END IF;
END $$;

-- Authenticated delete policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can delete document files'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can delete document files"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'documents');
  END IF;
END $$;
