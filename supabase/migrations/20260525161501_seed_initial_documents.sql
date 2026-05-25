/*
  # Seed initial documents

  Inserts the initial published documents for the K'atun 2032 platform,
  one per dimension plus a general plan document, referencing the PDF
  already hosted in the public folder.
*/

INSERT INTO documents (dimension_id, title, description, document_type, version, status, pdf_url, publication_date, is_published)
VALUES
  (
    NULL,
    'Plan Nacional de Desarrollo K''atun: Nuestra Guatemala 2032',
    'Documento base del Plan Nacional de Desarrollo de Guatemala, que establece la visión estratégica del país al año 2032 en sus cinco dimensiones de desarrollo.',
    'plan',
    '1.0',
    'published',
    '/files/ley_contrataciones_publicas.pdf',
    '2014-09-01',
    true
  ),
  (
    '0b5e4b23-7eb4-4f55-b0ff-e36d22bbac59',
    'Dimensión 1: Bienestar para la Gente',
    'Lineamientos y políticas del K''atun 2032 orientados al bienestar humano, incluyendo salud, educación, seguridad alimentaria y protección social.',
    'lineamientos',
    '1.0',
    'published',
    '/files/ley_contrataciones_publicas.pdf',
    '2014-09-01',
    true
  ),
  (
    'b7943058-fdb7-40a8-be5b-9136b22272c9',
    'Dimensión 2: Riqueza para Todos y Todas',
    'Estrategias del K''atun 2032 para el desarrollo económico inclusivo, generación de empleo digno y reducción de la pobreza.',
    'lineamientos',
    '1.0',
    'published',
    '/files/ley_contrataciones_publicas.pdf',
    '2014-09-01',
    true
  ),
  (
    '7444573a-0c71-497b-9af6-22b9bdc44a4e',
    'Dimensión 3: Recursos Naturales para Hoy y para el Futuro',
    'Marco estratégico del K''atun 2032 para la gestión sostenible de los recursos naturales, adaptación al cambio climático y ordenamiento territorial ambiental.',
    'lineamientos',
    '1.0',
    'published',
    '/files/ley_contrataciones_publicas.pdf',
    '2014-09-01',
    true
  ),
  (
    '8c161cc7-a04e-4f75-bebc-89c9916fcebc',
    'Dimensión 4: Guatemala Urbana y Rural',
    'Políticas del K''atun 2032 para el desarrollo territorial equilibrado, conectividad, vivienda e infraestructura en zonas urbanas y rurales.',
    'lineamientos',
    '1.0',
    'published',
    '/files/ley_contrataciones_publicas.pdf',
    '2014-09-01',
    true
  ),
  (
    'a353d718-9bd3-4ebe-9173-664c861ba004',
    'Dimensión 5: Estado como Garante de los Derechos Humanos',
    'Lineamientos del K''atun 2032 para el fortalecimiento del Estado, la transparencia, la participación ciudadana y la garantía de los derechos humanos.',
    'lineamientos',
    '1.0',
    'published',
    '/files/ley_contrataciones_publicas.pdf',
    '2014-09-01',
    true
  );
