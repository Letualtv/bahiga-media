import type { APIRoute } from 'astro';
import { clavePublica } from '../../lib/avisos';
export const GET: APIRoute = () => new Response(JSON.stringify({ clave: clavePublica() }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
