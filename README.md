
Este proyecto es una plataforma web para la participación ciudadana en la revisión de propuestas legislativas sobre **infraestructuras críticas**, **protección de datos personales** y **ciberseguridad**.

## Requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- Variables de entorno para Supabase
- Acceso a internet para cargar fuentes y recursos externos

## Instalación

1. **Clona el repositorio:**

   ```sh
   git clone https://github.com/RedCiudadana/ForoMINFIN.git
   ```

2. **Instala las dependencias:**

   ```sh
   npm install
   ```

3. **Configura las variables de entorno:**

   Copia el archivo `.env.example` a `.env` y completa los valores:

   ```
   VITE_SUPABASE_URL=tu_url_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key_supabase
   ```

4. **Crear ejecutable del proyecto:**

   ```sh
   npm run build
   ```

   Crea carpeta dist en el directorio del proyecto que es la que se debe copiar.

5. **Copiar contenido a carpeta de nginx**

   En el directorio base de nginx borrar el contenido actual y copiar la nueva carpeta dist del proyecto.

   Asegurarse que el archivo .env este en un lugar seguro para poder copiar posteriormente y poder hacer uso de él.

5. **Reiniciar servidor de nginx**

   Una vez se tiene el nuevo contenido se puede reiniciar el servidor de nginx para poder observar los nuevos cambios.

## Scripts principales

- `npm run dev` — Inicia el servidor de desarrollo con Vite.
- `npm run build` — Compila la aplicación para producción.
- `npm run preview` — Sirve la versión de producción localmente.

## Estructura principal

- `src` — Código fuente React, componentes, páginas y lógica.
- `public` — Archivos estáticos y configuración de Decap CMS.
- `supabase` — Migraciones y estructura de base de datos.
- `src/content/leyes` — Archivos Markdown con el contenido de las leyes.

## Configuración adicional

- **Supabase:** Debes tener una instancia de Supabase con las tablas y vistas definidas en los archivos de migración (`supabase/migrations/`).

## Recursos útiles

- `src/App.tsx` — Punto de entrada principal.
- `src/lib/supabase.ts` — Conexión y servicios para Supabase.
- `src/components/RecaptchaProvider.tsx` — Configuración de reCAPTCHA.
