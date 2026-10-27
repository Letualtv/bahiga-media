import { defineMiddleware } from 'astro:middleware';
import { COOKIE, sesionValida } from './lib/sesion';
import { iniciarVigilante } from './lib/vigilante';
import { ideas, VISTO_IDEAS, numIdea } from './lib/datos';
import { COOKIE_IDEAS } from './lib/pendiente';

iniciarVigilante();

const LIBRES = ['/entrar', '/fuentes/', '/arco.svg', '/_astro/', '/favicon', '/sw.js', '/manifest.webmanifest', '/iconos/', '/salud'];
// Rutas de servidor a servidor: se autentican con su propia clave (ver api/avisar.ts).
const MAQUINA = ['/api/avisar'];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const ruta = ctx.url.pathname;
  // Contra CSRF: un POST solo vale si viene de esta misma web.
  if (MAQUINA.includes(ruta)) return next();
  if (ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD') {
    const origen = ctx.request.headers.get('origin');
    const host = ctx.request.headers.get('x-forwarded-host') || ctx.request.headers.get('host');
    if (!origen || !host || new URL(origen).host !== host) return new Response('Origen no permitido', { status: 403 });
  }
  if (!LIBRES.some((l) => ruta === l || ruta.startsWith(l)) && !sesionValida(ctx.cookies.get(COOKIE)?.value)) {
    return ctx.redirect('/entrar');
  }
  // Primera visita desde este navegador: las ideas que ya existen no cuentan como nuevas.
  if (ctx.request.method === 'GET' && !ruta.startsWith('/api/') && !LIBRES.some((l) => ruta.startsWith(l)) && !ctx.cookies.get(VISTO_IDEAS)) {
    const max = Math.max(0, ...(await ideas().catch(() => [])).map((i: any) => numIdea(i.id)));
    if (max) ctx.cookies.set(VISTO_IDEAS, String(max), COOKIE_IDEAS);
  }
  const r = await next();
  const h = r.headers;
  h.set('X-Frame-Options', 'DENY');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Referrer-Policy', 'same-origin');
  h.set('X-Robots-Tag', 'noindex, nofollow');
  h.set('Content-Security-Policy', "default-src 'self'; img-src 'self' https://raw.githubusercontent.com https://*.cdninstagram.com https://*.fbcdn.net data:; media-src https://raw.githubusercontent.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'");
  return r;
});
