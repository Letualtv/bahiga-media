/* Diagnóstico de una web en un minuto (bahiga.es/revisa-tu-web).
   Junta dos fuentes: PageSpeed Insights de Google (velocidad y SEO en
   móvil) y una lectura propia de la portada (HTTPS, título, descripción,
   contacto a la vista, datos de negocio). Devuelve una nota de 0 a 100 y
   los arreglos ordenados por lo que más clientes cuestan.

   Seguridad: el servidor descarga la portada de una URL que escribe un
   desconocido, así que solo acepta http(s) a nombres públicos, comprueba
   que todas las IP a las que resuelve son públicas (también en cada
   redirección), corta a los 8 segundos y lee como mucho 1,5 MB. */

import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export type Gravedad = 'alta' | 'media' | 'baja';
export interface Arreglo { id: string; gravedad: Gravedad; titulo: string; detalle: string }
export interface Diagnostico {
  url: string;
  nota: number;
  resumen: string;
  velocidad: { nota: number | null; carga: string | null; peso: string | null };
  arreglos: Arreglo[];
  bien: string[];
  fecha: string;
}

export class ErrorDiagnostico extends Error {}

/* ── URL y red ──────────────────────────────────────────────────── */

export function normalizarUrl(entrada: string): URL {
  let t = (entrada || '').trim();
  if (!t) throw new ErrorDiagnostico('Escribe la dirección de tu web.');
  if (t.length > 300) throw new ErrorDiagnostico('Esa dirección es demasiado larga.');
  if (!/^https?:\/\//i.test(t)) t = 'https://' + t;
  let u: URL;
  try { u = new URL(t); } catch { throw new ErrorDiagnostico('Esa dirección no parece una web. Prueba con algo como tunegocio.es'); }
  if (!['http:', 'https:'].includes(u.protocol)) throw new ErrorDiagnostico('Solo se pueden revisar webs (http o https).');
  if (u.username || u.password) throw new ErrorDiagnostico('Esa dirección no es válida.');
  if (u.port && !['80', '443'].includes(u.port)) throw new ErrorDiagnostico('Esa dirección no es válida.');
  const host = u.hostname.toLowerCase();
  if (isIP(host) || !host.includes('.') || /(^|\.)(localhost|local|internal|lan|home|test|invalid)$/.test(host)) {
    throw new ErrorDiagnostico('Escribe el dominio de tu web, por ejemplo tunegocio.es');
  }
  u.hash = '';
  return u;
}

function ipPrivada(ip: string): boolean {
  if (ip.includes(':')) {
    const v = ip.toLowerCase();
    if (v === '::1' || v === '::') return true;
    if (v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb')) return true;
    const m = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return m ? ipPrivada(m[1]) : false;
  }
  const [a, b] = ip.split('.').map(Number);
  return a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19));
}

async function comprobarHost(host: string) {
  let ips: { address: string }[];
  try { ips = await lookup(host, { all: true }); } catch { throw new ErrorDiagnostico('No encontramos esa web. Revisa que la dirección esté bien escrita.'); }
  if (!ips.length || ips.some((i) => ipPrivada(i.address))) throw new ErrorDiagnostico('No podemos revisar esa dirección.');
}

/* Descarga la portada siguiendo hasta 4 redirecciones, validando cada salto. */
async function descargarPortada(inicio: URL): Promise<{ final: URL; html: string; viaHttps: boolean }> {
  let url = inicio;
  for (let salto = 0; salto < 5; salto++) {
    await comprobarHost(url.hostname);
    const ctl = new AbortController();
    const reloj = setTimeout(() => ctl.abort(), 8000);
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: 'manual', signal: ctl.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BahigaRevisaTuWeb/1.0; +https://bahiga.es/revisa-tu-web)', Accept: 'text/html' },
      });
    } catch {
      clearTimeout(reloj);
      throw new ErrorDiagnostico('Tu web no ha respondido en 8 segundos. Eso ya es un problema: muchos visitantes se van antes.');
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      clearTimeout(reloj);
      url = normalizarUrl(new URL(res.headers.get('location')!, url).href);
      continue;
    }
    if (!res.ok) { clearTimeout(reloj); throw new ErrorDiagnostico(`Tu web ha respondido con un error (${res.status}). Si no carga para nosotros, puede que tampoco para tus clientes.`); }
    // Lee como mucho 1,5 MB de HTML.
    const lector = res.body?.getReader();
    let html = '', total = 0;
    const dec = new TextDecoder();
    if (lector) {
      while (true) {
        const { done, value } = await lector.read();
        if (done) break;
        total += value.length; html += dec.decode(value, { stream: true });
        if (total > 1_500_000) { await lector.cancel(); break; }
      }
    }
    clearTimeout(reloj);
    return { final: url, html, viaHttps: url.protocol === 'https:' };
  }
  throw new ErrorDiagnostico('Tu web redirige demasiadas veces.');
}

