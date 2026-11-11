// Carrusel «web anotada» de Bahiga (1080x1350): una web de ejemplo dentro de un móvil, con cada
// fallo rodeado y una nota corta. La web es inventada y se dice en la portada.
// Uso: node motion/anotado/render.mjs  →  media/<id>-1.jpg … <id>-N.jpg
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(execSync('npm root -g').toString().trim() + '/playwright')); }

const NOT = new URL('../noticia/', import.meta.url).pathname;
const RAIZ = new URL('../../', import.meta.url).pathname;
const ID = '1118-senales-web';
const f = (n) => `data:font/woff2;base64,${readFileSync(`${NOT}fuentes/${n}.woff2`).toString('base64')}`;
const A = readFileSync(`${NOT}arch.js`, 'utf8');
const VB = JSON.parse(A.match(/ARCH_VB=(\[[^\]]*\])/)[1]);
const PATHS = JSON.parse(A.match(/ARCH=(\[[\s\S]*?\]);?\s*$/m)[1]);
const arco = (h, c) => `<svg viewBox="${VB.join(' ')}" style="height:${h}px;vertical-align:-8px;margin-right:14px">${PATHS.map((d) => `<path fill="${c}" d="${d}"/>`).join('')}</svg>`;

/* ── La web de ejemplo: «mal» (como tantas) y «bien» (arreglada) ── */
const MAL = `
<div class="w mal">
  <div class="w-cab"><span class="w-logo">Panadería La Miga</span><span class="w-menu">≡</span></div>
  <div class="w-hero" data-m="hero"><b>Bienvenidos a nuestra página web</b><span>Desde 1987 trabajando para usted con la mejor calidad y el mejor servicio</span></div>
  <div class="w-txt" data-m="letra"><h4>Quiénes somos</h4><p>Somos una empresa familiar con más de treinta años de experiencia en el sector, comprometida con la excelencia y la satisfacción de nuestros clientes. Nuestra misión es ofrecer productos de primera calidad elaborados con los mejores ingredientes y el máximo cuidado en cada proceso de elaboración artesanal.</p><p>Disponemos de una amplia gama de productos para todos los gustos. Para más información no dude en ponerse en contacto con nosotros a través del formulario.</p></div>
  <div class="w-fotos"><i></i><i></i><i></i></div>
  <div class="w-pie"><p data-m="tel">Tlf: 957 00 00 00 · Fax: 957 00 00 01</p><p data-m="horario">Horario: de lunes a viernes de 9:00 a 14:00</p><p>© 2019 Todos los derechos reservados</p></div>
</div>`;
const CARGA = `<div class="w carga"><div class="w-url">panaderialamiga.example</div><div class="w-giro" data-m="giro"></div><div class="w-seg">6 s…</div></div>`;
const MINI = `<div class="w mini"><div class="mini-in" data-m="mini">${MAL.replace(/data-m="[^"]*"/g, '')}</div></div>`;
const BIEN = `
<div class="w bien">
  <div class="b-cab"><span>La Miga</span><em>Abierto · cierra 14:00</em></div>
  <div class="b-hero"><b>Pan de horno de leña en Priego</b><span>Abrimos a las 7:00. Encargos por WhatsApp.</span>
    <div class="b-bot"><a class="pri">Llamar</a><a>WhatsApp</a></div></div>
  <div class="b-foto"></div>
  <div class="b-fila"><div><b>Horario</b><span>L–S 7:00–14:00</span></div><div><b>Dónde</b><span>C/ Ejemplo, 12</span></div></div>
  <div class="b-res"><b>4,8</b><span>★★★★★ · 132 reseñas en Google</span></div>
</div>`;
const GOOGLE = `<div class="g" data-g><small>Ficha de Google</small><b>Panadería La Miga</b><span>Cerrado · abre a las <u>7:00</u></span></div>`;

