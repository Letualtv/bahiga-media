/* Lo consulta el cron del servidor cada 10 minutos: mantiene el vigilante en marcha tras un reinicio
   y fuerza una revisión de la cola. */
import type { APIRoute } from 'astro';
import { vigilar } from '../lib/vigilante';
export const GET: APIRoute = async () => { await vigilar(); return new Response('ok', { headers: { 'Cache-Control': 'no-store' } }); };
