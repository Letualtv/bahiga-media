import { defineMiddleware } from 'astro:middleware';
import { COOKIE, sesionValida } from './lib/sesion';

const LIBRES = ['/entrar', '/fuentes/', '/arco.svg', '/_astro/', '/favicon'];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const ruta = ctx.url.pathname;
  // Contra CSRF: un POST solo vale si viene de esta misma web.
  if (ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD') {
    const origen = ctx.request.headers.get('origin');
    const host = ctx.request.headers.get('x-forwarded-host') || ctx.request.headers.get('host');
    if (!origen || !host || new URL(origen).host !== host) return new Response('Origen no permitido', { status: 403 });
  }
  if (!LIBRES.some((l) => ruta === l || ruta.startsWith(l)) && !sesionValida(ctx.cookies.get(COOKIE)?.value)) {
    return ctx.redirect('/entrar');
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
