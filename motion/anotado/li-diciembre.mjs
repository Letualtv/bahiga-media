// Imágenes de las publicaciones de LinkedIn de finales de noviembre y diciembre de 2026 (estilo «pantalla anotada»).
// Los negocios que salen son inventados y van marcados como ejemplo.
// Uso: node motion/anotado/li-diciembre.mjs [pieza]  →  media/linkedin/li-<pieza>.jpg
import { movil, render, RAIZ, ESTADO, OK } from './piezas.mjs';
import { real, img, SECTORES, CSS_REAL } from './real.mjs';
import fs from 'node:fs';

const filas = (xs) => xs.map(([d, h]) => `<div><span>${d}</span><b class="${h === 'Cerrado' ? 'cer' : ''}">${h}</b></div>`).join('');

// Pantalla de WhatsApp vista por el cliente: escribe en Nochebuena y le contesta el mensaje de ausencia.
const WA = `<div class="w wa">${ESTADO()}
  <div class="wa-cab"><i class="wa-av">FA</i><div><b>Flores Azahar</b><span>Cuenta de empresa</span></div></div>
  <div class="wa-chat"><em>Jueves, 24 de diciembre</em>
    <p class="yo">Hola, ¿mañana abrís? Quería un centro para la comida.<small>20:14 ✓✓</small></p>
    <p class="el">Hola, gracias por escribir. Cerramos del 24 al 27 de diciembre. Te contestamos el lunes 28 a primera hora. Si es para un encargo del 28, déjanos aquí lo que necesitas. Felices fiestas.<small>20:14</small></p>
  </div>
  <div class="wa-pie"><span>Mensaje</span><i></i></div></div>`;

const PIEZAS = {
  'ultimo-dia': { cls: 'portada', fantasma: '30', t: 'Hoy acaba *el Black Friday.*',
    cuerpo: `${movil(real('peluqueria'), { cls: 'real m-ult' })}<div class="chip nuevo"><b>${OK}</b>Nueva muestra: peluquería</div>
      <div class="oferta">Solo hoy, 30 de noviembre<b>3 meses de mantenimiento gratis</b><em>Webs por sector desde 390 € + IVA.</em></div>` },
  festivos: { cls: 'chica', t: '¿Abres el 8 de diciembre? *Díselo a Google.*',
    cuerpo: `<div class="gcard"><div class="g-cab"><i></i><div><b>Mercería Hilo y Aguja</b><span>Mercería en Lucena</span></div></div>
      <h5>Horario especial</h5><div class="g-filas">${filas([['Martes, 8 de diciembre', 'Cerrado'], ['Jueves, 24 de diciembre', '10:00–14:00'], ['Viernes, 25 de diciembre', 'Cerrado'], ['Jueves, 31 de diciembre', '10:00–14:00'], ['Viernes, 1 de enero', 'Cerrado'], ['Miércoles, 6 de enero', 'Cerrado']])}</div></div>
      <div class="ruta">Editar perfil › Horario › Horario especial</div><div class="ej">Ejemplo, negocio inventado</div>` },
  quince: { cls: 'chica', t: 'Quince webs. *Cada una se vende una vez.*',
    cuerpo: `<div class="rejilla">${SECTORES.map(([s, n]) => `<div><i style="background-image:url(${img(s)})"></i><span>${n}</span></div>`).join('')}</div>` },
  ausencia: { cls: 'chica', t: 'Cerrado por fiestas. *Que conteste tu WhatsApp.*', n: 'Mensaje de ausencia de WhatsApp Business, programado solo para esos días.',
    cuerpo: `${movil(WA, { cls: 'm-wa' })}<div class="chip auto"><b>${OK}</b>Sale solo</div><div class="ej izq">Ejemplo, negocio inventado</div>` },
  resenas: { cls: 'chica', t: 'Quien te busca *lee cómo contestas.*',
    cuerpo: `<div class="gcard res"><div class="g-cab"><i class="m av">M</i><div><b>María G.</b><span><u>★★</u><s>★★★</s> · hace 2 días</span></div></div>
      <p class="rs">Me dijeron que el mueble estaría el jueves y llegó el sábado. El trabajo, bien, pero nadie me avisó del retraso.</p>
      <div class="resp"><small>Respuesta del propietario · hace 1 día</small><p>Hola, María. Tienes razón: te dijimos el jueves y no te avisamos del cambio. Desde esta semana mandamos un mensaje en cuanto se mueve una fecha. Gracias por decirlo.</p></div></div>
      <div class="g-neg">Carpintería Los Olmos · Cabra</div><div class="ej">Ejemplo, negocio inventado</div>` },
  vacaciones: { cls: 'chica', t: 'Antes de cerrar, *cinco minutos a tu web.*',
    cuerpo: `<div class="lista">${['Horario de festivos en Google', 'Aviso arriba en la web con los días que cierras', 'Mensaje de ausencia en WhatsApp', 'Una copia de seguridad reciente', 'Prueba el botón de llamar y el formulario'].map((x, i) => `<div><b>${i + 1}</b>${x}</div>`).join('')}</div>
      <div class="chip ojo"><b>!</b>La 5 es la que más se olvida</div>` },
  balance: { cls: 'chica', fantasma: '8', t: 'Ocho meses *de autónomo.*',
    cuerpo: `<div class="tl">${[['Mayo', 'Me doy de alta como autónomo.'], ['Octubre', 'Archivo el SaaS y lanzo Habitual.'], ['Noviembre', 'Quince webs de muestra, una por sector.'], ['2027', 'Más negocios de Córdoba con Bahiga.']].map(([m, x], i, a) => `<div class="${i === a.length - 1 ? 'ya' : ''}"><small>${m}</small><b>${x}</b></div>`).join('')}</div>` },
};

