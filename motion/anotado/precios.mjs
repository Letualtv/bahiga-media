// Carrusel «Cuánto cuesta una web»: las tres opciones y el mantenimiento, con el estilo «pantalla anotada».
// Uso: node motion/anotado/precios.mjs  →  media/precios-web-1.jpg … -6.jpg
import { mkdirSync } from 'node:fs';
import { chromium, RAIZ, arco, co, CSS } from './piezas.mjs';
const ID = 'precios-web';
const ok = `<svg viewBox="0 0 24 24"><path d="M5.5 12.5l4.2 4.2L18.5 8"/></svg>`;
const lista = (xs, cls = '') => `<div class="lista ${cls}">${xs.map((x) => `<div><b>${ok}</b>${x}</div>`).join('')}</div>`;
const precio = (n, sub) => `<div class="pz"><small>Desde</small><b>${n}<i> €</i></b><span>${sub}</span></div>`;
const hoja = (cls, dentro = '') => `<div class="hoja ${cls}"><u></u><s></s><s></s>${dentro}</div>`;

const L = [
  { cls: 'portada', fantasma: '€', t: '¿Cuánto cuesta *una web?*',
    cuerpo: `<div class="fila f1"><b>390 €</b><span>Landing<em>Una página</em></span></div><div class="fila f2"><b>900 €</b><span>Web completa<em>Varias páginas y gestor</em></span></div><div class="fila f3"><b>1.000 €</b><span>Tienda online<em>Catálogo, carrito y pago</em></span></div>
      <div class="aviso">Precios desde, sin IVA.</div><div class="dz">Desliza →</div>` },
  { fantasma: '1', num: '01', t: 'Una *landing.*', n: 'Una sola página, para el negocio que necesita estar en Google y que le llamen.',
    cuerpo: `${precio('390', 'con el dominio del primer año')}${hoja('h-a')}
      ${lista(['Hecha a medida, no plantilla', 'Escaparate, contacto, mapa y horario', 'SEO de base y ficha de Google', 'Los cambios nos los pides a nosotros'])}` },
  { fantasma: '2', num: '02', t: 'Web *completa.*', n: 'Para quien tiene más que contar y quiere cambiarlo por su cuenta.',
    cuerpo: `${precio('900', 'en WordPress, con su servidor')}${hoja('h-b1')}${hoja('h-b2')}${hoja('h-b3')}
      ${lista(['Varias páginas: servicios, equipo, blog', 'Gestor para cambiar tú textos y fotos', 'Servidor propio, copias y seguridad', 'SEO página a página'])}
      <div class="chip suelto pq">Más páginas y un gestor que montar y proteger</div>` },
  { fantasma: '3', num: '03', t: 'Tienda *online.*', n: 'Para vender por la web, no solo enseñar.',
    cuerpo: `${precio('1.000', 'según catálogo y envíos')}${hoja('h-c', '<p></p><p></p><p></p><p></p><em>2</em>')}
      ${lista(['Catálogo con fotos, tallas y existencias', 'Carrito y pago con tarjeta', 'Envíos, impuestos y facturas', 'Avisos de pedido por correo'])}` },
  { fantasma: '30', t: 'Y cada mes, *desde 30 €.*', n: 'El mantenimiento es opcional. Si lo coges, esto es lo mínimo que lleva.',
    cuerpo: `${lista(['Alojamiento en nuestro servidor', 'Copias de seguridad', 'Media hora de cambios al mes', 'Tu panel con las visitas y los contactos', 'Informe cada mes'], 'l5')}
      <div class="chip suelto mes"><b>0</b>permanencia</div>` },
  { cls: 'coral', fantasma: '?', t: '¿Cuál es *la tuya?*',
    cuerpo: `<div class="gs">Escribe WEB en comentarios, cuéntanos qué negocio tienes y te decimos cuál te encaja y cuánto sería.</div><div class="gu">Precios desde, sin IVA.</div><div class="cta">Comenta WEB</div>` },
];

