// Carrusel «Una web para tu negocio, desde 390 €» con las muestras reales de bahiga.es/webs.
// Condiciones copiadas de la web (18/11/2026) más la oferta de Black Friday que fijó Antonio.
// Uso: node motion/anotado/webs-sector.mjs [id]  →  media/<id>-1.jpg … -7.jpg (por defecto 1123-webs-por-sector)
const N = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];
import { movil, render, OK } from './piezas.mjs';
import { real, img, SECTORES, CSS_REAL } from './real.mjs';
const LI = (process.argv[2] || '').startsWith('li-');
const CUANTOS = N[SECTORES.length], Cuantos = CUANTOS[0].toUpperCase() + CUANTOS.slice(1);
const tel = (s, cls, o = {}) => movil(real(s), { cls: `real ${cls}`, ...o });
const L = [
  { cls: 'portada', fantasma: String(SECTORES.length), t: 'Una web para tu negocio. *Desde 390&nbsp;€.*',
    cuerpo: `${tel('estetica', 'f1')}${tel('taller', 'f3')}${tel('barberia', 'f2')}<div class="oferta">Black Friday<b>3 meses de mantenimiento gratis</b></div><div class="aviso">Webs de muestra<br>hechas por Bahiga.</div><div class="dz">Desliza →</div>` },
  { fantasma: String(SECTORES.length), num: '01', t: `${Cuantos} sectores. *Elige el tuyo.*`,
    cuerpo: `<div class="rejilla">${SECTORES.map(([s, n]) => `<div><i style="background-image:url(${img(s)})"></i><span>${n}</span></div>`).join('')}${SECTORES.length % 5 ? '<div class="otro"><i>¿El tuyo<br>no está?</i><span>Pregúntanos</span></div>' : ''}</div>` },
  { fantasma: '02', num: '02', t: 'La adaptamos *con lo tuyo.*', n: 'Partimos de la muestra de tu sector y cambiamos lo que hace falta.',
    cuerpo: `${tel('barberia', 'm-der')}${['Tu nombre', 'Tus textos', 'Tus fotos', 'Tus precios', 'Tus colores'].map((x, i) => `<div class="chip pt p${i}"><b>${OK}</b>${x}</div>`).join('')}` },
  { fantasma: '390', num: '03', t: 'Qué lleva *por 390 €.*',
    cuerpo: `<div class="lista">${['Pensada para el móvil, con llamada y WhatsApp', 'Reservas o pedidos por WhatsApp', 'Tus redes dentro de la web', 'Versión en inglés, si la necesitas', 'Preparada para Google y asistentes de IA', 'Dominio un año y un correo con tu dominio', 'Tu área de clientes, con visitas y contactos'].map((x) => `<div><b>${OK}</b>${x}</div>`).join('')}</div>` },
  { fantasma: '+', num: '04', t: 'Y lo demás, *se añade.*', n: 'Con presupuesto por escrito antes de empezar.',
    cuerpo: `<div class="extras">${[['Agenda de reservas real', 'desde 150 € + 10 €/mes'], ['Pedidos con pago', 'desde 290 €'], ['Más páginas', 'desde 60 € cada una'], ['Ficha de Google lista', '60 €']].map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>` },
  { fantasma: '30', num: '05', t: 'El mantenimiento, *opcional.*', n: '30 € al mes, sin permanencia.',
    cuerpo: `<div class="lista corta">${['Alojamiento en nuestro servidor', 'Copias de seguridad', 'Media hora de cambios al mes', 'Tu área de clientes'].map((x) => `<div><b>${OK}</b>${x}</div>`).join('')}</div>
      <div class="oferta of2">Black Friday<b>Los 3 primeros meses, gratis</b><em>Contratando hasta el 30 de noviembre. Después, 1 mes.</em></div>` },
  { cls: 'coral', fantasma: '?', t: 'Mira la de *tu sector.*',
    cuerpo: `<div class="gs">Las ${CUANTOS} muestras están en bahiga.es/webs. Entra desde el móvil, pruébala y ${LI ? 'escríbeme si quieres la tuya' : 'escríbenos WEB si quieres la tuya'}.</div><div class="gu">Precios sin IVA.</div><div class="cta">${LI ? 'bahiga.es/webs' : 'Comenta WEB'}</div>` },
];
const EXTRA = `${CSS_REAL}
.chip svg,.lista svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.f1{left:40px;top:720px;transform:rotate(-9deg) scale(.74);transform-origin:0 0;filter:brightness(.82)}.f3{left:650px;top:690px;transform:rotate(8deg) scale(.74);transform-origin:0 0;filter:brightness(.82)}.f2{left:300px;top:610px;transform:scale(.86);transform-origin:0 0;z-index:8}
.oferta{position:absolute;left:500px;top:1100px;width:480px;z-index:20;background:#E8683C;color:#0F1C24;border-radius:26px;padding:18px 30px 22px;transform:rotate(4deg);box-shadow:0 26px 56px rgba(0,0,0,.55);font-family:M;font-size:20px;letter-spacing:3px;text-transform:uppercase}.oferta b{display:block;font:normal 40px/1.05 D;letter-spacing:-1px;text-transform:none;margin-top:6px}.oferta em{display:block;font:normal 22px/1.3 U;letter-spacing:0;text-transform:none;margin-top:10px}
.aviso,.dz{z-index:30}.aviso{display:none}
.rejilla{position:absolute;left:70px;right:70px;top:520px;display:grid;grid-template-columns:repeat(5,1fr);gap:20px 16px;z-index:10}
.rejilla i{display:block;height:206px;border-radius:20px;border:5px solid #05070A;background:#fff top/cover no-repeat;box-shadow:0 16px 34px rgba(0,0,0,.45)}.rejilla span{display:block;font:normal 17px/1.2 U6;text-align:center;margin-top:8px;color:#D9DEE2}
.rejilla .otro i{display:grid;place-items:center;text-align:center;background:#14242E;border:3px dashed #E8683C;font:normal 23px/1.15 DI;font-style:normal;color:#F0A07E}
.chip.pt{font-size:32px;padding:12px 30px 12px 12px;z-index:14}.chip.pt b{background:#2E7D4F}.p0{left:70px;top:740px;transform:rotate(-3deg)}.p1{left:140px;top:850px;transform:rotate(2deg)}.p2{left:60px;top:960px;transform:rotate(-2deg)}.p3{left:130px;top:1070px;transform:rotate(3deg)}.p4{left:70px;top:1180px;transform:rotate(-2deg)}
.lista{position:absolute;left:80px;right:80px;top:440px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:10px 38px;z-index:10;transform:rotate(-1.5deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}.lista div{display:flex;gap:20px;align-items:center;font-size:31px;line-height:1.2;padding:19px 0;border-bottom:2px solid #E6E0D6}.lista div:last-child{border:0}.lista b{width:44px;height:44px;border-radius:50%;background:#2E7D4F;display:grid;place-items:center;flex:none}
.lista.corta{top:600px;right:260px}.lista.corta div{font-size:30px;padding:17px 0}
.extras{position:absolute;left:80px;right:80px;top:700px;display:grid;gap:18px;z-index:10}.extras div{background:#FAF8F5;color:#0F1C24;border-radius:26px;padding:24px 32px;display:flex;justify-content:space-between;align-items:center;gap:20px;box-shadow:0 24px 50px rgba(0,0,0,.45)}.extras div:nth-child(odd){transform:rotate(-1.5deg)}.extras div:nth-child(even){transform:rotate(1.2deg) translateX(14px)}
.extras b{font:normal 34px/1.1 D;letter-spacing:-.5px}.extras span{font:normal 25px U6;color:#B4532E;white-space:nowrap}
.oferta.of2{left:auto;right:60px;top:960px;width:480px;transform:rotate(3deg)}
`;
await render(process.argv[2] || '1123-webs-por-sector', L, EXTRA);
