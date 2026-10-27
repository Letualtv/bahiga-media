// Tarjetas de noticia de Bahiga: carrusel de feed (1080x1350, de 4 a 6 láminas) y una historia (1080x1920).
// Pensado para que se guarde y se comparta: cada lámina se entiende sola y la última pide guardarlo.
// Campos del carrusel, en este orden:
//   "mensaje"   opcional: { "de": "Contacto", "texto": "… [Votar aquí]", "pie": "…" } (lo que va entre [ ] sale como enlace) → lámina «Así llega» con el mensaje tal cual.
//   "que_pasa"  2-3 frases cortas.
//   "que_hacer" lista de 2 a 4 pasos cortos.
//   "comprobar" opcional: { "ruta": ["Ajustes", "Dispositivos vinculados"], "texto": "…" } → «Comprueba si te ha pasado».
//   "cierre" (titular con *coral*), "cierre_sub", "cta" y "guardar" (frase para guardarlo o pasarlo).
// Salida: <id>-feed.jpg (portada, también para LinkedIn), <id>-2.jpg … <id>-N.jpg y <id>-historia.jpg.
// Uso: node motion/noticia/render.mjs noticia.json
// noticia.json: { "id": "1027-chrome", "etiqueta": "Aviso · Seguridad",
//   "titular": "Actualiza Chrome *hoy.*", "dato": "CVE-2026-1234",
//   "sub": "Fallo explotado activamente. Se arregla reiniciando el navegador.", "fuente": "Google" }
// En «titular», lo que va entre asteriscos sale en coral cursiva. Salida: media/noticias/<id>-feed.jpg y -historia.jpg
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(execSync('npm root -g').toString().trim() + '/playwright')); }

const DIR = new URL('.', import.meta.url).pathname;
const RAIZ = new URL('../../', import.meta.url).pathname;
const N = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const titular = esc(N.titular).replace(/\*(.+?)\*/g, '<i>$1</i>');
const f = (n) => `data:font/woff2;base64,${readFileSync(`${DIR}fuentes/${n}.woff2`).toString('base64')}`;
const A = readFileSync(`${DIR}arch.js`, 'utf8');
const VB = JSON.parse(A.match(/ARCH_VB=(\[[^\]]*\])/)[1]);
const PATHS = JSON.parse(A.match(/ARCH=(\[[\s\S]*?\]);?\s*$/m)[1]);
const arco = (h, c = '#FAF8F5') => `<svg viewBox="${VB.join(' ')}" style="height:${h}px;vertical-align:-10px;margin-right:16px">${PATHS.map((d) => `<path fill="${c}" d="${d}"/>`).join('')}</svg>`;

function html(alto) {
  const hist = alto > 1500, top = hist ? 330 : 190; // historia: deja libre la franja superior de Instagram
  return `<html><head><style>
  @font-face{font-family:D;src:url(${f('display')})}@font-face{font-family:DI;src:url(${f('display-italic')})}
  @font-face{font-family:U6;src:url(${f('ui-600')})}@font-face{font-family:M;src:url(${f('mono')})}
  body{margin:0;width:1080px;height:${alto}px;background:#0F1C24;color:#FAF8F5;position:relative;overflow:hidden;font-family:U6}
  .m{position:absolute;left:90px;top:${top - 110}px;font-family:D;font-size:44px}
  .k{position:absolute;left:90px;top:${top + 120}px;font-family:M;font-size:26px;letter-spacing:4px;color:#F0A07E;text-transform:uppercase}
  .r{position:absolute;left:90px;top:${top + 172}px;width:64px;height:4px;background:#E8683C}
  .t{position:absolute;left:84px;right:84px;top:${top + 220}px;font-family:D;font-size:${hist ? 112 : 104}px;line-height:1.04;letter-spacing:-2px}
  .t i{font-family:DI;font-style:normal;color:#E8683C}
  .bot{position:absolute;left:90px;right:90px;bottom:${hist ? 420 : 150}px;display:grid;gap:26px}
  .d{font-family:M;font-size:32px;color:#0F1C24;background:#E8683C;justify-self:start;padding:10px 22px;border-radius:12px}
  .s{font-size:40px;line-height:1.35;opacity:.85}
  .fu{position:absolute;left:90px;bottom:${hist ? 330 : 70}px;font-family:M;font-size:22px;letter-spacing:3px;opacity:.5;text-transform:uppercase}
  </style></head><body><div class=m>${arco(62)}Bahiga.</div><div class=k>${esc(N.etiqueta)}</div><div class=r></div>
  <div class=t>${titular}</div><div class=bot>${N.dato ? `<div class=d>${esc(N.dato)}</div>` : ''}<div class=s>${esc(N.sub)}</div></div>
  <div class=fu>${N.fuente ? 'Fuente: ' + esc(N.fuente) + ' · ' : ''}bahiga.es</div>${!hist && N.que_pasa ? '<div style="position:absolute;right:90px;bottom:66px;font-size:26px;color:#E8683C">Desliza →</div>' : ''}</body></html>`;
}