const EXTRA = `
.fila{position:absolute;left:80px;display:flex;align-items:center;gap:34px;background:#FAF8F5;color:#0F1C24;border-radius:36px;padding:26px 44px 28px;box-shadow:0 30px 64px rgba(0,0,0,.5);z-index:10}
.fila b{font-family:D;font-weight:400;font-size:112px;line-height:1;letter-spacing:-4px;color:#E8683C;min-width:330px}.fila span{font-size:38px}.fila em{display:block;font:normal 24px U;color:#6B747C;margin-top:4px}
.f1{top:480px;transform:rotate(-3deg)}.f2{top:700px;left:130px;transform:rotate(2deg)}.f3{top:925px;transform:rotate(-2deg)}.f3 b{min-width:400px}
.pz{position:absolute;left:76px;top:640px;z-index:12}.pz small{display:block;font-family:M;font-size:24px;letter-spacing:3px;text-transform:uppercase;color:#A9B4BA;margin-bottom:6px}
.pz b{display:block;font-family:DI;font-weight:400;font-size:250px;line-height:.82;color:#E8683C;letter-spacing:-9px}.pz b i{font-style:normal;font-size:130px;letter-spacing:0}.pz span{display:block;font-family:M;font-size:22px;letter-spacing:2px;text-transform:uppercase;color:#A9B4BA;margin-top:20px}
.lista{position:absolute;left:80px;right:80px;top:950px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:12px 38px;z-index:14;transform:rotate(-2deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}
.lista div{display:flex;gap:20px;align-items:center;font-size:31px;padding:16px 0;border-bottom:2px solid #E6E0D6}.lista div:last-child{border:0}.lista b{width:44px;height:44px;border-radius:50%;background:#2E7D4F;display:grid;place-items:center;flex:none}.lista svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.lista.l5{top:640px;padding:18px 40px}.lista.l5 div{font-size:36px;padding:21px 0}.lista.l5 b{width:50px;height:50px}
.hoja{position:absolute;width:230px;height:300px;border-radius:22px;background:#14242E;border:2px solid #3A5362;z-index:8;padding:18px;box-shadow:0 24px 50px rgba(0,0,0,.4)}
.hoja u{display:block;height:92px;border-radius:12px;background:linear-gradient(135deg,#E8683C,#F0A07E)}.hoja s{display:block;height:12px;border-radius:6px;background:#3A5362;margin-top:16px}.hoja s+s{width:60%}
.h-a{right:110px;top:600px;transform:rotate(5deg);height:330px}
.h-b1{right:250px;top:620px;transform:rotate(-8deg)}.h-b2{right:150px;top:600px;transform:rotate(1deg)}.h-b3{right:50px;top:625px;transform:rotate(9deg)}.h-b1 u,.h-b3 u{background:#3A5362}
.h-c{right:100px;top:590px;width:270px;height:330px;transform:rotate(4deg);display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:start}.h-c u,.h-c s{display:none}.h-c p{margin:0;height:130px;border-radius:12px;background:#22343F;border-bottom:26px solid #3A5362}.h-c p:first-child{background:linear-gradient(135deg,#E8683C,#F0A07E)}
.h-c em{position:absolute;right:-22px;top:-22px;width:64px;height:64px;border-radius:50%;background:#E8683C;color:#0F1C24;font:normal 30px U6;display:grid;place-items:center;box-shadow:0 10px 24px rgba(0,0,0,.4)}
.chip.suelto.pq{left:auto;right:50px;top:890px;bottom:auto;transform:rotate(2deg);font-size:24px;z-index:16}
.chip.suelto.mes{left:auto;right:70px;top:1170px;transform:rotate(3deg);font-size:32px;padding:14px 32px 14px 14px;z-index:16}.chip.suelto.mes b{width:64px;height:64px;font-size:38px;color:#FAF8F5}
.partida .n,.n{width:420px}
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
  await pg.evaluate(() => { const t = document.querySelector('.t'), n = document.querySelector('.n'); if (t && n) n.style.top = Math.max(430, t.getBoundingClientRect().bottom + 36) + 'px'; });
  await pg.screenshot({ path: `${RAIZ}media/${ID}-${i + 1}.jpg`, type: 'jpeg', quality: 93 });
}
await b.close();