/* ── PageSpeed Insights ─────────────────────────────────────────── */

interface Psi { rendimiento: number | null; seo: number | null; carga: string | null; peso: string | null; ahorroImagenes: number }

async function pagespeed(url: string): Promise<Psi | null> {
  const q = new URLSearchParams({ url, strategy: 'mobile', locale: 'es' });
  q.append('category', 'performance'); q.append('category', 'seo');
  const clave = process.env.PSI_API_KEY || (import.meta as { env?: Record<string, string> }).env?.PSI_API_KEY;
  if (clave) q.set('key', clave);
  const ctl = new AbortController();
  const reloj = setTimeout(() => ctl.abort(), 55_000);
  try {
    const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: ctl.signal });
    if (!r.ok) return null;
    const d = await r.json();
    const lh = d.lighthouseResult;
    if (!lh) return null;
    const a = lh.audits || {};
    const ahorro = ['modern-image-formats', 'uses-optimized-images', 'uses-responsive-images', 'offscreen-images']
      .reduce((s, k) => s + (a[k]?.details?.overallSavingsBytes || 0), 0);
    const nota = (c: { score?: number } | undefined) => (typeof c?.score === 'number' ? Math.round(c.score * 100) : null);
    return {
      rendimiento: nota(lh.categories?.performance),
      seo: nota(lh.categories?.seo),
      carga: a['largest-contentful-paint']?.displayValue?.replace(/ /g, ' ') || null,
      peso: a['total-byte-weight']?.displayValue?.replace(/ /g, ' ') || null,
      ahorroImagenes: ahorro,
    };
  } catch { return null; } finally { clearTimeout(reloj); }
}

/* ── Lectura de la portada ──────────────────────────────────────── */

const quitarEtiquetas = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
function meta(html: string, nombre: string): string | null {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${nombre}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || null;
}

