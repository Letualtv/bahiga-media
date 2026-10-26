// Busca música en la biblioteca de Instagram (Audio API) y guarda los resultados en
// publicador/audio.json. Uso: AUDIO_Q="lofi" node publicador/audio.mjs (sin AUDIO_Q = tendencias).
import { writeFileSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0';
const { META_TOKEN: T, IG_ID } = process.env;
const TP = () => null;
const consultas = (process.env.AUDIO_Q || '|lofi|chill|house|corporate|piano').split('|');
async function get(ruta, params = {}) {
  const r = await fetch(`${G}${ruta}?${new URLSearchParams({ ...params, access_token: T })}`);
  const d = await r.json().catch(() => ({}));
  return d.error ? { error: `${d.error.message} (${d.error.code})` } : d;
}
// Meta no documenta bien los parámetros: se prueban combinaciones y se guarda la respuesta cruda.
const out = { generado: new Date().toISOString(), pruebas: [] };
const pg = await get(`/${process.env.PAGE_ID}`, { fields: 'access_token' });
const tokens = { sistema: T, pagina: pg.access_token };
const combos = [
  { audio_type: 'music', ig_user_id: IG_ID, search_query: 'upbeat' },
  { audio_type: 'music', ig_user_id: IG_ID, search_query: 'corporate' },
  { audio_type: 'music' },
  { audio_type: 'music', ig_user_id: IG_ID },
  { audio_type: 'music', ig_user_id: IG_ID, search_query: 'lofi' },
  { audio_type: 'music', search_query: 'lofi' },
  { audio_type: 'music', q: 'lofi' },
  { audio_type: 'MUSIC', ig_user_id: IG_ID },
  { audio_type: 'original_sound', ig_user_id: IG_ID },
  { ig_user_id: IG_ID, search_query: 'lofi' },
  { instagram_user_id: IG_ID, audio_type: 'music' },
  { user_id: IG_ID, audio_type: 'music' },
  { audio_type: 'music', ig_user_id: IG_ID, fields: 'id,audio_id,title,display_artist,duration_ms' },
];
for (const [nombre, tk] of Object.entries(tokens)) {
  if (!tk) continue;
  for (const c of combos) {
    const r = await fetch(`${G}/ig_audio?${new URLSearchParams({ ...c, access_token: tk })}`);
    const d = await r.json().catch(() => ({}));
    out.pruebas.push({ token: nombre, params: c, estado: r.status, error: d.error ? `${d.error.message} (${d.error.code})` : undefined, n: (d.audio || d.data || []).length, claves: Object.keys(d), muestra: (d.audio || d.data || []).slice(0, 8) });
  }
}
const s = JSON.stringify(out, (k, v) => (k === 'paging' ? undefined : v), 1);
if (/access_token|EAA[A-Za-z0-9]{20,}/.test(s) || s.includes(T) || (tokens.pagina && s.includes(tokens.pagina))) throw new Error('Contiene el token: no se guarda.');
writeFileSync(new URL('./audio.json', import.meta.url), s + '\n');
console.log('Pruebas guardadas.');
