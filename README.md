# Plataforma K'atun: Nuestra Guatemala 2032

Plataforma web de participación ciudadana desarrollada para **SEGEPLAN** en el marco del proceso de actualización del Plan Nacional de Desarrollo K'atun: Nuestra Guatemala 2032. Permite a la ciudadanía consultar documentos oficiales, participar mediante comentarios y encuestas, y a los administradores gestionar contenido de forma dinámica.

---

## Tabla de contenidos

1. [Información general](#1-información-general)
   - [1.1 Estructura del proyecto](#11-estructura-del-proyecto)
   - [1.2 Panel de administración](#12-panel-de-administración)
2. [Desarrollo](#2-desarrollo)
   - [2.1 Requisitos técnicos](#21-requisitos-técnicos)
   - [2.2 Clonar e instalar](#22-clonar-e-instalar)
   - [2.3 Variables de entorno](#23-variables-de-entorno)
   - [2.4 Desarrollo local](#24-desarrollo-local)
   - [2.5 Scripts disponibles](#25-scripts-disponibles)
3. [Producción](#3-producción)
   - [3.1 Compilar para producción](#31-compilar-para-producción)
   - [3.2 Base de datos (Supabase)](#32-base-de-datos-supabase)
   - [3.3 Despliegue — Cloud](#33-despliegue--cloud)
   - [3.4 Despliegue — Self-hosted (Nginx + Docker)](#34-despliegue--self-hosted-nginx--docker)

---

## 1. Información general

### 1.1 Estructura del proyecto

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
├── nginx/
│   └── katun.conf       # Plantilla de proxy inverso (app + API de Supabase)
├── apply-migrations.sh  # Script para aplicar las migraciones al contenedor supabase-db
├── dist/                # Salida compilada (generada por npm run build)
├── .env                 # Variables de entorno (no subir al repositorio)
├── vite.config.ts       # Configuración de Vite
└── tailwind.config.js   # Configuración de Tailwind CSS
```

### 1.2 Panel de administración

Accesible en `/admin/login`. Requiere una cuenta de Supabase Auth (ver [Crear el usuario administrador](#crear-el-usuario-administrador)). Incluye los siguientes módulos:

| Módulo | Función |
|---|---|
| Dashboard | Resumen general de la plataforma |
| Documentos | Subir PDFs, publicar/despublicar documentos oficiales |
| Dimensiones | Administrar las 5 dimensiones del Plan K'atun y sus artículos |
| Comentarios | Moderar comentarios ciudadanos |
| Sala de Prensa | Publicar notas y comunicados |
| Encuestas | Ver respuestas a encuestas y preguntas guiadas |
| Participación | Consultar estadísticas de participación por departamento |
| Login | Autenticación de administradores vía Supabase Auth |

---


#### Migraciones

| Archivo de migración | Descripción |
|---|---|
| `20260225031047_create_comments_system.sql` | Sistema de comentarios ciudadanos |
| `20260225031404_create_katun_2052_system.sql` | Tablas principales de la plataforma K'atun |
| `20260225033300_update_dimensions_add_articles.sql` | Artículos por dimensión |
| `20260525161500_seed_dimensions.sql` | Siembra las 5 dimensiones del Plan K'atun (requerido por las semillas siguientes) |
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

#### Tablas principales

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

#### Almacenamiento (Storage Buckets)

| Bucket | Contenido |
|---|---|
| `documents` | PDFs y archivos adjuntos de documentos |
| `dimension-pdfs` | PDFs asociados a cada dimensión |

#### Seguridad (RLS)

Todas las tablas tienen **Row Level Security (RLS)** habilitado. Las políticas siguen este esquema general:

- **Lectura pública** (`anon`): documentos publicados, comentarios, hitos visibles y participación por departamento.
- **Escritura pública** (`anon`): envío de comentarios, respuestas y encuestas (participación ciudadana sin requerir registro).
- **Escritura autenticada** (`authenticated`): gestión de documentos, dimensiones, artículos, publicaciones de prensa y moderación de comentarios. El acceso autenticado se controla a través de Supabase Auth.

#### Compilar para producción

```bash
npm run build
```

Genera la carpeta `dist/` con todos los archivos estáticos optimizados listos para desplegar. Para previsualizar el resultado antes de subir al servidor:

```bash
npm run preview
```

## 2. Desarrollo

### 2.1 Requisitos técnicos

| Herramienta | Versión mínima | Notas |
|---|---|---|
| Node.js | 18.x o superior | Se recomienda usar la versión LTS más reciente |
| npm | 9.x o superior | Incluido con Node.js |
| Git | 2.x | Para clonar el repositorio |
| Nginx | 1.18 o superior | Solo para despliegue en servidor propio |
| Cuenta Supabase | — | Solo si se usa Supabase Cloud (Opción A) |
| Docker + Docker Compose | 24.x / v2 | Solo si se autoaloja Supabase (Opción B) |

La persistencia se gestiona a través de **Supabase** (PostgreSQL + Auth + Storage).
Hay dos opciones de backend, descritas en la [sección 3.2](#32-base-de-datos-supabase):

- **Opción A — Supabase Cloud:** proyecto gestionado en supabase.com.
- **Opción B — Autoalojado con Docker:** stack oficial de Supabase descrito en la documentación oficial para correr localmente o en un servidor propio.

### 2.2 Clonar e instalar

```bash
# 1. Clonar el repositorio
git clone https://github.com/RedCiudadana/Katun2052.git
cd Katun2052

# 2. Instalar dependencias
npm install
```

### 2.3 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

**Para Supabase Cloud:** obtener estos valores desde el panel de Supabase en:
**Project Settings > API > Project URL** y **anon public key**.

**Para Supabase autoalojado:** `VITE_SUPABASE_ANON_KEY` debe ser igual al valor de `ANON_KEY` generado en el archivo `.env` del stack de Supabase.

> Las variables deben comenzar con `VITE_` para que Vite las exponga al código del cliente.

### 2.4 Desarrollo local

```bash
npm run dev
```

Inicia el servidor de desarrollo en `http://localhost:5173`. Los cambios en el código se reflejan en tiempo real sin necesidad de recompilar.

### 2.5 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compilar para producción (genera `dist/`) |
| `npm run preview` | Previsualizar la build de producción localmente |
| `npm run lint` | Verificar errores de estilo con ESLint |

---

## 3. Producción

### 3.1 Base de datos (Supabase)

La plataforma usa **Supabase** como backend (PostgreSQL + autenticación + almacenamiento). Todos los esquemas están versionados en `supabase/migrations/`.

Elige **una** de las dos opciones de backend:

- **Opción A — Supabase Cloud** (proyecto gestionado en supabase.com).
- **Opción B — Autoalojado con Docker** (stack oficial descrito en la [documentación oficial](https://supabase.com/docs/guides/self-hosting/docker)).

#### Opción A — Supabase Cloud

##### Crear un proyecto Supabase nuevo

1. Ingresar a [supabase.com](https://supabase.com) y crear un proyecto.
2. Obtener la **Project URL** y la **anon public key** desde **Settings > API**.
3. Colocar esos valores en el archivo `.env`.

##### Aplicar las migraciones

Las migraciones deben ejecutarse **en orden cronológico** desde el panel SQL de Supabase (**SQL Editor**) o usando la CLI de Supabase:

```bash
# Con CLI de Supabase (requiere supabase CLI instalado)
supabase db push

# O manualmente: ejecutar cada archivo en el SQL Editor de Supabase
```

#### Opción B — Supabase autoalojado con Docker

Para desplegar Supabase en tu propia infraestructura (local o servidor), sigue la documentación oficial:

- **Guía completa:** <https://supabase.com/docs/guides/self-hosting/docker>
- **Repositorio oficial:** <https://github.com/supabase/supabase/tree/master/docker>

El stack incluye todos los servicios (`db`, `kong`, `auth`, `rest`, `storage`, `realtime`, `studio`, etc.)
necesarios para correr todo el backend sin depender de la nube.

##### Paso 1 — Preparar el stack de Supabase

Sigue los pasos de la [documentación oficial](https://supabase.com/docs/guides/self-hosting/docker) para:
- Clonar o descargar el repositorio oficial de Supabase
- Generar las claves y secretos (`ANON_KEY`, `JWT_SECRET`, `SERVICE_ROLE_KEY`, etc.)
- Configurar las variables de entorno (URLs, base de datos, autenticación)
- Levantar los contenedores con `docker compose up -d`

> Asegúrate de que el contenedor PostgreSQL se llame `supabase-db` (esto es importante para el siguiente paso).

##### Paso 2 — Obtener el ANON_KEY

Después de generar los secretos en el stack de Supabase, encuentra el valor de `ANON_KEY` en el archivo `.env` del stack.

En el `.env` de la raíz de este proyecto, configura:

```env
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=<ANON_KEY del stack de Supabase>
```

(Para producción detrás de Nginx: usa `VITE_SUPABASE_URL=https://api.tu-dominio.com`.)

##### Paso 3 — Aplicar las migraciones

Una vez que el stack de Supabase esté saludable (`docker compose ps` debe mostrar todos los servicios `healthy`),
ejecuta el script de migraciones desde la raíz de este proyecto:

```bash
./apply-migrations.sh
```

El script ejecuta automáticamente los archivos `.sql` de `supabase/migrations/` en orden cronológico dentro del contenedor `supabase-db` e imprime los conteos esperados:

```
dimensions=5
documents=6
dimension_articles=15
```

> El script asume que el contenedor PostgreSQL se llama `supabase-db`. Si le diste otro nombre,
> edita `apply-migrations.sh` y cambia la variable `DB_CONTAINER`.

> Está pensado para una base **nueva**. Re-ejecutarlo sobre una base ya poblada falla en
> sentencias no idempotentes (p. ej. `CREATE POLICY`); en ese caso, reinicia el stack limpio
> antes de volver a sembrar.

> **Nota sobre `seed_dimensions.sql`:** la migración `20260525161500_seed_dimensions.sql`
> inserta las 5 dimensiones del Plan K'atun. Es indispensable porque las semillas de
> documentos y de artículos referencian esas dimensiones (por UUID y por `slug`); sin
> ellas fallan las llaves foráneas. Por eso su timestamp va **justo antes** de
> `20260525161501_seed_initial_documents.sql`.

#### Crear el usuario administrador

El panel de administración (`/admin`) requiere una cuenta de Supabase Auth. Para crear el primer administrador:

1. Ir al panel de Supabase: **Authentication > Users > Add user**.
2. Ingresar correo electrónico y contraseña.
3. Usar esas credenciales para iniciar sesión en `/admin/login` de la plataforma.

### 3.3 Despliegue — Cloud

Para desplegar con Supabase Cloud como backend:

1. Completar [Opción A — Supabase Cloud](#opción-a--supabase-cloud) (proyecto, migraciones, usuario admin).
2. Compilar la app con `npm run build` (las variables `.env` quedan embebidas en el bundle).
3. Subir el contenido de `dist/` a cualquier hosting de estáticos (Netlify, Vercel, Nginx, etc.). El archivo `dist/_redirects` ya está incluido para Netlify; para Nginx ver la configuración SPA en [3.4](#34-despliegue--self-hosted-nginx--docker).

> Las variables de entorno se compilan dentro del bundle de JavaScript al ejecutar `npm run build`. No es necesario copiar el archivo `.env` al servidor; los valores ya están embebidos en `dist/assets/index-*.js`. Guarda el archivo `.env` en un lugar seguro para futuras compilaciones.

### 3.4 Despliegue — Self-hosted (Nginx + Docker)

Aplica cuando se autoaloja tanto la app como el backend de Supabase ([Opción B](#opción-b--supabase-autoalojado-con-docker)).

#### Paso 1 — Compilar el proyecto

```bash
npm run build
```

#### Paso 2 — Copiar archivos al servidor

Copia el contenido de la carpeta `dist/` a la carpeta raíz de Nginx (generalmente `/var/www/html` o `/usr/share/nginx/html`):

```bash
# Eliminar contenido anterior
rm -rf /var/www/html/*

# Copiar nueva versión
cp -r dist/* /var/www/html/
```

#### Paso 3 — Configurar Nginx para SPA

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

#### Paso 4 — Reiniciar Nginx

```bash
sudo nginx -t          # Verificar que la configuración no tiene errores
sudo systemctl reload nginx
```

#### Exponer Supabase autoalojado detrás de Nginx

Si usas el backend autoalojado, necesitas **dos** bloques `server`: uno sirve la app (estático) y otro hace de proxy hacia
el gateway de Supabase (`kong`, puerto `8000`). El repositorio incluye una plantilla en
`nginx/katun.conf`:

```nginx
# App (SPA)
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/html;          # contenido de dist/
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}

# API de Supabase (gateway kong)
server {
    listen 80;
    server_name api.tu-dominio.com;
    location / {
        proxy_pass http://127.0.0.1:8000;   # kong del stack supabase
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Websockets (Realtime)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        client_max_body_size 50m;           # subidas a Storage (límite del bucket documents)
    }
}
```

Pasos:

1. Apuntar el DNS de `tu-dominio.com` y `api.tu-dominio.com` al servidor.
2. Copiar/incluir `nginx/katun.conf` (ajustar `server_name` y `root`), `sudo nginx -t`, `sudo systemctl reload nginx`.
3. Activar HTTPS con Certbot: `sudo certbot --nginx -d tu-dominio.com -d api.tu-dominio.com`.
4. Poner `VITE_SUPABASE_URL=https://api.tu-dominio.com` en el `.env` de la app y recompilar
   (`npm run build`); en el `.env` del stack de Supabase fijar `SUPABASE_PUBLIC_URL` / `API_EXTERNAL_URL`
   a `https://api.tu-dominio.com` y `SITE_URL` a `https://tu-dominio.com`, luego
   `docker compose up -d`.
