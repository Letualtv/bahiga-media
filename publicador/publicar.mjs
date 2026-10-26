// Publicador de Bahiga para Instagram (@bahiga.estudio) y Facebook (bahiga.es).
//
// Lee publicador/cola.json, publica lo que ya ha llegado a su hora y anota el
// resultado en la misma cola. Lo ejecuta GitHub Actions (publicar.yml) cada 10
// minutos y cada vez que cambia la cola. Sin dependencias: Node 20 con fetch.
//
// Variables de entorno:
//   META_TOKEN  token del usuario del sistema (secreto de GitHub, nunca se imprime)
//   IG_ID       identificador de la cuenta de Instagram
//   PAGE_ID     identificador de la página de Facebook
//   MEDIA_BASE  URL pública donde están los ficheros del repositorio
//               (por defecto raw.githubusercontent.com en el commit actual)

import { readFileSync, writeFileSync } from 'node:fs';

const G = 'https://graph.facebook.com/v24.0';
const COLA = new URL('./cola.json', import.meta.url);
const { META_TOKEN, IG_ID, PAGE_ID } = process.env;
const MEDIA_BASE = process.env.MEDIA_BASE
  || `https://raw.githubusercontent.com/Letualtv/bahiga-media/${process.env.GITHUB_SHA || 'main'}/`;
const MAX_INTENTOS = 3;

if (!META_TOKEN || !IG_ID || !PAGE_ID) {
  console.error('Faltan META_TOKEN, IG_ID o PAGE_ID.');
  process.exit(1);
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ahoraISO = () => new Date().toISOString();

// Llamada a la Graph API. Los errores de Meta se lanzan con su mensaje, sin el token.
async function graph(metodo, ruta, params = {}, token = META_TOKEN) {
  const url = new URL(ruta.startsWith('http') ? ruta : G + ruta);
  const cuerpo = new URLSearchParams({ ...params, access_token: token });
  const res = metodo === 'GET'
    ? await fetch(`${url}?${cuerpo}`)
    : await fetch(url, { method: metodo, body: cuerpo });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok || datos.error) {
    const e = datos.error || {};
    throw new Error(`${e.message || res.statusText} (código ${e.code ?? res.status}${e.error_subcode ? '/' + e.error_subcode : ''})`);
  }
  return datos;
}

const urlMedia = (ruta) => (/^https?:\/\//.test(ruta) ? ruta : MEDIA_BASE + ruta.replace(/^\//, ''));
const esVideo = (ruta) => /\.(mp4|mov)$/i.test(ruta);

// ---------- Instagram ----------

async function esperarContenedor(id) {
  for (let i = 0; i < 60; i++) { // hasta 10 minutos
    const { status_code: estado, status } = await graph('GET', `/${id}`, { fields: 'status_code,status' });
    if (estado === 'FINISHED') return;
    if (estado === 'ERROR' || estado === 'EXPIRED') throw new Error(`Instagram no aceptó el fichero: ${status || estado}`);
    await espera(10_000);
  }
  throw new Error('Instagram tardó demasiado en procesar el fichero.');
}

async function instagram(p, ensayo) {
  const media = p.media ? urlMedia(p.media) : null;
  const params = {};
  if (p.tipo === 'reel') {
    Object.assign(params, { media_type: 'REELS', video_url: media, caption: p.texto || '', share_to_feed: 'true' });
    // Portada: un fotograma del vídeo (portada_ms) o una imagen propia (portada).
    if (p.portada) params.cover_url = urlMedia(p.portada);
    else if (p.portada_ms != null) params.thumb_offset = String(p.portada_ms);
  }
  else if (p.tipo === 'carrusel') {
    const hijos = [];
    for (const f of p.medios) {
      const h = esVideo(f) ? { media_type: 'VIDEO', video_url: urlMedia(f) } : { image_url: urlMedia(f) };
      const { id } = await graph('POST', `/${IG_ID}/media`, { ...h, is_carousel_item: 'true' });
      await esperarContenedor(id);
      hijos.push(id);
    }
    Object.assign(params, { media_type: 'CAROUSEL', children: hijos.join(','), caption: p.texto || '' });
  }
  else if (p.tipo === 'historia') Object.assign(params, { media_type: 'STORIES', [esVideo(p.media) ? 'video_url' : 'image_url']: media });
  else if (p.tipo === 'foto') Object.assign(params, { image_url: media, caption: p.texto || '' });
  else throw new Error(`Tipo desconocido para Instagram: ${p.tipo}`);

  const { id: contenedor } = await graph('POST', `/${IG_ID}/media`, params);
  await esperarContenedor(contenedor);
  if (ensayo) return { ensayo: 'contenedor aceptado, sin publicar', contenedor };

  const { id } = await graph('POST', `/${IG_ID}/media_publish`, { creation_id: contenedor });
  const { permalink } = await graph('GET', `/${id}`, { fields: 'permalink' }).catch(() => ({}));
  return { id, permalink };
}

// ---------- Facebook ----------

let tokenPagina;
async function tokenDePagina() {
  if (!tokenPagina) ({ access_token: tokenPagina } = await graph('GET', `/${PAGE_ID}`, { fields: 'access_token' }));
  return tokenPagina;
}

// Sube un vídeo por URL a un flujo de tres fases (video_reels o video_stories).
async function subirVideo(borde, media, tk) {
  const { video_id, upload_url } = await graph('POST', `/${PAGE_ID}/${borde}`, { upload_phase: 'start' }, tk);
  const res = await fetch(upload_url, { method: 'POST', headers: { Authorization: `OAuth ${tk}`, file_url: media } });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok || datos.success === false) throw new Error(`Facebook no pudo descargar el vídeo: ${datos.debug_info?.message || res.statusText}`);
  return video_id;
}

