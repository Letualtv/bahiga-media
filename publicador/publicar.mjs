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
    // Música de la biblioteca de Instagram (solo reels): musica.audio_id o musica.buscar.
    if (p.musica) {
      let audio_id = p.musica.audio_id;
      if (!audio_id && p.musica.buscar) {
        const r = await graph('GET', '/ig_audio', { audio_type: 'music', ig_user_id: IG_ID, search_query: p.musica.buscar });
        const pista = (r.audio || []).find((a) => (a.duration_in_ms || 0) >= 15000) || (r.audio || [])[0];
        if (!pista) throw new Error(`No hay música en Instagram para «${p.musica.buscar}».`);
        audio_id = pista.audio_id;
        p.musica.elegida = `${pista.title} · ${pista.display_artist || ''}`.trim();
      }
      params.audio_configuration = JSON.stringify({
        audio_id, audio_volume: p.musica.volumen_musica ?? 100, video_volume: p.musica.volumen_video ?? 30,
      });
    }
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

// ---------- LinkedIn (perfil personal de Antonio) ----------
// Producto «Share on LinkedIn» (permiso w_member_social) + OpenID Connect para saber
// quién es el autor. El token dura 60 días: secreto LINKEDIN_TOKEN.
// Texto propio de LinkedIn en «texto_linkedin» (si no, usa «texto»).

const LI = 'https://api.linkedin.com';
const LI_VERSION = process.env.LINKEDIN_VERSION || '202606';

async function li(metodo, ruta, cuerpo, extra = {}) {
  if (!process.env.LINKEDIN_TOKEN) throw new Error('Falta el secreto LINKEDIN_TOKEN.');
  const res = await fetch(ruta.startsWith('http') ? ruta : LI + ruta, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${process.env.LINKEDIN_TOKEN}`,
      'LinkedIn-Version': LI_VERSION, 'X-Restli-Protocol-Version': '2.0.0',
      ...(cuerpo ? { 'Content-Type': 'application/json' } : {}), ...extra,
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const txt = await res.text();
  const datos = txt ? (() => { try { return JSON.parse(txt); } catch { return {}; } })() : {};
  if (!res.ok) throw new Error(`LinkedIn: ${datos.message || res.statusText} (${res.status})`);
  return { datos, cabeceras: res.headers };
}

let autorLI;
async function autorLinkedIn() {
  if (!autorLI) autorLI = `urn:li:person:${(await li('GET', '/v2/userinfo')).datos.sub}`;
  return autorLI;
}

// LinkedIn usa «little text»: hay caracteres reservados y los hashtags van con plantilla.
function textoLinkedIn(t) {
  return (t || '')
    .replace(/[\\|{}@[\]()<>*_~]/g, (c) => '\\' + c)
    .replace(/#([\p{L}\p{N}]+)/gu, (_, w) => `{hashtag|\\#|${w}}`);
}

async function bytesDe(ruta) {
  const r = await fetch(urlMedia(ruta));
  if (!r.ok) throw new Error(`No se pudo descargar ${ruta} (${r.status}).`);
  return Buffer.from(await r.arrayBuffer());
}

async function subirVideoLI(ruta, owner) {
  const buf = await bytesDe(ruta);
  const { datos } = await li('POST', '/rest/videos?action=initializeUpload', {
    initializeUploadRequest: { owner, fileSizeBytes: buf.length, uploadCaptions: false, uploadThumbnail: false },
  });
  const { video, uploadToken = '', uploadInstructions } = datos.value;
  const partes = [];
  for (const ins of uploadInstructions) {
    const r = await fetch(ins.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: buf.subarray(ins.firstByte, ins.lastByte + 1) });
    if (!r.ok) throw new Error(`LinkedIn no aceptó un trozo del vídeo (${r.status}).`);
    partes.push(r.headers.get('etag'));
  }
  await li('POST', '/rest/videos?action=finalizeUpload', { finalizeUploadRequest: { video, uploadToken, uploadedPartIds: partes } });
  for (let i = 0; i < 60; i++) { // hasta 10 minutos procesando
    const { datos: v } = await li('GET', `/rest/videos/${encodeURIComponent(video)}`);
    if (v.status === 'AVAILABLE') return video;
    if (v.status === 'PROCESSING_FAILED') throw new Error('LinkedIn no pudo procesar el vídeo.');
    await espera(10_000);
  }
  throw new Error('LinkedIn tardó demasiado en procesar el vídeo.');
}

async function subirImagenLI(ruta, owner) {
  const buf = await bytesDe(ruta);
  const { datos } = await li('POST', '/rest/images?action=initializeUpload', { initializeUploadRequest: { owner } });
  const r = await fetch(datos.value.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: buf });
  if (!r.ok) throw new Error(`LinkedIn no aceptó la imagen (${r.status}).`);
  return datos.value.image;
}

async function linkedin(p, ensayo) {
  const author = await autorLinkedIn();
  if (ensayo) return { ensayo: 'token y autor comprobados, sin publicar', autor: author };
  const post = {
    author, commentary: textoLinkedIn(p.texto_linkedin || p.texto), visibility: 'PUBLIC',
    distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
    lifecycleState: 'PUBLISHED', isReshareDisabledByAuthor: false,
  };
  if (p.tipo === 'reel' || (p.media && esVideo(p.media))) post.content = { media: { id: await subirVideoLI(p.media, author) } };
  else if (p.tipo === 'carrusel') post.content = { multiImage: { images: await Promise.all(p.medios.map(async (f) => ({ id: await subirImagenLI(f, author) }))) } };
  else if (p.media) post.content = { media: { id: await subirImagenLI(p.media, author) } };
  const { cabeceras } = await li('POST', '/rest/posts', post);
  const id = cabeceras.get('x-restli-id');
  return { id, permalink: id ? `https://www.linkedin.com/feed/update/${id}/` : undefined };
}

const REDES = { instagram, facebook, linkedin };

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
