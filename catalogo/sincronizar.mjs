// Catálogo desde redes: lee las publicaciones de la cuenta de Instagram (y, si se pide, de la página de
// Facebook) de un negocio y las deja listas para enseñarlas en su web: un catalogo.json y las fotos copiadas.
// Las direcciones de las fotos que da Meta caducan, por eso se descargan al servidor de la web.
//
// Uso:  META_TOKEN=… IG_ID=… [PAGE_ID=…] [ETIQUETA=catalogo] [MAX=60] node catalogo/sincronizar.mjs <carpeta de destino>
//   ETIQUETA: si se indica, solo entran las publicaciones que lleven esa etiqueta (#catalogo).
//   La cuenta de Instagram tiene que ser profesional (empresa o creador) y haber autorizado la aplicación.
import { mkdirSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const T = process.env.META_TOKEN, G = 'https://graph.facebook.com/v24.0';
const DEST = process.argv[2] || 'catalogo/salida';
const MAX = Number(process.env.MAX || 60);
const ETIQUETA = (process.env.ETIQUETA || '').replace(/^#/, '').toLowerCase();
if (!T) { console.error('Falta META_TOKEN'); process.exit(1); }

const api = async (url, token = T) => {
  const r = await fetch(url + (url.includes('?') ? '&' : '?') + 'access_token=' + token);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
};
const todas = async (url, token) => {
  const out = [];
  while (url && out.length < MAX) { const j = await api(url, token); out.push(...(j.data || [])); url = j.paging?.next?.replace(/[?&]access_token=[^&]+/, '') || null; }
  return out.slice(0, MAX);
};

// Del texto de la publicación sale la ficha: primera línea = nombre; «25 €» = precio; «agotado» o «vendido» = sin existencias.
export function ficha(texto = '') {
  const limpio = texto.replace(/\r/g, '').trim();
  const lineas = limpio.split('\n').map((l) => l.trim()).filter(Boolean);
  const etiquetas = [...limpio.matchAll(/#([\p{L}\p{N}_]+)/gu)].map((m) => m[1].toLowerCase());
  const precio = limpio.match(/(\d{1,5}(?:[.,]\d{1,2})?)\s?(?:€|euros?\b)/i);
  const sinEtiquetas = (l) => l.replace(/#[\p{L}\p{N}_]+/gu, '').trim();
  return {
    nombre: sinEtiquetas(lineas[0] || '').slice(0, 90),
    descripcion: lineas.slice(1).map(sinEtiquetas).filter(Boolean).join(' ').slice(0, 400),
    precio: precio ? precio[1].replace('.', ',') + ' €' : null,
    agotado: /\b(agotad[oa]s?|vendid[oa]s?)\b/i.test(limpio),
    etiquetas,
  };
}

mkdirSync(join(DEST, 'img'), { recursive: true });
const guardadas = new Set();
async function foto(url, nombre) {
  const ruta = join(DEST, 'img', nombre); guardadas.add(nombre);
  if (existsSync(ruta)) return `img/${nombre}`;
  const r = await fetch(url); if (!r.ok) return null;
  writeFileSync(ruta, Buffer.from(await r.arrayBuffer()));
  return `img/${nombre}`;
}

const piezas = [];
if (process.env.IG_ID) {
  const ms = await todas(`${G}/${process.env.IG_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}&limit=50`);
  for (const m of ms) {
    const partes = m.media_type === 'CAROUSEL_ALBUM' ? (m.children?.data || []) : [m];
    const urls = partes.map((p) => (p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url)).filter(Boolean);
    const fotos = [];
    for (const [i, u] of urls.entries()) { const f = await foto(u, `${m.id}-${i + 1}.jpg`); if (f) fotos.push(f); }
    if (fotos.length) piezas.push({ id: m.id, red: 'instagram', fecha: m.timestamp, enlace: m.permalink, video: m.media_type === 'VIDEO', fotos, ...ficha(m.caption) });
  }
}
if (process.env.PAGE_ID) {
  // Las publicaciones de la página piden el identificador de la propia página.
  const { access_token: PT } = await api(`${G}/${process.env.PAGE_ID}?fields=access_token`);
  const ps = await todas(`${G}/${process.env.PAGE_ID}/published_posts?fields=id,message,full_picture,permalink_url,created_time&limit=50`, PT);
  for (const p of ps) {
    if (!p.full_picture) continue;
    const f = await foto(p.full_picture, `fb-${p.id}.jpg`);
    if (f) piezas.push({ id: `fb-${p.id}`, red: 'facebook', fecha: p.created_time, enlace: p.permalink_url, video: false, fotos: [f], ...ficha(p.message) });
  }
}

// Lo mismo publicado en las dos redes entra una sola vez (manda Instagram).
const vistos = new Set();
const catalogo = piezas
  .filter((p) => !ETIQUETA || p.etiquetas.includes(ETIQUETA))
  .sort((a, b) => (a.red === b.red ? 0 : a.red === 'instagram' ? -1 : 1))
  .filter((p) => { const k = p.nombre.toLowerCase(); if (k && vistos.has(k)) return false; vistos.add(k); return true; })
  .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha));

// Lo que se borró en la red se borra también aquí.
const usadas = new Set(catalogo.flatMap((p) => p.fotos.map((f) => f.slice(4))));
for (const f of readdirSync(join(DEST, 'img'))) if (!usadas.has(f)) unlinkSync(join(DEST, 'img', f));

writeFileSync(join(DEST, 'catalogo.json'), JSON.stringify({ actualizado: new Date().toISOString(), piezas: catalogo }, null, 1));
console.log(`${catalogo.length} publicaciones en el catálogo, ${usadas.size} fotos.`);
