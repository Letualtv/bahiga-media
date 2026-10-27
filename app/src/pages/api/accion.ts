/* Todas las acciones del panel llegan aquí por formulario y vuelven a la página de origen.
   Cada cambio es un commit en bahiga-media con el prefijo «Panel:», así queda historial. */
import type { APIRoute } from 'astro';
import { modificar, cerrarPropuestas, lanzarPublicador } from '../../lib/github';
import { aMadrid, type Pub } from '../../lib/util';
import { marcarHecho } from '../../lib/avisos';

const COLA = 'publicador/cola.json';
const IDEAS = 'ideas/ideas.json';
const CUENTAS = 'publicador/competencia-cuentas.json';

const ahoraMadrid = () => aMadrid(new Date(Date.now() + 60_000).toLocaleString('sv-SE', { timeZone: 'Europe/Madrid' }).replace(' ', 'T').slice(0, 16));

export const POST: APIRoute = async ({ request, redirect }) => {
  const f = await request.formData();
  const accion = String(f.get('accion') || '');
  const id = String(f.get('id') || '');
  const volverRaw = String(f.get('volver') || '/');
  const volver = volverRaw.startsWith('/') && !volverRaw.startsWith('//') ? volverRaw : '/';
  const ir = (clave: 'ok' | 'error', txt: string) => redirect(`${volver}${volver.includes('?') ? '&' : '?'}${clave}=${encodeURIComponent(txt)}`, 303);

  try {
    // ── Cola ──
    if (['aprobar', 'ahora', 'descartar', 'pausar', 'reintentar', 'hora'].includes(accion)) {
      let nuevaFecha = '';
      if (accion === 'hora') {
        const local = String(f.get('fecha') || '');
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return ir('error', 'La fecha no es válida.');
        nuevaFecha = aMadrid(local);
      }
      let hecho = '';
      const ids = id.split(',').map((s) => s.trim()).filter(Boolean);
      await modificar<{ publicaciones: Pub[] }>(COLA, (c) => {
        let cambios = 0;
        for (const uno of ids) {
        const p = c.publicaciones.find((x) => x.id === uno);
        if (!p) throw new Error(`No encuentro ${uno} en la cola.`);
        const antes = JSON.stringify(p);
        if (accion === 'aprobar') { if (p.estado !== 'borrador') continue; p.estado = 'pendiente'; if (Date.parse(p.fecha) < Date.now()) p.fecha = ahoraMadrid(); hecho = ids.length > 1 ? 'Aprobadas.' : 'Aprobada.'; }
        if (accion === 'ahora') { p.estado = 'pendiente'; p.fecha = ahoraMadrid(); hecho = 'Sale en el próximo pase del reloj (menos de 10 minutos).'; }
        if (accion === 'descartar') { p.estado = 'descartada'; hecho = 'Descartada.'; }
        if (accion === 'pausar') { if (p.estado !== 'pendiente') continue; p.estado = 'borrador'; hecho = 'Pasada a borrador: no se publica hasta que la apruebes.'; }
        if (accion === 'reintentar') { p.estado = 'pendiente'; (p as any).intentos = 0; delete p.error; hecho = 'Se reintenta en el próximo pase.'; }
        if (accion === 'hora') { p.fecha = nuevaFecha; hecho = 'Hora cambiada.'; }
        if (JSON.stringify(p) !== antes) cambios++;
        }
        if (!cambios) return 'sin-cambios';
      }, `${accion} ${id}`);
      if (['aprobar', 'ahora', 'descartar'].includes(accion)) await cerrarPropuestas(ids, `${accion === 'descartar' ? 'Descartado' : 'Aprobado'} desde el panel: ${id}.`).catch(() => {});
      if (accion === 'ahora') await lanzarPublicador();
      return ir('ok', hecho || 'Sin cambios.');
    }

    // ── Mensajes y comentarios (guardados en el servidor) ──
    if (accion === 'aviso-hecho') { marcarHecho(id); return ir('ok', 'Hecho.'); }

    // ── Ideas ──
    if (accion === 'idea-nueva') {
      const titulo = String(f.get('titulo') || '').trim().slice(0, 200);
      if (!titulo) return ir('error', 'Escribe la idea.');
      await modificar<{ ideas: any[] }>(IDEAS, (d) => {
        const num = Math.max(0, ...d.ideas.map((i) => Number(String(i.id).slice(1)) || 0)) + 1;
        d.ideas.unshift({ id: `i${String(num).padStart(3, '0')}`, titulo, formato: String(f.get('formato') || ''), redes: f.getAll('redes').map(String), pilar: String(f.get('pilar') || '').trim(), fuente: 'Antonio (panel)', estado: 'idea', notas: String(f.get('notas') || '').trim().slice(0, 300), creada: new Date().toISOString().slice(0, 10) });
      }, `nueva idea «${titulo.slice(0, 50)}»`);
      return ir('ok', 'Idea guardada.');
    }
    if (accion === 'idea-estado') {
      const estado = String(f.get('estado') || '');
      if (!['idea', 'en-marcha', 'programada', 'hecha', 'descartada'].includes(estado)) return ir('error', 'Estado no válido.');
      await modificar<{ ideas: any[] }>(IDEAS, (d) => { const i = d.ideas.find((x) => x.id === id); if (!i) throw new Error('No encuentro la idea.'); i.estado = estado; }, `idea ${id} → ${estado}`);
      return ir('ok', 'Idea actualizada.');
    }

    // ── Competencia ──
    if (accion === 'cuenta-nueva' || accion === 'cuenta-quitar') {
      const cuenta = String(f.get('cuenta') || '').trim().replace(/^@/, '').toLowerCase();
      if (!/^[a-z0-9._]{1,30}$/.test(cuenta)) return ir('error', 'Ese nombre de usuario no es válido.');
      await modificar<{ cuentas: string[] }>(CUENTAS, (d) => {
        if (accion === 'cuenta-nueva') { if (d.cuentas.includes(cuenta)) return 'sin-cambios'; d.cuentas.push(cuenta); }
        else d.cuentas = d.cuentas.filter((c) => c !== cuenta);
      }, `${accion === 'cuenta-nueva' ? 'vigilar' : 'dejar de vigilar'} @${cuenta}`);
      return ir('ok', accion === 'cuenta-nueva' ? `Añadida @${cuenta}. Sus datos aparecen en unos minutos.` : `Ya no se vigila @${cuenta}.`);
    }

    return ir('error', 'Acción desconocida.');
  } catch (e) {
    return ir('error', (e as Error).message);
  }
};
