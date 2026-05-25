/*
  # Seed dimension_articles

  Inserts the 3 thematic articles for each of the 5 K'atun dimensions.
  Uses dimension IDs from the actual `dimensions` table (code = 'dimension-1' … 'dimension-5').
  Only inserts if the table is currently empty to avoid duplicates.
*/

DO $$
DECLARE
  dim_bienestar   uuid;
  dim_riqueza     uuid;
  dim_recursos    uuid;
  dim_territorial uuid;
  dim_estado      uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM dimension_articles LIMIT 1) THEN
    RAISE NOTICE 'dimension_articles already has rows — skipping seed.';
    RETURN;
  END IF;

  SELECT id INTO dim_bienestar   FROM dimensions WHERE slug = 'bienestar'   LIMIT 1;
  SELECT id INTO dim_riqueza     FROM dimensions WHERE slug = 'riqueza'     LIMIT 1;
  SELECT id INTO dim_recursos    FROM dimensions WHERE slug = 'recursos'    LIMIT 1;
  SELECT id INTO dim_territorial FROM dimensions WHERE slug = 'territorial' LIMIT 1;
  SELECT id INTO dim_estado      FROM dimensions WHERE slug = 'estado'      LIMIT 1;

  -- ── BIENESTAR ──────────────────────────────────────────────────────────────
  IF dim_bienestar IS NOT NULL THEN
    INSERT INTO dimension_articles (dimension_id, title, content, order_index) VALUES
    (dim_bienestar,
     'Artículo 1. Derecho a la Salud',
     E'El Estado garantizará el acceso universal a servicios de salud de calidad, promoviendo la prevención, atención integral y rehabilitación para toda la población. Se priorizará la atención primaria en salud, la salud materno-infantil y la prevención de enfermedades crónicas.\n\nSe establecerán mecanismos para fortalecer el sistema público de salud, aumentar la cobertura en áreas rurales y reducir las brechas de acceso. Asimismo, se promoverá la formación y retención de personal médico calificado en todo el territorio nacional.\n\nEl Estado trabajará en coordinación con organizaciones de la sociedad civil y el sector privado para garantizar que ninguna persona quede excluida de los servicios esenciales de salud.',
     1),
    (dim_bienestar,
     'Artículo 2. Educación de Calidad',
     E'Se garantizará el acceso universal a una educación de calidad en todos los niveles, desde la educación preprimaria hasta la educación superior. El Estado promoverá modelos educativos pertinentes culturalmente y orientados al desarrollo de competencias para la vida y el trabajo.\n\nSe implementarán programas de formación docente continua, mejoramiento de infraestructura educativa y dotación de recursos pedagógicos. Se priorizará la educación bilingüe intercultural y la educación en ciencia, tecnología, ingeniería y matemáticas.\n\nEl sistema educativo fomentará el pensamiento crítico, la creatividad y los valores democráticos, preparando a las nuevas generaciones para los desafíos del siglo XXI.',
     2),
    (dim_bienestar,
     'Artículo 3. Reducción de la Pobreza',
     E'El Estado implementará políticas integrales para la reducción sostenible de la pobreza y la pobreza extrema, con enfoque en las poblaciones más vulnerables. Se desarrollarán programas de protección social, transferencias condicionadas y oportunidades de generación de ingresos.\n\nSe promoverá el acceso a activos productivos, capacitación y servicios financieros para las familias en condición de pobreza. Las políticas públicas considerarán las múltiples dimensiones de la pobreza, incluyendo educación, salud, vivienda y nutrición.\n\nEl combate a la pobreza será una prioridad nacional con enfoque territorial, considerando las particularidades de las áreas urbanas y rurales.',
     3);
  END IF;

  -- ── RIQUEZA ───────────────────────────────────────────────────────────────
  IF dim_riqueza IS NOT NULL THEN
    INSERT INTO dimension_articles (dimension_id, title, content, order_index) VALUES
    (dim_riqueza,
     'Artículo 1. Desarrollo Económico Inclusivo',
     E'El Estado promoverá un modelo de desarrollo económico inclusivo que genere oportunidades para todos los sectores de la población. Se fomentará la diversificación productiva, el desarrollo de cadenas de valor y la integración de pequeños y medianos productores al mercado.\n\nSe implementarán políticas de fomento a la innovación, el emprendimiento y la formalización de la economía. Se priorizará el desarrollo de sectores estratégicos con alto potencial de generación de empleo y valor agregado.\n\nEl desarrollo económico será sostenible ambientalmente y socialmente responsable, considerando los principios de la economía circular y verde.',
     1),
    (dim_riqueza,
     'Artículo 2. Empleo Digno',
     E'Se garantizará el acceso a empleo digno y decente para toda la población económicamente activa. El Estado promoverá la creación de empleos de calidad, con salarios justos, seguridad social y condiciones laborales adecuadas.\n\nSe implementarán programas de formación técnica y profesional alineados con las necesidades del mercado laboral. Se promoverá la equidad de género en el empleo y la inclusión laboral de poblaciones históricamente excluidas.\n\nEl Estado velará por el cumplimiento de los derechos laborales y promoverá el diálogo social entre trabajadores, empleadores y gobierno.',
     2),
    (dim_riqueza,
     'Artículo 3. Competitividad e Innovación',
     E'El Estado fomentará la competitividad sistémica del país mediante la mejora del clima de negocios, infraestructura productiva y capital humano. Se promoverá la inversión en investigación, desarrollo e innovación tecnológica.\n\nSe apoyará la transformación digital de las empresas y la adopción de nuevas tecnologías. Se fortalecerán los ecosistemas de emprendimiento e innovación, con énfasis en sectores de alto valor agregado.\n\nGuatemala se posicionará como un país atractivo para la inversión productiva, con instituciones sólidas y un entorno favorable para los negocios.',
     3);
  END IF;

  -- ── RECURSOS NATURALES ────────────────────────────────────────────────────
  IF dim_recursos IS NOT NULL THEN
    INSERT INTO dimension_articles (dimension_id, title, content, order_index) VALUES
    (dim_recursos,
     'Artículo 1. Gestión Integral del Agua',
     E'El Estado garantizará el acceso al agua potable como derecho humano fundamental y promoverá la gestión integral y sostenible de los recursos hídricos. Se implementarán políticas de conservación de cuencas hidrográficas y protección de fuentes de agua.\n\nSe desarrollarán sistemas de monitoreo de la calidad del agua y se promoverá el uso eficiente en todos los sectores. Se priorizará el acceso al agua para consumo humano y se regularán los usos productivos de manera sostenible.\n\nEl manejo del agua será participativo, considerando los conocimientos ancestrales y las necesidades de todas las comunidades.',
     1),
    (dim_recursos,
     'Artículo 2. Conservación de Bosques y Biodiversidad',
     E'Se implementarán políticas efectivas para la conservación y restauración de los bosques, reconociendo su importancia para la biodiversidad, la regulación climática y el bienestar humano. Se fortalecerá el sistema de áreas protegidas y se promoverá el manejo forestal sostenible.\n\nEl Estado combatirá la deforestación mediante mecanismos de vigilancia, incentivos para la conservación y alternativas productivas sostenibles. Se promoverá la restauración de ecosistemas degradados y la conectividad ecológica.\n\nSe reconocerá y valorará el conocimiento tradicional de los pueblos indígenas en la gestión de la biodiversidad.',
     2),
    (dim_recursos,
     'Artículo 3. Acción Climática',
     E'Guatemala implementará medidas efectivas de mitigación y adaptación al cambio climático. Se reducirán las emisiones de gases de efecto invernadero y se fortalecerá la resiliencia de las comunidades más vulnerables.\n\nSe desarrollarán sistemas de alerta temprana, planes de gestión de riesgos y estrategias de adaptación basadas en ecosistemas. Se promoverá la transición hacia energías renovables y prácticas agrícolas climáticamente inteligentes.\n\nLa acción climática será transversal a todas las políticas públicas y se implementará con enfoque territorial y participativo.',
     3);
  END IF;

  -- ── TERRITORIAL ───────────────────────────────────────────────────────────
  IF dim_territorial IS NOT NULL THEN
    INSERT INTO dimension_articles (dimension_id, title, content, order_index) VALUES
    (dim_territorial,
     'Artículo 1. Ordenamiento Territorial',
     E'El Estado implementará políticas de ordenamiento territorial que promuevan un desarrollo equilibrado entre áreas urbanas y rurales. Se establecerán instrumentos de planificación territorial participativos que consideren las vocaciones productivas, la protección ambiental y el patrimonio cultural.\n\nSe regularizará el uso del suelo y se promoverá un crecimiento urbano ordenado y sostenible. Se fortalecerán las capacidades de los gobiernos locales para la gestión territorial efectiva.\n\nEl ordenamiento territorial considerará la gestión de riesgos, la conectividad y el acceso equitativo a servicios básicos.',
     1),
    (dim_territorial,
     'Artículo 2. Infraestructura y Conectividad',
     E'Se desarrollará infraestructura de calidad que conecte todo el territorio nacional y facilite el acceso a mercados, servicios y oportunidades. Se priorizará la construcción y mantenimiento de carreteras, puentes, puertos y aeropuertos.\n\nSe ampliará la cobertura de servicios básicos como agua potable, saneamiento, electricidad y telecomunicaciones. Se promoverá la conectividad digital para reducir la brecha tecnológica entre áreas urbanas y rurales.\n\nLa infraestructura será resiliente al cambio climático, ambientalmente sostenible y diseñada con criterios de accesibilidad universal.',
     2),
    (dim_territorial,
     'Artículo 3. Desarrollo Rural Integral',
     E'Se promoverá el desarrollo integral de las áreas rurales mediante políticas que mejoren la calidad de vida, generen oportunidades económicas y fortalezcan las capacidades locales. Se apoyará la agricultura familiar, el desarrollo de agroindustrias y la diversificación productiva rural.\n\nSe garantizará el acceso a servicios de salud, educación y otros servicios básicos en áreas rurales. Se promoverá el fortalecimiento de la organización comunitaria y la participación de las poblaciones rurales en la toma de decisiones.\n\nEl desarrollo rural será sostenible, respetará las culturas locales y promoverá la seguridad alimentaria.',
     3);
  END IF;

  -- ── ESTADO ────────────────────────────────────────────────────────────────
  IF dim_estado IS NOT NULL THEN
    INSERT INTO dimension_articles (dimension_id, title, content, order_index) VALUES
    (dim_estado,
     'Artículo 1. Fortalecimiento Institucional',
     E'El Estado fortalecerá sus instituciones para garantizar su eficiencia, eficacia y legitimidad. Se promoverá la profesionalización de la función pública, la meritocracia y la carrera administrativa. Se modernizarán los sistemas de gestión pública y se implementarán tecnologías de información.\n\nSe fortalecerán los mecanismos de control interno y rendición de cuentas. Las instituciones serán accesibles, inclusivas y orientadas al servicio de la ciudadanía. Se promoverá la coordinación interinstitucional y entre niveles de gobierno.\n\nEl fortalecimiento institucional será continuo y basado en evidencia, aprendizaje y mejora permanente.',
     1),
    (dim_estado,
     'Artículo 2. Transparencia y Combate a la Corrupción',
     E'Se implementarán políticas efectivas para prevenir, detectar y sancionar la corrupción en todos los niveles del Estado. Se fortalecerán los órganos de control y fiscalización, garantizando su independencia y recursos adecuados.\n\nSe promoverá la transparencia activa, el acceso a la información pública y la participación ciudadana en la vigilancia de la gestión pública. Se implementarán sistemas de contrataciones públicas transparentes y mecanismos de denuncia protegidos.\n\nLa integridad pública será un valor fundamental, promovido mediante educación, códigos de ética y una cultura de legalidad.',
     2),
    (dim_estado,
     'Artículo 3. Participación Ciudadana',
     E'El Estado promoverá la participación activa de la ciudadanía en la formulación, implementación y evaluación de políticas públicas. Se establecerán mecanismos formales de consulta, diálogo y deliberación ciudadana.\n\nSe fortalecerán los espacios de participación comunitaria y se promoverá la organización social. Se garantizará el acceso a información clara y oportuna para facilitar la participación informada. Se reconocerá la diversidad de actores sociales y se promoverá la inclusión de grupos históricamente excluidos.\n\nLa participación será significativa, plural y con capacidad de incidir en las decisiones públicas.',
     3);
  END IF;

END $$;
