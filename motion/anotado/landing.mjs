// Carrusel «Landing desde 390 €» con el estilo «pantalla anotada».
// La web del móvil es un negocio inventado (La Miga) y va etiquetada como ejemplo.
// Uso: node motion/anotado/landing.mjs  →  media/landing-390-1.jpg … -8.jpg
import { mkdirSync } from 'node:fs';
import { chromium, RAIZ, arco, co, CSS, ESTADO, PAN, movil } from './piezas.mjs';
const ID = 'landing-390';

const prod = (n, d, pos) => `<div class="l-p"><i style="background-position:${pos}"></i><b>${n}</b><span>${d}</span></div>`;
export const LANDING = `
<div class="w bien">
  <div class="b-hero">${ESTADO('#fff')}
    <div class="b-cab"><span>La Miga</span><em>● Abierto · cierra 14:00</em></div>
    <b>Pan de horno de leña en Priego</b><p>Abrimos a las 7:00. Encargos por WhatsApp.</p>
    <div class="b-bot"><a class="pri">Llamar</a><a>WhatsApp</a></div>
  </div>
  <div class="b-fila"><div><b>Horario</b><span>L–S · 7:00–14:00</span></div><div><b>Dónde</b><span>C/ Ejemplo, 12</span></div></div>
  <div class="l-sec" id="escaparate"><small>Nuestro pan</small><h3>Lo que sale del horno cada día</h3>
    <div class="l-grid">${prod('Hogaza de masa madre', 'Cada día', '20% 60%')}${prod('Pan de pueblo', 'Cada día', '70% 40%')}${prod('Roscos y dulces', 'Viernes y sábado', '45% 85%')}${prod('Encargos', 'Con un día de antelación', '85% 75%')}</div></div>
  <div class="l-sec" id="resenas"><small>Opiniones</small><div class="b-res" style="margin:8px 0 0"><b>4,8</b><span><u>★★★★★</u>132 reseñas en Google</span></div>
    <div class="l-op">«El mejor pan de la zona. Encargo por WhatsApp y lo tengo listo.»<em>Reseña de ejemplo</em></div></div>
  <div class="l-sec" id="donde"><small>Dónde estamos</small><div class="l-mapa"><i></i><i></i><i></i><i></i><u></u></div><p class="l-dir">C/ Ejemplo, 12 · Priego de Córdoba<br>Lunes a sábado, de 7:00 a 14:00</p></div>
  <div class="l-sec l-cont" id="contacto"><h3>¿Un encargo?</h3><a class="pri">Llamar ahora</a><a>Escribir por WhatsApp</a><p>Aviso legal · Privacidad · Cookies</p></div>
</div>`;
const pm = (o = {}) => movil(LANDING, { ...o });
const ok = `<svg viewBox="0 0 24 24"><path d="M5.5 12.5l4.2 4.2L18.5 8"/></svg>`;