/* ── Láminas ── t: titular (con *coral*), n: nota, web, m: qué rodear, y: desplazamiento de la web ── */
const L = [
  { tipo: 'portada', t: '5 señales de que tu web te *cuesta clientes.*', n: 'Web de ejemplo, inventada. Los fallos son los de verdad.', web: MAL, y: -64 },
  { num: '01', t: 'Tarda en *cargar.*', n: 'Pruébala con datos, no con wifi. Si tú esperas, tu cliente se va.', web: CARGA, m: 'giro', y: 0 },
  { num: '02', t: 'No dice *qué haces.*', n: '«Bienvenidos» no vende pan. Qué haces y dónde, en la primera pantalla.', web: MAL, m: 'hero', y: 0 },
  { num: '03', t: 'El teléfono *no se pulsa.*', n: 'Escondido al final y sin enlace. Nadie lo copia a mano.', web: MAL, m: 'tel', y: -150 },
  { num: '04', t: 'Se lee *con lupa.*', n: 'Hecha para ordenador. Tus clientes la abren en el móvil.', web: MINI, m: 'mini', y: 0 },
  { num: '05', t: 'El horario *no coincide.*', n: 'La web dice una cosa y Google otra. El cliente no se fía de ninguna.', web: MAL, m: 'horario', y: -150, google: true },
  { tipo: 'claro', num: '→', t: 'La misma panadería, *arreglada.*', n: 'Qué hace, dónde está y un botón para llamar. Nada más.', web: BIEN, y: 0 },
  { tipo: 'cierre', t: '¿Cuántas tiene *la tuya?*', n: 'Cuenta con Bahiga. La miramos contigo y te decimos qué arreglar primero, sin compromiso.' },
];

