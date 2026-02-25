# Transformación ForoMINFIN → K'atun 2052 SEGEPLAN

## Resumen Ejecutivo

Este proyecto ha sido exitosamente transformado de la plataforma **ForoMINFIN** (para retroalimentación sobre leyes) a la nueva plataforma **K'atun 2052** de SEGEPLAN para la actualización participativa del Plan Nacional de Desarrollo de Guatemala.

## Cambios Realizados

### 1. Base de Datos

#### Nuevas Tablas Creadas

**`dimensions`** - Las 5 dimensiones del K'atun 2052
- Bienestar para la Gente
- Riqueza para Todos y Todas
- Recursos Naturales para Hoy y para el Futuro
- Guatemala Urbana y Rural
- Estado como Garante de los Derechos

**`documents`** - Documentos oficiales validados por SEGEPLAN
- Organizados por dimensión
- Versiones, estado de aprobación, metadatos
- Secciones estructuradas para retroalimentación granular

**`feedback`** - Retroalimentación ciudadana (reemplaza `comments`)
- Clasificación por dimensión y documento
- Tipo de actor (Ciudadano, Academia, Sociedad Civil, etc.)
- Etiquetas temáticas automáticas
- Soporte para archivos adjuntos

**`structured_responses`** - Respuestas a consultas estructuradas
- Preguntas orientadoras por dimensión
- Respuestas tipo escala
- Análisis estadístico facilitado

**`process_milestones`** - Cronograma del proceso
- Fases completadas, en progreso y próximas
- Tipos: publicación, consulta, fecha límite, evento

**`feedback_likes`** y **`feedback_replies`** - Interacción social

#### Seguridad (RLS)
- Todas las tablas tienen Row Level Security habilitado
- Acceso público de lectura a contenido publicado
- Acceso público de escritura para retroalimentación ciudadana
- Datos sensibles protegidos

### 2. Arquitectura de Código

#### Nuevos Tipos TypeScript
- `src/types/katun.ts` - Tipos completos para todas las entidades
- Interfaces para Dimension, Document, Feedback, StructuredResponse, etc.
- Enums para ActorType y ThematicTag

#### Servicios
- `src/services/katunService.ts` - Capa de servicio completa
- Métodos para todas las operaciones CRUD
- Manejo de errores y casos edge
- Estadísticas agregadas

#### Páginas Nuevas

**KatunHome** (`src/pages/KatunHome.tsx`)
- Introducción al proceso K'atun 2052
- Tarjetas de las 5 dimensiones
- Pasos de participación
- Llamados a la acción

**Documents** (`src/pages/Documents.tsx`)
- Listado completo de documentos oficiales
- Filtros por dimensión y tipo de documento
- Vista previa y descarga de PDFs

**DimensionDetail** (`src/pages/DimensionDetail.tsx`)
- Vista detallada de cada dimensión
- Documentos asociados
- Formulario de retroalimentación

**KatunCalendar** (`src/pages/KatunCalendar.tsx`)
- Línea de tiempo interactiva del proceso
- Hitos completados, en progreso y próximos
- Estadísticas de avance

**PrivacyPolicy** (`src/pages/PrivacyPolicy.tsx`)
- Aviso de privacidad completo y conforme
- Derechos del ciudadano
- Contacto para privacidad

### 3. Actualización de Marca

#### Cambios de Identidad
- MINFIN → SEGEPLAN
- Ley de Contrataciones → K'atun 2052
- Logo actualizado (usar logo de SEGEPLAN)
- Paleta de colores institucionales

#### Contenido Actualizado
- TopBar: información de SEGEPLAN
- Header: navegación adaptada (Inicio, Documentos, Cronograma)
- Footer: contactos y redes sociales de SEGEPLAN
- Meta tags y título del sitio

### 4. Funcionalidades Clave

#### Sistema de Retroalimentación
- **Por documento completo**: Comentarios generales
- **Por sección**: Retroalimentación específica
- **Por dimensión**: Formularios estructurados
- **Clasificación temática**: Tags automáticos para análisis

