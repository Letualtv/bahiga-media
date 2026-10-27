// Temporal: lista lo programado en Meta Business Suite (Facebook) para cruzarlo con la cola.
import { writeFileSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0';
const t = process.env.META_TOKEN, PAGE = '1371169526080229', IG = '17841430450985904';
const get = async (r, q = {}, tk = t) => { const u = new URL(G + r); for (const [k, v] of Object.entries({ ...q, access_token: tk })) u.searchParams.set(k, v); const x = await (await fetch(u)).json(); return x; };
const { access_token: ptk } = await get(`/${PAGE}`, { fields: 'access_token' });
const out = {};
out.fb_programados = await get(`/${PAGE}/scheduled_posts`, { fields: 'id,message,scheduled_publish_time,created_time', limit: '100' }, ptk);
out.fb_videos_programados = await get(`/${PAGE}/videos`, { fields: 'id,title,description,scheduled_publish_time,published,created_time', limit: '50' }, ptk);
out.fb_reels = await get(`/${PAGE}/video_reels`, { fields: 'id,description,scheduled_publish_time,published,created_time', limit: '50' }, ptk);
out.ig_ultimos = await get(`/${IG}/media`, { fields: 'id,caption,media_type,media_product_type,timestamp', limit: '30' });
writeFileSync('tmp/programadas.json', JSON.stringify(out, null, 1));
