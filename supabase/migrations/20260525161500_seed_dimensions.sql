/*
  # Seed the 5 K'atun dimensions

  The dimensions table was created (20260225031404) and later given slug +
  full_description columns (20260225033300), but no migration ever inserted the
  dimension rows. The documents seed (20260525161501) and dimension_articles seed
  (20260525233725) both reference dimensions (by UUID / by slug), so without this
  seed those FK references fail or no-op. This migration fills that gap.

  UUIDs match the dimension_id values hard-coded in the documents seed; codes (D1-D5)
  and slugs match the lookups in the dimension_articles migrations.
  Idempotent via ON CONFLICT.
*/

INSERT INTO dimensions (id, code, slug, name, order_index, is_active) VALUES
  ('0b5e4b23-7eb4-4f55-b0ff-e36d22bbac59', 'D1', 'bienestar',   'Dimensión 1: Bienestar para la Gente',                        1, true),
  ('b7943058-fdb7-40a8-be5b-9136b22272c9', 'D2', 'riqueza',     'Dimensión 2: Riqueza para Todos y Todas',                     2, true),
  ('7444573a-0c71-497b-9af6-22b9bdc44a4e', 'D3', 'recursos',    'Dimensión 3: Recursos Naturales para Hoy y para el Futuro',   3, true),
  ('8c161cc7-a04e-4f75-bebc-89c9916fcebc', 'D4', 'territorial', 'Dimensión 4: Guatemala Urbana y Rural',                       4, true),
  ('a353d718-9bd3-4ebe-9173-664c861ba004', 'D5', 'estado',      'Dimensión 5: Estado como Garante de los Derechos Humanos',    5, true)
ON CONFLICT (id) DO NOTHING;