async function facebook(p, ensayo) {
  const tk = await tokenDePagina();
  const media = p.media ? urlMedia(p.media) : null;

  if (ensayo) {
    // Solo comprueba permisos: abre una subida de reel y no la completa.
    const { video_id } = await graph('POST', `/${PAGE_ID}/video_reels`, { upload_phase: 'start' }, tk);
    return { ensayo: 'permiso de publicación comprobado, sin publicar', video_id };
  }

  if (p.tipo === 'reel') {
    const video_id = await subirVideo('video_reels', media, tk);
    await graph('POST', `/${PAGE_ID}/video_reels`, { upload_phase: 'finish', video_id, video_state: 'PUBLISHED', description: p.texto || '' }, tk);
    return { id: video_id, permalink: `https://www.facebook.com/reel/${video_id}` };
  }
  if (p.tipo === 'historia') {
    if (esVideo(p.media)) {
      const video_id = await subirVideo('video_stories', media, tk);
      const r = await graph('POST', `/${PAGE_ID}/video_stories`, { upload_phase: 'finish', video_id }, tk);
      return { id: r.post_id || video_id };
    }
    const { id: photo_id } = await graph('POST', `/${PAGE_ID}/photos`, { url: media, published: 'false' }, tk);
    const r = await graph('POST', `/${PAGE_ID}/photo_stories`, { photo_id }, tk);
    return { id: r.post_id || photo_id };
  }
  if (p.tipo === 'carrusel') {
    const ids = [];
    for (const f of p.medios) {
      const { id } = await graph('POST', `/${PAGE_ID}/photos`, { url: urlMedia(f), published: 'false' }, tk);
      ids.push(id);
    }
    const params = { message: p.texto || '' };
    ids.forEach((id, i) => { params[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id }); });
    const r = await graph('POST', `/${PAGE_ID}/feed`, params, tk);
    return { id: r.id, permalink: `https://www.facebook.com/${r.id}` };
  }
  if (p.tipo === 'foto') {
    const r = await graph('POST', `/${PAGE_ID}/photos`, { url: media, message: p.texto || '' }, tk);
    return { id: r.post_id || r.id };
  }
  throw new Error(`Tipo desconocido para Facebook: ${p.tipo}`);
}

const REDES = { instagram, facebook };

// ---------- Cola ----------

const cola = JSON.parse(readFileSync(COLA, 'utf8'));
const ahora = Date.now();
let cambios = false;

for (const p of cola.publicaciones) {
  if (!['pendiente', 'error'].includes(p.estado)) continue;
  if ((p.intentos || 0) >= MAX_INTENTOS) continue;
  if (!/[+-]\d\d:\d\d$|Z$/.test(p.fecha)) {
    p.estado = 'error'; p.error = 'La fecha necesita zona horaria, p. ej. 2026-10-27T19:30:00+01:00'; cambios = true; continue;
  }
  if (Date.parse(p.fecha) > ahora) continue;

  const ensayo = Boolean(p.ensayo);
  p.resultado ||= {};
  p.intentos = (p.intentos || 0) + 1;
  const fallos = [];

  for (const red of p.redes) {
    if (p.resultado[red]?.id && !ensayo) continue; // ya publicada en esa red: no se repite
    try {
      console.log(`${p.id}: ${ensayo ? 'ensayo' : 'publicando'} ${p.tipo} en ${red}…`);
      p.resultado[red] = { ...(await REDES[red](p, ensayo)), hora: ahoraISO() };
      console.log(`${p.id}: ${red} correcto.`);
    } catch (e) {
      fallos.push(`${red}: ${e.message}`);
      console.error(`${p.id}: ${red} falló: ${e.message}`);
    }
  }

  p.estado = fallos.length ? 'error' : (ensayo ? 'ensayo-ok' : 'publicada');
  p.error = fallos.length ? fallos.join(' | ') : undefined;
  cambios = true;
}

if (cambios) writeFileSync(COLA, JSON.stringify(cola, null, 1) + '\n');
console.log(cambios ? 'Cola actualizada.' : 'Nada que publicar ahora.');
