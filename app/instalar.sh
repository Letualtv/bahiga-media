#!/bin/bash
# Instala el panel de contenido de Bahiga en el VPS (contenido.bahiga.es). Se ejecuta una vez, como root.
# Antes: el registro DNS A de contenido.bahiga.es tiene que apuntar a este servidor.
set -euo pipefail
DIR=/var/www/bahiga-contenido
ENV=/etc/bahiga-contenido.env
DOMINIO=contenido.bahiga.es

echo "1/6 Código (solo la carpeta app del repositorio)"
if [ ! -d "$DIR/.git" ]; then
  git clone --filter=blob:none --sparse https://github.com/Letualtv/bahiga-media.git "$DIR"
  git -C "$DIR" sparse-checkout set app
else
  git -C "$DIR" pull -q
fi

echo "2/6 Claves (no se muestran al escribirlas)"
if [ ! -f "$ENV" ]; then
  read -s -p "Contraseña para entrar al panel (mínimo 10 caracteres): " CLAVE; echo
  [ ${#CLAVE} -ge 10 ] || { echo "Demasiado corta."; exit 1; }
  read -s -p "Token de GitHub del panel: " TOKEN; echo
  HASH=$(CLAVE="$CLAVE" node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');console.log('scrypt\$'+s+'\$'+c.scryptSync(process.env.CLAVE,s,64).toString('hex'))")
  umask 077
  cat > "$ENV" <<FIN
HOST=127.0.0.1
PORT=4337
PANEL_PASS_HASH=$HASH
PANEL_SECRET=$(openssl rand -hex 32)
GITHUB_TOKEN=$TOKEN
FIN
  unset CLAVE TOKEN HASH
  chmod 600 "$ENV"
fi

echo "3/6 Compilación"
cd "$DIR/app" && npm ci --silent && npm run build --silent

echo "4/6 Arranque con PM2"
pm2 delete bahiga-contenido >/dev/null 2>&1 || true
pm2 start "node --env-file=$ENV $DIR/app/dist/server/entry.mjs" --name bahiga-contenido --cwd "$DIR/app"
pm2 save

echo "5/6 nginx y certificado"
cat > /etc/nginx/sites-available/$DOMINIO <<FIN
server {
  listen 80;
  server_name $DOMINIO;
  client_max_body_size 2m;
  location / {
    proxy_pass http://127.0.0.1:4337;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
FIN
ln -sf /etc/nginx/sites-available/$DOMINIO /etc/nginx/sites-enabled/$DOMINIO
nginx -t && systemctl reload nginx
certbot --nginx -d $DOMINIO --non-interactive --agree-tos -m info@bahiga.es --redirect

echo "6/6 Actualización automática (cada 10 minutos)"
chmod +x "$DIR/app/actualizar.sh"
( crontab -l 2>/dev/null | grep -v 'bahiga-contenido/app/actualizar.sh'; echo "*/10 * * * * $DIR/app/actualizar.sh >> /var/log/bahiga-contenido.log 2>&1" ) | crontab -

echo "Listo: https://$DOMINIO"
