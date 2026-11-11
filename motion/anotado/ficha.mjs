// Ficha de un negocio en un buscador de mapas, dibujada por nosotros (sin logotipos de terceros),
// para meter dentro del móvil. Dos versiones: la cuidada y la descuidada.
import { ESTADO } from './piezas.mjs';
import { NEGOCIOS, con } from './negocios.mjs';

const pin = `<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/></svg>`;
const reloj = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/></svg>`;
const tel = `<svg viewBox="0 0 24 24"><path d="M6 4h3l1.500 4-2 1.500a11 11 0 0 0 6 6l1.500-2 4 1.500v3c0 1-1 2-2 2C10 20 4 14 4 6c0-1 1-2 2-2z"/></svg>`;
const mundo = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.500"/><path d="M3.500 12h17M12 3.500c3 3 3 14 0 17M12 3.500c-3 3-3 14 0 17"/></svg>`;

export const ficha = (id, { mala = false } = {}) => { const n = NEGOCIOS[id]; const tipo = { taller: 'Taller mecánico', barberia: 'Barbería', ropa: 'Tienda de ropa', fisio: 'Fisioterapeuta', flores: 'Floristería', panaderia: 'Panadería' }[id];
  return con(id, `${ESTADO('#111')}
  <div class="gf-busca"><i></i>${n.busca}</div>
  ${mala ? `<div class="gf-fotos vacia" id="fotos"><div><em>Añadir fotos</em></div></div>` : `<div class="gf-fotos" id="fotos"><div class="a"></div><div class="b"></div><div class="c"><em>+24</em></div></div>`}
  <div class="gf-cab"><h2>${n.nombre}</h2>
    <p class="gf-nota"><b>${mala ? '3,9' : n.nota}</b><u>${mala ? '★★★★☆' : '★★★★★'}</u><span>(${mala ? '7' : n.resenas})</span></p>
    <p class="gf-tipo">${tipo} · ${mala ? '<s>Horario sin confirmar</s>' : `<strong>Abierto</strong> · ${n.estado.split(' · ')[1]}`}</p></div>
  <div class="gf-bot" id="botones"><a class="pri">${tel}Llamar</a><a>${pin}Cómo llegar</a><a class="${mala ? 'off' : 'web'}">${mundo}Sitio web</a></div>
  <div class="gf-filas" id="datos">
    <div>${pin}<span>${n.dir}, ${n.ciudad}</span></div>
    <div id="horario">${reloj}<span>${mala ? '<s>Añadir horario</s>' : `<strong>Abierto</strong> · ${n.horario.split(' · ')[1]}<small>Festivos actualizados</small>`}</span></div>
    <div>${mundo}<span>${mala ? '<s>Añadir sitio web</s>' : n.dominio}</span></div>
  </div>
  ${mala ? `<div class="gf-tuyo">¿Es tuyo este negocio?</div>` : `<div class="gf-nov"><small>Novedades</small><b>${n.sub}</b><span>Publicado esta semana</span></div>`}
  <div class="gf-res" id="resenas"><small>Reseñas</small>
    <div class="gf-r"><i>M</i><span><b>María G.</b><u>★★★★★</u>${n.opinion.replace(/[«»]/g, '')}</span></div>
    ${mala ? `<div class="gf-r"><i>J</i><span><b>Javier R.</b><u>★★☆☆☆</u>Llamé dos veces y no cogieron. En la ficha no pone horario.</span></div><p class="gf-sin">Sin respuesta del propietario</p>`
           : `<div class="gf-resp"><b>Respuesta del propietario</b>Gracias, María. Aquí estamos cuando quieras.</div>`}
  </div>`, 'w gf'); };

