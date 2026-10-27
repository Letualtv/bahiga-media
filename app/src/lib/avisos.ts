/* Avisos al móvil (notificaciones push del navegador) y avisos guardados en el panel.
   Todo vive en el servidor, fuera del repositorio público: las suscripciones, las claves
   VAPID y los avisos de comentarios y mensajes privados (con datos de terceros). */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import webpush from 'web-push';

const DIR = process.env.PANEL_DATOS || '/var/lib/bahiga-contenido';
const ruta = (f: string) => join(DIR, f);

export function leerLocal<T>(f: string, defecto: T): T {
  try { return JSON.parse(readFileSync(ruta(f), 'utf8')); } catch { return defecto; }
}
export function guardarLocal(f: string, datos: unknown) {
  mkdirSync(DIR, { recursive: true, mode: 0o700 });
  writeFileSync(ruta(f), JSON.stringify(datos, null, 1), { mode: 0o600 });
}

/* Claves VAPID: se crean la primera vez y se quedan en el servidor. */
function claves() {
  if (!existsSync(ruta('vapid.json'))) guardarLocal('vapid.json', webpush.generateVAPIDKeys());
  const k = leerLocal<{ publicKey: string; privateKey: string }>('vapid.json', null as any);
  webpush.setVapidDetails('mailto:info@bahiga.es', k.publicKey, k.privateKey);
  return k;
}
export const clavePublica = () => claves().publicKey;

type Suscripcion = { endpoint: string; keys: { p256dh: string; auth: string }; alta: string; equipo?: string };
const suscripciones = () => leerLocal<Suscripcion[]>('suscripciones.json', []);

export function suscribir(s: Suscripcion) {
  const l = suscripciones().filter((x) => x.endpoint !== s.endpoint);
  l.push({ endpoint: s.endpoint, keys: s.keys, alta: new Date().toISOString(), equipo: s.equipo?.slice(0, 80) });
  guardarLocal('suscripciones.json', l.slice(-10));
}
export function desuscribir(endpoint: string) {
  guardarLocal('suscripciones.json', suscripciones().filter((x) => x.endpoint !== endpoint));
}
export const hayMoviles = () => suscripciones().length;

/* Manda una notificación a todos los dispositivos dados de alta. */
export async function notificar(titulo: string, cuerpo: string, url = '/') {
  claves();
  const l = suscripciones();
  const caducadas: string[] = [];
  await Promise.all(l.map((s) => webpush.sendNotification(s, JSON.stringify({ titulo, cuerpo: cuerpo.slice(0, 180), url }), { TTL: 86400 })
    .catch((e: any) => { if (e?.statusCode === 404 || e?.statusCode === 410) caducadas.push(s.endpoint); else console.error('Aviso no enviado:', e?.statusCode || e?.message); })));
  if (caducadas.length) guardarLocal('suscripciones.json', l.filter((s) => !caducadas.includes(s.endpoint)));
}

/* Avisos de comentarios y mensajes privados que manda el vigilante de GitHub. */
export type Aviso = { id: string; fecha: string; red: string; usuario: string; texto: string; enlace?: string; privado?: boolean; respondido?: boolean; hecho?: boolean };
export const avisos = () => leerLocal<Aviso[]>('avisos.json', []);
export function anadirAvisos(nuevos: Omit<Aviso, 'id' | 'fecha'>[]) {
  const l = avisos();
  const fecha = new Date().toISOString();
  const alta = nuevos.map((a) => ({
    id: randomUUID(), fecha, red: String(a.red || '').slice(0, 40), usuario: String(a.usuario || '').slice(0, 80),
    texto: String(a.texto || '').slice(0, 500), enlace: /^https:\/\//.test(a.enlace || '') ? a.enlace : undefined,
    privado: !!a.privado, respondido: !!a.respondido,
  }));
  guardarLocal('avisos.json', [...alta, ...l].slice(0, 300));
  return alta;
}
export function marcarHecho(id: string) {
  const l = avisos();
  const a = l.find((x) => x.id === id);
  if (a) { a.hecho = true; guardarLocal('avisos.json', l); }
}
