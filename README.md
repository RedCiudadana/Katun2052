# Plataforma K'atun: Nuestra Guatemala 2032

Plataforma web de participación ciudadana desarrollada para **SEGEPLAN** en el marco del proceso de actualización del Plan Nacional de Desarrollo K'atun: Nuestra Guatemala 2032. Permite a la ciudadanía consultar documentos oficiales, participar mediante comentarios y encuestas, y a los administradores gestionar contenido de forma dinámica.

---

## Tabla de contenidos

1. [Requisitos técnicos](#1-requisitos-técnicos)
2. [Clonar e instalar](#2-clonar-e-instalar)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Desarrollo local](#4-desarrollo-local)
5. [Compilar para producción](#5-compilar-para-producción)
6. [Despliegue en servidor con Nginx](#6-despliegue-en-servidor-con-nginx)
7. [Base de datos (Supabase)](#7-base-de-datos-supabase)
8. [Panel de administración](#8-panel-de-administración)
9. [Estructura del proyecto](#9-estructura-del-proyecto)

---

## 1. Requisitos técnicos

| Herramienta | Versión mínima | Notas |
|---|---|---|
| Node.js | 18.x o superior | Se recomienda usar la versión LTS más reciente |
| npm | 9.x o superior | Incluido con Node.js |
| Git | 2.x | Para clonar el repositorio |
| Nginx | 1.18 o superior | Solo para despliegue en servidor propio |
| Cuenta Supabase | — | Proyecto activo con URL y claves de API |

No se requiere base de datos local. Toda la persistencia se gestiona a través de **Supabase** (PostgreSQL en la nube).

---

## 2. Clonar e instalar

```bash
# 1. Clonar el repositorio
git clone https://github.com/RedCiudadana/Katun2052.git
cd Katun2052

# 2. Instalar dependencias
npm install
```

---

## 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

Estos valores se obtienen desde el panel de Supabase en:
**Project Settings > API > Project URL** y **anon public key**.

> Las variables deben comenzar con `VITE_` para que Vite las exponga al código del cliente.

---

## 4. Desarrollo local

```bash
npm run dev
```

Inicia el servidor de desarrollo en `http://localhost:5173`. Los cambios en el código se reflejan en tiempo real sin necesidad de recompilar.

---

## 5. Compilar para producción

```bash
npm run build
```

Genera la carpeta `dist/` con todos los archivos estáticos optimizados listos para desplegar. Para previsualizar el resultado antes de subir al servidor:

```bash
npm run preview
```

---

## 6. Despliegue en servidor con Nginx

### Paso 1 — Compilar el proyecto

```bash
npm run build
```

### Paso 2 — Copiar archivos al servidor

Copia el contenido de la carpeta `dist/` a la carpeta raíz de Nginx (generalmente `/var/www/html` o `/usr/share/nginx/html`):

```bash
# Eliminar contenido anterior
rm -rf /var/www/html/*

# Copiar nueva versión
cp -r dist/* /var/www/html/
```

### Paso 3 — Configurar Nginx para SPA

La plataforma usa React Router, por lo que todas las rutas deben redirigirse a `index.html`. Agrega o edita el bloque `location` en tu configuración de Nginx:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de archivos estáticos con hash en el nombre
    location ~* \.(js|css|png|jpg|gif|ico|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

> El archivo `dist/_redirects` está incluido para despliegues en Netlify. Para Nginx, la configuración anterior cumple la misma función.

### Paso 4 — Reiniciar Nginx

```bash
sudo nginx -t          # Verificar que la configuración no tiene errores
sudo systemctl reload nginx
```

### Nota sobre el archivo .env

Las variables de entorno se compilan dentro del bundle de JavaScript en el momento de ejecutar `npm run build`. No es necesario copiar el archivo `.env` al servidor; los valores ya están embebidos en `dist/assets/index-*.js`. Guarda el archivo `.env` en un lugar seguro para futuras compilaciones.

---

## 7. Base de datos (Supabase)

La plataforma usa **Supabase** como backend (PostgreSQL + autenticación + almacenamiento). Todos los esquemas están versionados en `supabase/migrations/`.

### Crear un proyecto Supabase nuevo

1. Ingresar a [supabase.com](https://supabase.com) y crear un proyecto.
2. Obtener la **Project URL** y la **anon public key** desde **Settings > API**.
3. Colocar esos valores en el archivo `.env`.

### Aplicar las migraciones

Las migraciones deben ejecutarse **en orden cronológico** desde el panel SQL de Supabase (**SQL Editor**) o usando la CLI de Supabase:

```bash
# Con CLI de Supabase (requiere supabase CLI instalado)
supabase db push

# O manualmente: ejecutar cada archivo en el SQL Editor de Supabase
```

| Archivo de migración | Descripción |
|---|---|
| `20260225031047_create_comments_system.sql` | Sistema de comentarios ciudadanos |
| `20260225031404_create_katun_2052_system.sql` | Tablas principales de la plataforma K'atun |
| `20260225033300_update_dimensions_add_articles.sql` | Artículos por dimensión |
| `20260525161501_seed_initial_documents.sql` | Datos iniciales de documentos |
| `20260525162644_seed_document_sections.sql` | Secciones de documentos |
| `20260525163044_admin_settings_and_doc_file_upload.sql` | Configuración de admin y carga de archivos |
| `20260525163514_create_documents_storage_bucket.sql` | Bucket de almacenamiento para documentos |
| `20260525214223_create_department_participation.sql` | Participación por departamento (mapa) |
| `20260525214946_add_thumbnail_url_to_documents.sql` | Miniaturas para documentos |
| `20260525215935_create_press_posts.sql` | Sala de Prensa |
| `20260525233725_seed_dimension_articles.sql` | Artículos iniciales por dimensión |
| `20260613200751_add_pdf_url_to_dimensions.sql` | PDF adjunto por dimensión |
| `20260613200806_create_dimension_pdfs_bucket.sql` | Bucket para PDFs de dimensiones |
| `20260613202105_add_rls_policies_dimensions_update.sql` | Políticas RLS adicionales |
| `20260615181705_add_image_mime_types_to_documents_bucket.sql` | Soporte de imágenes en bucket de documentos |

### Tablas principales

| Tabla | Propósito |
|---|---|
| `dimensions` | Los 5 ejes del Plan K'atun (territorial, bienestar, riqueza, recursos, estado) |
| `documents` | Documentos oficiales publicados por SEGEPLAN |
| `feedback` | Comentarios y retroalimentación ciudadana por documento |
| `structured_responses` | Respuestas a preguntas guiadas por dimensión |
| `feedback_likes` | Votos de apoyo en comentarios |
| `feedback_replies` | Respuestas de moderadores a comentarios |
| `process_milestones` | Hitos de la línea de tiempo del proceso |
| `department_participation` | Conteo de participación por departamento de Guatemala |
| `press_posts` | Artículos y comunicados de la Sala de Prensa |

### Almacenamiento (Storage Buckets)

| Bucket | Contenido |
|---|---|
| `documents` | PDFs y archivos adjuntos de documentos |
| `dimension-pdfs` | PDFs asociados a cada dimensión |

### Seguridad (RLS)

Todas las tablas tienen **Row Level Security (RLS)** habilitado. Las políticas siguen este esquema general:

- **Lectura pública** (`anon`): documentos publicados, comentarios, hitos visibles y participación por departamento.
- **Escritura pública** (`anon`): envío de comentarios, respuestas y encuestas (participación ciudadana sin requerir registro).
- **Escritura autenticada** (`authenticated`): gestión de documentos, dimensiones, artículos, publicaciones de prensa y moderación de comentarios. El acceso autenticado se controla a través de Supabase Auth.

### Crear el usuario administrador

El panel de administración (`/admin`) requiere una cuenta de Supabase Auth. Para crear el primer administrador:

1. Ir al panel de Supabase: **Authentication > Users > Add user**.
2. Ingresar correo electrónico y contraseña.
3. Usar esas credenciales para iniciar sesión en `/admin/login` de la plataforma.

---

## 8. Panel de administración

Accesible en `/admin/login`. Permite:

- Gestionar documentos (subir PDFs, publicar/despublicar)
- Administrar dimensiones y artículos
- Moderar comentarios ciudadanos
- Publicar notas de Sala de Prensa
- Ver respuestas de encuestas
- Consultar estadísticas de participación por departamento

---

## 9. Estructura del proyecto

```
/
├── src/
│   ├── assets/          # Imágenes, fuentes, íconos, logos
│   ├── components/      # Componentes reutilizables (Header, Footer, etc.)
│   ├── context/         # Contextos de React (Auth, Participación)
│   ├── hooks/           # Custom hooks (useComments, etc.)
│   ├── lib/             # Cliente de Supabase
│   ├── pages/           # Páginas públicas y panel /admin
│   ├── services/        # Lógica de acceso a datos (Supabase queries)
│   └── types/           # Tipos TypeScript
├── public/
│   ├── images/          # Recursos estáticos públicos
│   └── admin/           # Configuración de Decap CMS (opcional)
├── supabase/
│   └── migrations/      # Archivos SQL de migraciones en orden
├── dist/                # Salida compilada (generada por npm run build)
├── .env                 # Variables de entorno (no subir al repositorio)
├── vite.config.ts       # Configuración de Vite
└── tailwind.config.js   # Configuración de Tailwind CSS
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compilar para producción (genera `dist/`) |
| `npm run preview` | Previsualizar la build de producción localmente |
| `npm run lint` | Verificar errores de estilo con ESLint |