const L = [
  { cls: 'portada', fantasma: '1', t: 'Tu negocio, en una página. *Desde 390 €.*',
    cuerpo: `${pm({ cls: 'm-portada' })}<div class="chips"><div class="chip pl p1">Tu escaparate</div><div class="chip pl p2">Llamar y WhatsApp</div><div class="chip pl p3">Lista para Google</div></div>
      <div class="aviso">Web de ejemplo,<br>negocio inventado.</div><div class="dz">Desliza →</div>` },
  { fantasma: '1', t: 'Una sola página. *Todo lo tuyo.*', n: 'Quién eres, qué haces, dónde estás y cómo llamarte. Sin menús ni vueltas.',
    cuerpo: `${pm({ cls: 'm-der', y: -30 })}<div class="partes">${['Portada', 'Escaparate', 'Opiniones', 'Dónde y horario', 'Contacto'].map((x, i) => `<div class="chip pt"><b>${i + 1}</b>${x}</div>`).join('')}</div>` },
  { fantasma: '01', num: '01', t: 'Tu *escaparate.*', n: 'Lo que vendes o haces, con fotos y dicho claro.',
    cuerpo: `${pm({ cls: 'm-der ir-escaparate' })}<div class="zoom">${prod('Hogaza de masa madre', 'Cada día', '20% 60%')}${prod('Roscos y dulces', 'Viernes y sábado', '45% 85%')}</div>` },
  { fantasma: '02', num: '02', t: 'Que te *llamen.*', n: 'A un toque, con tu horario y cómo llegar.',
    cuerpo: `<div class="bot b-ll">Llamar</div><div class="bot b-wa">WhatsApp</div>
      <div class="tarjeta th"><small>Horario</small><b>L–S · 7:00–14:00</b><em>● Abierto ahora</em></div>
      <div class="tarjeta tm"><div class="l-mapa"><i></i><i></i><i></i><i></i><u></u></div><b>C/ Ejemplo, 12</b></div>` },
  { fantasma: '03', num: '03', t: 'Que te *encuentren.*', n: 'El SEO va hecho desde el primer día.',
    cuerpo: `<div class="busca"><div class="caja"><i></i>panadería en priego</div>
        <div class="resu"><small>panaderialamiga.example</small><b>La Miga · Pan de horno de leña en Priego</b><p><u>★★★★★</u> 4,8 · Abierto · cierra 14:00</p><span>Abrimos a las 7:00. Encargos por WhatsApp. C/ Ejemplo, 12.</span></div></div>
      <div class="seo">${['Títulos y textos', 'Datos para Google', 'Carga rápida', 'Ficha de Google'].map((x) => `<div class="chip sg"><b>${ok}</b>${x}</div>`).join('')}</div>
      <div class="nota">Búsqueda de ejemplo. Te dejamos tu web lista para competir.</div>` },
  { fantasma: '04', num: '04', t: 'Y no se queda *abandonada.*', n: 'Cada mes nos ocupamos nosotros.',
    cuerpo: `<div class="lista">${['Alojamiento en nuestro servidor', 'Copias de seguridad', 'Media hora de cambios: textos, fotos, horarios', 'Tu panel con las visitas y los contactos', 'Informe cada mes'].map((x) => `<div><b>${ok}</b>${x}</div>`).join('')}</div>
      <div class="chip suelto mes"><b>30</b>€ al mes · sin permanencia</div>` },
  { fantasma: '€', t: 'Lo que *cuesta.*',
    cuerpo: `<div class="precio p-a"><b>390 €</b><span>La landing, hecha y publicada.<br>Dominio del primer año incluido.</span><small>Desde</small></div>
      <div class="precio p-b"><b>30 €<i>/mes</i></b><span>Alojamiento y mantenimiento.<br>Los dos primeros meses, gratis.</span></div>
      <div class="nota n7">Precios sin IVA. Sin permanencia. «Desde» porque depende de las secciones que necesites.</div>` },
  { cls: 'coral', fantasma: '?', t: '¿Te la *enseñamos?*',
    cuerpo: `<div class="gs">Escribe LANDING en comentarios y te mandamos un ejemplo pensado para tu tipo de negocio.</div><div class="gu">390 € + 30 €/mes, sin IVA.</div><div class="cta">Comenta LANDING</div>` },
];

