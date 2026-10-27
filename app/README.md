# Panel de contenido de Bahiga

Aplicación privada en https://contenido.bahiga.es (Astro en servidor, PM2 en el VPS, puerto 4337).
No tiene base de datos propia: lee y escribe los ficheros de este repositorio por la API de GitHub.

- Inicio: «Para ti» (por aprobar, errores, mensajes y comentarios sin atender, ideas nuevas), 4 cifras y los próximos 7 días.
- Calendario: mes con la hora, la red y el titular de cada pieza.
- Publicaciones: una línea por pieza; al pulsarla se ve el texto y las opciones. Filtro por red y «Solo noticias».
- Ideas: `ideas/ideas.json`. Las que añade otra persona o la rutina salen como «Nuevo» y con contador en el menú.
- Análisis: tu cuenta y, en otra pestaña, la competencia (`publicador/competencia-cuentas.json`).

## Avisos al móvil

El panel es instalable (PWA). En el móvil: abrir el panel en Chrome, «Añadir a pantalla de inicio» y pulsar «Activar avisos en este dispositivo».

- El vigilante del panel (`src/lib/vigilante.ts`) revisa la cola cada 2 minutos y avisa de lo nuevo por aprobar, de los fallos y de las noticias publicadas.
- `publicador/comentarios.mjs` manda los comentarios con palabra clave y los mensajes privados a `/api/avisar` con la clave `PANEL_AVISOS` (secreto de GitHub y variable del servidor). Se guardan en el servidor, no en el repositorio, porque este es público.
- Datos locales en `/var/lib/bahiga-contenido` (solo root): claves VAPID, dispositivos dados de alta, avisos y estado del vigilante.

Cada cambio desde el panel es un commit «Panel: …» en este repositorio.

## Servidor

- Variables en `/etc/bahiga-contenido.env` (solo root): `PANEL_PASS_HASH`, `PANEL_SECRET`, `GITHUB_TOKEN`, `PANEL_AVISOS`, `HOST`, `PORT`.
- `GITHUB_TOKEN`: token de grano fino solo para bahiga-media con Contents, Issues y Actions en lectura y escritura.
- Instalación: `bash app/instalar.sh` (una vez). Actualización: el cron ejecuta `app/actualizar.sh` cada 10 minutos y recompila si cambió `app/`.
- Cambiar la contraseña: `node -e` del instalador para generar el hash nuevo, sustituir `PANEL_PASS_HASH` en el fichero y `pm2 restart bahiga-contenido`.
