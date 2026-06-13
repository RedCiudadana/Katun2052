-- Storage bucket for dimension PDF files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dimension-pdfs',
  'dimension-pdfs',
  true,
  104857600, -- 100 MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Public can read dimension pdfs'
    AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Public can read dimension pdfs"
      ON storage.objects FOR SELECT TO public
      USING (bucket_id = 'dimension-pdfs');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can upload dimension pdfs'
    AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can upload dimension pdfs"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'dimension-pdfs');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can update dimension pdfs'
    AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can update dimension pdfs"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'dimension-pdfs');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can delete dimension pdfs'
    AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can delete dimension pdfs"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'dimension-pdfs');
  END IF;
END $$;
