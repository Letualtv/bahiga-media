/* Vigilante de la cola: cada 2 minutos mira cola.json y avisa al móvil de lo que pide atención.
   - Algo nuevo por aprobar (propuestas de noticias incluidas): un aviso por noticia o pieza.
   - Una publicación que falla.
   - Una noticia que se ha publicado (las urgentes salen solas).
   La primera vez solo memoriza el estado, para no mandar avisos de lo que ya había. */
import { leer } from './github';
import { leerLocal, guardarLocal, notificar } from './avisos';
import { grupo, textoDe, type Pub } from './util';

type Estado = { vistos: string[] };
let enMarcha = false;

const titular = (p: Pub) => (textoDe(p).split('\n').find((l) => l.trim()) || p.id).trim().slice(0, 90);

export async function vigilar() {
  if (enMarcha) return;
  enMarcha = true;
  try {
    const { datos } = await leer<{ publicaciones: Pub[] }>('publicador/cola.json', { fresco: true });
    const ps = (datos.publicaciones || []).filter((p) => !p.ensayo);
    const claves = new Map<string, Pub>();
    for (const p of ps) {
      if (p.estado === 'borrador') claves.set(`aprobar:${grupo(p.id)}`, p);
      if (p.estado === 'error') claves.set(`error:${p.id}:${(p.error || '').slice(0, 40)}`, p);
      if (p.estado === 'publicada' && p.id.startsWith('n-')) claves.set(`publicada:${grupo(p.id)}`, p);
    }
    const previo = leerLocal<Estado | null>('vigilante.json', null);
    const vistos = new Set(previo?.vistos || []);
    if (previo) {
      for (const [k, p] of claves) {
        if (vistos.has(k)) continue;
        if (k.startsWith('aprobar:')) await notificar(p.id.startsWith('n-') ? 'Noticia para aprobar' : 'Publicación para aprobar', titular(p), '/');
        else if (k.startsWith('error:')) await notificar('Ha fallado una publicación', `${titular(p)} · ${p.error || ''}`, '/');
        else await notificar('Noticia publicada', titular(p), '/publicaciones?ver=publicadas');
      }
    }
    // Se guardan las claves actuales más las antiguas recientes, para no repetir si algo vuelve atrás.
    guardarLocal('vigilante.json', { vistos: [...new Set([...claves.keys(), ...vistos])].slice(-1000) });
  } catch (e) {
    console.error('Vigilante:', (e as Error).message);
  } finally {
    enMarcha = false;
  }
}

let iniciado = false;
export function iniciarVigilante() {
  if (iniciado || process.env.PANEL_SIN_VIGILANTE) return;
  iniciado = true;
  setTimeout(vigilar, 5_000);
  setInterval(vigilar, 120_000).unref();
}
