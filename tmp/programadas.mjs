// Temporal: fechas de los vídeos programados en Business Suite.
import { writeFileSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0';
const t = process.env.META_TOKEN, PAGE = '1371169526080229';
const get = async (r, q = {}, tk = t) => { const u = new URL(G + r); for (const [k, v] of Object.entries({ ...q, access_token: tk })) u.searchParams.set(k, v); return (await fetch(u)).json(); };
const { access_token: ptk } = await get(`/${PAGE}`, { fields: 'access_token' });
const out = {};
const vids = await get(`/${PAGE}/videos`, { fields: 'id,title,description,published,created_time', limit: '50' }, ptk);
for (const v of (vids.data || []).filter((x) => x.published === false)) {
  out[v.id] = await get(`/${v.id}`, { fields: 'id,description,status,scheduled_publish_time,backdated_time,created_time,updated_time,post_id,permalink_url,length,published' }, ptk);
  delete out[v.id].source;
}
out._sched = await get(`/${PAGE}/scheduled_posts`, { fields: 'id,message,scheduled_publish_time', limit: '50' }, ptk);
out._ig_tags = await get(`/17841430450985904`, { fields: 'id,username,media_count' });
writeFileSync('tmp/programadas.json', JSON.stringify(out, null, 1));
