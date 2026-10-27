import { RAW } from './github';

export type Pub = {
  id: string; fecha: string; redes: string[]; tipo: string; estado: string;
  media?: string; medios?: string[]; texto?: string; texto_linkedin?: string; primer_comentario?: string;
  musica?: { buscar?: string; elegida?: string }; ensayo?: boolean; error?: string; origen?: string;
  resultado?: Record<string, { id?: string; permalink?: string; hora?: string }>;
};

export const TIPO: Record<string, string> = { reel: 'Reel', historia: 'Historia', foto: 'Imagen', carrusel: 'Carrusel', documento: 'Carrusel PDF' };
export const ESTADO: Record<string, string> = { pendiente: 'Programada', borrador: 'Por aprobar', publicada: 'Publicada', error: 'Con error', descartada: 'Descartada', externa: 'En Business Suite' };

export const n = (v: unknown) => (v == null || v === '' || Number.isNaN(Number(v)) ? '—' : Number(v).toLocaleString('es-ES'));

const TZ = 'Europe/Madrid';
export const fecha = (iso: string, op: Intl.DateTimeFormatOptions) => new Date(iso).toLocaleString('es-ES', { timeZone: TZ, ...op });
export const corta = (iso: string) => fecha(iso, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const hora = (iso: string) => fecha(iso, { hour: '2-digit', minute: '2-digit' });
export const diaClave = (iso: string) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: TZ }); // AAAA-MM-DD en Madrid

/* «2026-11-03T21:00» (hora de Madrid) → ISO con la zona correcta (+01:00 o +02:00). */
export function aMadrid(local: string): string {
  const base = new Date(local + ':00Z');
  const parte = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'shortOffset' }).formatToParts(base).find((p) => p.type === 'timeZoneName')?.value || 'GMT+1';
  const h = Number(parte.replace('GMT', '') || 0);
  return `${local}:00${h >= 0 ? '+' : '-'}${String(Math.abs(h)).padStart(2, '0')}:00`;
}
/* ISO → valor para <input type="datetime-local"> en hora de Madrid. */
export const aLocal = (iso: string) => new Date(iso).toLocaleString('sv-SE', { timeZone: TZ }).replace(' ', 'T').slice(0, 16);

export function miniatura(p: Pub): { url: string; video: boolean } | null {
  let m = p.medios?.[0] || p.media;
  if (!m) return null;
  if (/\.pdf$/i.test(m)) m = m.replace(/^media\/linkedin\/([\w-]+)\.pdf$/i, '$1-1.jpg');
  return { url: /^https?:/.test(m) ? m : RAW + m.replace(/^\//, ''), video: /\.(mp4|mov)$/i.test(m) };
}

/* Las piezas de una misma noticia comparten raíz: n-1027-whatsapp-baile-ig, -fb, -historia… */
export const grupo = (id: string) => id.replace(/-(ig|fb|historia|li|feed)$/, '');
export const RED: Record<string, string> = { instagram: 'IG', facebook: 'FB', linkedin: 'LI' };
const deId = (id: string) => grupo(id).replace(/^(n-)?\d{4}-/, '').replace(/-/g, ' ');
export const tituloDe = (p: Pub) => (textoDe(p).split('\n').find((l) => l.trim()) || (p.tipo === 'historia' ? `Historia: ${deId(p.id)}` : deId(p.id))).trim();

export const textoDe = (p: Pub) => p.texto || p.texto_linkedin || '';
export const enlaceDe = (p: Pub) => Object.values(p.resultado || {}).find((r) => r.permalink)?.permalink;
