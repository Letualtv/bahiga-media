import { readFileSync } from 'node:fs';
/* Acceso a bahiga-media por la API de GitHub. El panel no guarda datos propios:
   lee y escribe los mismos ficheros que usan el publicador y las rutinas
   (cola, informe, competencia, ideas), así que todo sigue en un único sitio.
   El token (GITHUB_TOKEN) vive solo en el servidor y no se envía al navegador. */

const REPO = 'Letualtv/bahiga-media';
const API = 'https://api.github.com';
export const RAW = `https://raw.githubusercontent.com/${REPO}/main/`;

const cache = new Map<string, { hasta: number; datos: unknown; sha: string }>();

function cabeceras() {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error('Falta GITHUB_TOKEN en el servidor.');
  return { Authorization: `Bearer ${t}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'bahiga-panel' };
}

export async function gh(metodo: string, ruta: string, cuerpo?: unknown) {
  const r = await fetch(API + ruta, { method: metodo, headers: { ...cabeceras(), ...(cuerpo ? { 'Content-Type': 'application/json' } : {}) }, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  const txt = await r.text();
  const d = txt ? JSON.parse(txt) : {};
  if (!r.ok) { const e = new Error(`GitHub ${r.status}: ${d.message || r.statusText}`) as Error & { status?: number }; e.status = r.status; throw e; }
  return d;
}

/* Lee un fichero JSON del repositorio. Caché corta para que el panel vaya ágil. */
export async function leer<T = any>(ruta: string, { fresco = false, defecto }: { fresco?: boolean; defecto?: T } = {}): Promise<{ datos: T; sha: string }> {
  // Solo para probar en local: lee de una copia del repositorio en disco.
  if (process.env.PANEL_REPO_LOCAL) {
    try { return { datos: JSON.parse(readFileSync(`${process.env.PANEL_REPO_LOCAL}/${ruta}`, 'utf8')), sha: 'local' }; }
    catch (e) { if (defecto !== undefined) return { datos: defecto, sha: '' }; throw e; }
  }
  const c = cache.get(ruta);
  if (!fresco && c && c.hasta > Date.now()) return { datos: c.datos as T, sha: c.sha };
  try {
    const d = await gh('GET', `/repos/${REPO}/contents/${ruta}?ref=main`);
    let texto: string;
    if (d.content) texto = Buffer.from(d.content, 'base64').toString('utf8');
    else texto = await (await fetch(d.download_url)).text(); // ficheros de más de 1 MB
    const datos = JSON.parse(texto);
    cache.set(ruta, { hasta: Date.now() + 30_000, datos, sha: d.sha });
    return { datos, sha: d.sha };
  } catch (e) {
    if ((e as { status?: number }).status === 404 && defecto !== undefined) return { datos: defecto, sha: '' };
    throw e;
  }
}

/* Modifica un JSON con reintento si alguien (el publicador, una rutina) lo cambió a la vez. */
export async function modificar<T = any>(ruta: string, cambio: (d: T) => void | string, mensaje: string) {
  for (let intento = 0; intento < 4; intento++) {
    const { datos, sha } = await leer<T>(ruta, { fresco: true });
    const res = cambio(datos);
    if (res === 'sin-cambios') return;
    const contenido = Buffer.from(JSON.stringify(datos, null, 1) + '\n', 'utf8').toString('base64');
    try {
      await gh('PUT', `/repos/${REPO}/contents/${ruta}`, {
        message: `Panel: ${mensaje}`, content: contenido, sha, branch: 'main',
        committer: { name: 'bahiga-panel', email: 'info@bahiga.es' },
      });
      cache.delete(ruta);
      return;
    } catch (e) {
      if ((e as { status?: number }).status === 409 && intento < 3) { await new Promise((r) => setTimeout(r, 800)); continue; }
      throw e;
    }
  }
}

export async function propuestas(estado: 'open' | 'closed' | 'all' = 'open') {
  try { return await gh('GET', `/repos/${REPO}/issues?state=${estado}&labels=aprobacion&per_page=50`); } catch { return []; }
}

export async function cerrarPropuestas(ids: string[], texto: string) {
  const abiertas = await propuestas('open');
  for (const i of abiertas) {
    const marcados = (i.body?.match(/<!--\s*ids:\s*([^>]+?)\s*-->/)?.[1] || '').split(',').map((s: string) => s.trim());
    if (!marcados.some((m: string) => ids.includes(m))) continue;
    await gh('POST', `/repos/${REPO}/issues/${i.number}/comments`, { body: texto }).catch(() => {});
    await gh('PATCH', `/repos/${REPO}/issues/${i.number}`, { state: 'closed' }).catch(() => {});
  }
}

/* Lanza el publicador para que lo urgente salga sin esperar al reloj (si el token lo permite). */
export async function lanzarPublicador() {
  await gh('POST', `/repos/${REPO}/actions/workflows/publicar.yml/dispatches`, { ref: 'main' }).catch(() => {});
}
