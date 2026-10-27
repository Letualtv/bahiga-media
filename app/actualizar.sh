#!/bin/bash
# Lo lanza el cron cada 10 minutos: si ha cambiado la carpeta app en GitHub, recompila y reinicia el panel.
set -e
DIR=/var/www/bahiga-contenido
cd "$DIR"
ANTES=$(git rev-parse HEAD:app 2>/dev/null || echo nada)
git pull -q
DESPUES=$(git rev-parse HEAD:app)
[ "$ANTES" = "$DESPUES" ] && exit 0
echo "$(date -Is) actualizando panel"
cd app && npm ci --silent && npm run build --silent && pm2 restart bahiga-contenido --update-env >/dev/null
echo "$(date -Is) panel actualizado"
