/* Lo que pide tu atención, en un solo sitio: lo usan el inicio («Para ti») y el contador del menú. */
import { cola, ideas, VISTO_IDEAS, esNueva, numIdea } from './datos';
import { avisos, type Aviso } from './avisos';
import { grupo, type Pub } from './util';
import type { AstroCookies } from 'astro';

export const COOKIE_IDEAS = { path: '/', maxAge: 365 * 86400, httpOnly: true, sameSite: 'lax' as const };

export type Pendiente = {
  aprobar: { clave: string; piezas: Pub[] }[];
  errores: Pub[];
  mensajes: Aviso[];
  ideasNuevas: number;
  total: number;
};

export async function pendiente(cookies: AstroCookies): Promise<Pendiente> {
  const [ps, ids] = await Promise.all([cola(), ideas()]);
  const grupos = new Map<string, Pub[]>();
  for (const p of ps.filter((p) => p.estado === 'borrador').sort((a, b) => Date.parse(a.fecha) - Date.parse(b.fecha))) {
    const k = grupo(p.id);
    grupos.set(k, [...(grupos.get(k) || []), p]);
  }
  const aprobar = [...grupos].map(([clave, piezas]) => ({ clave, piezas }));
  const errores = ps.filter((p) => p.estado === 'error');
  const mensajes = avisos().filter((a) => !a.hecho).slice(0, 20);
  // Sin cookie (primera vez en este navegador) cuenta todo como visto; la pone el middleware.
  const visto = Number(cookies.get(VISTO_IDEAS)?.value || 0) || Math.max(0, ...ids.map((i) => numIdea(i.id)));
  const ideasNuevas = ids.filter((i) => esNueva(i, visto)).length;
  return { aprobar, errores, mensajes, ideasNuevas, total: aprobar.length + errores.length + mensajes.length };
}
