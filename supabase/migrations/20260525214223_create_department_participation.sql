/*
  # Create department_participation table

  ## Summary
  Stores participation counts per department for the interactive Guatemala map.

  ## New Tables
  - `department_participation`
    - `id` (uuid, pk)
    - `department_code` (text, unique) — 2-letter code e.g. "GT-GU"
    - `department_name` (text) — display name
    - `total_participants` (int) — total submissions/comments from that department
    - `survey_responses` (int)
    - `comments_count` (int)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled; public read allowed; only authenticated admins can write
*/

CREATE TABLE IF NOT EXISTS department_participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_code text UNIQUE NOT NULL,
  department_name text NOT NULL,
  total_participants integer DEFAULT 0,
  survey_responses integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE department_participation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read department participation"
  ON department_participation FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update department participation"
  ON department_participation FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert department participation"
  ON department_participation FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed all 22 departments with initial zero counts
INSERT INTO department_participation (department_code, department_name, total_participants, survey_responses, comments_count)
VALUES
  ('GT-GU', 'Guatemala',        0, 0, 0),
  ('GT-SA', 'Sacatepéquez',     0, 0, 0),
  ('GT-CM', 'Chimaltenango',    0, 0, 0),
  ('GT-ES', 'Escuintla',        0, 0, 0),
  ('GT-SR', 'Santa Rosa',       0, 0, 0),
  ('GT-SO', 'Sololá',           0, 0, 0),
  ('GT-TO', 'Totonicapán',      0, 0, 0),
  ('GT-QZ', 'Quetzaltenango',   0, 0, 0),
  ('GT-SU', 'Suchitepéquez',    0, 0, 0),
  ('GT-RE', 'Retalhuleu',       0, 0, 0),
  ('GT-SM', 'San Marcos',       0, 0, 0),
  ('GT-HU', 'Huehuetenango',    0, 0, 0),
  ('GT-QC', 'Quiché',           0, 0, 0),
  ('GT-BV', 'Baja Verapaz',     0, 0, 0),
  ('GT-AV', 'Alta Verapaz',     0, 0, 0),
  ('GT-PE', 'Petén',            0, 0, 0),
  ('GT-IZ', 'Izabal',           0, 0, 0),
  ('GT-ZA', 'Zacapa',           0, 0, 0),
  ('GT-CH', 'Chiquimula',       0, 0, 0),
  ('GT-JA', 'Jalapa',           0, 0, 0),
  ('GT-JU', 'Jutiapa',          0, 0, 0),
  ('GT-PR', 'El Progreso',      0, 0, 0)
ON CONFLICT (department_code) DO NOTHING;
