-- Allow authenticated users (admins) to UPDATE and INSERT dimensions
-- Also allow full CRUD for admins on dimension_articles

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can update dimensions'
    AND tablename = 'dimensions' AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Authenticated users can update dimensions"
      ON dimensions FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can insert dimensions'
    AND tablename = 'dimensions' AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Authenticated users can insert dimensions"
      ON dimensions FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can delete dimensions'
    AND tablename = 'dimensions' AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Authenticated users can delete dimensions"
      ON dimensions FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Also fix dimension_articles (admin needs to manage these)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can update dimension articles'
    AND tablename = 'dimension_articles' AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Authenticated users can update dimension articles"
      ON dimension_articles FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can insert dimension articles'
    AND tablename = 'dimension_articles' AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Authenticated users can insert dimension articles"
      ON dimension_articles FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Authenticated users can delete dimension articles'
    AND tablename = 'dimension_articles' AND schemaname = 'public'
  ) THEN
    CREATE POLICY "Authenticated users can delete dimension articles"
      ON dimension_articles FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;
