// Carrusel de lista de comprobación de Bahiga (1080x1350): portada, bloques de casillas, puntuación y cierre.
// Uso: node motion/checklist/render.mjs lista.json  →  media/<id>-1.jpg … <id>-N.jpg
// lista.json: { "id", "etiqueta", "titular" (con *coral*), "sub", "bloques": [{ "titulo", "items": [[texto, detalle]] }],
//   "puntuacion": [[rango, texto]], "cierre", "cierre_sub", "guardar", "cta" }
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(execSync('npm root -g').toString().trim() + '/playwright')); }

const NOT = new URL('../noticia/', import.meta.url).pathname;
const RAIZ = new URL('../../', import.meta.url).pathname;
const L = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const co = (s) => esc(s).replace(/\*(.+?)\*/g, '<i>$1</i>');
const f = (n) => `data:font/woff2;base64,${readFileSync(`${NOT}fuentes/${n}.woff2`).toString('base64')}`;
const A = readFileSync(`${NOT}arch.js`, 'utf8');
const VB = JSON.parse(A.match(/ARCH_VB=(\[[^\]]*\])/)[1]);
const PATHS = JSON.parse(A.match(/ARCH=(\[[\s\S]*?\]);?\s*$/m)[1]);
const arco = (h, c) => `<svg viewBox="${VB.join(' ')}" style="height:${h}px;vertical-align:-10px;margin-right:16px">${PATHS.map((d) => `<path fill="${c}" d="${d}"/>`).join('')}</svg>`;

const total = 1 + L.bloques.length + 2;
let n = 0;
const lamina = (cuerpo, coral = false) => {
  n++;
  const fondo = coral ? '#E8683C' : '#0F1C24', tinta = coral ? '#0F1C24' : '#FAF8F5';
  return `<html><head><style>
  @font-face{font-family:D;src:url(${f('display')})}@font-face{font-family:DI;src:url(${f('display-italic')})}
  @font-face{font-family:U6;src:url(${f('ui-600')})}@font-face{font-family:U;src:url(${f('ui')})}@font-face{font-family:M;src:url(${f('mono')})}
  body{margin:0;width:1080px;height:1350px;background:${fondo};color:${tinta};position:relative;overflow:hidden;font-family:U6}
  .m{position:absolute;left:90px;top:80px;font-family:D;font-size:44px}.p{position:absolute;right:90px;top:96px;font-family:M;font-size:24px;letter-spacing:3px;color:${coral ? tinta : '#E8683C'}}
  .k{position:absolute;left:90px;top:250px;font-family:M;font-size:26px;letter-spacing:4px;color:${coral ? tinta : '#F0A07E'};text-transform:uppercase}
  .r{position:absolute;left:90px;top:302px;width:64px;height:4px;background:${coral ? tinta : '#E8683C'}}
  .t{position:absolute;left:84px;right:84px;top:360px;font-family:D;font-size:112px;line-height:1.03;letter-spacing:-2px}.t i{font-family:DI;font-style:normal;color:${coral ? tinta : '#E8683C'}}
  .s{position:absolute;left:90px;right:120px;bottom:200px;font-size:42px;line-height:1.38;opacity:.88}
  .cas{position:absolute;left:90px;right:90px;top:370px;display:grid;gap:64px}
  .it{display:grid;grid-template-columns:76px 1fr;gap:6px 26px;align-items:start}
  .box{width:58px;height:58px;border:4px solid #E8683C;border-radius:12px;margin-top:4px}
  .it b{font-size:52px;line-height:1.22;font-weight:inherit}.it span{grid-column:2;font-family:U;font-size:36px;line-height:1.38;color:#A9B4BA}
  .pt{position:absolute;left:90px;right:90px;top:360px;display:grid;gap:28px}
  .pt div{display:grid;grid-template-columns:250px 1fr;gap:26px;align-items:center;background:#14242E;border:2px solid #24343E;border-radius:22px;padding:30px 34px}
  .pt em{font-family:DI;font-style:normal;color:#E8683C;font-size:64px;line-height:1}.pt p{margin:0;font-size:40px;line-height:1.3}
  .g{position:absolute;left:84px;right:84px;top:330px;font-family:D;font-size:108px;line-height:1.04;letter-spacing:-2px}.g i{font-family:DI;font-style:normal}
  .gs{position:absolute;left:90px;right:120px;top:700px;font-size:44px;line-height:1.35}
  .gu{position:absolute;left:90px;right:120px;bottom:290px;font-family:M;font-size:32px;line-height:1.4;letter-spacing:1px}
  .cta{position:absolute;left:90px;bottom:150px;background:#0F1C24;color:#FAF8F5;font-size:36px;padding:24px 38px;border-radius:999px}
  .fu{position:absolute;left:90px;bottom:60px;font-family:M;font-size:22px;letter-spacing:3px;opacity:.5}
  .dz{position:absolute;right:90px;bottom:56px;font-size:26px;color:#E8683C}
  </style></head><body><div class=m>${arco(62, tinta)}Bahiga.</div><div class=p>0${n} / 0${total}</div>${cuerpo}<div class=fu>BAHIGA.ES</div>${n === 1 ? '<div class=dz>Desliza →</div>' : ''}</body></html>`;
};

const paginas = [
  lamina(`<div class=k>${esc(L.etiqueta)}</div><div class=r></div><div class=t>${co(L.titular)}</div><div class=s>${esc(L.sub)}</div>`),
  ...L.bloques.map((b) => lamina(`<div class=k>${esc(b.titulo)}</div><div class=r></div><div class=cas>${b.items.map(([t, d]) => `<div class=it><div class=box></div><b>${esc(t)}</b>${d ? `<span>${esc(d)}</span>` : ''}</div>`).join('')}</div>`)),
  lamina(`<div class=k>¿Cuántas has marcado?</div><div class=r></div><div class=pt>${L.puntuacion.map(([r, t]) => `<div><em>${esc(r)}</em><p>${esc(t)}</p></div>`).join('')}</div>`),
  lamina(`<div class=g>${co(L.cierre)}</div><div class=gs>${esc(L.cierre_sub)}</div><div class=gu>${esc(L.guardar)}</div><div class=cta>${esc(L.cta)}</div>`, true),
];
mkdirSync(`${RAIZ}media`, { recursive: true });
const b = await chromium.launch();
for (const [i, h] of paginas.entries()) {
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await pg.setContent(h); await pg.evaluate(() => document.fonts.ready);
  // Si un bloque no cabe, reduce la letra hasta que quepa sobre el pie.
  await pg.evaluate(() => { const c = document.querySelector('.cas, .pt, .t'); if (!c) return; let k = 1; while (c.getBoundingClientRect().bottom > 1230 && k > 0.7) { k -= 0.03; c.style.zoom = k; } });
  const ruta = `${RAIZ}media/${L.id}-${i + 1}.jpg`;
  await pg.screenshot({ path: ruta, type: 'jpeg', quality: 92 });
  console.log(ruta.replace(RAIZ, ''));
}
await b.close();