function leerPortada(html: string) {
  const titulo = quitarEtiquetas(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descripcion = meta(html, 'description');
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const telefono = /href=["']tel:/i.test(html);
  const whatsapp = /(wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/)/i.test(html);
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join(' ');
  const datosNegocio = /"@type"\s*:\s*"?\[?\s*"?(LocalBusiness|Organization|Store|Restaurant|ProfessionalService|[A-Za-z]+Business|[A-Za-z]+Store)"/.test(jsonld);
  const mapa = /(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|g\.page\/)/i.test(html);
  return { titulo, descripcion, viewport, telefono, whatsapp, datosNegocio, mapa };
}

/* ── Nota y arreglos ────────────────────────────────────────────── */

const MB = (b: number) => (b / 1_048_576).toLocaleString('es-ES', { maximumFractionDigits: 1 });

export async function diagnosticar(entrada: string): Promise<Diagnostico> {
  const inicio = normalizarUrl(entrada);
  const portada = await descargarPortada(inicio);
  const [psi, p] = [await pagespeed(portada.final.href), leerPortada(portada.html)];

  const arreglos: Arreglo[] = [];
  const bien: string[] = [];
  let nota = 0;

  // Velocidad en el móvil (40 puntos)
  if (psi?.rendimiento != null) {
    nota += Math.round(psi.rendimiento * 0.4);
    if (psi.rendimiento < 50) arreglos.push({ id: 'velocidad', gravedad: 'alta', titulo: 'Tu web va lenta en el móvil', detalle: `Google le da ${psi.rendimiento} sobre 100 en móvil${psi.carga ? ` y el contenido principal tarda ${psi.carga} en aparecer` : ''}. Casi todas las visitas de un comercio llegan desde el móvil, y con prisa: si tarda, se van a la competencia.` });
    else if (psi.rendimiento < 90) arreglos.push({ id: 'velocidad', gravedad: 'media', titulo: 'Tu web podría cargar más rápido en el móvil', detalle: `Google le da ${psi.rendimiento} sobre 100 en móvil${psi.carga ? ` (contenido principal en ${psi.carga})` : ''}. No es grave, pero cada segundo de espera resta visitas.` });
    else bien.push(`Carga rápido en el móvil (${psi.rendimiento} sobre 100 en Google).`);
    if (psi.ahorroImagenes > 300_000) arreglos.push({ id: 'imagenes', gravedad: psi.ahorroImagenes > 1_500_000 ? 'alta' : 'media', titulo: 'Las imágenes pesan más de la cuenta', detalle: `Optimizándolas te ahorrarías unos ${MB(psi.ahorroImagenes)} MB en cada visita. Se ven igual y la web carga bastante antes.` });
  } else {
    nota += 20; // sin dato de Google no se castiga ni se premia del todo
  }

  // Seguridad (10)
  if (portada.viaHttps) { nota += 10; bien.push('Tiene conexión segura (HTTPS).'); }
  else arreglos.push({ id: 'https', gravedad: 'alta', titulo: 'Tu web no tiene conexión segura', detalle: 'El navegador la marca como «No segura». Mucha gente se va al verlo y Google la posiciona peor. Se arregla con un certificado gratuito.' });

  // Lo que se ve en Google (20)
  if (p.titulo && p.titulo.length >= 15 && p.titulo.length <= 65) { nota += 7; bien.push('El título que sale en Google está bien.'); }
  else arreglos.push({ id: 'titulo', gravedad: 'media', titulo: p.titulo ? 'El título que sale en Google no está bien ajustado' : 'Tu web no tiene título para Google', detalle: p.titulo ? `Ahora es «${p.titulo.slice(0, 80)}». Debería decir en unas 60 letras qué haces y dónde, que es lo que busca la gente.` : 'Google se inventa uno. Debería decir en unas 60 letras qué haces y dónde.' });
  if (p.descripcion && p.descripcion.length >= 70) { nota += 6; bien.push('Tiene descripción para Google.'); }
  else arreglos.push({ id: 'descripcion', gravedad: 'media', titulo: 'Falta la descripción que aparece en Google', detalle: 'Es el texto bajo el título en los resultados. Sin ella, Google coge cualquier frase de la página y la gente pincha menos.' });
  if (p.viewport) nota += 7;
  else arreglos.push({ id: 'movil', gravedad: 'alta', titulo: 'Tu web no está adaptada al móvil', detalle: 'En el móvil se ve diminuta y hay que hacer zoom. Es lo primero que hace que alguien se vaya.' });

  // Contacto a la vista (15)
  if (p.telefono || p.whatsapp) { nota += 15; bien.push(`Tiene ${p.whatsapp ? 'WhatsApp' : 'teléfono'} pulsable.`); }
  else arreglos.push({ id: 'contacto', gravedad: 'alta', titulo: 'No hay un teléfono ni un WhatsApp pulsables', detalle: 'Desde el móvil, quien quiere llamarte tiene que copiar el número a mano. Un botón de llamar o de WhatsApp es lo que más contactos trae en un comercio.' });

  // Datos de negocio para Google y las IA (15)
  if (p.datosNegocio) { nota += 15; bien.push('Tiene los datos de negocio que leen Google y las IA.'); }
  else arreglos.push({ id: 'datos', gravedad: 'media', titulo: 'Google y las IA no tienen tus datos de negocio', detalle: 'Faltan los datos estructurados (dirección, horario, teléfono) que usan Google, ChatGPT y otros asistentes para recomendar negocios. Sin ellos es más difícil que te mencionen.' });
  if (!p.mapa) arreglos.push({ id: 'mapa', gravedad: 'baja', titulo: 'No enlaza con tu ficha de Google Maps', detalle: 'Un enlace o un mapa a tu ficha ayuda a que te encuentren y refuerza tu posición en búsquedas locales.' });

  const orden: Record<Gravedad, number> = { alta: 0, media: 1, baja: 2 };
  arreglos.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);
  nota = Math.max(0, Math.min(100, nota));
  const resumen = nota >= 85 ? 'Tu web está en buena forma. Quedan detalles que pulir.'
    : nota >= 60 ? 'Tu web funciona, pero está dejando escapar clientes.'
    : 'Tu web te está costando clientes. Tiene arreglo, y casi siempre es más fácil de lo que parece.';

  return {
    url: portada.final.href, nota, resumen,
    velocidad: { nota: psi?.rendimiento ?? null, carga: psi?.carga ?? null, peso: psi?.peso ?? null },
    arreglos, bien, fecha: new Date().toISOString(),
  };
}
