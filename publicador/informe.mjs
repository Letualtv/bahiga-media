// Saca las métricas de Instagram (@bahiga.estudio) y Facebook (bahiga.es) y las
// guarda en publicador/informe.json. No imprime ni guarda el token.
import { writeFileSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0';
const { META_TOKEN: T, IG_ID, PAGE_ID } = process.env;

async function get(ruta, params = {}, tk = T) {
  const q = new URLSearchParams({ ...params, access_token: tk });
  const r = await fetch(`${G}${ruta}?${q}`);
  const d = await r.json().catch(() => ({}));
  if (d.error) return { error: `${d.error.message} (${d.error.code})` };
  return d;
}

// Prueba varias listas de métricas: Meta rechaza la petición entera si una no vale para ese tipo.
async function insightsMedia(m) {
  const listas = m.media_product_type === 'REELS'
    ? ['reach,views,saved,shares,comments,likes,total_interactions,ig_reels_avg_watch_time', 'reach,views,saved,shares,total_interactions', 'reach,saved,shares']
    : m.media_product_type === 'STORY'
      ? ['reach,views,replies,navigation,shares', 'reach,views', 'reach']
      : ['reach,views,saved,shares,total_interactions', 'reach,saved,shares', 'reach'];
  let ultimo;
  for (const metric of listas) {
    const d = await get(`/${m.id}/insights`, { metric });
    if (!d.error) return Object.fromEntries((d.data || []).map((x) => [x.name, x.values?.[0]?.value ?? x.total_value?.value]));
    ultimo = d.error;
  }
  return { error: ultimo };
}

const informe = { generado: new Date().toISOString() };
informe.instagram_cuenta = await get(`/${IG_ID}`, { fields: 'username,followers_count,follows_count,media_count' });
const medios = await get(`/${IG_ID}/media`, { fields: 'id,caption,media_type,media_product_type,timestamp,permalink,like_count,comments_count', limit: '50' });
informe.instagram_publicaciones = [];
for (const m of medios.data || []) {
  informe.instagram_publicaciones.push({
    fecha: m.timestamp, tipo: m.media_product_type, formato: m.media_type, enlace: m.permalink,
    texto: (m.caption || '').slice(0, 120), likes: m.like_count, comentarios: m.comments_count,
    metricas: await insightsMedia(m),
  });
}
if (medios.error) informe.instagram_publicaciones_error = medios.error;
const hist = await get(`/${IG_ID}/stories`, { fields: 'id,media_type,media_product_type,timestamp,permalink' });
informe.instagram_historias_activas = [];
for (const m of hist.data || []) informe.instagram_historias_activas.push({ fecha: m.timestamp, metricas: await insightsMedia({ ...m, media_product_type: 'STORY' }) });

const hasta = Math.floor(Date.now() / 1000), desde = hasta - 28 * 86400;
informe.instagram_cuenta_28d = await get(`/${IG_ID}/insights`, { metric: 'reach,views,accounts_engaged,total_interactions,profile_views,website_clicks,follows_and_unfollows', period: 'day', metric_type: 'total_value', since: String(desde), until: String(hasta) });
if (informe.instagram_cuenta_28d.error) informe.instagram_cuenta_28d = await get(`/${IG_ID}/insights`, { metric: 'reach,accounts_engaged,total_interactions,profile_views', period: 'day', metric_type: 'total_value', since: String(desde), until: String(hasta) });

const pg = await get(`/${PAGE_ID}`, { fields: 'access_token,name,followers_count,fan_count' });
const ptk = pg.access_token; delete pg.access_token;
informe.facebook_pagina = pg;
if (ptk) {
  const posts = await get(`/${PAGE_ID}/posts`, { fields: 'id,message,created_time,permalink_url,shares,reactions.summary(true),comments.summary(true)', limit: '30' }, ptk);
  informe.facebook_publicaciones = (posts.data || []).map((p) => ({ fecha: p.created_time, enlace: p.permalink_url, texto: (p.message || '').slice(0, 120), reacciones: p.reactions?.summary?.total_count, comentarios: p.comments?.summary?.total_count, compartidos: p.shares?.count || 0 }));
  if (posts.error) informe.facebook_publicaciones_error = posts.error;
  informe.facebook_28d = await get(`/${PAGE_ID}/insights`, { metric: 'page_impressions_unique,page_post_engagements,page_follows', period: 'days_28' }, ptk);
}
// Las dos cifras que miramos cada semana: lo que trae gente nueva (compartidos + guardados)
// y lo que trae clientes (comentarios con palabra clave: WEB, GOOGLE...).
const PALABRAS = /\b(web|google|precio|presupuesto|info|informaci[oó]n|interesa)\b/i;
const reels7d = informe.instagram_publicaciones.filter((x) => Date.now() - Date.parse(x.fecha) < 7 * 86400e3);
let conPalabra = 0;
for (const x of reels7d) {
  const id = x.enlace && (await get(`/${IG_ID}/media`, { fields: 'id,permalink', limit: '50' })).data?.find((m) => m.permalink === x.enlace)?.id;
  if (!id || !x.comentarios) continue;
  const cs = await get(`/${id}/comments`, { fields: 'text,username', limit: '100' });
  x.comentarios_palabra_clave = (cs.data || []).filter((k) => PALABRAS.test(k.text || '')).map((k) => `@${k.username}: ${k.text}`);
  conPalabra += x.comentarios_palabra_clave.length;
}
informe.resumen_semana = {
  publicaciones: reels7d.length,
  nuevos_por_pieza: reels7d.map((x) => ({ enlace: x.enlace, compartidos_mas_guardados: (x.metricas?.shares || 0) + (x.metricas?.saved || 0), alcance: x.metricas?.reach })),
  compartidos_mas_guardados_total: reels7d.reduce((n, x) => n + (x.metricas?.shares || 0) + (x.metricas?.saved || 0), 0),
  comentarios_con_palabra_clave: conPalabra,
};
// Que el resumen salga el primero al leer el fichero.
const { resumen_semana, ...resto } = informe;
Object.keys(informe).forEach((k) => delete informe[k]);
Object.assign(informe, { generado: resto.generado, resumen_semana }, resto);

// Meta devuelve enlaces de paginación con el token dentro: se quitan y se comprueba que no quede rastro.
const limpio = JSON.stringify(informe, (k, v) => (k === 'paging' ? undefined : v), 1);
if (/access_token|EAA[A-Za-z0-9]{20,}/.test(limpio) || limpio.includes(T)) throw new Error('El informe contiene el token: no se guarda.');
writeFileSync(new URL('./informe.json', import.meta.url), limpio + '\n');
console.log('Informe guardado.');
