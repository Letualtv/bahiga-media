// Historia de ejemplo (3 pantallas, 1080x1920) con el estilo «pantalla anotada».
// La encuesta se añade a mano en Instagram: la lámina 1 deja el hueco; «-vista» la enseña dibujada.
import { mkdirSync } from 'node:fs';
import { chromium, RAIZ, arco, co, CSS, movil } from './piezas.mjs';
import { PANEL, CSS_PANEL } from './panel.mjs';
const ID = 'ejemplo-historia-visitas';
const pm = (o = {}) => movil(PANEL, { url: 'panel.bahiga.es/area', ...o });
const encuesta = `<div class="enc"><small>Aquí va la encuesta</small><div><span>Sí</span><span>Ni idea</span></div></div>`;
const L = [
  { n: '1', fantasma: '?', t: '¿Sabes cuántas visitas tuvo tu web *este mes?*', cuerpo: `${pm({ cls: 'h1' })}<div class="hueco"></div>` },
  { n: '1-vista', fantasma: '?', t: '¿Sabes cuántas visitas tuvo tu web *este mes?*', cuerpo: `${pm({ cls: 'h1' })}${encuesta}` },
  { n: '2', fantasma: '842', t: 'Un cliente de Bahiga lo mira *aquí.*',
    cuerpo: `${pm({ cls: 'h2' })}<div class="chip dato a"><b>842</b>visitas</div><div class="chip dato b"><b>37</b>contactos</div><div class="chip dato c"><b>61 %</b>por Google</div><div class="aviso">Pantalla de ejemplo, datos inventados.</div>` },
  { n: '3', cls: 'coral', fantasma: '?', t: '¿Y *la tuya?*', cuerpo: `<div class="gs">Responde WEB a esta historia y te enseño cómo se ve el panel con una web de verdad.</div><div class="cta">Responde WEB</div>` },
];
const EXTRA = `
body{height:1920px;background:radial-gradient(1000px 900px at 76% 66%,#1B3340 0%,#0F1C24 62%)}
.m{top:150px}.pie{bottom:120px}
.t{top:290px;font-size:116px;right:80px}.coral .t{top:520px;font-size:190px}
.fan{top:300px;right:-40px;font-size:1300px}.coral .fan{top:700px}
.h1{left:430px;top:800px;transform:rotate(-7deg) scale(1.08);transform-origin:0 0}
.h2{left:240px;top:700px;transform:rotate(2deg) scale(1.1);transform-origin:50% 0}
.enc{position:absolute;left:60px;top:1230px;width:600px;z-index:16;transform:rotate(-3deg)}
.enc small{display:block;font-family:M;font-size:20px;letter-spacing:2px;text-transform:uppercase;color:#F0A07E;margin:0 0 14px 8px}
.enc div{display:grid;grid-template-columns:1fr 1fr;background:#fff;border-radius:34px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.55)}
.enc span{padding:42px 10px;text-align:center;font:normal 46px U6;color:#0F1C24}.enc span+span{border-left:2px solid #E6E0D6;color:#E8683C}
.chip.dato{font-size:34px;padding:14px 32px 14px 16px;gap:14px;z-index:16}.chip.dato b{width:auto;height:auto;background:none;font-family:D;font-size:58px;color:#E8683C;padding:0 4px 0 12px;letter-spacing:-1px}
.a{left:24px;top:1130px;transform:rotate(-4deg)}.b{left:700px;top:1000px;transform:rotate(3deg)}.c{left:40px;top:1430px;transform:rotate(2deg)}
.aviso{bottom:auto;top:600px;left:80px;z-index:16}
.gs{position:absolute;left:80px;right:120px;top:980px;font-size:50px;line-height:1.25;z-index:10}
.cta{bottom:420px;font-size:46px;padding:30px 48px}
`;
const html = (s) => `<html><head><style>${CSS}${CSS_PANEL}${EXTRA}</style></head><body class="${s.cls || ''}">
  <div class=m>${arco(56, s.cls === 'coral' ? '#0F1C24' : '#FAF8F5')}Bahiga.</div>
  <div class=fan>${s.fantasma}</div><div class=t>${co(s.t)}</div>${s.cuerpo}<div class=pie>BAHIGA.ES</div></body></html>`;
mkdirSync(`${RAIZ}media`, { recursive: true });
const b = await chromium.launch();
for (const s of L) {
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.setContent(html(s)); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: `${RAIZ}media/${ID}-${s.n}.jpg`, type: 'jpeg', quality: 93 });
}
await b.close();