const co = (s) => s.replace(/\*(.+?)\*/g, '<i>$1</i>');
const CSS = `
@font-face{font-family:D;src:url(${f('display')})}@font-face{font-family:DI;src:url(${f('display-italic')})}
@font-face{font-family:U6;src:url(${f('ui-600')})}@font-face{font-family:U;src:url(${f('ui')})}@font-face{font-family:M;src:url(${f('mono')})}
*{box-sizing:border-box}body{margin:0;width:1080px;height:1350px;background:#0F1C24;color:#FAF8F5;position:relative;overflow:hidden;font-family:U6}
body.coral{background:#E8683C;color:#0F1C24}
body.claro{background:#FAF8F5;color:#0F1C24}.claro .n{color:#3A4A54}.claro .movil{box-shadow:0 40px 80px rgba(15,28,36,.28),0 0 0 2px #C9CED2}
.m{position:absolute;left:80px;top:70px;font-family:D;font-size:40px;z-index:5}.p{position:absolute;right:80px;top:84px;font-family:M;font-size:22px;letter-spacing:3px;color:#F0A07E;z-index:5}
.coral .p{color:#0F1C24}
.num{position:absolute;left:80px;top:176px;font-family:DI;font-size:60px;color:#E8683C;line-height:1}
.t{position:absolute;left:76px;right:70px;top:246px;font-family:D;font-size:104px;line-height:1;letter-spacing:-2.5px}.t i{font-family:DI;font-style:normal;color:#E8683C}
.portada .t{top:176px;font-size:112px}
.n{position:absolute;left:80px;width:300px;top:640px;font-size:34px;line-height:1.32;z-index:4}
.portada .n{top:auto;bottom:150px;font-family:M;font-size:22px;letter-spacing:1px;line-height:1.5;color:#A9B4BA;width:290px}
.pie{position:absolute;left:80px;bottom:56px;font-family:M;font-size:20px;letter-spacing:3px;opacity:.5;z-index:5}
.dz{position:absolute;left:80px;bottom:96px;font-size:26px;color:#E8683C;z-index:5}
/* móvil */
.movil{position:absolute;left:420px;top:500px;width:590px;height:1220px;border-radius:64px;background:#05090C;padding:16px;box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 2px #2A3A45;transform:rotate(2.2deg);transform-origin:50% 0}
.portada .movil{top:560px;transform:rotate(-3deg)}
.pant{width:100%;height:100%;border-radius:50px;overflow:hidden;background:#fff;position:relative}
.isla{position:absolute;top:14px;left:50%;width:120px;height:30px;margin-left:-60px;border-radius:20px;background:#05090C;z-index:3}
.esc{width:390px;transform-origin:0 0;transform:scale(1.431);position:absolute;left:0;top:0}
/* web mal */
.w{width:390px;min-height:860px;color:#222;font-family:Georgia,serif;background:#fff;padding-top:40px}
.w-cab{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#7A1F1F;color:#FFE9A8;font-size:13px}.w-menu{font-size:20px}
.w-hero{height:210px;background:linear-gradient(135deg,#C9A227,#8B5E1A 60%,#5B3A12);color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 22px;gap:8px}
.w-hero b{font-family:"Comic Sans MS","Trebuchet MS",sans-serif;font-size:25px;line-height:1.15;text-shadow:2px 2px 0 #0006}.w-hero span{font-size:11px;opacity:.9}
.w-txt{padding:14px 14px 4px}.w-txt h4{margin:0 0 6px;font-size:13px;color:#7A1F1F;text-transform:uppercase}.w-txt p{margin:0 0 8px;font-size:9.5px;line-height:1.5;text-align:justify;color:#444}
.w-fotos{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px 14px}.w-fotos i{height:64px;background:repeating-linear-gradient(45deg,#E4DCCB,#E4DCCB 6px,#D8CDB6 6px,#D8CDB6 12px)}
.w-pie{background:#2B2B2B;color:#BDBDBD;padding:14px;margin-top:10px;font-family:Arial,sans-serif}.w-pie p{margin:0 0 7px;font-size:9.5px;width:max-content}
.carga{background:#fff;padding-top:0;height:860px}.w-url{margin:52px 14px 0;padding:8px 12px;border-radius:20px;background:#EEF0F2;font-family:Arial,sans-serif;font-size:12px;color:#555}
.w-giro{width:64px;height:64px;margin:150px auto 18px;border-radius:50%;border:6px solid #E3E6E9;border-top-color:#8A939B}.w-seg{text-align:center;font-family:Arial,sans-serif;font-size:22px;color:#8A939B}
.mini{background:#F4F4F4;height:860px;padding-top:54px}.mini-in{width:390px;transform:scale(.48);transform-origin:50% 0;box-shadow:0 0 0 1px #DDD}.mini-in .w{padding-top:0;min-height:0}
/* web bien */
.bien{font-family:U,system-ui,sans-serif;background:#FBF6EE;color:#2B1D12;padding-top:46px}
.b-cab{display:flex;justify-content:space-between;align-items:center;padding:8px 18px}.b-cab span{font-family:D;font-size:22px}.b-cab em{font-style:normal;font-size:11px;color:#2E7D4F;font-family:U6}
.b-hero{padding:18px 18px 16px}.b-hero b{display:block;font-family:D;font-size:38px;line-height:1.02;letter-spacing:-.8px;font-weight:400}.b-hero span{display:block;margin-top:10px;font-size:14px;color:#6B5A4A}
.b-bot{display:flex;gap:8px;margin-top:16px}.b-bot a{flex:1;text-align:center;padding:12px 0;border-radius:10px;border:1.5px solid #2B1D12;font-family:U6;font-size:15px}.b-bot a.pri{background:#2B1D12;color:#FBF6EE}
.b-foto{height:170px;margin:0 18px;border-radius:14px;background:radial-gradient(ellipse 60px 34px at 30% 62%,#C98B4A 0 98%,transparent 100%),radial-gradient(ellipse 74px 40px at 62% 54%,#B5773A 0 98%,transparent 100%),radial-gradient(ellipse 50px 28px at 78% 74%,#D49A5A 0 98%,transparent 100%),linear-gradient(#E9DCC6,#D9C7A8)}
.b-fila{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:14px 18px 0}.b-fila div{background:#fff;border-radius:12px;padding:10px 12px}.b-fila b{display:block;font-family:U6;font-size:11px;color:#8A7867}.b-fila span{font-size:14px}
.b-res{margin:8px 18px 0;background:#fff;border-radius:12px;padding:10px 12px;display:flex;gap:10px;align-items:center}.b-res b{font-family:D;font-size:26px;font-weight:400}.b-res span{font-size:12px;color:#6B5A4A}
/* ficha de Google y anotaciones */
.g{position:absolute;left:70px;top:1120px;width:392px;background:#fff;color:#202124;border-radius:16px;padding:16px 18px;font-family:Arial,sans-serif;box-shadow:0 18px 40px rgba(0,0,0,.4);z-index:6;transform:rotate(-2deg)}
.g small{display:block;font-size:13px;color:#70757A}.g b{display:block;font-size:21px;margin:4px 0}.g span{font-size:17px;color:#C5221F;white-space:nowrap;word-spacing:3px}.g u{text-decoration:none;font-weight:700}
svg.an{position:absolute;left:0;top:0;width:1080px;height:1350px;z-index:7;pointer-events:none}
.ok{position:absolute;z-index:7;width:64px;height:64px;border-radius:50%;background:#E8683C;color:#0F1C24;display:grid;place-items:center;font-size:36px}
/* cierre */
.g1{position:absolute;left:76px;right:70px;top:300px;font-family:D;font-size:128px;line-height:1;letter-spacing:-3px}.g1 i{font-family:DI;font-style:normal}
.gs{position:absolute;left:80px;right:140px;top:650px;font-size:44px;line-height:1.34}
.gu{position:absolute;left:80px;right:120px;bottom:290px;font-family:M;font-size:30px;line-height:1.4;letter-spacing:1px}
.cta{position:absolute;left:80px;bottom:150px;background:#0F1C24;color:#FAF8F5;font-size:36px;padding:24px 38px;border-radius:999px}
`;
const total = L.length;
const html = (s, i) => {
  const cab = `<div class=m>${arco(56, ['cierre', 'claro'].includes(s.tipo) ? '#0F1C24' : '#FAF8F5')}Bahiga.</div><div class=p>0${i + 1} / 0${total}</div>`;
  if (s.tipo === 'cierre') return `<html><head><style>${CSS}</style></head><body class=coral>${cab}<div class=g1>${co(s.t)}</div><div class=gs>${s.n}</div><div class=gu>Guárdalo y repásalo con tu web abierta.</div><div class=cta>Escríbenos WEB en comentarios</div><div class=pie>BAHIGA.ES</div></body></html>`;
  return `<html><head><style>${CSS}</style></head><body class="${s.tipo || ''}">${cab}
    ${s.num ? `<div class=num>${s.num}</div>` : ''}<div class=t>${co(s.t)}</div><div class=n>${s.n}</div>
    <div class=movil><div class=pant><div class=isla></div><div class=esc style="top:${(s.y || 0) * 1.431}px">${s.web}</div></div></div>
    ${s.google ? GOOGLE : ''}
    <svg class=an viewBox="0 0 1080 1350"></svg>
    ${s.tipo === 'portada' ? '<div class=dz>Desliza →</div>' : ''}<div class=pie>BAHIGA.ES</div></body></html>`;
};

