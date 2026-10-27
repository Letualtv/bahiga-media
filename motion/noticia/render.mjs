// Tarjetas de noticia de Bahiga: carrusel de feed de 4 láminas (1080x1350) y una historia (1080x1920).
// Campos extra para el carrusel: "que_pasa" (2-3 frases) y "que_hacer" (lista de 2 a 4 pasos cortos).
// Opcional: "cierre" (titular de la última lámina, con *coral*) y "cierre_sub".
// Salida: <id>-feed.jpg (portada, también para LinkedIn), <id>-2.jpg, <id>-3.jpg, <id>-4.jpg y <id>-historia.jpg.
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

function lamina(n, cuerpo, fondo = '#0F1C24', tinta = '#FAF8F5') {
  return `<html><head><style>
  @font-face{font-family:D;src:url(${f('display')})}@font-face{font-family:DI;src:url(${f('display-italic')})}
  @font-face{font-family:U6;src:url(${f('ui-600')})}@font-face{font-family:M;src:url(${f('mono')})}
  body{margin:0;width:1080px;height:1350px;background:${fondo};color:${tinta};position:relative;overflow:hidden;font-family:U6}
  .m{position:absolute;left:90px;top:80px;font-family:D;font-size:44px}.p{position:absolute;right:90px;top:96px;font-family:M;font-size:24px;letter-spacing:3px;color:${fondo === '#E8683C' ? tinta : '#E8683C'}}
  .k{position:absolute;left:90px;top:300px;font-family:M;font-size:26px;letter-spacing:4px;color:#F0A07E;text-transform:uppercase}
  .r{position:absolute;left:90px;top:352px;width:64px;height:4px;background:#E8683C}
  .c{position:absolute;left:90px;right:90px;top:410px;font-size:46px;line-height:1.4}
  ol{margin:0;padding:0;list-style:none;display:grid;gap:34px;counter-reset:n} li{counter-increment:n;display:grid;grid-template-columns:78px 1fr;font-size:44px;line-height:1.3}
  li:before{content:counter(n);font-family:DI;color:#E8683C;font-size:64px;line-height:.9}
  .cta{position:absolute;left:90px;bottom:120px;background:#E8683C;color:#0F1C24;font-size:34px;padding:22px 34px;border-radius:999px}
  .g{position:absolute;left:84px;right:84px;top:420px;font-family:D;font-size:110px;line-height:1.04;letter-spacing:-2px}.g i{font-family:DI;font-style:normal}
  .gs{position:absolute;left:90px;right:120px;top:760px;font-size:44px;line-height:1.35}
  .cta2{position:absolute;left:90px;bottom:150px;background:#0F1C24;color:#FAF8F5;font-size:36px;padding:24px 38px;border-radius:999px}
  .fu{position:absolute;left:90px;bottom:60px;font-family:M;font-size:22px;letter-spacing:3px;opacity:.5}
  </style></head><body><div class=m>${arco(62, tinta)}Bahiga.</div><div class=p>0${n} / 04</div>${cuerpo}<div class=fu>BAHIGA.ES</div></body></html>`;
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
  const L = [
    [2, `<div class=k>Qué pasa</div><div class=r></div><div class=c>${esc(N.que_pasa)}</div>`],
    [3, `<div class=k>Qué hacer</div><div class=r></div><div class=c><ol>${N.que_hacer.map((x) => `<li><span>${esc(x)}</span></li>`).join('')}</ol></div>`],
    [4, `<div class=g>${esc(N.cierre || '¿No sabes por dónde *empezar?*').replace(/\*(.+?)\*/g, '<i>$1</i>')}</div><div class=gs>${esc(N.cierre_sub || 'Cuenta con Bahiga. Lo revisamos contigo y te decimos qué hacer, sin compromiso.')}</div><div class=cta2>${esc(N.cta || 'Escríbenos WEB en comentarios')}</div>`, '#E8683C', '#0F1C24'],
  ];
  for (const [n, cuerpo, fondo, tinta] of L) {
    const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
    await pg.setContent(lamina(n, cuerpo, fondo, tinta));
    await pg.evaluate(() => document.fonts.ready);
    await pg.evaluate(() => { const c = document.querySelector('.c'); if (!c) return; let s = 46; const tope = (document.querySelector('.cta')?.getBoundingClientRect().top ?? 1220) - 50; while (c.getBoundingClientRect().bottom > tope && s > 30) { s -= 2; c.style.fontSize = s + 'px'; c.querySelectorAll('li').forEach((l) => (l.style.fontSize = s + 'px')); } });
    const ruta = `${RAIZ}media/noticias/${N.id}-${n}.jpg`;
    await pg.screenshot({ path: ruta, type: 'jpeg', quality: 92 });
    console.log(ruta.replace(RAIZ, ''));
  }
}
await b.close();
