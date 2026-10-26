// Busca música en la biblioteca de Instagram (Audio API) y guarda los resultados en
// publicador/audio.json. Uso: AUDIO_Q="lofi" node publicador/audio.mjs (sin AUDIO_Q = tendencias).
import { writeFileSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0';
const { META_TOKEN: T, IG_ID } = process.env;
const consultas = (process.env.AUDIO_Q || '|lofi|chill|house|corporate|piano').split('|');
async function get(ruta, params = {}) {
  const r = await fetch(`${G}${ruta}?${new URLSearchParams({ ...params, access_token: T })}`);
  const d = await r.json().catch(() => ({}));
  return d.error ? { error: `${d.error.message} (${d.error.code})` } : d;
}
// Meta no documenta bien la ruta: se prueban las candidatas y se queda la que responda.
const rutas = ['/ig_audio', `/${IG_ID}/ig_audio`, `/${IG_ID}/audio`];
const out = { generado: new Date().toISOString(), rutas: {}, resultados: {} };
let buena = null;
for (const r of rutas) {
  const d = await get(r, { audio_type: 'music', ig_user_id: IG_ID });
  out.rutas[r] = d.error || `ok (${(d.data || []).length} resultados)`;
  if (!d.error && !buena) buena = r;
}
if (buena) {
  for (const q of consultas) {
    const p = { audio_type: 'music', ig_user_id: IG_ID };
    if (q) p.search_query = q;
    const d = await get(buena, p);
    out.resultados[q || '(tendencias)'] = d.error || (d.data || []).slice(0, 15);
  }
}
const s = JSON.stringify(out, (k, v) => (k === 'paging' ? undefined : v), 1);
if (/access_token|EAA[A-Za-z0-9]{20,}/.test(s) || s.includes(T)) throw new Error('Contiene el token: no se guarda.');
writeFileSync(new URL('./audio.json', import.meta.url), s + '\n');
console.log('Ruta válida:', buena);
