# Panel de contenido de Bahiga

Aplicación privada en https://contenido.bahiga.es (Astro en servidor, PM2 en el VPS, puerto 4337).
No tiene base de datos propia: lee y escribe los ficheros de este repositorio por la API de GitHub.

- Inicio: cifras, lo pendiente de aprobar o con error, y lo próximo.
- Publicaciones: programadas, por aprobar, publicadas, con error y descartadas. Aprobar, publicar ya, descartar, pasar a borrador, reintentar y cambiar la hora.
- Calendario: mes con un color por red.
- Análisis: cifras de Instagram, evolución diaria (`publicador/informe-historial.json`), rendimiento por formato y tabla de publicaciones.
- Competencia: cuentas de `publicador/competencia-cuentas.json`, leídas cada mañana por `competencia.yml`.
- Noticias: lo que prepara la rutina de noticias (ids «n-») con su propuesta de GitHub.
- Ideas: `ideas/ideas.json`. Alta de ideas y cambio de estado desde el panel.

Cada cambio desde el panel es un commit «Panel: …» en este repositorio.

## Servidor

- Variables en `/etc/bahiga-contenido.env` (solo root): `PANEL_PASS_HASH`, `PANEL_SECRET`, `GITHUB_TOKEN`, `HOST`, `PORT`.
- `GITHUB_TOKEN`: token de grano fino solo para bahiga-media con Contents, Issues y Actions en lectura y escritura.
- Instalación: `bash app/instalar.sh` (una vez). Actualización: el cron ejecuta `app/actualizar.sh` cada 10 minutos y recompila si cambió `app/`.
- Cambiar la contraseña: `node -e` del instalador para generar el hash nuevo, sustituir `PANEL_PASS_HASH` en el fichero y `pm2 restart bahiga-contenido`.
