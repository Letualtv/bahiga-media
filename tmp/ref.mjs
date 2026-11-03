// Temporal: leer un post de referencia (autor por oEmbed, texto e imágenes por Business Discovery).
import { writeFileSync, mkdirSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0', t = process.env.META_TOKEN, IG = '17841430450985904', CODE = 'DeaTsRxkX0w';
const get = async (r, q = {}) => { const u = new URL(G + r); for (const [k, v] of Object.entries({ ...q, access_token: t })) u.searchParams.set(k, v); return (await fetch(u)).json(); };
const out = {};
out.oembed = await get('/instagram_oembed', { url: `https://www.instagram.com/p/${CODE}/`, fields: 'author_name,title' });
const user = out.oembed.author_name;
if (user) {
  let after = '', post;
  for (let i = 0; i < 8 && !post; i++) {
    const d = await get(`/${IG}`, { fields: `business_discovery.username(${user}){username,media.limit(50)${after ? `.after(${after})` : ''}{id,caption,permalink,media_type,timestamp,media_url,children{media_url,media_type}}}` });
    const m = d.business_discovery?.media; if (!m) { out.error = d.error; break; }
    post = m.data.find((x) => x.permalink?.includes(CODE)); after = m.paging?.cursors?.after; if (!after) break;
  }
  out.post = post || null;
  if (post) { mkdirSync('tmp/img', { recursive: true }); const urls = post.children?.data?.map((c) => c.media_url) || [post.media_url];
    for (const [i, u] of urls.entries()) if (u) writeFileSync(`tmp/img/${String(i + 1).padStart(2, '0')}.jpg`, Buffer.from(await (await fetch(u)).arrayBuffer())); }
}
writeFileSync('tmp/ref.json', JSON.stringify(out, null, 1));
