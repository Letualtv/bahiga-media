#!/bin/bash
# Lo lanza el cron cada 10 minutos: si ha cambiado la carpeta app en GitHub, recompila y reinicia el panel.
set -e
DIR=/var/www/bahiga-contenido
cd "$DIR"
# Mantiene vivo el vigilante de avisos y fuerza una revisión de la cola.
curl -s -o /dev/null -m 40 http://127.0.0.1:4337/salud || true
ANTES=$(git rev-parse HEAD:app 2>/dev/null || echo nada)
git pull -q
DESPUES=$(git rev-parse HEAD:app)
[ "$ANTES" = "$DESPUES" ] && exit 0
echo "$(date -Is) actualizando panel"
cd app && npm ci --silent && npx -y node@24 node_modules/astro/bin/astro.mjs build --silent && pm2 restart bahiga-contenido --update-env >/dev/null
echo "$(date -Is) panel actualizado"