mkdirSync(`${RAIZ}media`, { recursive: true });
const b = await chromium.launch();
for (const [i, s] of L.entries()) {
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await pg.setContent(html(s, i)); await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(({ m, tipo, google }) => {
    const svg = document.querySelector('svg.an'); if (!svg) return;
    // El titular manda: si ocupa tres líneas, la nota y el móvil bajan.
    const t = document.querySelector('.t').getBoundingClientRect(); const n = document.querySelector('.n');
    if (tipo !== 'portada') n.style.top = Math.max(640, t.bottom + 70) + 'px';
    const trazo = (d, w = 7) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#E8683C'); p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round'); svg.appendChild(p); };
    const rodear = (r, hol = 26) => { // elipse a mano: dos arcos que no cierran del todo
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2, rx = r.width / 2 + hol, ry = r.height / 2 + hol * .8;
      trazo(`M ${cx - rx * .96} ${cy + ry * .22} C ${cx - rx * 1.06} ${cy - ry * 1.25}, ${cx + rx * 1.1} ${cy - ry * 1.2}, ${cx + rx} ${cy + ry * .05} C ${cx + rx * .95} ${cy + ry * 1.3}, ${cx - rx * .9} ${cy + ry * 1.22}, ${cx - rx * 1.02} ${cy - ry * .1}`);
      return { cx, cy, rx, ry };
    };
    const flecha = (x1, y1, x2, y2) => { const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 50; trazo(`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`, 5); const a = Math.atan2(y2 - my, x2 - mx); trazo(`M ${x2} ${y2} L ${x2 - 26 * Math.cos(a - .5)} ${y2 - 26 * Math.sin(a - .5)} M ${x2} ${y2} L ${x2 - 26 * Math.cos(a + .5)} ${y2 - 26 * Math.sin(a + .5)}`, 5); };
    const nr = n.getBoundingClientRect();
    if (tipo === 'portada') { // cinco marcas numeradas sobre la web
      const pts = [['hero', .84, .3], ['hero', .16, .8], ['letra', .52, .55], ['tel', 1.12, .3], ['horario', .5, 1.6]];
      pts.forEach(([k, fx, fy], j) => { const e = document.querySelector(`[data-m="${k}"]`); if (!e) return; const r = e.getBoundingClientRect(); const d = document.createElement('div'); d.className = 'ok'; d.textContent = j + 1; d.style.cssText = `left:${r.left + r.width * fx - 32}px;top:${r.top + r.height * fy - 32}px;font-family:DI;box-shadow:0 8px 20px rgba(0,0,0,.45)`; document.body.appendChild(d); });
      return;
    }
    if (tipo === 'claro') { // marcas de «hecho» junto a lo arreglado
      [['.b-hero b', 1.0, -.12], ['.b-bot .pri', .06, .5], ['.b-fila div', .9, .5], ['.b-res', .94, .5]].forEach(([q, fx, fy]) => { const r = document.querySelector(q).getBoundingClientRect(); const d = document.createElement('div'); d.className = 'ok'; d.textContent = '✓'; d.style.cssText = `left:${r.left + r.width * fx - 32}px;top:${r.top + r.height * fy - 32}px;box-shadow:0 8px 20px rgba(0,0,0,.35)`; document.body.appendChild(d); });
      return;
    }
    const e = document.querySelector(`[data-m="${m}"]`); if (!e) return;
    const o = rodear(e.getBoundingClientRect(), m === 'mini' ? 34 : 26);
    const x2 = o.cx - o.rx - 16; // la flecha solo se dibuja si hay sitio entre la nota y la marca
    if (x2 - nr.right > 40 || o.cy - nr.bottom > 120) flecha(nr.left + 60, nr.bottom + 30, x2, Math.max(o.cy, nr.bottom + 70));
    if (google) { const g = document.querySelector('[data-g] u').getBoundingClientRect(); rodear(g, 7); }
  }, { m: s.m, tipo: s.tipo, google: !!s.google });
  const ruta = `${RAIZ}media/${ID}-${i + 1}.jpg`;
  await pg.screenshot({ path: ruta, type: 'jpeg', quality: 92 });
  console.log(ruta.replace(RAIZ, ''));
}
await b.close();
