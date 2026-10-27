import { writeFileSync, mkdirSync } from 'node:fs';
const { META_TOKEN: T, IG_ID } = process.env;
const U = 'julioiero';
let bd, medios = [], after = '', obj;
for (let pag = 0; pag < 10; pag++) {
  const campos = `business_discovery.username(${U}){username,name,followers_count,media_count,media.limit(50)${after ? `.after(${after})` : ''}{id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,media_url,children{media_url,media_type}}}`;
  const r = await fetch(`https://graph.facebook.com/v24.0/${IG_ID}?fields=${encodeURIComponent(campos)}&access_token=${T}`);
  const d = await r.json();
  if (d.error) { writeFileSync('tmp-ref/resultado.json', JSON.stringify({ error: d.error.message, pag })); process.exit(0); }
  bd = d.business_discovery; medios.push(...(bd.media?.data || []));
  obj = medios.find((m) => /120/.test(m.caption || '') && /idea/i.test(m.caption || ''));
  if (obj) break;
  after = bd.media?.paging?.cursors?.after; if (!after) break;
}
mkdirSync('tmp-ref/img', { recursive: true });
if (obj) { let i = 0; for (const h of obj.children?.data || [{ media_url: obj.media_url, media_type: obj.media_type }]) { i++; if (!h.media_url || h.media_type === 'VIDEO') continue; writeFileSync(`tmp-ref/img/${String(i).padStart(2, '0')}.jpg`, Buffer.from(await (await fetch(h.media_url)).arrayBuffer())); } }
const out = { cuenta: { u: bd?.username, seguidores: bd?.followers_count }, objetivo: obj ? { caption: obj.caption, tipo: obj.media_type, permalink: obj.permalink, fecha: obj.timestamp, likes: obj.like_count, coms: obj.comments_count, laminas: obj.children?.data?.length } : null,
  candidatos: medios.filter((m) => /idea/i.test(m.caption || '')).slice(0, 10).map((m) => ({ c: (m.caption || '').slice(0, 120), url: m.permalink, tipo: m.media_type })) };
const txt = JSON.stringify(out, null, 1); if (txt.includes(T)) throw new Error('token');
writeFileSync('tmp-ref/resultado.json', txt);
