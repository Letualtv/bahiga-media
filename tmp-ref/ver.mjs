// Lee una cuenta profesional ajena con Business Discovery y baja las láminas de una publicación.
import { writeFileSync, mkdirSync } from 'node:fs';
const { META_TOKEN: T, IG_ID } = process.env;
const U = 'marcosrazzetti', CODIGO = 'DefaYz_iMfX';
const campos = `business_discovery.username(${U}){username,name,biography,followers_count,media_count,media.limit(40){id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,media_url,children{media_url,media_type}}}`;
const r = await fetch(`https://graph.facebook.com/v24.0/${IG_ID}?fields=${encodeURIComponent(campos)}&access_token=${T}`);
const d = await r.json();
if (d.error) { writeFileSync('tmp-ref/resultado.json', JSON.stringify({ error: d.error.message })); process.exit(0); }
const bd = d.business_discovery;
const medios = bd.media?.data || [];
const p = medios.find((m) => m.permalink?.includes(CODIGO));
const resumen = { cuenta: { u: bd.username, nombre: bd.name, bio: bd.biography, seguidores: bd.followers_count, publicaciones: bd.media_count },
  objetivo: p ? { ...p, children: undefined, laminas: p.children?.data?.length } : 'no encontrada en las últimas 40',
  ultimas: medios.map((m) => ({ fecha: m.timestamp?.slice(0, 10), tipo: m.media_product_type + '/' + m.media_type, likes: m.like_count, coms: m.comments_count, texto: (m.caption || '').slice(0, 90), url: m.permalink })) };
mkdirSync('tmp-ref/img', { recursive: true });
if (p) {
  const hijos = p.children?.data || [{ media_url: p.media_url, media_type: p.media_type }];
  let i = 0;
  for (const h of hijos) { i++; if (!h.media_url || h.media_type === 'VIDEO') continue; const b = Buffer.from(await (await fetch(h.media_url)).arrayBuffer()); writeFileSync(`tmp-ref/img/${String(i).padStart(2, '0')}.jpg`, b); }
}
const txt = JSON.stringify(resumen, null, 1);
if (txt.includes(T)) throw new Error('token');
writeFileSync('tmp-ref/resultado.json', txt);