export const CSS_FICHA = `
.gf{font-family:U,system-ui,sans-serif;background:#fff;color:#1B1F23;min-height:1150px;padding-bottom:30px}.gf svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.gf-busca{margin:6px 14px 10px;padding:10px 16px;border-radius:999px;background:#F1F3F4;font-size:13.5px;display:flex;gap:10px;align-items:center}.gf-busca i{width:12px;height:12px;border:2px solid #7A8087;border-radius:50%}
.gf-fotos{display:grid;grid-template-columns:2fr 1fr;grid-template-rows:86px 86px;gap:4px;padding:0 14px}.gf-fotos div{border-radius:10px;background:var(--foto) center/cover}.gf-fotos .a{grid-row:1/3;border-radius:14px 4px 4px 14px}.gf-fotos .b{background-size:260%;background-position:80% 30%;border-radius:4px 14px 4px 4px}.gf-fotos .c{background-size:260%;background-position:20% 85%;border-radius:4px 4px 14px 4px;display:grid;place-items:center}
.gf-fotos em{font-style:normal;font-family:U6;font-size:14px;color:#fff;background:rgba(0,0,0,.45);padding:4px 9px;border-radius:999px}
.gf-fotos.vacia{display:block}.gf-fotos.vacia div{height:140px;background:repeating-linear-gradient(135deg,#ECEEF0 0 12px,#E3E6E9 12px 24px);display:grid;place-items:center;border-radius:14px}.gf-fotos.vacia em{background:#fff;color:#5B6670}
.gf-cab{padding:14px 16px 4px}.gf-cab h2{margin:0;font:400 25px/1.1 D;letter-spacing:-.4px}.gf-cab p{margin:5px 0 0;font-size:13px;color:#5B6670}.gf-nota{display:flex;gap:6px;align-items:center}.gf-nota b{font-family:U6;font-weight:400;color:#1B1F23}.gf-nota u{text-decoration:none;color:#E0A23A;letter-spacing:1px}
.gf strong{font-family:U6;font-weight:400;color:#1E7B46}.gf s{text-decoration:none;color:#B4532E}
.gf-bot{display:flex;gap:8px;padding:12px 14px 6px}.gf-bot a{display:flex;gap:6px;align-items:center;padding:9px 13px;border-radius:999px;border:1.5px solid #D5D9DD;font-family:U6;font-size:12.5px;white-space:nowrap}.gf-bot a.pri{background:#1B1F23;color:#fff;border-color:#1B1F23}.gf-bot a.off{color:#B8BDC2;border-style:dashed}
.gf-filas{padding:4px 16px}.gf-filas div{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid #ECEEF0;font-size:13px}.gf-filas svg{color:#5B6670;margin-top:1px}.gf-filas small{display:block;font-size:11px;color:#5B6670}
.gf-nov{margin:12px 14px 0;padding:13px 14px;border-radius:14px;background:#F6F7F8}.gf small{font-family:U6;font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;color:#7A8087}.gf-nov b{display:block;font-family:U6;font-weight:400;font-size:14px;margin:4px 0 2px}.gf-nov span{font-size:11.5px;color:#5B6670}
.gf-tuyo{margin:12px 14px 0;padding:12px 14px;border-radius:14px;border:1.5px dashed #D5D9DD;font-size:13px;color:#5B6670;text-align:center}
.gf-res{padding:16px 16px 0}.gf-r{display:flex;gap:10px;margin-top:10px}.gf-r i{width:32px;height:32px;border-radius:50%;background:#E3E6E9;font:normal 13px U6;display:grid;place-items:center;flex:none}.gf-r span{font-size:12.5px;line-height:1.4;color:#3C4248}.gf-r b{display:block;font-family:U6;font-weight:400;color:#1B1F23}.gf-r u{display:block;text-decoration:none;color:#E0A23A;font-size:11px;letter-spacing:1px}
.gf-resp{margin:8px 0 0 42px;padding:10px 12px;border-left:3px solid #1E7B46;background:#F1F7F3;border-radius:0 10px 10px 0;font-size:12.5px;color:#3C4248}.gf-resp b{display:block;font-family:U6;font-weight:400;font-size:11.5px;color:#1E7B46}
.gf-sin{margin:8px 0 0 42px;font-size:12px;color:#B4532E}
`;
