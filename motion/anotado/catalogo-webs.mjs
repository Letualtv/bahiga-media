// Imágenes cuadradas (1080x1080) de las webs por sector para catálogos: WhatsApp Business y ficha de Google.
// Uso: node motion/anotado/catalogo-webs.mjs  →  media/catalogo/web-<sector>.jpg y media/catalogo/web-390.jpg
import { movil, render, RAIZ } from './piezas.mjs';
import { real, CSS_REAL } from './real.mjs';
import { SECTORES } from './historias-sector.mjs';
import fs from 'node:fs';
const BASE = `${CSS_REAL}
body{height:1080px;background:radial-gradient(900px 800px at 78% 70%,#1B3340 0%,#0F1C24 62%)}
.pg,.pie,.fan{display:none}.m{top:70px;left:70px}
.t{top:190px;left:70px;right:520px;font-size:84px;line-height:1}
.c1{left:600px;top:120px;transform:rotate(4deg) scale(.78);transform-origin:0 0}
.px{position:absolute;left:70px;bottom:80px;z-index:20;background:#E8683C;color:#0F1C24;border-radius:30px;padding:26px 34px}.px small{font-family:M;font-size:20px;letter-spacing:3px;text-transform:uppercase;display:block}.px b{font-family:D;font-weight:400;font-size:92px;line-height:1;letter-spacing:-3px}.px b i{font-style:normal;font-size:38px;letter-spacing:0}
.av{position:absolute;left:70px;bottom:40px;font-family:M;font-size:17px;color:#A9B4BA;z-index:20}
.tres .c1{left:640px;top:150px;transform:rotate(5deg) scale(.7)}.tres .c0{position:absolute;left:400px;top:330px;transform:rotate(-5deg) scale(.6);transform-origin:0 0;opacity:.9}
`;
const PX = '<div class=px><small>Desde</small><b>390 € <i>+ IVA</i></b></div><div class=av>Web de muestra hecha por Bahiga</div>';
const L = Object.entries(SECTORES).map(([s, [que]]) => ({ t: `Web para *${que}*`, cuerpo: `${movil(real(s), { cls: 'real c1' })}${PX}` }));
L.push({ cls: 'tres', t: 'Web para *tu negocio.*', cuerpo: `<div class=c0>${movil(real('estetica'), { cls: 'real' })}</div>${movil(real('barberia'), { cls: 'real c1' })}${PX}` });
await render('cat', L, BASE, { ancho: 1080, alto: 1080 });
fs.mkdirSync(`${RAIZ}/media/catalogo`, { recursive: true });
[...Object.keys(SECTORES), '390'].forEach((s, i) => fs.renameSync(`${RAIZ}/media/cat-${i + 1}.jpg`, `${RAIZ}/media/catalogo/web-${s}.jpg`));
