// Panel de contenido de Bahiga (contenido.bahiga.es). Todo en servidor: la
// sesión se comprueba en cada petición y los datos se leen de bahiga-media.
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://contenido.bahiga.es',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // La comprobación de origen la hace el middleware: detrás de nginx, Astro ve http y el navegador manda https.
  security: { checkOrigin: false },
  server: { host: '127.0.0.1', port: 4337 },
});
