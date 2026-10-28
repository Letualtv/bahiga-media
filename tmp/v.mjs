import { writeFileSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0', t = process.env.META_TOKEN;
const u = new URL(`${G}/${process.env.MID}`); u.searchParams.set('fields', 'id,thumbnail_url,permalink,caption,timestamp'); u.searchParams.set('access_token', t);
const d = await (await fetch(u)).json();
const img = await (await fetch(d.thumbnail_url)).arrayBuffer();
writeFileSync('tmp/mini.jpg', Buffer.from(img));
writeFileSync('tmp/v2.json', JSON.stringify({ ...d, thumbnail_url: undefined }));