const EXTRA = `
.l-sec{padding:22px 16px 0}.l-sec small{display:block;font-family:U6;font-size:10.5px;color:#9A866F;text-transform:uppercase;letter-spacing:.8px}.l-sec h3{margin:4px 0 12px;font-family:D;font-weight:400;font-size:25px;line-height:1.05;letter-spacing:-.5px}
.l-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.l-p{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 0 #EADFCF;padding-bottom:10px}.l-p i{display:block;height:96px;background:${PAN} center/260%}.l-p b{display:block;font-family:U6;font-weight:400;font-size:13px;padding:9px 11px 0;color:#2B1D12}.l-p span{display:block;font-size:11px;color:#6B5A4A;padding:1px 11px 0}
.l-op{margin-top:8px;background:#fff;border-radius:14px;padding:13px;font-size:13px;line-height:1.4;box-shadow:0 1px 0 #EADFCF}.l-op em{display:block;font-style:normal;font-size:10.5px;color:#9A866F;margin-top:6px}
.l-mapa{position:relative;height:150px;margin-top:8px;border-radius:14px;overflow:hidden;background:#E9E2D3}.l-mapa i{position:absolute;background:#fff;height:9px;width:140%;left:-20%}.l-mapa i:nth-child(1){top:34px;transform:rotate(-8deg)}.l-mapa i:nth-child(2){top:98px;transform:rotate(5deg)}.l-mapa i:nth-child(3){top:60px;transform:rotate(72deg);height:7px}.l-mapa i:nth-child(4){top:70px;transform:rotate(-58deg);height:7px;left:10%}
.l-mapa u{position:absolute;left:54%;top:36px;width:30px;height:30px;border-radius:50% 50% 50% 0;background:#E8683C;transform:rotate(-45deg);box-shadow:0 6px 12px rgba(0,0,0,.25)}.l-mapa u:after{content:"";position:absolute;inset:9px;border-radius:50%;background:#fff}
.l-dir{font-size:12.5px;line-height:1.5;color:#6B5A4A;margin:10px 0 0}
.l-cont{background:#2B1D12;color:#fff;margin-top:24px;padding:24px 16px 26px}.l-cont h3{font-size:30px;margin:0 0 14px}.l-cont a{display:block;text-align:center;padding:13px 0;border-radius:12px;border:1.5px solid rgba(255,255,255,.6);font-family:U6;font-size:15px;margin-top:8px}.l-cont a.pri{background:#E9B872;color:#2B1D12;border-color:#E9B872}.l-cont p{font-size:10px;opacity:.6;text-align:center;margin:16px 0 0}
.m-portada{left:520px;top:500px;transform:rotate(-7deg)}
.chip.pl{font-size:30px;padding:16px 30px}.p1{left:340px;top:700px;transform:rotate(3deg)}.p2{left:560px;top:1010px;transform:rotate(-3deg)}.p3{left:330px;top:1150px;transform:rotate(2deg)}
.partes{position:absolute;left:80px;top:700px;display:grid;gap:18px;z-index:14;justify-items:start}.chip.pt{position:static;font-size:30px;padding:12px 30px 12px 12px}.chip.pt b{color:#FAF8F5;font-family:U6;font-size:22px}.chip.pt:nth-child(odd){transform:rotate(-2deg)}.chip.pt:nth-child(even){transform:translateX(34px) rotate(2deg)}
.zoom{position:absolute;left:70px;top:660px;width:440px;display:grid;gap:22px;z-index:14}.zoom .l-p{border-radius:30px;box-shadow:0 30px 60px rgba(0,0,0,.5);padding-bottom:22px}.zoom .l-p:first-child{transform:rotate(-3deg)}.zoom .l-p:last-child{transform:translateX(40px) rotate(2deg)}.zoom .l-p i{height:190px}.zoom .l-p b{font-size:30px;padding:18px 24px 0}.zoom .l-p span{font:normal 22px U;padding:4px 24px 0}
.bot{position:absolute;z-index:10;font:normal 62px U6;padding:44px 0;width:520px;text-align:center;border-radius:36px;box-shadow:0 34px 70px rgba(0,0,0,.5)}.b-ll{left:80px;top:690px;background:#E9B872;color:#2B1D12;transform:rotate(-3deg)}.b-wa{left:470px;top:850px;background:#FAF8F5;color:#0F1C24;transform:rotate(2deg)}
.tarjeta{position:absolute;z-index:9;background:#FAF8F5;color:#0F1C24;border-radius:30px;padding:28px 30px;box-shadow:0 30px 60px rgba(0,0,0,.45)}.tarjeta small{display:block;font-family:M;font-size:19px;letter-spacing:2px;text-transform:uppercase;color:#8A8F93}.tarjeta b{display:block;font-family:D;font-weight:400;font-size:44px;letter-spacing:-1px;margin-top:6px}.tarjeta em{font-style:normal;font-size:24px;color:#2E7D4F}
.th{left:80px;top:1040px;width:430px;transform:rotate(2deg)}.tm{left:560px;top:1020px;width:440px;padding:16px 16px 22px;transform:rotate(-3deg)}.tm .l-mapa{height:170px;margin:0;border-radius:20px}.tm b{font-size:34px;padding:12px 12px 0}
.busca{position:absolute;left:80px;right:80px;top:600px;z-index:10;transform:rotate(-2deg)}.caja{background:#FAF8F5;color:#0F1C24;border-radius:999px;padding:22px 34px;font-size:34px;display:flex;gap:18px;align-items:center;box-shadow:0 20px 44px rgba(0,0,0,.45)}.caja i{width:30px;height:30px;border:4px solid #8A8F93;border-radius:50%;position:relative;flex:none}.caja i:after{content:"";position:absolute;right:-12px;bottom:-9px;width:14px;height:4px;background:#8A8F93;transform:rotate(45deg);border-radius:2px}
.resu{margin-top:22px;background:#fff;color:#0F1C24;border-radius:30px;padding:34px 38px;box-shadow:0 30px 60px rgba(0,0,0,.5)}.resu small{font-family:M;font-size:20px;color:#6B747C}.resu b{display:block;font-family:U6;font-weight:400;font-size:40px;line-height:1.15;color:#1A4FA0;margin:8px 0 10px}.resu p{margin:0;font-size:25px;color:#4A5560}.resu u{text-decoration:none;color:#E0A23A;letter-spacing:2px}.resu span{display:block;font:normal 25px/1.4 U;color:#4A5560;margin-top:8px}
.seo{position:absolute;left:80px;right:60px;top:1010px;display:flex;flex-wrap:wrap;gap:16px;z-index:12}.chip.sg{position:static;font-size:28px}.chip.sg b{background:#2E7D4F}.chip svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.nota{position:absolute;left:80px;right:120px;bottom:110px;font-family:M;font-size:20px;line-height:1.5;color:#A9B4BA;z-index:12}
.lista{position:absolute;left:80px;right:80px;top:600px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:22px 40px;z-index:10;transform:rotate(-2deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}.lista div{display:flex;gap:22px;align-items:center;font-size:36px;padding:22px 0;border-bottom:2px solid #E6E0D6}.lista div:last-child{border:0}.lista b{width:50px;height:50px;border-radius:50%;background:#2E7D4F;display:grid;place-items:center;flex:none}.lista svg{width:30px;height:30px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.chip.suelto.mes{left:auto;right:70px;top:1150px;transform:rotate(3deg);font-size:32px;padding:14px 32px 14px 14px}.chip.suelto.mes b{width:64px;height:64px;font-size:34px;color:#FAF8F5}
.precio{position:absolute;z-index:10;border-radius:40px;padding:40px 46px 44px;box-shadow:0 34px 70px rgba(0,0,0,.5)}.precio b{display:block;font-family:D;font-weight:400;line-height:.9;letter-spacing:-6px}.precio span{display:block;font-size:30px;line-height:1.3;margin-top:22px}
.p-a{left:80px;top:470px;width:700px;background:#FAF8F5;color:#0F1C24;transform:rotate(-3deg)}.p-a b{font-size:230px;color:#E8683C}.p-a small{position:absolute;right:44px;top:40px;font-family:M;font-size:24px;letter-spacing:3px;text-transform:uppercase;color:#8A8F93}
.p-b{left:380px;top:890px;width:620px;background:#14242E;border:2px solid #2F4553;color:#FAF8F5;transform:rotate(2deg)}.p-b b{font-size:150px;letter-spacing:-4px}.p-b b i{font-family:DI;font-style:normal;font-size:70px;color:#F0A07E;letter-spacing:-1px}
.n7{bottom:100px;right:300px}
`;
const total = L.length;
const html = (s, i) => `<html><head><style>${CSS}${EXTRA}</style></head><body class="${s.cls || ''}">
  <div class=m>${arco(56, s.cls === 'coral' ? '#0F1C24' : '#FAF8F5')}Bahiga.</div><div class=pg>0${i + 1} / 0${total}</div>
  ${s.fantasma ? `<div class=fan>${s.fantasma}</div>` : ''}${s.num ? `<div class=num>${s.num}</div>` : ''}
  <div class=t>${co(s.t)}</div>${s.n ? `<div class=n>${s.n}</div>` : ''}${s.cuerpo}
  <div class=pie>BAHIGA.ES</div></body></html>`;

mkdirSync(`${RAIZ}media`, { recursive: true });
const b = await chromium.launch();
for (const [i, s] of L.entries()) {
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await pg.setContent(html(s, i)); await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(() => {
    const t = document.querySelector('.t'), n = document.querySelector('.n'); if (t && n) n.style.top = Math.max(470, t.getBoundingClientRect().bottom + 44) + 'px';
    // «ir-<id>» desplaza la web del móvil hasta esa sección.
    for (const m of document.querySelectorAll('.movil')) { const c = [...m.classList].find((x) => x.startsWith('ir-')); if (!c) continue; const d = m.querySelector('#' + c.slice(3)); m.querySelector('.esc').style.top = -(d.offsetTop - 50) * 1.431 + 'px'; }
  });
  await pg.screenshot({ path: `${RAIZ}media/${ID}-${i + 1}.jpg`, type: 'jpeg', quality: 93 });
}
await b.close();
