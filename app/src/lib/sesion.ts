/* Sesión de un solo usuario (Antonio). La contraseña no se guarda: el servidor
   tiene PANEL_PASS_HASH (scrypt con sal) y firma la cookie con PANEL_SECRET. */
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'bahiga_panel';
const DURACION = 30 * 864e5;

const secreto = () => {
  const s = process.env.PANEL_SECRET;
  if (!s || s.length < 32) throw new Error('PANEL_SECRET debe tener al menos 32 caracteres.');
  return s;
};
const firmar = (v: string) => createHmac('sha256', secreto()).update(v).digest('hex');

export function crearSesion(): string {
  const hasta = String(Date.now() + DURACION);
  return `${hasta}.${firmar(hasta)}`;
}

export function sesionValida(valor?: string): boolean {
  if (!valor) return false;
  const [hasta, firma] = valor.split('.');
  if (!hasta || !firma || Number(hasta) < Date.now()) return false;
  const a = Buffer.from(firma, 'hex'), b = Buffer.from(firmar(hasta), 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

export function claveCorrecta(clave: string): boolean {
  const [tipo, sal, hash] = (process.env.PANEL_PASS_HASH || '').split('$');
  if (tipo !== 'scrypt' || !sal || !hash) return false;
  const a = scryptSync(clave, sal, 64), b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/* Freno a la fuerza bruta: 5 intentos fallidos por IP cada 15 minutos. */
const fallos = new Map<string, number[]>();
export function bloqueado(ip: string) {
  const v = (fallos.get(ip) || []).filter((t) => Date.now() - t < 15 * 60_000);
  fallos.set(ip, v);
  return v.length >= 5;
}
export function anotarFallo(ip: string) { fallos.set(ip, [...(fallos.get(ip) || []), Date.now()]); }
