// Historias de las webs por sector: dos pantallas por sector (la muestra real y lo que lleva) y la cuenta atrás del Black Friday.
// Lo que «lleva» cada sector sale de la página de venta de bahiga.es/webs/<sector>: no se inventa nada.
// Uso: node motion/anotado/historias-sector.mjs [sector|cuenta]  →  media/historia-web-<sector>-1.jpg, -2.jpg y media/historia-bf-<n>.jpg
import { movil, render } from './piezas.mjs';
import { real, CSS_REAL } from './real.mjs';
export const SECTORES = {
  barberia: ['tu barbería.', ['Tablón de precios', 'Reserva de hora por WhatsApp', 'Abierto o cerrado, al momento']],
  estetica: ['tu centro de estética.', ['Carta de tratamientos', 'Cita por WhatsApp', 'Tus trabajos, con foto']],
  taller: ['tu taller.', ['Guía de testigos del cuadro', 'Precios de lo habitual', 'Cita con la matrícula puesta']],
  reformas: ['tu empresa de reformas.', ['Catálogo de obras acabadas', 'Te mandan fotos por WhatsApp', 'Tu zona de trabajo']],
  bar: ['tu bar.', ['Menú del día en pizarra', 'La carta, grande y clara', 'Reservar llamando']],
  rural: ['tu casa rural.', ['La casa, estancia a estancia', 'Solicitud por WhatsApp', 'En español e inglés']],
  floristeria: ['tu floristería.', ['Ramo flor a flor', 'Encargo con tarjeta', 'Zona de reparto']],
  autoescuela: ['tu autoescuela.', ['Test de señales', 'Calculadora del carnet', 'Matrícula por WhatsApp']],
  entreno: ['tu centro de entrenamiento.', ['Parrilla de clases', 'Plazas que quedan', 'Tarifas claras']],
  merceria: ['tu mercería.', ['Colores a elegir', 'Arreglos con precio', 'Talleres']],
  fisio: ['tu clínica de fisio.', ['Mapa del cuerpo: dónde duele', 'Cita con la zona puesta', 'Tratamientos con precio']],
  panaderia: ['tu panadería.', ['El horno, ahora', 'Encargo para mañana', 'Dulces de temporada']],
  electricista: ['tu negocio de electricidad.', ['Qué hacer si se va la luz', 'Qué bombilla te hace falta', 'Trabajos con precio']],
  moda: ['tu tienda de moda.', ['El escaparate que se toca', 'Apartar en tu talla', 'Recién llegado']],
  peluqueria: ['tu peluquería.', ['Carta de color en abanico', 'Huecos libres de la semana', 'Precios con duración']],
};
const BASE = `${CSS_REAL}
body{height:1920px;background:radial-gradient(1000px 900px at 76% 66%,#1B3340 0%,#0F1C24 62%)}
.m{top:150px}.pie{bottom:120px}.pg{display:none}
.t{top:290px;font-size:112px;right:80px}.largo .t{font-size:96px}
.fan{top:300px;right:-40px;font-size:1300px}
.h1{left:260px;top:860px;transform:rotate(-4deg) scale(1.12);transform-origin:50% 0}
.aviso{bottom:auto;top:740px;left:80px;z-index:16}
.lv{position:absolute;left:80px;right:80px;top:540px;z-index:12}.lv div{display:flex;align-items:center;gap:26px;background:#FAF8F5;color:#0F1C24;border-radius:32px;padding:32px 40px;margin-bottom:22px;font-size:46px;font-weight:600;line-height:1.15;box-shadow:0 24px 50px rgba(0,0,0,.4)}.lv div:nth-child(2){margin-left:40px}.lv i{flex:0 0 52px;height:52px;border-radius:50%;background:#1F7A4D;display:grid;place-items:center}.lv i svg{width:30px;height:30px}
.pr{position:absolute;left:80px;right:80px;z-index:20;border-radius:44px;padding:40px 50px 44px;box-shadow:0 40px 80px rgba(0,0,0,.55)}.pr b{display:block;font-family:D;font-weight:400;line-height:.92;letter-spacing:-4px}.pr span{display:block;font-size:34px;line-height:1.3;margin-top:18px}.pr small{font-family:M;font-size:26px;letter-spacing:3px;text-transform:uppercase}
#pa{top:1050px;right:100px;background:#E8683C;color:#0F1C24;transform:rotate(-1.5deg)}#pa b{font-size:150px}
.cta{bottom:300px;left:80px;font-size:44px;padding:28px 46px;background:#FAF8F5;color:#0F1C24}
#pc{top:620px;right:100px;background:#FAF8F5;color:#0F1C24;transform:rotate(-2deg)}#pc b{font-size:128px;color:#E8683C;white-space:nowrap}#pc small{color:#8A8F93}
#pd{top:1090px;left:140px;background:#E8683C;color:#0F1C24;transform:rotate(1.5deg)}#pd b{font-size:118px;white-space:nowrap}
`;
const TIC = '<i><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>';
const PRECIO = `<div class=pr id=pa><small>Desde</small><b>390 € <span style="display:inline;font-family:inherit;font-size:60px;letter-spacing:0">+ IVA</span></b><span>Con tu nombre, tus fotos y tus precios. Black Friday: 3 meses de mantenimiento gratis hasta el 30 de noviembre.</span></div><div class="cta">Responde WEB</div>`;
const CUENTA = [['3', 'Quedan *tres días.*'], ['2', 'Quedan *dos días.*'], ['1', 'Hoy es *el último día.*']];
const cual = process.argv[2];
const directo = process.argv[1].endsWith("historias-sector.mjs");
if (directo) for (const [s, [que, lleva]] of Object.entries(SECTORES)) {
  if (cual && cual !== s) continue;
  await render(`historia-web-${s}`, [
    { cls: que.length > 16 ? 'largo' : '', fantasma: '1', t: `Una web para *${que}*`, cuerpo: `${movil(real(s), { cls: 'real h1' })}<div class="aviso">Web de muestra hecha por Bahiga. Pruébala en bahiga.es/webs</div>` },
    { fantasma: '2', t: 'Lo que *lleva.*', cuerpo: `<div class=lv>${lleva.map((x) => `<div>${TIC}${x}</div>`).join('')}</div>${PRECIO}` },
  ], BASE, { ancho: 1080, alto: 1920 });
}
if (directo && (!cual || cual === "cuenta")) await render('historia-bf', CUENTA.map(([n, t]) => ({ fantasma: n, t, cuerpo: `<div class=pr id=pc><small>Black Friday</small><b>3 meses gratis</b><span>de mantenimiento, contratando tu web hasta el 30 de noviembre. Después, 1 mes.</span></div><div class=pr id=pd><small>Web para tu negocio</small><b>Desde 390 €</b><span>Más IVA. Catorce sectores en bahiga.es/webs</span></div><div class="cta">Responde WEB</div>` })), BASE, { ancho: 1080, alto: 1920 });