function lamina(n, total, cuerpo, fondo = '#0F1C24', tinta = '#FAF8F5') {
  return `<html><head><style>
  @font-face{font-family:D;src:url(${f('display')})}@font-face{font-family:DI;src:url(${f('display-italic')})}
  @font-face{font-family:U6;src:url(${f('ui-600')})}@font-face{font-family:U;src:url(${f('ui')})}@font-face{font-family:M;src:url(${f('mono')})}
  body{margin:0;width:1080px;height:1350px;background:${fondo};color:${tinta};position:relative;overflow:hidden;font-family:U6}
  .m{position:absolute;left:90px;top:80px;font-family:D;font-size:44px}.p{position:absolute;right:90px;top:96px;font-family:M;font-size:24px;letter-spacing:3px;color:${fondo === '#E8683C' ? tinta : '#E8683C'}}
  .k{position:absolute;left:90px;top:300px;font-family:M;font-size:26px;letter-spacing:4px;color:#F0A07E;text-transform:uppercase}
  .r{position:absolute;left:90px;top:352px;width:64px;height:4px;background:#E8683C}
  .c{position:absolute;left:90px;right:90px;top:410px;font-size:50px;line-height:1.38}
  .c p{margin:0 0 34px}.c b{color:#F0A07E;font-weight:inherit}
  .chat{position:absolute;left:90px;right:90px;top:410px;background:#14242E;border:2px solid #24343E;border-radius:36px;padding:40px 44px;display:grid;gap:26px}
  .chat__de{display:flex;align-items:center;gap:22px;font-size:34px}.chat__av{width:76px;height:76px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#5B7383 0 17px,transparent 18px),radial-gradient(ellipse 30px 22px at 50% 92%,#5B7383 0 100%,transparent 101%),#2E4250}
  .burbuja{background:#1F3542;border-radius:6px 30px 30px 30px;padding:30px 34px;font-family:U;font-size:40px;line-height:1.4;justify-self:start;max-width:92%}
  .burbuja u{color:#8FCBF0;text-decoration-thickness:2px}
  .chat__pie{font-size:36px;line-height:1.4;color:#F0A07E;position:absolute;left:90px;right:90px;bottom:140px}
  .ruta{position:absolute;left:90px;right:90px;top:420px;display:grid;gap:20px}
  .ruta div{display:flex;align-items:center;gap:24px;background:#14242E;border:2px solid #24343E;border-radius:22px;padding:30px 34px;font-size:44px}
  .ruta div span{font-family:DI;color:#E8683C;font-size:56px;width:48px}
  .ruta div:last-child{border-color:#E8683C}
  .rnota{position:absolute;left:90px;right:90px;bottom:140px;font-size:40px;line-height:1.4;opacity:.9}
  .guarda{position:absolute;left:90px;right:120px;bottom:290px;font-size:34px;line-height:1.35;font-family:M;letter-spacing:1px}
  ol{margin:0;padding:0;list-style:none;display:grid;gap:48px;counter-reset:n} li{counter-increment:n;display:grid;grid-template-columns:84px 1fr;font-size:50px;line-height:1.3}
  li:before{content:counter(n);font-family:DI;color:#E8683C;font-size:64px;line-height:.9}
  .cta{position:absolute;left:90px;bottom:120px;background:#E8683C;color:#0F1C24;font-size:34px;padding:22px 34px;border-radius:999px}
  .g{position:absolute;left:84px;right:84px;top:420px;font-family:D;font-size:110px;line-height:1.04;letter-spacing:-2px}.g i{font-family:DI;font-style:normal}
  .gs{position:absolute;left:90px;right:120px;top:740px;font-size:44px;line-height:1.35}
  .cta2{position:absolute;left:90px;bottom:150px;background:#0F1C24;color:#FAF8F5;font-size:36px;padding:24px 38px;border-radius:999px}
  .fu{position:absolute;left:90px;bottom:60px;font-family:M;font-size:22px;letter-spacing:3px;opacity:.5}
  </style></head><body><div class=m>${arco(62, tinta)}Bahiga.</div><div class=p>0${n} / 0${total}</div>${cuerpo}<div class=fu>BAHIGA.ES</div></body></html>`;
}

