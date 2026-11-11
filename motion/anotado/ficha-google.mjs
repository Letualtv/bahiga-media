// Carrusel «Tu ficha de Google» con el estilo «pantalla anotada».
// Uso: node motion/anotado/ficha-google.mjs [negocio]  →  media/1120-ficha-google-1.jpg … -7.jpg
import { movil, render, OK, NO } from './piezas.mjs';
import { NEGOCIOS, con, CSS_NEG } from './negocios.mjs';
import { ficha, CSS_FICHA } from './ficha.mjs';
const NEG = process.argv[2] || 'barberia', N = NEGOCIOS[NEG];
const pm = (o = {}, f = {}) => movil(ficha(NEG, f), { url: 'Resultado de la búsqueda', ...o });
const dia = (d, h, cls = '') => `<div class="${cls}"><span>${d}</span><b>${h}</b></div>`;

const L = [
  { cls: 'portada', fantasma: 'G', t: '¿Qué ve quien te busca *en Google?*',
    cuerpo: `${pm({ cls: 'm-portada' })}<div class="chip pl p1"><b>${OK}</b>Fotos</div><div class="chip pl p2"><b>${OK}</b>Horario al día</div><div class="chip pl p3"><b>${OK}</b>Reseñas contestadas</div>
      <div class="aviso">Ficha de ejemplo,<br>negocio inventado.</div><div class="dz">Desliza →</div>` },
  { fantasma: '?', t: 'Así está *casi siempre.*', n: 'Nadie la ha tocado desde que apareció sola.',
    cuerpo: `${pm({ cls: 'm-der', y: -20 }, { mala: true })}<div class="chip mal x1"><b>${NO}</b>Sin fotos</div><div class="chip mal x2"><b>${NO}</b>Sin horario</div><div class="chip mal x3"><b>${NO}</b>Sin web</div><div class="chip mal x4"><b>${NO}</b>Reseñas sin contestar</div>` },
  { fantasma: '01', num: '01', t: 'Fotos *de verdad.*', n: 'El local, el trabajo y quién atiende. Es lo primero que se mira.',
    cuerpo: `${con(NEG, '<div class="a"></div><div class="b"></div><div class="c"></div>', 'tira')}<div class="chip suelto f1">Súbelas tú: las del móvil valen</div>` },
  { fantasma: '02', num: '02', t: 'Horario *al día.*', n: 'También en festivos y en fiestas.',
    cuerpo: `<div class="horas"><small>Horario</small>${dia('Lunes', 'Cerrado')}${dia('Martes a viernes', N.horario.split(' · ')[1])}${dia('Sábado', '9:30–14:00')}${dia('Fiestas del pueblo', 'Horario especial', 'fest')}</div>
      <div class="chip suelto h1"><b>${OK}</b>Actualizado esta semana</div>` },
  { fantasma: '03', num: '03', t: 'Reseñas *contestadas.*', n: 'Todas, también las malas. Quien te busca lee la respuesta.',
    cuerpo: `<div class="res r1"><i>J</i><span><b>Javier R.</b><u>★★☆☆☆</u>Llamé dos veces y no cogieron.</span></div>
      <div class="resp">Respuesta del propietario<b>Lo sentimos, Javier. Los lunes cerramos; ya lo hemos puesto en la ficha. Escríbenos por WhatsApp y te guardamos hora.</b></div>` },
  { fantasma: '04', num: '04', t: 'Y un sitio *adonde ir.*', n: 'El botón «Sitio web» tiene que llevar a tu página.',
    cuerpo: `${pm({ cls: 'm-der ir-botones' })}<div class="boton-web">Sitio web</div><div class="chip suelto w1">${N.dominio}</div>` },
  { cls: 'coral', fantasma: '?', t: '¿Miramos *la tuya?*',
    cuerpo: `<div class="gs">Escribe GOOGLE en comentarios y repasamos tu ficha contigo: qué falta y qué sobra.</div><div class="gu">Ficha de ejemplo con un negocio inventado.</div><div class="cta">Comenta GOOGLE</div>` },
];
const EXTRA = `
.m-portada{left:500px;top:500px;transform:rotate(-7deg)}
.chip svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.chip.pl{font-size:30px;padding:12px 30px 12px 12px;z-index:14}.chip.pl b{background:#2E7D4F}.p1{left:300px;top:690px;transform:rotate(3deg)}.p2{left:560px;top:960px;transform:rotate(-3deg)}.p3{left:330px;top:1150px;transform:rotate(2deg)}
.chip.mal{font-size:30px;padding:12px 30px 12px 12px;z-index:14}.chip.mal b{background:#E8683C}.x1{left:70px;top:700px;transform:rotate(-3deg)}.x2{left:130px;top:830px;transform:rotate(2deg)}.x3{left:60px;top:960px;transform:rotate(-2deg)}.x4{left:100px;top:1090px;transform:rotate(3deg)}
.tira{position:absolute;left:80px;right:80px;top:660px;height:480px;display:grid;grid-template-columns:1.5fr 1fr;grid-template-rows:1fr 1fr;gap:14px;z-index:10;transform:rotate(-2deg)}.tira div{border-radius:26px;background:var(--foto) center/cover;box-shadow:0 30px 60px rgba(0,0,0,.5)}.tira .a{grid-row:1/3}.tira .b{background-size:240%;background-position:80% 30%}.tira .c{background-size:240%;background-position:25% 80%}
.chip.suelto.f1{left:auto;right:70px;top:1150px;transform:rotate(2deg);font-size:28px}
.horas{position:absolute;left:80px;right:80px;top:650px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:30px 40px 14px;z-index:10;transform:rotate(-2deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}.horas small{font-family:M;font-size:20px;letter-spacing:2px;text-transform:uppercase;color:#8A8F93}
.horas div{display:flex;justify-content:space-between;align-items:center;padding:20px 0;border-bottom:2px solid #E6E0D6;font-size:34px}.horas div:last-child{border:0}.horas b{font-family:D;font-weight:400;font-size:38px}.horas .fest{color:#B4532E}.horas .fest b{color:#E8683C}
.chip.suelto.h1{left:auto;right:70px;top:1140px;transform:rotate(3deg);font-size:28px;padding:12px 28px 12px 12px}.chip.suelto.h1 b{background:#2E7D4F}
.res{position:absolute;left:80px;top:640px;width:760px;display:flex;gap:22px;background:#FAF8F5;color:#0F1C24;border-radius:30px;padding:30px 34px;z-index:10;transform:rotate(-2deg);box-shadow:0 30px 60px rgba(0,0,0,.5)}.res i{width:70px;height:70px;border-radius:50%;background:#E3E6E9;font:normal 30px U6;display:grid;place-items:center;flex:none}.res span{font-size:32px;line-height:1.3}.res b{display:block}.res u{display:block;text-decoration:none;color:#E0A23A;font-size:26px;letter-spacing:2px}
.resp{position:absolute;left:200px;right:70px;top:890px;background:#14242E;border:2px solid #2F4553;border-left:8px solid #2E9E5B;border-radius:8px 30px 30px 8px;padding:28px 34px;z-index:12;transform:rotate(2deg);font-family:M;font-size:20px;letter-spacing:2px;text-transform:uppercase;color:#7FD3A2;box-shadow:0 30px 60px rgba(0,0,0,.5)}.resp b{display:block;font:normal 32px/1.3 U6;letter-spacing:0;text-transform:none;color:#FAF8F5;margin-top:10px}
.boton-web{position:absolute;left:80px;top:720px;z-index:14;font:normal 58px U6;padding:38px 60px;border-radius:999px;background:#FAF8F5;color:#0F1C24;transform:rotate(-3deg);box-shadow:0 34px 70px rgba(0,0,0,.5);border:6px solid #E8683C}
.chip.suelto.w1{left:110px;top:930px;transform:rotate(2deg);font-family:M;font-size:26px}
`;
await render('1120-ficha-google', L, CSS_NEG + CSS_FICHA + EXTRA);