const EXTRA = `${CSS_REAL}
.pg{display:none}
.chica .t{top:176px;font-size:92px;right:90px}
.chip svg,.lista svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.ej{position:absolute;right:80px;bottom:56px;font-family:M;font-size:19px;letter-spacing:1px;color:#A9B4BA;z-index:20}.ej.izq{right:auto;left:80px;bottom:110px}
/* último día */
.m-ult{left:470px;top:470px;transform:rotate(-6deg)}
.chip.nuevo{left:80px;top:470px;z-index:14;font-size:30px;padding:12px 30px 12px 12px;transform:rotate(-2deg)}.chip.nuevo b{background:#2E7D4F}
.oferta{position:absolute;left:60px;top:1010px;width:560px;z-index:20;background:#E8683C;color:#0F1C24;border-radius:26px;padding:20px 32px 24px;transform:rotate(-3deg);box-shadow:0 26px 56px rgba(0,0,0,.55);font-family:M;font-size:20px;letter-spacing:3px;text-transform:uppercase}
.oferta b{display:block;font:normal 46px/1.05 D;letter-spacing:-1px;text-transform:none;margin-top:8px}.oferta em{display:block;font:normal 24px/1.3 U;letter-spacing:0;text-transform:none;margin-top:10px}
/* tarjeta de Google */
.gcard{position:absolute;left:90px;right:90px;top:480px;background:#fff;color:#202124;border-radius:30px;padding:36px 44px 26px;z-index:10;transform:rotate(-1.5deg);box-shadow:0 40px 80px rgba(0,0,0,.55);font-family:Arial,sans-serif}
.g-cab{display:flex;gap:20px;align-items:center}.g-cab i{width:64px;height:64px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#EA4335;flex:none;margin:0 6px}.g-cab b{display:block;font-size:36px;font-weight:400}.g-cab span{font-size:25px;color:#70757A}
.gcard h5{margin:28px 0 6px;font-size:28px;font-weight:700;color:#202124}
.g-filas div{display:flex;justify-content:space-between;padding:15px 0;border-bottom:1px solid #E8EAED;font-size:29px}.g-filas div:last-child{border:0}.g-filas b{font-weight:400}.g-filas b.cer{color:#C5221F}
.ruta{position:absolute;left:80px;top:1120px;font-family:M;font-size:22px;color:#F0A07E;background:#14242E;border:1px solid #2F4553;padding:10px 18px;border-radius:999px;z-index:12}
.chica .ruta+.ej{bottom:56px}
/* rejilla de muestras */
.rejilla{position:absolute;left:70px;right:70px;top:440px;display:grid;grid-template-columns:repeat(5,1fr);gap:18px 16px;z-index:10}
.rejilla i{display:block;height:214px;border-radius:20px;border:5px solid #05070A;background:#fff top/cover no-repeat;box-shadow:0 16px 34px rgba(0,0,0,.45)}.rejilla span{display:block;font:normal 18px/1.2 U6;text-align:center;margin-top:9px;color:#D9DEE2}
/* WhatsApp */
.chica .n{width:360px}
.m-wa{left:470px;top:480px;transform:rotate(3deg)}
.wa{font-family:U,system-ui,sans-serif;background:#EFEAE2;min-height:812px;position:relative}
.wa-cab{display:flex;gap:10px;align-items:center;background:#fff;padding:8px 14px 10px;border-bottom:1px solid #E0DDD6}.wa-av{width:38px;height:38px;border-radius:50%;background:#C4577A;color:#fff;display:grid;place-items:center;font:normal 14px U6}
.wa-cab b{display:block;font-family:U6;font-size:15px;color:#111B21}.wa-cab span{font-size:11px;color:#667781}
.wa-chat{padding:14px 12px}.wa-chat em{display:block;width:max-content;margin:4px auto 14px;font-style:normal;font-size:11px;background:#fff;color:#54656F;padding:5px 10px;border-radius:8px}
.wa-chat p{margin:0 0 10px;font-size:14px;line-height:1.38;padding:8px 10px 18px;border-radius:10px;position:relative;max-width:84%;color:#111B21;box-shadow:0 1px 0 rgba(0,0,0,.08)}
.wa-chat p small{position:absolute;right:9px;bottom:4px;font-size:10px;color:#667781}
.wa-chat .yo{margin-left:auto;background:#D9FDD3}.wa-chat .el{background:#fff}
.wa-pie{position:absolute;left:10px;right:10px;bottom:96px;display:flex;gap:8px;align-items:center}.wa-pie span{flex:1;background:#fff;border-radius:22px;padding:11px 16px;font-size:14px;color:#8696A0}.wa-pie i{width:40px;height:40px;border-radius:50%;background:#00A884}
.chip.auto{left:330px;top:1000px;z-index:14;font-size:30px;padding:12px 30px 12px 12px;transform:rotate(-3deg)}.chip.auto b{background:#2E7D4F}
/* reseña */
.gcard.res{top:520px}.res .g-cab i.m{position:static;left:auto;top:auto;transform:none;margin:0;border-radius:50%;background:#7B61A8;color:#fff;display:grid;place-items:center;font:normal 30px Arial,sans-serif}
.res .g-cab span u{text-decoration:none;color:#F4B400}.res .g-cab span s{text-decoration:none;color:#DADCE0}
.rs{margin:22px 0 0;font-size:29px;line-height:1.4;color:#3C4043}
.resp{margin-top:26px;background:#F1F3F4;border-radius:18px;padding:22px 26px;border-left:8px solid #E8683C}.resp small{display:block;font-size:22px;color:#5F6368;margin-bottom:10px}.resp p{margin:0;font-size:28px;line-height:1.4;color:#202124}
.g-neg{position:absolute;left:80px;bottom:110px;font-family:M;font-size:22px;color:#F0A07E;z-index:12}
/* lista */
.lista{position:absolute;left:80px;right:80px;top:560px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:16px 40px;z-index:10;transform:rotate(-2deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}
.lista div{display:flex;gap:22px;align-items:center;font-size:33px;line-height:1.2;padding:22px 0;border-bottom:2px solid #E6E0D6}.lista div:last-child{border:0}
.lista b{width:52px;height:52px;border-radius:50%;background:#0F1C24;color:#FAF8F5;font:normal 26px DI;display:grid;place-items:center;flex:none}.lista div:last-child b{background:#E8683C}
.chip.ojo{left:440px;top:1150px;z-index:14;font-size:28px;padding:12px 30px 12px 12px;transform:rotate(3deg)}.chip.ojo b{font-family:U6}
/* línea de tiempo */
.tl{position:absolute;left:90px;right:80px;top:500px;z-index:10;border-left:4px solid #2A3A45;padding-left:56px}
.tl div{position:relative;padding:0 0 54px}.tl div:last-child{padding:0}.tl div:before{content:"";position:absolute;left:-70px;top:12px;width:24px;height:24px;border-radius:50%;background:#FAF8F5}
.tl div.ya:before{background:#E8683C;box-shadow:0 0 0 8px rgba(232,104,60,.3)}
.tl small{display:block;font-family:M;font-size:24px;letter-spacing:3px;text-transform:uppercase;color:#F0A07E}.tl b{display:block;font:normal 52px/1.08 D;letter-spacing:-1px;margin-top:8px;font-weight:400}.tl .ya b{color:#E8683C;font-family:DI}
`;

const quiero = process.argv[2];
fs.mkdirSync(`${RAIZ}media/linkedin`, { recursive: true });
for (const [id, s] of Object.entries(PIEZAS)) {
  if (quiero && quiero !== id) continue;
  await render(`li-${id}`, [s], EXTRA);
  fs.renameSync(`${RAIZ}media/li-${id}-1.jpg`, `${RAIZ}media/linkedin/li-${id}.jpg`);
}
