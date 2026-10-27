// Aprobación de propuestas por comentario en una incidencia de GitHub.
// La rutina de noticias deja las piezas en la cola como «borrador» y abre una incidencia
// con la etiqueta «aprobacion» y la marca <!-- ids: a,b,c -->. Antonio contesta en la incidencia:
//   sí / ok / adelante  → las piezas pasan a «pendiente» y salen a la hora propuesta
//   ahora               → pasan a «pendiente» con la hora de ya (salen en menos de 10 minutos)
//   no                  → se marcan «descartada»
// Solo cuenta lo que escribe Antonio (Letualtv).
import { readFileSync, writeFileSync } from 'node:fs';

const { DECISION_TEXTO = '', DECISION_AUTOR = '', CUERPO = '' } = process.env;
const COLA = new URL('./cola.json', import.meta.url);
const salida = (txt) => { writeFileSync(new URL('./aprobar-resultado.txt', import.meta.url), txt + '\n'); console.log(txt); };

if (DECISION_AUTOR !== 'Letualtv') { salida('IGNORAR'); process.exit(0); }
const ids = (CUERPO.match(/<!--\s*ids:\s*([^>]+?)\s*-->/) || [])[1]?.split(',').map((s) => s.trim()).filter(Boolean) || [];
if (!ids.length) { salida('Esta incidencia no tiene piezas asociadas.'); process.exit(0); }

const t = DECISION_TEXTO.trim().toLowerCase();
let accion;
if (/^(no|descarta|descartar|rechaza)(?![a-zñáéíóú])/.test(t)) accion = 'no';
else if (/^(ahora|ya|publica ya|publícalo ya)(?![a-zñáéíóú])/.test(t)) accion = 'ahora';
else if (/^(s[ií]|ok|vale|adelante|aprobado|aprueba|programa)(?![a-zñáéíóú])/.test(t)) accion = 'si';
else { salida('IGNORAR'); process.exit(0); }

const cola = JSON.parse(readFileSync(COLA, 'utf8'));
const madrid = () => {
  const d = new Date(Date.now() + 60_000);
  const off = -new Date(d.toLocaleString('en-US', { timeZone: 'UTC' })).getTime() + new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Madrid' })).getTime();
  const h = Math.round(off / 3600_000), l = new Date(d.getTime() + off);
  return l.toISOString().slice(0, 19) + `+${String(h).padStart(2, '0')}:00`;
};
const hechas = [];
for (const p of cola.publicaciones) {
  if (!ids.includes(p.id) || p.estado !== 'borrador') continue;
  if (accion === 'no') p.estado = 'descartada';
  else { p.estado = 'pendiente'; if (accion === 'ahora' || Date.parse(p.fecha) < Date.now()) p.fecha = madrid(); }
  hechas.push(`${p.id} → ${p.estado === 'descartada' ? 'descartada' : `programada para el ${p.fecha.slice(8, 10)}/${p.fecha.slice(5, 7)} a las ${p.fecha.slice(11, 16)}`} (${p.redes.join(', ')})`);
}
writeFileSync(COLA, JSON.stringify(cola, null, 1) + '\n');
salida(hechas.length ? (accion === 'no' ? 'Descartado:\n' : 'Aprobado:\n') + hechas.map((h) => '- ' + h).join('\n') : 'No quedaba ninguna pieza en borrador de esta propuesta.');
