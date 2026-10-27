/* Alta y baja del móvil para recibir avisos. Lo llama el botón «Avisos en este dispositivo». */
import type { APIRoute } from 'astro';
import { suscribir, desuscribir, notificar } from '../../lib/avisos';

export const POST: APIRoute = async ({ request }) => {
  const d = await request.json().catch(() => null);
  const s = d?.suscripcion;
  if (!s?.endpoint || !/^https:\/\//.test(s.endpoint) || !s.keys?.p256dh || !s.keys?.auth) return new Response('Suscripción no válida', { status: 400 });
  if (d.baja) { desuscribir(s.endpoint); return new Response('ok'); }
  suscribir({ endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth }, alta: '', equipo: request.headers.get('user-agent') || '' });
  await notificar('Avisos activados', 'Te avisaré aquí de lo que tengas que aprobar, de los fallos y de los mensajes nuevos.', '/');
  return new Response('ok');
};
