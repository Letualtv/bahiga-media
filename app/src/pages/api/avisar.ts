/* Entrada para el vigilante de comentarios (GitHub Actions): guarda el aviso en el servidor
   y lo manda al móvil. Se autentica con PANEL_AVISOS (secreto compartido con GitHub). */
import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { anadirAvisos, notificar } from '../../lib/avisos';

const valida = (cab: string | null) => {
  const s = process.env.PANEL_AVISOS || '';
  const t = (cab || '').replace(/^Bearer\s+/i, '');
  if (s.length < 32 || t.length !== s.length) return false;
  return timingSafeEqual(Buffer.from(t), Buffer.from(s));
};

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.PANEL_AVISOS) return new Response('Sin configurar', { status: 503 });
  if (!valida(request.headers.get('authorization'))) return new Response('No autorizado', { status: 401 });
  let cuerpo: any;
  try { cuerpo = await request.json(); } catch { return new Response('JSON no válido', { status: 400 }); }
  const lista = Array.isArray(cuerpo?.avisos) ? cuerpo.avisos.slice(0, 50) : [];
  const alta = anadirAvisos(lista);
  for (const a of alta) await notificar(a.privado ? `Mensaje privado en ${a.red.replace(' (privado)', '')}` : `Comentario en ${a.red}`, `${a.usuario}: ${a.texto}`, '/');
  return new Response(JSON.stringify({ guardados: alta.length }), { headers: { 'Content-Type': 'application/json' } });
};
