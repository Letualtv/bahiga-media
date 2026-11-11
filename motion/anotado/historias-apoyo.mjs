// Historias de apoyo (1080x1920) con el estilo «pantalla anotada»: landing y revisión gratis.
// Cada pantalla es una imagen; se publican seguidas. Uso: node motion/anotado/historias-apoyo.mjs
import { movil, render } from './piezas.mjs';
import { web, CSS_NEG } from './negocios.mjs';
const BASE = `
body{height:1920px;background:radial-gradient(1000px 900px at 76% 66%,#1B3340 0%,#0F1C24 62%)}
.m{top:150px}.pie{bottom:120px}.pg{display:none}
.t{top:290px;font-size:116px;right:80px}.coral .t{top:520px;font-size:170px}
.fan{top:300px;right:-40px;font-size:1300px}.coral .fan{top:700px}
.h1{left:430px;top:820px;transform:rotate(-7deg) scale(1.08);transform-origin:0 0}
.aviso{bottom:auto;top:640px;left:80px;z-index:16}
.gs{position:absolute;left:80px;right:120px;top:980px;font-size:50px;line-height:1.25;z-index:10}
.cta{bottom:420px;font-size:46px;padding:30px 48px}
.pr{position:absolute;left:80px;right:80px;z-index:20;border-radius:44px;padding:44px 50px 48px;box-shadow:0 40px 80px rgba(0,0,0,.55)}.pr b{display:block;font-family:D;font-weight:400;line-height:.9;letter-spacing:-6px}.pr span{display:block;font-size:36px;line-height:1.3;margin-top:22px}.pr small{font-family:M;font-size:26px;letter-spacing:3px;text-transform:uppercase;color:#8A8F93}
#pa{top:640px;background:#FAF8F5;color:#0F1C24;transform:rotate(-3deg)}#pa b{font-size:270px;color:#E8683C}
#pb{top:1180px;left:200px;background:#14242E;border:2px solid #2F4553;color:#FAF8F5;transform:rotate(2deg)}#pb b{font-size:170px;letter-spacing:-4px}#pb b i{font-family:DI;font-style:normal;font-size:80px;color:#F0A07E;letter-spacing:-1px}
.cero{position:absolute;left:76px;top:820px;z-index:10}.cero b{display:block;font-family:DI;font-weight:400;font-size:460px;line-height:.8;color:#E8683C;letter-spacing:-12px}.cero span{display:block;font-family:M;font-size:30px;letter-spacing:3px;text-transform:uppercase;line-height:1.5;color:#A9B4BA;margin-top:44px}
`;
const O = { ancho: 1080, alto: 1920 };
await render('1119-historia-landing', [
  { fantasma: '1', t: 'Tu negocio, en *una página.*', cuerpo: `${movil(web('barberia'), { url: 'barberianavaja.example', cls: 'h1' })}<div class="aviso">Web de ejemplo, negocio inventado.</div>` },
  { fantasma: '€', t: 'Lo que *cuesta.*', cuerpo: `<div class=pr id=pa><small>Desde</small><b>390 €</b><span>La landing, hecha y publicada.<br>Con el dominio del primer año.</span></div><div class=pr id=pb><b>30 €<i>/mes</i></b><span>Alojamiento y mantenimiento.<br>Dos meses gratis, sin permanencia.</span></div>` },
  { cls: 'coral', fantasma: '?', t: '¿Te la *enseñamos?*', cuerpo: `<div class="gs">Responde LANDING a esta historia y te mandamos un ejemplo para tu tipo de negocio.</div><div class="cta">Responde LANDING</div>` },
], CSS_NEG + BASE, O);
await render('1128-historia-revision', [
  { fantasma: '0', t: 'Quedan *tres días.*', n: '', cuerpo: `<div class="cero"><b>0 €</b><span>la revisión de tu web<br>hasta el 30 de noviembre</span></div>` },
  { cls: 'coral', fantasma: '?', t: '¿Revisamos *la tuya?*', cuerpo: `<div class="gs">Responde WEB a esta historia con la dirección de tu página. Te mandamos una hoja con lo urgente y lo que puede esperar.</div><div class="cta">Responde WEB</div>` },
], CSS_NEG + BASE, O);