mkdirSync(`${RAIZ}media/noticias`, { recursive: true });
const b = await chromium.launch();
for (const [nombre, alto] of [['feed', 1350], ['historia', 1920]]) {
  const pg = await b.newPage({ viewport: { width: 1080, height: alto } });
  await pg.setContent(html(alto));
  await pg.evaluate(() => document.fonts.ready);
  // Si el titular no cabe, se reduce hasta que no pise el bloque inferior.
  await pg.evaluate(() => { const t = document.querySelector('.t'), b = document.querySelector('.bot'); let s = parseFloat(getComputedStyle(t).fontSize); while (t.getBoundingClientRect().bottom > b.getBoundingClientRect().top - 40 && s > 56) { s -= 4; t.style.fontSize = s + 'px'; } });
  const ruta = `${RAIZ}media/noticias/${N.id}-${nombre}.jpg`;
  await pg.screenshot({ path: ruta, type: 'jpeg', quality: 92 });
  console.log(ruta.replace(RAIZ, ''));
}
if (N.que_pasa && N.que_hacer?.length) {
  // Frases de «qué pasa» en párrafos; lo que va entre *asteriscos* se resalta.
  const parrafos = (t) => t.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/).map((x) => `<p>${esc(x).replace(/\*(.+?)\*/g, '<b>$1</b>')}</p>`).join('');
  const C = [];
  if (N.mensaje?.texto) C.push([`<div class=k>Así llega</div><div class=r></div><div class=chat><div class=chat__de><span class=chat__av></span>${esc(N.mensaje.de || 'Un contacto')}</div><div class=burbuja>${esc(N.mensaje.texto).replace(/\[(.+?)\]/g, '<u>$1</u>')}</div></div>${N.mensaje.pie ? `<div class=chat__pie>${esc(N.mensaje.pie)}</div>` : ''}`]);
  C.push([`<div class=k>Qué pasa</div><div class=r></div><div class=c>${parrafos(N.que_pasa)}</div>`]);
  C.push([`<div class=k>Qué hacer</div><div class=r></div><div class=c><ol>${N.que_hacer.map((x) => `<li><span>${esc(x)}</span></li>`).join('')}</ol></div>`]);
  if (N.comprobar?.ruta?.length) C.push([`<div class=k>Comprueba si te ha pasado</div><div class=r></div><div class=ruta>${N.comprobar.ruta.map((x, i) => `<div><span>${i + 1}</span>${esc(x)}</div>`).join('')}</div>${N.comprobar.texto ? `<div class=rnota>${esc(N.comprobar.texto)}</div>` : ''}`]);
  C.push([`<div class=g>${esc(N.cierre || '¿No sabes por dónde *empezar?*').replace(/\*(.+?)\*/g, '<i>$1</i>')}</div><div class=gs>${esc(N.cierre_sub || 'Cuenta con Bahiga. Lo revisamos contigo y te decimos qué hacer, sin compromiso.')}</div><div class=guarda>${esc(N.guardar || 'Guárdalo y pásaselo a quien lleve las redes o el WhatsApp de tu negocio.')}</div><div class=cta2>${esc(N.cta || 'Escríbenos WEB en comentarios')}</div>`, '#E8683C', '#0F1C24']);
  const total = C.length + 1;
  const L = C.map(([cuerpo, fondo, tinta], i) => [i + 2, cuerpo, fondo, tinta]);
  for (const [n, cuerpo, fondo, tinta] of L) {
    const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
    await pg.setContent(lamina(n, total, cuerpo, fondo, tinta));
    await pg.evaluate(() => document.fonts.ready);
    await pg.evaluate(() => { const c = document.querySelector('.c'); if (!c) return; let s = 46; const tope = 1200; s = parseFloat(getComputedStyle(c).fontSize); while (c.getBoundingClientRect().bottom > tope && s > 30) { s -= 2; c.style.fontSize = s + 'px'; c.querySelectorAll('li').forEach((l) => (l.style.fontSize = s + 'px')); } });
    const ruta = `${RAIZ}media/noticias/${N.id}-${n}.jpg`;
    await pg.screenshot({ path: ruta, type: 'jpeg', quality: 92 });
    console.log(ruta.replace(RAIZ, ''));
  }
}
await b.close();
