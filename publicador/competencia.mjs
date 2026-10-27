// Rastreador de competencia: lee una vez al día las cuentas profesionales de
// competencia-cuentas.json con Business Discovery (API oficial de Meta) y guarda
// en competencia.json sus cifras, su ritmo de publicación y sus mejores piezas.
// No imprime ni guarda el token.
import { readFileSync, writeFileSync } from 'node:fs';
const { META_TOKEN: T, IG_ID } = process.env;
const { cuentas } = JSON.parse(readFileSync(new URL('./competencia-cuentas.json', import.meta.url), 'utf8'));
const SALIDA = new URL('./competencia.json', import.meta.url);
let previo = { cuentas: {} };
try { previo = JSON.parse(readFileSync(SALIDA, 'utf8')); } catch {}

const hoy = new Date().toISOString().slice(0, 10);
const out = { generado: new Date().toISOString(), cuentas: {} };
for (const u of cuentas) {
  const campos = `business_discovery.username(${u}){username,name,biography,followers_count,media_count,profile_picture_url,media.limit(30){caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count}}`;
  const d = await (await fetch(`https://graph.facebook.com/v24.0/${IG_ID}?fields=${encodeURIComponent(campos)}&access_token=${T}`)).json().catch(() => ({}));
  if (d.error || !d.business_discovery) { out.cuentas[u] = { error: d.error?.message || 'Sin datos (¿cuenta personal o privada?)' }; continue; }
  const b = d.business_discovery, m = b.media?.data || [];
  const dias = (x) => (Date.now() - Date.parse(x.timestamp)) / 864e5;
  const ult30 = m.filter((x) => dias(x) <= 30);
  const media = (arr, k) => (arr.length ? Math.round(arr.reduce((s, x) => s + (x[k] || 0), 0) / arr.length) : 0);
  const porTipo = {};
  for (const x of ult30) { const t = x.media_product_type === 'REELS' ? 'Reel' : x.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : 'Imagen'; (porTipo[t] ||= []).push(x); }
  const historial = (previo.cuentas?.[u]?.historial || []).filter((h) => h.fecha !== hoy);
  historial.push({ fecha: hoy, seguidores: b.followers_count });
  out.cuentas[u] = {
    nombre: b.name, bio: b.biography, seguidores: b.followers_count, publicaciones: b.media_count,
    publicaciones_7d: m.filter((x) => dias(x) <= 7).length, publicaciones_30d: ult30.length,
    likes_medios: media(ult30, 'like_count'), comentarios_medios: media(ult30, 'comments_count'),
    por_tipo: Object.fromEntries(Object.entries(porTipo).map(([t, a]) => [t, { n: a.length, likes: media(a, 'like_count'), comentarios: media(a, 'comments_count') }])),
    mejores: [...ult30].sort((a, z) => (z.comments_count * 3 + z.like_count) - (a.comments_count * 3 + a.like_count)).slice(0, 5)
      .map((x) => ({ fecha: x.timestamp.slice(0, 10), tipo: x.media_product_type === 'REELS' ? 'Reel' : x.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : 'Imagen', likes: x.like_count, comentarios: x.comments_count, texto: (x.caption || '').slice(0, 160), enlace: x.permalink })),
    historial: historial.slice(-180),
  };
}
const txt = JSON.stringify(out, null, 1);
if (T && txt.includes(T)) throw new Error('La salida contiene el token: no se guarda.');
writeFileSync(SALIDA, txt + '\n');
console.log('Competencia guardada.');
