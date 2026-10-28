import { writeFileSync } from 'node:fs';
const G = 'https://graph.facebook.com/v24.0', t = process.env.META_TOKEN, PAGE = '1371169526080229', IG = '17841430450985904';
const get = async (r, q = {}, tk = t) => { const u = new URL(G + r); for (const [k, v] of Object.entries({ ...q, access_token: tk })) u.searchParams.set(k, v); return (await fetch(u)).json(); };
const { access_token: ptk } = await get(`/${PAGE}`, { fields: 'access_token' });
const out = {
  ig: await get(`/${IG}/media`, { fields: 'id,caption,media_product_type,timestamp,permalink', limit: '40' }),
  ig_stories: await get(`/${IG}/stories`, { fields: 'id,timestamp,permalink,media_type' }),
  fb_posts: await get(`/${PAGE}/posts`, { fields: 'id,message,created_time,permalink_url', limit: '40' }, ptk),
  fb_videos: await get(`/${PAGE}/videos`, { fields: 'id,description,created_time,published', limit: '50' }, ptk),
};
writeFileSync('tmp/v.json', JSON.stringify(out, null, 1));