#### Protección de Datos
- Participación anónima opcional
- Consentimiento explícito antes de enviar
- Aviso de privacidad visible
- Cumplimiento de estándares de protección de datos

#### Transparencia
- Visualización de estadísticas en tiempo real
- Cronograma público del proceso
- Contadores de participación
- Reportes agregados

### 5. Datos Iniciales

#### Dimensiones
Las 5 dimensiones del K'atun están pre-cargadas en la base de datos con:
- Códigos únicos
- Nombres oficiales
- Descripciones
- Iconos y colores para UI

#### Hitos del Proceso
7 hitos del cronograma están configurados:
- Inicio del proceso (completado)
- Consulta técnica (completado)
- Publicación de documentos (completado)
- Retroalimentación ciudadana (en progreso)
- Cierre de retroalimentación (próximo)
- Consolidación y análisis (próximo)
- Presentación final (próximo)

## Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables (Header, Footer, etc.)
├── pages/             # Páginas principales
│   ├── KatunHome.tsx           # Página de inicio
│   ├── Documents.tsx           # Listado de documentos
│   ├── DimensionDetail.tsx     # Detalle de dimensión
│   ├── KatunCalendar.tsx       # Cronograma
│   └── PrivacyPolicy.tsx       # Aviso de privacidad
├── services/          # Lógica de negocio
│   └── katunService.ts         # Servicio principal de K'atun
├── types/             # Definiciones de TypeScript
│   └── katun.ts                # Tipos de K'atun
└── lib/               # Utilidades
    └── supabase.ts             # Cliente de Supabase

supabase/
└── migrations/        # Migraciones de base de datos
    └── create_katun_2052_system.sql  # Schema completo
```

## Próximos Pasos para Implementación

### 1. Assets y Branding
- [ ] Reemplazar logo de MINFIN con logo oficial de SEGEPLAN
- [ ] Actualizar favicon
- [ ] Ajustar colores institucionales si es necesario
- [ ] Añadir imágenes de banner específicas de K'atun 2052

### 2. Contenido
- [ ] Cargar documentos oficiales validados por SEGEPLAN
- [ ] Configurar URLs de PDFs en servidor
- [ ] Definir secciones de documentos para retroalimentación granular
- [ ] Configurar preguntas orientadoras por dimensión

### 3. Configuración
- [ ] Actualizar variables de entorno de producción
- [ ] Configurar dominio personalizado
- [ ] Establecer políticas de backup
- [ ] Configurar monitoreo y analytics

### 4. Seguridad y Cumplimiento
- [ ] Revisar y aprobar aviso de privacidad con equipo legal
- [ ] Implementar límites de tamaño para archivos adjuntos
- [ ] Configurar rate limiting para prevenir abuso
- [ ] Establecer proceso de moderación

### 5. Capacitación
- [ ] Capacitar equipo de SEGEPLAN en uso de plataforma
- [ ] Crear manual de administración
- [ ] Documentar proceso de moderación
- [ ] Preparar materiales de comunicación para ciudadanía

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Routing**: React Router v6
- **Icons**: Lucide React

## Características de Seguridad

- Row Level Security (RLS) en todas las tablas
- Participación anónima soportada
- No se requieren datos personales obligatorios
- Cifrado de datos en tránsito y reposo
- Políticas de acceso granulares

## Análisis y Reportes

La plataforma facilita:
- Conteo de retroalimentación por dimensión
- Análisis por tipo de actor
- Categorización por etiquetas temáticas
- Identificación de tendencias y temas comunes
- Exportación de datos para análisis externo

## Soporte

Para preguntas técnicas sobre la implementación:
- Documentación de código inline
- README.md con instrucciones de desarrollo
- Este documento de transformación

Para preguntas sobre el proceso K'atun 2052:
- Contactar a SEGEPLAN: www.segeplan.gob.gt
- Correo de privacidad: privacidad@segeplan.gob.gt

---

**Desarrollado con base en la arquitectura ForoMINFIN de Red Ciudadana**
**Adaptado para SEGEPLAN - Febrero 2026**
