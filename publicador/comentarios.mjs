// Vigila los comentarios de Instagram y Facebook. Cuando alguien escribe una palabra
// clave (WEB, GOOGLE, precio...) responde en público con un mensaje corto y abre una
// incidencia en GitHub para que Antonio siga la conversación por privado.
// Lo ejecuta GitHub Actions (comentarios.yml) cada 10 minutos. No imprime el token.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const G = 'https://graph.facebook.com/v24.0';
const { META_TOKEN: T, IG_ID, PAGE_ID, GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
const VISTOS = new URL('./comentarios-vistos.json', import.meta.url);
const vistos = existsSync(VISTOS) ? JSON.parse(readFileSync(VISTOS, 'utf8')) : { ids: [] };
const yaVisto = new Set(vistos.ids);

// Palabra clave → respuesta pública. La conversación de verdad sigue por privado.
const RESPUESTAS = [
  [/\bweb\b/i, 'Apuntado. Te escribimos por privado y te decimos qué le falta a tu web.'],
  [/\bgoogle\b/i, 'Apuntado. Te escribimos por privado y revisamos tu ficha de Google.'],
  [/\b(precio|presupuesto|cu[aá]nto)\b/i, 'Te escribimos por privado con los precios, sin compromiso.'],
  [/\b(info|informaci[oó]n|interesa|quiero)\b/i, 'Te escribimos por privado y lo vemos.'],
];
const PROPIOS = ['bahiga.estudio', 'bahiga.es'];

async function graph(metodo, ruta, params = {}, tk = T) {
  const cuerpo = new URLSearchParams({ ...params, access_token: tk });
  const r = metodo === 'GET' ? await fetch(`${G}${ruta}?${cuerpo}`) : await fetch(`${G}${ruta}`, { method: metodo, body: cuerpo });
  const d = await r.json().catch(() => ({}));
  if (d.error) throw new Error(`${d.error.message} (${d.error.code})`);
  return d;
}

const nuevos = []; // comentarios con palabra clave encontrados en esta pasada
const haceDias = (n) => Date.now() - n * 86400e3;

// Instagram: comentarios de las publicaciones de los últimos 14 días.
const medios = await graph('GET', `/${IG_ID}/media`, { fields: 'id,permalink,timestamp,comments_count', limit: '25' });
for (const m of medios.data || []) {
  if (Date.parse(m.timestamp) < haceDias(14) || !m.comments_count) continue;
  const cs = await graph('GET', `/${m.id}/comments`, { fields: 'id,text,username,timestamp,replies{username}', limit: '100' });
  for (const c of cs.data || []) {
    if (yaVisto.has(c.id) || PROPIOS.includes(c.username)) continue;
    yaVisto.add(c.id);
    const r = RESPUESTAS.find(([re]) => re.test(c.text || ''));
    if (!r) continue;
    const yaRespondido = (c.replies?.data || []).some((x) => PROPIOS.includes(x.username));
    if (!yaRespondido) await graph('POST', `/${c.id}/replies`, { message: r[1] }).catch((e) => console.error(`No se pudo responder en Instagram: ${e.message}`));
    nuevos.push({ red: 'Instagram', usuario: `@${c.username}`, texto: c.text, enlace: m.permalink, respondido: !yaRespondido });
  }
}

// Facebook: comentarios de las publicaciones de la página.
const { access_token: ptk } = await graph('GET', `/${PAGE_ID}`, { fields: 'access_token' });
const posts = await graph('GET', `/${PAGE_ID}/posts`, { fields: 'id,permalink_url,created_time', limit: '15' }, ptk);
for (const p of posts.data || []) {
  if (Date.parse(p.created_time) < haceDias(14)) continue;
  const cs = await graph('GET', `/${p.id}/comments`, { fields: 'id,message,from,created_time,comments{from}', limit: '100' }, ptk);
  for (const c of cs.data || []) {
    if (yaVisto.has(c.id) || c.from?.id === PAGE_ID) continue;
    yaVisto.add(c.id);
    const r = RESPUESTAS.find(([re]) => re.test(c.message || ''));
    if (!r) continue;
    const yaRespondido = (c.comments?.data || []).some((x) => x.from?.id === PAGE_ID);
    if (!yaRespondido) await graph('POST', `/${c.id}/comments`, { message: r[1] }, ptk).catch((e) => console.error(`No se pudo responder en Facebook: ${e.message}`));
    nuevos.push({ red: 'Facebook', usuario: c.from?.name || 'alguien', texto: c.message, enlace: p.permalink_url, respondido: !yaRespondido });
  }
}

// Aviso: una incidencia en GitHub por pasada (llega al correo y al móvil al momento).
if (nuevos.length && GITHUB_TOKEN) {
  const cuerpo = nuevos.map((n) => `- **${n.red}** · ${n.usuario}: «${n.texto}»\n  ${n.enlace}\n  ${n.respondido ? 'Respondido en público; falta el privado.' : 'Ya estaba respondido.'}`).join('\n');
  await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/issues`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    body: JSON.stringify({ title: `${nuevos.length} comentario${nuevos.length > 1 ? 's' : ''} con palabra clave (${nuevos.map((n) => n.usuario).join(', ')})`, body: `${cuerpo}\n\nContesta por privado cuanto antes: la respuesta pública ya está puesta.`, labels: ['comentarios'] }),
  }).then((r) => console.log(r.ok ? 'Aviso creado.' : `No se pudo crear el aviso (${r.status}).`));
}

vistos.ids = [...yaVisto].slice(-2000);
writeFileSync(VISTOS, JSON.stringify(vistos) + '\n');
console.log(`${nuevos.length} comentario(s) con palabra clave.`);
